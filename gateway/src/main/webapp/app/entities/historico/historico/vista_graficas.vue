<template>
  <div class="container-fluid py-4 bg-transparent animate__animated animate__fadeIn">
    <div class="row mb-4">
      <div class="col-12 d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <div class="bg-vino text-white rounded-circle p-3 mr-3 shadow-sm icon-header">
            <font-awesome-icon icon="chart-pie" />
          </div>
          <div>
            <h2 class="font-weight-bold text-dark mb-0">Estadísticas de Farmacia</h2>
            <p class="text-muted mb-0 small">
              Análisis de suministros y control de inventarios
            </p>
          </div>
        </div>

        <div class="d-flex align-items-center">
          <router-link :to="{ name: 'Historico' }" class="mr-2">
            <b-button
              variant="outline-secondary"
              class="shadow-sm btn-sm rounded-pill px-4 py-2 font-weight-bold"
            >
              <font-awesome-icon icon="arrow-left" class="mr-2" />
              VOLVER
            </b-button>
          </router-link>

          <b-button
            variant="guinda"
            class="shadow-sm btn-sm rounded-pill px-4 py-2 font-weight-bold"
            @click="loadData"
            :disabled="isFetching"
          >
            <font-awesome-icon icon="sync" :spin="isFetching" class="mr-2" />
            ACTUALIZAR DATOS
          </b-button>
        </div>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-12">
        <div class="card shadow-sm border-0 rounded-pill px-4 py-1 search-card">
          <div class="input-group align-items-center">
            <font-awesome-icon icon="search" class="text-guinda mr-3" />
            <input
              type="text"
              class="form-control border-0 bg-transparent py-4"
              v-model="filtroGlobal"
              placeholder="Buscar por medicamento, médico o folio de receta..."
              style="box-shadow: none"
            />
            <span
              v-if="filtroGlobal"
              class="text-muted small ml-2 p-2"
              @click="filtroGlobal = ''"
              style="cursor: pointer"
            >
              <font-awesome-icon icon="times-circle" size="lg" />
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-4">
      <div
        v-for="(metric, idx) in [
          {
            label: 'Recetas Totales',
            val: historicosFiltrados.length,
            icon: 'file-medical',
            color: 'guinda',
          },
          {
            label: 'Unidades Entregadas',
            val: totalMedicamentos,
            icon: 'pills',
            color: 'blue',
          },
          {
            label: 'Cuerpo Médico',
            val: datosMedicos.tabla.length,
            icon: 'user-md',
            color: 'orange',
          },
          {
            label: 'Controlados Admin',
            val: chartControlados.datasets[0].data[0],
            icon: 'user-shield',
            color: 'green',
          },
        ]"
        :key="idx"
        class="col-md-3 mb-3"
      >
        <div
          :class="[
            'card shadow-sm border-0 metric-card h-100',
            'border-top-' + metric.color,
          ]"
        >
          <div class="card-body d-flex align-items-center">
            <div :class="['icon-circle-metric mr-3', 'bg-light-' + metric.color]">
              <font-awesome-icon
                :icon="metric.icon"
                size="lg"
                :class="'text-' + metric.color"
              />
            </div>
            <div>
              <p class="text-muted mb-0 x-small font-weight-bold text-uppercase">
                {{ metric.label }}
              </p>
              <h3 class="mb-0 font-weight-bold text-dark">{{ metric.val }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-7 mb-4">
        <div class="card shadow-sm border-0 rounded-lg p-4 h-100 border-top-guinda">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="font-weight-bold text-dark mb-0">Tendencia de Recetas</h6>
            <span class="badge badge-light text-guinda px-3 rounded-pill">Mensual</span>
          </div>
          <div class="position-relative" style="height: 280px">
            <Line
              v-if="historicosFiltrados.length"
              :data="chartRecetasPorDia"
              :options="chartOptions"
            />
          </div>
        </div>
      </div>
      <div class="col-md-5 mb-4">
        <div class="card shadow-sm border-0 rounded-lg p-4 h-100 border-top-guinda">
          <h6 class="font-weight-bold text-dark mb-1">Medicamentos</h6>
          <p class="text-muted x-small mb-3">
            Click en la barra para ver el desglose detallado
          </p>
          <div class="position-relative" style="height: 280px">
            <Bar
              v-if="historicosFiltrados.length"
              :data="chartTopMedicamentos"
              :options="horizontalOptions"
              @click="onChartClick"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm border-0 rounded-lg p-4 h-100 card-secondary">
          <h6 class="font-weight-bold text-dark mb-3">Actividad por Médico</h6>
          <div class="position-relative" style="height: 230px">
            <Bar
              v-if="historicosFiltrados.length"
              :data="datosMedicos.chartData"
              :options="medicoOptions"
            />
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm border-0 rounded-lg p-4 h-100 card-secondary">
          <h6 class="font-weight-bold text-dark mb-3">Consumo de Inventario</h6>
          <div class="position-relative" style="height: 230px">
            <Bar
              v-if="historicosFiltrados.length"
              :data="chartConsumoInventario"
              :options="verticalOptions"
            />
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm border-0 rounded-lg p-4 h-100 card-secondary">
          <h6 class="font-weight-bold text-dark mb-1">Balance de Autorizaciones</h6>
          <p class="text-muted x-small mb-3">Validación de fármacos controlados</p>
          <div class="position-relative" style="height: 230px">
            <Doughnut
              v-if="historicosFiltrados.length"
              :data="chartControlados"
              :options="donaOptions"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showModal"
      class="modal-backdrop fade show"
      @click="showModal = false"
    ></div>
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg custom-modal">
          <div class="modal-header border-0 bg-vino text-white">
            <h5 class="modal-title font-weight-bold">
              <font-awesome-icon icon="pills" class="mr-2" /> {{ tituloModal }}
            </h5>
            <button type="button" class="close text-white" @click="showModal = false">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body p-4">
            <div class="alert alert-info py-2 small border-0 rounded-pill">
              <font-awesome-icon icon="info-circle" class="mr-2" />
              Lista completa de stock dispensado ordenado por demanda.
            </div>
            <div style="height: 450px; overflow-y: auto" class="pr-2">
              <div
                v-if="datosGraficaModal"
                :style="{
                  height: Math.max(400, datosGraficaModal.labels.length * 35) + 'px',
                }"
              >
                <Bar :data="datosGraficaModal" :options="modalChartOptions" />
              </div>
            </div>
          </div>
          <div class="modal-footer border-0">
            <b-button
              variant="outline-secondary"
              class="rounded-pill px-4"
              @click="showModal = false"
            >
              CERRAR VENTANA
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./vista_grafica.component.ts"></script>

