import { type Ref, defineComponent, inject, onMounted, ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import InventarioService from './inventario.service';
import { type IInventario } from '@/shared/model/inventario/inventario.model';
import { useAlertService } from '@/shared/alert/alert.service';
import MovimientoInventarioService from '@/entities/inventario/movimiento-inventario/movimiento-inventario.service';

// 1. IMPORTAR EL COMPONENTE DE GRÁFICAS
import GraficasInventario from './graficas_inventario.vue';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Inventario',
  // 2. REGISTRAR EL COMPONENTE
  components: {
    'graficas-inventario': GraficasInventario,
  },
  setup() {
    const { t: t$ } = useI18n();
    const router = useRouter();

    // Servicios
    const inventarioService = inject('inventarioService', () => new InventarioService());
    const alertService = inject('alertService', () => useAlertService(), true);
    const movimientoService = inject('movimientoInventarioService', () => new MovimientoInventarioService());

    // Variables de paginación y orden
    const itemsPerPage = ref(20);
    const queryCount: Ref<number> = ref(null);
    const page: Ref<number> = ref(1);
    const propOrder = ref('id');
    const reverse = ref(false);
    const totalItems = ref(0);

    // Inventarios y estado
    const inventarios: Ref<IInventario[]> = ref([]);
    const isFetching = ref(false);

    // Controla la visibilidad de las gráficas
    const showGraficas = ref(false);

    // Variables para entradas
    const showEntradaModal = ref(false);
    const entrada = ref({
      nombre: '',
      cantidad: 0,
      observacion: '',
    });

    // --- FILTROS ---
    const filtroTexto = ref('');
    const filtroFecha = ref(null); // Variable para el nuevo calendario

    const inventariosFiltrados = computed(() => {
      let filtrados = inventarios.value;

      // Filtro por Texto (Nombre, Clave, Lote, etc.)
      if (filtroTexto.value) {
        const texto = filtroTexto.value.toLowerCase();
        filtrados = filtrados.filter(
          (inv) =>
            inv.nombre?.toLowerCase().includes(texto) ||
            inv.claveMedicamento?.toLowerCase().includes(texto) ||
            inv.lote?.toLowerCase().includes(texto) ||
            inv.presentacion?.toLowerCase().includes(texto) ||
            inv.ubicacion?.toLowerCase().includes(texto)
        );
      }

      // Filtro por Fecha (Solo muestra los que coinciden con la fecha seleccionada)
      if (filtroFecha.value) {
        filtrados = filtrados.filter(
          (inv) => inv.fechaCaducidad === filtroFecha.value
        );
      }

      return filtrados;
    });

    // Función para detectar si un medicamento está caducado o cerca de caducar
    const esCaducado = (fecha: string) => {
      if (!fecha) return false;
      const hoy = new Date();
      const fechaCad = new Date(fecha);
      return fechaCad <= hoy;
    };

    // Función para alternar la vista de gráficas
    const toggleGraficas = () => {
      showGraficas.value = !showGraficas.value;
    };

    // FUNCIÓN PARA RECIBIR DATOS DESDE LAS GRÁFICAS (Resurtido)
    const abrirResurtidoDesdeGrafica = (item: any) => {
      showEntradaModal.value = true;
      entrada.value = {
        nombre: item.nombre,
        cantidad: 0,
        observacion: `Resurtido automático: Stock bajo detectado (${item.cantidad} unidades restantes).`,
      };
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const irMovimientos = () => {
      router.push({ name: 'MovimientoInventario' });
    };

    const clear = () => { page.value = 1; };

    const sort = (): Array<any> => {
      const result = [`${propOrder.value},${reverse.value ? 'desc' : 'asc'}`];
      if (propOrder.value !== 'id') result.push('id');
      return result;
    };

    const retrieveInventarios = async () => {
      isFetching.value = true;
      try {
        const paginationQuery = { page: page.value - 1, size: itemsPerPage.value, sort: sort() };
        const res = await inventarioService().retrieve(paginationQuery);
        totalItems.value = Number(res.headers['x-total-count']);
        queryCount.value = totalItems.value;
        inventarios.value = res.data;
      } catch (err) {
        alertService.showHttpError(err.response);
      } finally {
        isFetching.value = false;
      }
    };

    const handleSyncList = () => { retrieveInventarios(); };

    onMounted(async () => { await retrieveInventarios(); });

    const removeId: Ref<number> = ref(null);
    const removeEntity = ref<any>(null);

    const prepareRemove = (instance: IInventario) => {
      removeId.value = instance.id;
      removeEntity.value.show();
    };

    const closeDialog = () => { removeEntity.value.hide(); };

    const removeInventario = async () => {
      try {
        await inventarioService().delete(removeId.value);
        const message = t$('inventarioApp.inventarioInventario.deleted', { param: removeId.value }).toString();
        alertService.showInfo(message, { variant: 'danger' });
        removeId.value = null;
        retrieveInventarios();
        closeDialog();
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    const changeOrder = (newOrder: string) => {
      if (propOrder.value === newOrder) reverse.value = !reverse.value;
      else reverse.value = false;
      propOrder.value = newOrder;
    };

    watch([propOrder, reverse], async () => {
      if (page.value === 1) await retrieveInventarios();
      else clear();
    });

    watch(page, async () => { await retrieveInventarios(); });

    const guardarEntrada = async () => {
      try {
        if (!entrada.value.nombre || entrada.value.cantidad <= 0) {
          alertService.showInfo('Por favor, selecciona un medicamento y una cantidad válida', { variant: 'warning' });
          return;
        }

        const inventarioExistente = inventarios.value.find(
          i => i.nombre?.toLowerCase().trim() === entrada.value.nombre.toLowerCase().trim()
        );

        if (!inventarioExistente) {
          alertService.showInfo(`No se encontró el medicamento "${entrada.value.nombre}".`, { variant: 'danger' });
          return;
        }

        const nuevoMovimiento = {
          tipoMovimiento: 'ENTRADA',
          cantidad: entrada.value.cantidad,
          fecha: new Date().toISOString(),
          observacion: entrada.value.observacion,
          inventario: {
            id: inventarioExistente.id,
            nombre: inventarioExistente.nombre
          }
        };

        await movimientoService().create(nuevoMovimiento);

        inventarioExistente.cantidad += entrada.value.cantidad;
        await inventarioService().update(inventarioExistente);

        alertService.showInfo('Stock actualizado con éxito', { variant: 'success' });

        showEntradaModal.value = false;
        entrada.value = { nombre: '', cantidad: 0, observacion: '' };
        
        await retrieveInventarios();
      } catch (error) {
        console.error('Error al guardar entrada:', error);
        alertService.showHttpError(error.response);
      }
    };

    return {
      inventarios,
      inventariosFiltrados,
      filtroTexto,
      filtroFecha, // Exportado para el template
      esCaducado,   // Exportado para el template
      irMovimientos,
      handleSyncList,
      isFetching,
      retrieveInventarios,
      clear,
      removeId,
      removeEntity,
      prepareRemove,
      closeDialog,
      removeInventario,
      itemsPerPage,
      queryCount,
      page,
      propOrder,
      reverse,
      totalItems,
      changeOrder,
      t$,
      showEntradaModal,
      showGraficas,
      toggleGraficas,
      entrada,
      guardarEntrada,
      abrirResurtidoDesdeGrafica,
    };
  },
});