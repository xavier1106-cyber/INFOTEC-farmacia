<template>
  <div class="container-fluid py-4 bg-transparent animate__animated animate__fadeIn">
    <div class="row justify-content-center">
      <div class="col-md-10 col-lg-8">
        <div
          v-if="inventario"
          class="card shadow-lg border-0 rounded-xl overflow-hidden bg-white-opacity"
        >
          <div
            class="card-header bg-vino text-white py-3 d-flex justify-content-between align-items-center"
          >
            <h4 class="mb-0 fw-bold">
              <font-awesome-icon icon="file-medical" class="me-2" />
              <span v-text="t$('gatewayApp.inventarioInventario.detail.title')"></span>
            </h4>
            <span class="badge bg-white-opacity-btn rounded-pill px-3 py-2 small">
              ID: #{{ inventario.id }}
            </span>
          </div>

          <div class="card-body p-4">
            <div class="text-center mb-4 border-bottom pb-3">
              <h3 class="text-guinda fw-bold mb-1">{{ inventario.nombre }}</h3>
              <span
                class="badge bg-light-guinda text-guinda rounded-pill px-3 shadow-sm border border-guinda-light"
              >
                <font-awesome-icon icon="barcode" class="me-1" />
                {{ inventario.claveMedicamento }}
              </span>
            </div>

            <div class="row g-4 jh-entity-details">
              <div class="col-md-6 border-end-md">
                <div class="mb-3 d-flex align-items-start">
                  <div
                    class="icon-box-sm bg-light-guinda text-guinda me-3 rounded-circle text-center"
                  >
                    <font-awesome-icon icon="capsules" />
                  </div>
                  <div>
                    <label
                      class="d-block small text-muted fw-bold"
                      v-text="t$('gatewayApp.inventarioInventario.presentacion')"
                    ></label>
                    <span class="h6 mb-0 text-dark">{{ inventario.presentacion }}</span>
                  </div>
                </div>

                <div class="mb-3 d-flex align-items-start">
                  <div
                    class="icon-box-sm bg-light-guinda text-guinda me-3 rounded-circle text-center"
                  >
                    <font-awesome-icon icon="boxes" />
                  </div>
                  <div>
                    <label
                      class="d-block small text-muted fw-bold"
                      v-text="t$('gatewayApp.inventarioInventario.lote')"
                    ></label>
                    <span class="h6 mb-0 text-dark">{{ inventario.lote }}</span>
                  </div>
                </div>

                <div class="mb-3 d-flex align-items-start">
                  <div
                    class="icon-box-sm bg-light-guinda text-guinda me-3 rounded-circle text-center"
                  >
                    <font-awesome-icon icon="map-marker-alt" />
                  </div>
                  <div>
                    <label
                      class="d-block small text-muted fw-bold"
                      v-text="t$('gatewayApp.inventarioInventario.ubicacion')"
                    ></label>
                    <span class="h6 mb-0 text-dark">{{ inventario.ubicacion }}</span>
                  </div>
                </div>
              </div>

              <div class="col-md-6 ps-md-4">
                <div class="mb-3 d-flex align-items-start">
                  <div
                    class="icon-box-sm bg-light-ocre text-ocre me-3 rounded-circle text-center"
                  >
                    <font-awesome-icon icon="layer-group" />
                  </div>
                  <div>
                    <label
                      class="d-block small text-muted fw-bold"
                      v-text="t$('gatewayApp.inventarioInventario.cantidad')"
                    ></label>
                    <span
                      class="h5 mb-0 fw-bold"
                      :class="
                        inventario.cantidad <= inventario.cantidadMinima
                          ? 'text-danger'
                          : 'text-success'
                      "
                    >
                      {{ inventario.cantidad }}
                    </span>
                    <small class="text-muted ms-2"
                      >(Min: {{ inventario.cantidadMinima }})</small
                    >
                  </div>
                </div>

                <div class="mb-3 d-flex align-items-start">
                  <div
                    class="icon-box-sm bg-light-ocre text-ocre me-3 rounded-circle text-center"
                  >
                    <font-awesome-icon icon="calendar-check" />
                  </div>
                  <div>
                    <label
                      class="d-block small text-muted fw-bold"
                      v-text="t$('gatewayApp.inventarioInventario.fechaCaducidad')"
                    ></label>
                    <span class="h6 mb-0 text-dark">{{ inventario.fechaCaducidad }}</span>
                  </div>
                </div>

                <div class="mb-3 d-flex align-items-start">
                  <div
                    class="icon-box-sm me-3 rounded-circle text-center"
                    :class="
                      inventario.controlado
                        ? 'bg-danger-light text-danger'
                        : 'bg-light text-muted'
                    "
                  >
                    <font-awesome-icon
                      :icon="inventario.controlado ? 'shield-alt' : 'check-circle'"
                    />
                  </div>
                  <div>
                    <label
                      class="d-block small text-muted fw-bold"
                      v-text="t$('gatewayApp.inventarioInventario.controlado')"
                    ></label>
                    <span
                      v-if="inventario.controlado"
                      class="badge bg-danger rounded-pill"
                      >SÍ - MEDICAMENTO CONTROLADO</span
                    >
                    <span v-else class="text-muted small"></span>
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-between border-top pt-4 mt-3">
              <button
                type="submit"
                @click.prevent="previousState()"
                class="btn btn-outline-secondary rounded-pill px-4"
                data-cy="entityDetailsBackButton"
              >
                <font-awesome-icon icon="arrow-left" class="me-1"></font-awesome-icon>
                <span v-text="t$('entity.action.back')"></span>
              </button>

              <router-link
                v-if="inventario.id"
                :to="{ name: 'InventarioEdit', params: { inventarioId: inventario.id } }"
                custom
                v-slot="{ navigate }"
              >
                <button @click="navigate" class="btn btn-guinda rounded-pill px-4 shadow">
                  <font-awesome-icon icon="pencil-alt" class="me-1"></font-awesome-icon>
                  <span v-text="t$('entity.action.edit')"></span>
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./inventario-details.component.ts"></script>

<style scoped>
/* ESTILOS INSTITUCIONALES */
.text-guinda {
  color: #9b2247 !important;
}
.bg-vino {
  background-color: #611232 !important;
}
.bg-light-guinda {
  background-color: #fdf2f5;
}
.bg-guinda-light {
  border-color: rgba(155, 34, 71, 0.2) !important;
}
.text-ocre {
  color: #a57f2c !important;
}
.bg-light-ocre {
  background-color: #fcf8ee;
}

.btn-guinda {
  background-color: #9b2247;
  color: white;
  border: none;
}
.btn-guinda:hover {
  background-color: #611232;
  transform: translateY(-2px);
}

/* DISEÑO DE TARJETA */
.rounded-xl {
  border-radius: 20px !important;
}
.bg-white-opacity {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
}
.bg-white-opacity-btn {
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* ICONOS */
.icon-box-sm {
  width: 40px;
  height: 40px;
  line-height: 40px;
  flex-shrink: 0;
}

.bg-danger-light {
  background-color: #ffebee;
  color: #c62828;
}

@media (min-width: 768px) {
  .border-end-md {
    border-right: 1px solid #eee;
  }
}

.jh-entity-details dt {
  display: none; /* Ocultamos etiquetas dt ya que usamos labels personalizadas */
}
</style>
