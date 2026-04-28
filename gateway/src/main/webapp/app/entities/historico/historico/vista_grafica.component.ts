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

    const loadData = async () => {
      isFetching.value = true;
      try {
        const res = await historicoService().retrieve({ 
          page: 0, 
          size: 500, 
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

    // --- GRÁFICA 1: TENDENCIA DIARIA ---
    const chartRecetasPorDia = computed(() => {
      const counts: { [key: string]: number } = {};
      historicos.value.forEach(h => {
        if (h.fechaEmision) {
          const date = new Date(h.fechaEmision).toLocaleDateString('es-MX');
          counts[date] = (counts[date] || 0) + 1;
        }
      });
      const labels = Object.keys(counts);
      return {
        labels,
        datasets: [
          { label: 'Carga de Recetas', data: Object.values(counts), borderColor: '#3498db', backgroundColor: 'rgba(52, 152, 219, 0.1)', fill: true, tension: 0.4 },
          { label: 'Límite', data: new Array(labels.length).fill(LIMITE_SATURACION), borderColor: '#e74c3c', borderDash: [5, 5], fill: false, pointRadius: 0 }
        ]
      };
    });

    // --- GRÁFICA 2: MEDICAMENTOS TOP (CORREGIDO) ---
    const chartTopMedicamentos = computed(() => {
      const medCounts: { [key: string]: number } = {};
      historicos.value.forEach(h => {
        if (h.medicamentos) {
          try {
            // Validamos que sea un string con formato de array antes de intentar parsear
            const rawMeds = h.medicamentos.trim();
            if (rawMeds.startsWith('[') && rawMeds.endsWith(']')) {
              const listaMeds = JSON.parse(rawMeds);
              listaMeds.forEach((item: any) => {
                const nombre = item.nombre || 'Desconocido';
                const cantidad = Number(item.cantidad) || 0;
                medCounts[nombre] = (medCounts[nombre] || 0) + cantidad;
              });
            }
          } catch (e) { 
             // Silenciamos errores de parseo para limpiar la consola de registros corruptos
          } 
        }
      });
      const sortedMeds = Object.entries(medCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
      return {
        labels: sortedMeds.map(m => m[0]),
        datasets: [{ label: 'Unidades', data: sortedMeds.map(m => m[1]), backgroundColor: '#2ecc71', borderRadius: 6 }]
      };
    });

    // --- GRÁFICA 3: CONTROLADOS (DONA) ---
    const chartControlados = computed(() => {
      let controlados = 0;
      let normales = 0;
      historicos.value.forEach(h => {
        if (!!h.autorizo) controlados++;
        else normales++;
      });
      return {
        labels: ['Controlados', 'Normales'],
        datasets: [{ data: [controlados, normales], backgroundColor: ['#e74c3c', '#3498db'], hoverOffset: 4 }]
      };
    });

    // --- GRÁFICA 4: DATOS UNIFICADOS DE MÉDICOS ---
    const datosMedicos = computed(() => {
      const stats: { [key: string]: { total: number, fechas: Set<string> } } = {};
      historicos.value.forEach(h => {
        const nombre = h.medico?.nombre || h.medicoNombre || 'Médico Externo';
        const fecha = h.fechaEmision ? new Date(h.fechaEmision).toLocaleDateString('es-MX') : 'S/F';

        if (!stats[nombre]) stats[nombre] = { total: 0, fechas: new Set() };
        stats[nombre].total++;
        stats[nombre].fechas.add(fecha);
      });

      const listaOrdenada = Object.entries(stats)
        .map(([nombre, data]) => ({
          nombre,
          total: data.total,
          fechas: Array.from(data.fechas).sort().reverse().slice(0, 3).join(', ')
        }))
        .sort((a, b) => b.total - a.total);

      return {
        chartData: {
          labels: listaOrdenada.map(m => m.nombre),
          datasets: [{ label: 'Recetas', data: listaOrdenada.map(m => m.total), backgroundColor: '#9b59b6', borderRadius: 4 }]
        },
        tabla: listaOrdenada
      };
    });

    // --- GRÁFICA 5: DATOS POR ESPECIALIDAD (ROBUSTO) ---
    const datosEspecialidades = computed(() => {
      const espStats: { [key: string]: { total: number, medicos: Set<string> } } = {};
      
      historicos.value.forEach(h => {
        // Mapeo flexible para capturar la especialidad desde diferentes estructuras de DTO
        const especialidad = 
          h.medico?.especialidad || 
          (h as any).medicoEspecialidad || 
          (h as any).especialidad || 
          'General / No especificada';

        const medicoNombre = h.medico?.nombre || h.medicoNombre || 'Externo';
        
        if (!espStats[especialidad]) {
          espStats[especialidad] = { total: 0, medicos: new Set() };
        }
        espStats[especialidad].total++;
        espStats[especialidad].medicos.add(medicoNombre);
      });

      const listaOrdenada = Object.entries(espStats)
        .map(([nombre, data]) => ({ 
          nombre, 
          total: data.total,
          conteoMedicos: data.medicos.size 
        }))
        .sort((a, b) => b.total - a.total);

      return {
        chartData: {
          labels: listaOrdenada.map(e => e.nombre),
          datasets: [{
            label: 'Recetas por Especialidad',
            data: listaOrdenada.map(e => e.total),
            backgroundColor: '#f1c40f',
            borderRadius: 4
          }]
        },
        tabla: listaOrdenada
      };
    });

    return {
      historicos, isFetching, loadData,
      chartRecetasPorDia, chartTopMedicamentos, chartControlados, 
      datosMedicos, datosEspecialidades,
      chartOptions: { responsive: true, maintainAspectRatio: false },
      horizontalOptions: { indexAxis: 'y' as const, responsive: true, maintainAspectRatio: false },
      donaOptions: { responsive: true, maintainAspectRatio: false, cutout: '70%' },
      medicoOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { 
          y: { beginAtZero: true },
          x: { ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 } } 
        },
        plugins: { legend: { display: false } }
      }
    };
  }
});