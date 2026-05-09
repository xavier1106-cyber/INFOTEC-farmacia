<template>
  <div class="container-fluid py-4 bg-transparent animate__animated animate__fadeIn">
    <div class="row justify-content-center">
      <div class="col-md-11 col-lg-9">
        <div
          v-if="historico"
          class="card shadow-lg border-0 rounded-xl overflow-hidden bg-white-opacity"
          id="seccion-receta"
        >
          <div
            class="card-header bg-vino text-white d-flex justify-content-between align-items-center py-3 no-print"
          >
            <div>
              <h4 class="mb-0 fw-bold">
                <font-awesome-icon icon="file-invoice" class="text-ocre me-2" />
                Folio:
                <span class="badge bg-white-opacity-btn ms-1">{{ historico.folio }}</span>
              </h4>
              <small class="text-white-50 opacity-75"
                >ID Sistema: {{ historico.id }}</small
              >
            </div>
            <div class="text-end">
              <div class="fw-bold h5 mb-0 text-ocre">
                {{ formatDateLong(historico.fechaEmision) }}
              </div>
              <span
                class="badge bg-light-ocre text-ocre border border-ocre-light shadow-sm"
              >
                <font-awesome-icon icon="check-circle" class="me-1" /> Registro Verificado
              </span>
            </div>
          </div>

          <div class="only-print text-center mb-5 mt-3">
            <h2 class="text-guinda fw-bold text-uppercase letter-spacing-2">
              Receta Médica / Comprobante de Entrega
            </h2>
            <div class="d-flex justify-content-center gap-4 mt-2 h6 text-muted">
              <span><strong>Folio:</strong> {{ historico.folio }}</span>
              <span
                ><strong>Fecha:</strong>
                {{ formatDateLong(historico.fechaEmision) }}</span
              >
            </div>
            <div class="border-bottom border-2 border-dark mt-3 w-75 mx-auto"></div>
          </div>

          <div class="card-body p-4 p-md-5 bg-white">
            <div class="row mb-5">
              <div class="col-md-6 border-end-md printable-col mb-4 mb-md-0">
                <div class="d-flex align-items-center mb-3">
                  <div
                    class="icon-box-sm bg-light-guinda text-guinda rounded-circle me-3 no-print"
                  >
                    <font-awesome-icon icon="user" />
                  </div>
                  <h6
                    class="text-guinda fw-bold text-uppercase mb-0 border-bottom-guinda pb-1 flex-grow-1"
                  >
                    Datos del Paciente
                  </h6>
                </div>
                <div class="ps-md-5">
                  <p class="mb-2">
                    <span class="text-muted small fw-bold text-uppercase d-block"
                      >Nombre:</span
                    >
                    <span class="h6 fw-bold text-dark">{{
                      historico.pacienteNombre
                    }}</span>
                  </p>
                  <p class="mb-2">
                    <span class="text-muted small fw-bold text-uppercase d-block"
                      >ID Paciente:</span
                    >
                    <span class="text-dark">{{ historico.pacienteId }}</span>
                  </p>
                  <p class="mb-0">
                    <span class="text-muted small fw-bold text-uppercase d-block"
                      >CURP:</span
                    >
                    <span class="text-muted italic">{{
                      historico.pacienteCurp || "No registrada"
                    }}</span>
                  </p>
                </div>
              </div>

              <div class="col-md-6 ps-md-4 printable-col">
                <div class="d-flex align-items-center mb-3">
                  <div
                    class="icon-box-sm bg-light-ocre text-ocre rounded-circle me-3 no-print"
                  >
                    <font-awesome-icon icon="user-md" />
                  </div>
                  <h6
                    class="text-ocre fw-bold text-uppercase mb-0 border-bottom-ocre pb-1 flex-grow-1"
                  >
                    Datos del Médico
                  </h6>
                </div>
                <div class="ps-md-5">
                  <p class="mb-2">
                    <span class="text-muted small fw-bold text-uppercase d-block"
                      >Nombre:</span
                    >
                    <span class="h6 fw-bold text-dark">{{ historico.medicoNombre }}</span>
                  </p>
                  <p class="mb-2">
                    <span class="text-muted small fw-bold text-uppercase d-block"
                      >Especialidad:</span
                    >
                    <span class="text-dark">{{
                      historico.medicoEspecialidad || "Médico General"
                    }}</span>
                  </p>
                  <p class="mb-0">
                    <span class="text-muted small fw-bold text-uppercase d-block"
                      >Cédula Profesional:</span
                    >
                    <span class="text-dark">{{ historico.medicoId }}</span>
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-4">
              <div class="d-flex align-items-center mb-3">
                <div class="icon-box-sm bg-vino text-white rounded-circle me-3 no-print">
                  <font-awesome-icon icon="pills" />
                </div>
                <h6 class="text-guinda fw-bold text-uppercase mb-0">
                  Medicamentos Entregados
                </h6>
              </div>

              <div class="table-responsive rounded-xl shadow-sm border border-light">
                <table class="table table-hover align-middle mb-0">
                  <thead class="bg-vino text-white text-uppercase small">
                    <tr>
                      <th class="py-3 px-4 border-0" style="width: 10%">Clave</th>
                      <th class="py-3 border-0">Descripción</th>
                      <th class="py-3 text-center border-0" style="width: 20%">
                        Cantidad
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-if="esJsonValido(historico.medicamentos)">
                      <tr
                        v-for="med in parsearMeds(historico.medicamentos)"
                        :key="med.id"
                        class="border-bottom"
                      >
                        <td class="px-4">
                          <span class="badge bg-light text-muted border">{{
                            med.id
                          }}</span>
                        </td>
                        <td>
                          <div class="fw-bold text-dark h6 mb-1">{{ med.nombre }}</div>
                          <div
                            v-if="med.observaciones"
                            class="text-guinda italic small d-flex align-items-start mt-1"
                          >
                            <font-awesome-icon
                              icon="info-circle"
                              class="me-2 mt-1 no-print"
                            />
                            <span>{{ med.observaciones }}</span>
                          </div>
                        </td>
                        <td class="text-center">
                          <span
                            class="badge bg-light-guinda text-guinda px-3 py-2 rounded-pill fw-bold border border-guinda-light"
                          >
                            {{ med.cantidad }} pz.
                          </span>
                        </td>
                      </tr>
                    </template>
                    <tr v-else>
                      <td colspan="3" class="text-center italic text-muted py-5">
                        <font-awesome-icon icon="exclamation-circle" class="me-2" />
                        {{ historico.medicamentos }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="row mt-5 pt-4 border-top border-light">
              <div class="col-md-7 printable-col mb-4 mb-md-0">
                <label class="small fw-bold text-guinda text-uppercase mb-2 d-block"
                  >Observaciones Generales:</label
                >
                <div
                  class="p-3 bg-light rounded-xl border border-light italic text-muted shadow-inner min-height-100"
                >
                  {{ historico.observaciones || "Sin observaciones adicionales." }}
                </div>
              </div>
              <div
                class="col-md-5 text-md-end printable-col d-flex flex-column justify-content-center"
              >
                <div class="mb-3">
                  <small class="text-muted d-block text-uppercase small-font fw-bold"
                    >Despachado por:</small
                  >
                  <span class="text-vino fw-bold">{{
                    historico.usuarioQueRegistro
                  }}</span>
                </div>
                <div>
                  <small class="text-muted d-block text-uppercase small-font fw-bold"
                    >Autorización Digital:</small
                  >
                  <span class="text-ocre fw-bold">{{ historico.autorizo }}</span>
                </div>
              </div>
            </div>

            <div class="only-print mt-5 pt-5">
              <div class="row text-center mt-5">
                <div class="col-5 border-top border-dark pt-2 mx-auto">
                  <small class="text-uppercase fw-bold d-block"
                    >Firma del Paciente / Recibe</small
                  >
                </div>
                <div class="col-1"></div>
                <div class="col-5 border-top border-dark pt-2 mx-auto">
                  <small class="text-uppercase fw-bold d-block"
                    >Sello de Farmacia / Despacho</small
                  >
                </div>
              </div>
            </div>
          </div>

          <div
            class="card-footer bg-light-guinda py-3 d-flex justify-content-between no-print border-0 p-4"
          >
            <button
              type="button"
              @click.prevent="previousState()"
              class="btn btn-outline-secondary rounded-pill px-4 shadow-sm bg-white"
            >
              <font-awesome-icon icon="arrow-left" class="me-2" /> Volver
            </button>
            <div class="d-flex gap-2">
              <button
                type="button"
                @click="imprimirReceta"
                class="btn btn-ocre rounded-pill px-4 shadow-sm text-white fw-bold"
              >
                <font-awesome-icon icon="print" class="me-2" /> Imprimir Comprobante
              </button>
              <router-link
                v-if="historico.id"
                :to="{ name: 'HistoricoEdit', params: { historicoId: historico.id } }"
                custom
                v-slot="{ navigate }"
              >
                <button
                  @click="navigate"
                  class="btn btn-guinda rounded-pill px-4 shadow-sm fw-bold"
                >
                  <font-awesome-icon icon="pencil-alt" class="me-2" /> Editar Registro
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./historico-details.component.ts"></script>

<style scoped>
/* ESTILOS INSTITUCIONALES */
.text-guinda {
  color: #9b2247 !important;
}
.text-vino {
  color: #611232 !important;
}
.bg-vino {
  background-color: #611232 !important;
}
.bg-light-guinda {
  background-color: #fdf2f5;
}
.border-bottom-guinda {
  border-bottom: 2px solid #9b2247;
}

.text-ocre {
  color: #a57f2c !important;
}
.bg-light-ocre {
  background-color: #fcf8ee;
}
.border-bottom-ocre {
  border-bottom: 2px solid #a57f2c;
}
.ocre-light {
  border-color: rgba(165, 127, 44, 0.2) !important;
}

.btn-guinda {
  background-color: #9b2247;
  color: white;
  border: none;
}
.btn-guinda:hover {
  background-color: #611232;
  transform: translateY(-1px);
}
.btn-ocre {
  background-color: #a57f2c;
  color: white;
  border: none;
}
.btn-ocre:hover {
  background-color: #846522;
}

/* DISEÑO DE TARJETA Y TABLA */
.rounded-xl {
  border-radius: 15px !important;
}
.bg-white-opacity {
  background-color: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(8px);
}
.bg-white-opacity-btn {
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.icon-box-sm {
  width: 35px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  flex-shrink: 0;
}

.min-height-100 {
  min-height: 100px;
}
.shadow-inner {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* --- ESTILOS DE IMPRESIÓN --- */
.only-print {
  display: none;
}
.letter-spacing-2 {
  letter-spacing: 2px;
}

@media print {
  .no-print {
    display: none !important;
  }
  .only-print {
    display: block !important;
  }
  .card {
    border: none !important;
    box-shadow: none !important;
  }
  .card-body {
    padding: 0 !important;
  }
  .bg-white-opacity {
    background: white !important;
  }
  .printable-col {
    width: 48% !important;
    float: left !important;
  }
  .table thead {
    background-color: #f8f9fa !important;
    color: black !important;
  }
  .badge {
    border: 1px solid #000 !important;
    color: black !important;
    background: transparent !important;
  }
  .min-height-100 {
    min-height: 80px;
  }
  @page {
    margin: 1.5cm;
  }
}

@media (min-width: 768px) {
  .border-end-md {
    border-right: 1px solid #eee;
  }
}
</style>
