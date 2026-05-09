import { type Ref, computed, defineComponent, inject, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';

import HistoricoService from './historico.service';
import InventarioService from '@/entities/inventario/inventario/inventario.service';
import useDataUtils from '@/shared/data/data-utils.service';
import { useDateFormat, useValidation } from '@/shared/composables';
import { useAlertService } from '@/shared/alert/alert.service';

import { Historico, type IHistorico } from '@/shared/model/historico/historico.model';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'HistoricoUpdate',
  setup() {
    const historicoService = inject('historicoService', () => new HistoricoService());
    const inventarioService = inject('inventarioService', () => new InventarioService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const historico: Ref<IHistorico> = ref(new Historico());
    const isSaving = ref(false);
    const listaInventario = ref<any[]>([]);
    
    // Lista de medicamentos con estado de edición (isEditing)
    const listaMedsEdicion = ref<any[]>([]);

    const route = useRoute();
    const router = useRouter();
    const { t: t$ } = useI18n();

    const previousState = () => router.go(-1);

    // --- CARGA DE DATOS ---
    const cargarInventario = async () => {
      try {
        const res = await inventarioService().retrieve({ size: 1000 });
        listaInventario.value = res.data || [];
      } catch (err) {
        console.error("Error al cargar inventario", err);
      }
    };

    const retrieveHistorico = async (historicoId: number) => {
      try {
        const res = await historicoService().find(historicoId);
        res.fechaEmision = res.fechaEmision ? new Date(res.fechaEmision) : new Date();
        historico.value = res;
        
        if (res.medicamentos) {
            const meds = typeof res.medicamentos === 'string' 
                ? JSON.parse(res.medicamentos) 
                : res.medicamentos;
            
            // Al cargar registros existentes, todos permanecen bloqueados
            listaMedsEdicion.value = meds.map((m: any) => ({ ...m, isEditing: false }));
        }
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    onMounted(() => {
      cargarInventario();
      if (route.params?.historicoId) {
        retrieveHistorico(Number(route.params.historicoId));
      } else {
        historico.value.fechaEmision = new Date();
        historico.value.usuarioQueRegistro = 'Usuario Actual'; 
      }
    });

    // --- GESTIÓN DE FILAS DE MEDICAMENTOS ---
    
    const agregarMedicamentoRow = () => {
      // Bloqueamos cualquier fila que pudiera haber quedado abierta antes de añadir la nueva
      listaMedsEdicion.value.forEach(m => m.isEditing = false);

      listaMedsEdicion.value.push({
        id: '',
        nombre: '',
        cantidad: 1,
        observaciones: '',
        isEditing: true 
      });
    };

    const confirmarMedicamentoRow = (index: number) => {
      // Bloquea la fila seleccionada permanentemente
      listaMedsEdicion.value[index].isEditing = false;
    };

    const removerMedicamentoRow = (index: number) => {
      listaMedsEdicion.value.splice(index, 1);
    };

    const onMedicamentoChange = (index: number) => {
      const med = listaMedsEdicion.value[index];
      const encontrado = listaInventario.value.find(i => i.nombre === med.nombre);
      if (encontrado) {
        med.id = encontrado.id;
      }
    };

    // --- VALIDACIONES ---
    const validations = useValidation();
    const validationRules = {
      fechaEmision: { required: validations.required(t$('entity.validation.required').toString()) },
      folio: { required: validations.required(t$('entity.validation.required').toString()) },
      pacienteId: { required: validations.required(t$('entity.validation.required').toString()) },
      pacienteNombre: { required: validations.required(t$('entity.validation.required').toString()) },
      pacienteCurp: {},
      medicoId: { required: validations.required(t$('entity.validation.required').toString()) },
      medicoNombre: {},
      medicoEspecialidad: {},
      usuarioQueRegistro: { required: validations.required(t$('entity.validation.required').toString()) },
      autorizo: {},
      observaciones: {},
    };

    const v$ = useVuelidate(validationRules, historico as any);

    return {
      historicoService,
      alertService,
      historico,
      previousState,
      isSaving,
      v$,
      t$,
      listaInventario,
      listaMedsEdicion,
      agregarMedicamentoRow,
      confirmarMedicamentoRow,
      removerMedicamentoRow,
      onMedicamentoChange,
      ...useDateFormat({ entityRef: historico }),
      ...useDataUtils(),
    };
  },
  methods: {
    save(): void {
      this.isSaving = true;
      
      const datosParaGuardar = this.listaMedsEdicion.map(({ isEditing, ...resto }) => resto);
      this.historico.medicamentos = JSON.stringify(datosParaGuardar);

      if (this.historico.id) {
        this.historicoService()
          .update(this.historico)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showInfo(this.t$('historicoApp.historicoHistorico.updated', { param: param.id }));
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      } else {
        this.historicoService()
          .create(this.historico)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showSuccess(this.t$('historicoApp.historicoHistorico.created', { param: param.id }).toString());
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      }
    },
  },
});