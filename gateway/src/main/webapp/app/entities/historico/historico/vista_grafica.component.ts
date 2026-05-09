import { defineComponent, ref, onMounted, computed, inject } from 'vue';
import HistoricoService from '../historico/historico.service';
import { type IHistorico } from '@/shared/model/historico/historico.model';

import { Line, Bar, Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS, Title, Tooltip, Legend, PointElement, LineElement, 
  CategoryScale, LinearScale, Filler, BarElement, ArcElement 
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale, Filler, BarElement, ArcElement);

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'VistaGrafica',
  components: { Line, Bar, Doughnut },
  setup() {
    const historicoService = inject('historicoService', () => new HistoricoService());
    const historicos = ref<IHistorico[]>([]);
    const isFetching = ref(false);
    const LIMITE_SATURACION = 50;

    const filtroGlobal = ref('');
    const mostrarSugerencias = ref(false);
    
    const showModal = ref(false);
    const tituloModal = ref('');
    const datosGraficaModal = ref<any>(null);

    const loadData = async () => {
      isFetching.value = true;
      try {
        const res = await historicoService().retrieve({ 
          page: 0, 
          size: 1000, 
          sort: ['fechaEmision,asc'] 
        });
        historicos.value = res.data ?? [];
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        isFetching.value = false;
      }
    };

    onMounted(loadData);

    // --- UTILIDAD: NORMALIZAR TEXTO (Quitar acentos y pasar a minúsculas) ---
    const normalizar = (texto: string): string => {
      if (!texto) return '';
      return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''); // Elimina diacríticos (acentos)
    };

    // --- LÓGICA DE AUTOCOMPLETADO CON NORMALIZACIÓN ---
    const sugerenciasAutocompletado = computed(() => {
      const buscador = normalizar(filtroGlobal.value);
      if (!buscador || buscador.length < 2) return [];
      
      const setSugerencias = new Set<string>();

      historicos.value.forEach(h => {
        // Sugerir Pacientes
        if (normalizar(h.pacienteNombre).includes(buscador)) setSugerencias.add(h.pacienteNombre);
        
        // Sugerir Médicos
        const nombreMed = h.medico?.nombre || h.medicoNombre;
        if (normalizar(nombreMed).includes(buscador)) setSugerencias.add(nombreMed);

        // Sugerir Medicamentos
        if (h.medicamentos) {
          try {
            const meds = JSON.parse(h.medicamentos);
            meds.forEach((m: any) => {
              if (normalizar(m.nombre).includes(buscador)) setSugerencias.add(m.nombre);
            });
          } catch (e) {}
        }
      });

      return Array.from(setSugerencias).slice(0, 8);
    });

    const seleccionarSugerencia = (valor: string) => {
      filtroGlobal.value = valor;
      mostrarSugerencias.value = false;
    };

    // --- FILTRADO DE DATOS PARA GRÁFICAS CON NORMALIZACIÓN ---
    const historicosFiltrados = computed(() => {
      const buscador = normalizar(filtroGlobal.value);
      if (!buscador) return historicos.value;

      return historicos.value.filter(h => {
        const medsStr = h.medicamentos ? normalizar(h.medicamentos) : '';
        const medicoStr = normalizar(h.medico?.nombre || h.medicoNombre);
        const pacienteStr = normalizar(h.pacienteNombre);
        const autorizoStr = normalizar(h.autorizo);

        return medsStr.includes(buscador) || 
               medicoStr.includes(buscador) || 
               pacienteStr.includes(buscador) || 
               autorizoStr.includes(buscador);
      });
    });

    // --- LÓGICA DE MÉTRICAS Y GRÁFICAS (Usando historicosFiltrados) ---
    const chartControlados = computed(() => {
      let unidadesAdmin = 0;
      let unidadesMedicas = 0;

      historicosFiltrados.value.forEach(h => {
        if (h.medicamentos) {
          try {
            const listaMeds = JSON.parse(h.medicamentos);
            listaMeds.forEach((item: any) => {
              const cantidad = Number(item.cantidad) || 0;
              const tieneFolio = h.autorizo && h.autorizo.trim() !== '';
              const esAdmin = tieneFolio && (normalizar(h.autorizo).includes('admin'));

              if (esAdmin) unidadesAdmin += cantidad;
              else if (tieneFolio) unidadesMedicas += cantidad;
            });
          } catch (e) { }
        }
      });

      return {
        labels: ['controlados', 'Normales'],
        datasets: [{
          data: [unidadesAdmin, unidadesMedicas],
          backgroundColor: ['#9b2247', '#3498db'], 
          hoverOffset: 15,
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      };
    });

    const chartRecetasPorDia = computed(() => {
      const counts: { [key: string]: number } = {};
      historicosFiltrados.value.forEach(h => {
        if (h.fechaEmision) {
          const date = new Date(h.fechaEmision).toLocaleDateString('es-MX');
          counts[date] = (counts[date] || 0) + 1;
        }
      });
      return {
        labels: Object.keys(counts),
        datasets: [
          { label: 'Carga de Recetas', data: Object.values(counts), borderColor: '#9b2247', backgroundColor: 'rgba(155, 34, 71, 0.1)', fill: true, tension: 0.4 },
          { label: 'Límite', data: new Array(Object.keys(counts).length).fill(LIMITE_SATURACION), borderColor: '#e74c3c', borderDash: [5, 5], fill: false, pointRadius: 0 }
        ]
      };
    });

    const chartTopMedicamentos = computed(() => {
      const medCounts: { [key: string]: number } = {};
      historicosFiltrados.value.forEach(h => {
        if (h.medicamentos) {
          try {
            const listaMeds = JSON.parse(h.medicamentos);
            listaMeds.forEach((item: any) => {
              const nombre = item.nombre || 'Desconocido';
              medCounts[nombre] = (medCounts[nombre] || 0) + (Number(item.cantidad) || 0);
            });
          } catch (e) { } 
        }
      });
      const sortedMeds = Object.entries(medCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
      return {
        labels: sortedMeds.map(m => m[0]),
        datasets: [{ label: 'Unidades', data: sortedMeds.map(m => m[1]), backgroundColor: '#9b2247', borderRadius: 6 }]
      };
    });

    const datosMedicos = computed(() => {
      const stats: { [key: string]: number } = {};
      historicosFiltrados.value.forEach(h => {
        const nombre = h.medico?.nombre || h.medicoNombre || 'Médico Externo';
        stats[nombre] = (stats[nombre] || 0) + 1;
      });
      const lista = Object.entries(stats).map(([nombre, total]) => ({ nombre, total })).sort((a, b) => b.total - a.total);
      return {
        chartData: { labels: lista.map(m => m.nombre), datasets: [{ label: 'Recetas', data: lista.map(m => m.total), backgroundColor: '#611232', borderRadius: 4 }] },
        tabla: lista
      };
    });

    const chartConsumoInventario = computed(() => {
      const consumo: { [key: string]: number } = {};
      historicosFiltrados.value.forEach(h => {
        if (h.fechaEmision && h.medicamentos) {
          try {
            const lista = JSON.parse(h.medicamentos);
            const fecha = new Date(h.fechaEmision).toLocaleDateString('es-MX');
            let total = 0;
            lista.forEach((item: any) => total += (Number(item.cantidad) || 0));
            consumo[fecha] = (consumo[fecha] || 0) + total;
          } catch (e) { }
        }
      });
      return {
        labels: Object.keys(consumo),
        datasets: [{ label: 'Unidades Dispensadas', data: Object.values(consumo), backgroundColor: '#34495e', borderRadius: 5 }]
      };
    });

    const onChartClick = (event: any) => {
      const chart = event.chart;
      const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
      if (!points.length) return;
      
      const labelSeleccionado = chart.data.labels[points[0].index];
      tituloModal.value = `Consumo Total de Medicamentos`;
      const medCounts: { [key: string]: number } = {};
      
      historicos.value.forEach(h => {
        if (h.medicamentos) {
          try {
            const lista = JSON.parse(h.medicamentos);
            lista.forEach((m: any) => {
              medCounts[m.nombre] = (medCounts[m.nombre] || 0) + (Number(m.cantidad) || 0);
            });
          } catch (e) {}
        }
      });

      const sorted = Object.entries(medCounts).sort((a, b) => b[1] - a[1]);
      datosGraficaModal.value = {
        labels: sorted.map(m => m[0]),
        datasets: [{
          label: 'Unidades',
          data: sorted.map(m => m[1]),
          backgroundColor: sorted.map(m => m[0] === labelSeleccionado ? '#9b2247' : '#3498db'),
          borderRadius: 5
        }]
      };
      showModal.value = true;
    };

    const totalMedicamentos = computed(() => {
      let total = 0;
      historicosFiltrados.value.forEach(h => {
        try {
          const meds = JSON.parse(h.medicamentos || '[]');
          meds.forEach((m: any) => total += (Number(m.cantidad) || 0));
        } catch (e) {}
      });
      return total;
    });

    return {
      historicos, historicosFiltrados, isFetching, loadData, filtroGlobal, 
      showModal, tituloModal, datosGraficaModal, 
      chartRecetasPorDia, chartTopMedicamentos, chartControlados, 
      datosMedicos, chartConsumoInventario, onChartClick,
      totalMedicamentos,
      mostrarSugerencias, sugerenciasAutocompletado, seleccionarSugerencia,
      chartOptions: { responsive: true, maintainAspectRatio: false },
      horizontalOptions: { indexAxis: 'y' as const, responsive: true, maintainAspectRatio: false },
      modalChartOptions: { indexAxis: 'y' as const, responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
      donaOptions: { responsive: true, maintainAspectRatio: false, cutout: '70%' },
      verticalOptions: { responsive: true, maintainAspectRatio: false },
      medicoOptions: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    };
  }
});