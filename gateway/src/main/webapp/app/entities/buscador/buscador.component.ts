import { defineComponent, nextTick } from "vue";
import BuscadorService from "./buscador.service";
import HistoricoService from "@/entities/historico/historico/historico.service";
import InventarioService from "@/entities/inventario/inventario/inventario.service";
import MovimientoInventarioService from "@/entities/inventario/movimiento-inventario/movimiento-inventario.service";
import Swal from "sweetalert2";

const buscarService = new BuscadorService();
const historicoService = new HistoricoService();
const inventarioService = new InventarioService();
const movimientoInventarioService = new MovimientoInventarioService();

export default defineComponent({
  name: "Buscador",

  data() {
    return {
      pacienteQuery: "",
      medicoQuery: "",
      medicamentoQuery: "",

      pacientes: [] as any[],
      medicos: [] as any[],
      medicamentos: [] as any[],

      receta: {
        pacienteId: null as number | null,
        pacienteNombre: "",
        edad: "" as string | number,
        sexo: "",
        medicoId: null as number | null,
        medicoNombre: "",
        especialidad: "",
        medicamentos: [] as any[],
        tipo: "Normal",
        fechaEmision: new Date().toLocaleDateString(),
        estado: "Borrador"
      },

      mostrarModalAdmin: false,

      adminCredentials: {
        usuario: "",
        password: ""
      }
    };
  },

  methods: {

    async buscarPacientes() {
      this.pacientes = await buscarService.buscarPacientes(this.pacienteQuery);
    },

    async buscarMedicos() {
      this.medicos = await buscarService.buscarMedicos(this.medicoQuery);
    },

    async buscarMedicamentos() {
      this.medicamentos = await buscarService.buscarMedicamentos(this.medicamentoQuery);
    },

    seleccionarPaciente(p: any) {
      this.receta.pacienteId = p.id;
      this.receta.pacienteNombre = `${p.nombre} ${p.apellidoP || ''}`;
      this.receta.edad = p.edad || "N/A";
      this.receta.sexo = p.sexo || "N/A";
      this.pacientes = [];
      this.pacienteQuery = "";
    },

    seleccionarMedico(m: any) {
      this.receta.medicoId = m.id;
      this.receta.medicoNombre = m.nombre;
      this.receta.especialidad = m.especialidad || "General";
      this.medicos = [];
      this.medicoQuery = "";
    },

    seleccionarMedicamento(m: any) {
      this.receta.medicamentos.push({
        medicamentoId: m.id,
        nombre: m.nombre,
        cantidad: 1,
        stock: m.cantidad || 0,
        controlado: m.controlado || false,
        indicaciones: "",
        editando: false,
        _uid: Math.random().toString(36).substr(2, 9)
      });
      this.medicamentos = [];
      this.medicamentoQuery = "";
    },

    cerrarListas() {
      this.pacientes = [];
      this.medicos = [];
      this.medicamentos = [];
    },

    eliminarMedicamento(index: number) {
      this.receta.medicamentos.splice(index, 1);
    },

    editarMedicamento(index: number) {
      this.receta.medicamentos[index].editando = true;
    },

    guardarEdicion(index: number) {
      this.receta.medicamentos[index].editando = false;
    },

    validarStock(index: number) {
      const med = this.receta.medicamentos[index];

      if (med.cantidad > med.stock) {
        Swal.fire({
          icon: "warning",
          title: "Stock insuficiente",
          text: `La cantidad de ${med.nombre} supera el stock disponible (${med.stock})`,
          confirmButtonColor: "#ffc107"
        });

        med.cantidad = med.stock;
      }
    },

    
    async imprimirBorrador() {
      await nextTick();

      setTimeout(() => {
        window.print();
      }, 300);
    },

    async registrarHistorico() {
      const tieneControlados = this.receta.medicamentos.some(m => m.controlado);

      if (tieneControlados) {
        this.mostrarModalAdmin = true;
      } else {
        await this.ejecutarGuardadoFinal();
      }
    },

    async validarYAutorizarAdmin() {
      if (this.adminCredentials.usuario === "admin" && this.adminCredentials.password === "admin") {
        this.mostrarModalAdmin = false;
        await this.ejecutarGuardadoFinal(this.adminCredentials.usuario);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Credenciales de administrador no válidas",
          confirmButtonColor: "#611232"
        });
      }
    },

    async ejecutarGuardadoFinal(adminAutorizador?: string) {
      try {

        const usuarioSesion = localStorage.getItem("usuario") || "usuario_anonimo";
        const autorizo = adminAutorizador || usuarioSesion;

        const listaMedsParaHistorico = this.receta.medicamentos.map(med => ({
          id: med.medicamentoId,
          nombre: med.nombre,
          cantidad: med.cantidad,
          controlado: med.controlado,
          observaciones: med.indicaciones
        }));

        const dataHistorico = {
          fechaEmision: new Date().toISOString(),
          folio: `FOL-${Date.now()}`,
          pacienteId: this.receta.pacienteId,
          pacienteNombre: this.receta.pacienteNombre,
          medicoId: this.receta.medicoId,
          medicoNombre: this.receta.medicoNombre,
          medicoEspecialidad: this.receta.especialidad,
          usuarioQueRegistro: usuarioSesion,
          autorizo: autorizo,
          medicamentos: JSON.stringify(listaMedsParaHistorico),
          cantidad: listaMedsParaHistorico.reduce((acc, cur) => acc + (Number(cur.cantidad) || 0), 0),
          observaciones: `Receta con ${listaMedsParaHistorico.length} productos.`
        };

        await historicoService.create(dataHistorico);

        //ACTUALIZAR INVENTARIO
        for (const med of this.receta.medicamentos) {
          if (!med.medicamentoId) continue;

          const inv = await inventarioService.find(med.medicamentoId);

          inv.cantidad = (inv.cantidad || 0) - med.cantidad;
          await inventarioService.update(inv);

          const movimiento = {
            tipoMovimiento: "SALIDA",
            cantidad: med.cantidad,
            fecha: new Date().toISOString().split('T')[0],
            observacion: `Salida por receta ${dataHistorico.folio}`,
            inventario: { id: med.medicamentoId }
          };

          await movimientoInventarioService.create(movimiento);
        }

        await Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Receta registrada con éxito",
          confirmButtonColor: "#9b2247"
        });

        const result = await Swal.fire({
          title: "¿Imprimir?",
          text: "¿Desea imprimir el comprobante de la receta ahora?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Sí, imprimir",
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#9b2247"
        });

        // FIX DEFINITIVO
        if (result.isConfirmed) {

          await nextTick();

          setTimeout(() => {
            window.print();

            // limpiar DESPUÉS de imprimir
            setTimeout(() => {
              this.limpiarPantalla();
            }, 800);

          }, 300);

        } else {
          await this.limpiarPantalla();
        }

      } catch (error) {
        console.error("Error en el proceso de guardado:", error);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al procesar la receta",
          confirmButtonColor: "#611232"
        });
      }
    },

    async limpiarPantalla() {
      await nextTick();

      this.pacienteQuery = "";
      this.medicoQuery = "";
      this.medicamentoQuery = "";

      this.receta.pacienteId = null;
      this.receta.pacienteNombre = "";
      this.receta.edad = "";
      this.receta.sexo = "";
      this.receta.medicoId = null;
      this.receta.medicoNombre = "";
      this.receta.especialidad = "";
      this.receta.medicamentos = [];

      this.adminCredentials = { usuario: "", password: "" };
    }
  }
});