<style scoped>
/* PALETA INSTITUCIONAL */
.text-guinda {
  color: #9b2247 !important;
}
.bg-vino {
  background-color: #611232 !important;
}
.text-blue {
  color: #3498db !important;
}
.text-orange {
  color: #f39c12 !important;
}
.text-green {
  color: #27ae60 !important;
}

.btn-guinda {
  background-color: #9b2247;
  color: white;
  border: none;
  transition: 0.3s;
}
.btn-guinda:hover {
  background-color: #611232;
  transform: translateY(-2px);
}

/* TARJETAS DE MÉTRICAS */
.metric-card {
  border-radius: 15px !important;
  transition: transform 0.3s ease;
}
.metric-card:hover {
  transform: translateY(-5px);
}

.border-top-guinda {
  border-top: 5px solid #9b2247 !important;
}
.border-top-blue {
  border-top: 5px solid #3498db !important;
}
.border-top-orange {
  border-top: 5px solid #f39c12 !important;
}
.border-top-green {
  border-top: 5px solid #27ae60 !important;
}

.icon-circle-metric {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-light-guinda {
  background-color: #fdf2f5;
}
.bg-light-blue {
  background-color: #ebf5fb;
}
.bg-light-orange {
  background-color: #fef5e7;
}
.bg-light-green {
  background-color: #eafaf1;
}

.icon-header {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

/* BUSCADOR */
.search-card {
  border-radius: 50px !important;
  background: white;
}

/* MODAL */
.custom-modal {
  border-radius: 20px !important;
  overflow: hidden;
}

.x-small {
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.bg-transparent {
  background-color: transparent !important;
}

.card-secondary {
  border-top: 3px solid #e0e0e0;
}

/* AJUSTES PARA DISPOSITIVOS MÓVILES */
@media (max-width: 768px) {
  .col-12.d-flex {
    flex-direction: column;
    align-items: flex-start !important;
  }
  .d-flex.align-items-center {
    margin-top: 15px;
    width: 100%;
    justify-content: space-between;
  }
}
</style>
