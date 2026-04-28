<template>
  <div class="container-fluid py-4 bg-light">
    <div class="row">
      <div class="col-12 mb-4">
        <div class="card shadow-sm border-0 rounded-lg p-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 class="font-weight-bold text-dark mb-0">Análisis de Carga Diaria</h4>
              <p class="text-muted small">Detección de picos y saturación operativa</p>
            </div>
            <button
              type="button"
              class="btn btn-primary btn-sm"
              :disabled="isFetching"
              @click="loadData"
            >
              <font-awesome-icon icon="sync" :spin="isFetching" />
              <span> Actualizar Datos</span>
            </button>
          </div>

          <div class="position-relative" style="height: 350px">
            <Line
              v-if="historicos && historicos.length > 0"
              :data="chartRecetasPorDia"
              :options="chartOptions"
            />
            <div
              v-else-if="isFetching"
              class="h-100 d-flex flex-column align-items-center justify-content-center"
            >
              <div class="spinner-border text-primary mb-2" role="status"></div>
              <span>Sincronizando registros...</span>
            </div>
            <div
              v-else
              class="h-100 d-flex flex-column align-items-center justify-content-center text-muted"
            >
              <font-awesome-icon icon="folder-open" size="3x" class="mb-2 opacity-50" />
              <p>No hay datos históricos disponibles.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-7 mb-4">
        <div class="card shadow-sm border-0 rounded-lg p-4 h-100">
          <div class="mb-3">
            <h5 class="font-weight-bold text-dark mb-0">Medicamentos más Recetados</h5>
            <p class="text-muted small">Top 5 basado en unidades dispensadas</p>
          </div>

          <div class="position-relative" style="height: 300px">
            <Bar
              v-if="historicos && historicos.length > 0"
              :data="chartTopMedicamentos"
              :options="horizontalOptions"
            />
            <div
              v-else
              class="h-100 d-flex flex-column align-items-center justify-content-center text-muted"
            >
              <font-awesome-icon icon="pills" size="2x" class="mb-2 opacity-50" />
              <p class="small">Sin detalles de medicamentos</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-5 mb-4">
        <div class="card shadow-sm border-0 rounded-lg p-4 h-100">
          <div class="mb-3">
            <h5 class="font-weight-bold text-dark mb-0">Tipo de Medicamentos</h5>
            <p class="text-muted small">Proporción de narcóticos vs normales</p>
          </div>

          <div class="position-relative" style="height: 250px">
            <Doughnut
              v-if="historicos && historicos.length > 0"
              :data="chartControlados"
              :options="donaOptions"
            />
            <div
              v-else
              class="h-100 d-flex align-items-center justify-content-center text-muted"
            >
              <p class="small">Esperando datos de control...</p>
            </div>
          </div>

          <div class="mt-4 border-top pt-3">
            <div class="d-flex justify-content-between small mb-2">
              <span>
                <font-awesome-icon icon="circle" class="text-danger" />
                Controlados (Narcóticos)
              </span>
              <span class="font-weight-bold text-danger">
                {{ historicos.filter((h) => !!h.autorizo).length }}
              </span>
            </div>
            <div class="d-flex justify-content-between small">
              <span>
                <font-awesome-icon icon="circle" class="text-primary" />
                Medicamentos Normales
              </span>
              <span class="font-weight-bold text-primary">
                {{ historicos.filter((h) => !h.autorizo).length }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 mb-4">
        <div class="card shadow-sm border-0 rounded-lg p-4">
          <div class="mb-4">
            <h5 class="font-weight-bold text-dark mb-0">Demanda por Especialidad</h5>
            <p class="text-muted small">
              Distribución de todas las recetas por área médica
            </p>
          </div>

          <div class="row">
            <div class="col-lg-8 border-right">
              <div class="position-relative" style="height: 300px">
                <Bar
                  v-if="historicos && historicos.length > 0"
                  :data="datosEspecialidades.chartData"
                  :options="medicoOptions"
                />
              </div>
            </div>
            <div class="col-lg-4">
              <div class="table-responsive pl-lg-2">
                <table class="table table-sm table-borderless">
                  <thead>
                    <tr class="text-muted small border-bottom">
                      <th>Especialidad</th>
                      <th class="text-right">Recetas</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="esp in datosEspecialidades.tabla"
                      :key="esp.nombre"
                      class="border-bottom-faint"
                    >
                      <td class="py-2 small">
                        <span class="font-weight-bold text-dark">{{ esp.nombre }}</span>
                        <br />
                        <span class="text-muted" style="font-size: 0.75rem">
                          {{ esp.conteoMedicos }} médicos activos
                        </span>
                      </td>
                      <td class="py-2 text-right align-middle">
                        <span class="badge badge-warning text-dark px-2">
                          {{ esp.total }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 mb-4">
        <div class="card shadow-sm border-0 rounded-lg p-4">
          <div class="mb-4">
            <h5 class="font-weight-bold text-dark mb-0">Desempeño por Médico</h5>
            <p class="text-muted small">
              Volumen de recetas y fechas de actividad reciente
            </p>
          </div>

          <div class="position-relative mb-5" style="height: 350px">
            <Bar
              v-if="historicos && historicos.length > 0"
              :data="datosMedicos.chartData"
              :options="medicoOptions"
            />
            <div
              v-else
              class="h-100 d-flex flex-column align-items-center justify-content-center text-muted"
            >
              <font-awesome-icon icon="user-md" size="3x" class="mb-2 opacity-50" />
              <p>No se encontraron registros de médicos.</p>
            </div>
          </div>

          <div class="table-responsive mt-2">
            <table class="table table-hover align-middle border-top">
              <thead class="bg-light">
                <tr>
                  <th class="border-0">Nombre del Médico</th>
                  <th class="border-0 text-center">Total Recetas</th>
                  <th class="border-0">Fechas de Actividad</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="medico in datosMedicos.tabla" :key="medico.nombre">
                  <td class="font-weight-bold text-dark">
                    <font-awesome-icon icon="user-md" class="text-secondary mr-2" />
                    {{ medico.nombre }}
                  </td>
                  <td class="text-center">
                    <span class="badge badge-pill badge-primary px-3 py-2">
                      {{ medico.total }}
                    </span>
                  </td>
                  <td class="text-muted small">
                    <font-awesome-icon icon="calendar-alt" class="mr-1 opacity-50" />
                    {{ medico.fechas }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-12">
        <div class="card shadow-sm border-0 rounded-lg p-3 bg-white">
          <div class="d-flex align-items-center">
            <div class="p-3">
              <font-awesome-icon
                icon="exclamation-circle"
                size="2x"
                class="text-danger"
              />
            </div>
            <div class="border-left pl-3">
              <h6 class="text-danger font-weight-bold mb-1">
                Nota de Saturación Operativa
              </h6>
              <p class="small text-muted mb-0">
                Si la tendencia diaria supera las <strong>50 recetas</strong> (línea
                roja), el sistema recomienda habilitar una ventanilla adicional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./vista_grafica.component.ts"></script>

<style scoped>
.container-fluid {
  min-height: 100vh;
}
.card {
  border-radius: 1rem !important;
  transition: transform 0.2s ease;
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1) !important;
}
.border-left {
  border-left: 3px solid #dee2e6 !important;
}
.border-bottom-faint {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.table thead th {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6c757d;
}
/* Estilo para la división visual entre gráfica y tabla */
@media (min-width: 992px) {
  .border-right {
    border-right: 1px solid #eee;
  }
}
</style>
