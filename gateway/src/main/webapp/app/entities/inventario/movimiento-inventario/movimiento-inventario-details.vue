<template>
  <div class="container mt-4 mb-5">
    <div class="row justify-content-center">
      <div class="col-md-10 col-lg-8">
        <div v-if="movimientoInventario" class="card shadow-sm border-0">
          <div class="card-header bg-institucional text-white py-3">
            <h2 class="h4 mb-0 fw-bold" data-cy="movimientoInventarioDetailsHeading">
              <font-awesome-icon icon="info-circle" class="me-2"></font-awesome-icon>
              {{ t$("gatewayApp.inventarioMovimientoInventario.detail.title") }}
              <span class="ms-2 opacity-75">#{{ movimientoInventario.id }}</span>
            </h2>
          </div>

          <div class="card-body p-4">
            <dl class="row jh-entity-details mb-0">
              <dt class="col-sm-4 text-muted fw-normal pb-3">
                <font-awesome-icon
                  icon="exchange-alt"
                  class="me-2 text-institucional"
                ></font-awesome-icon>
                <span
                  v-text="t$('gatewayApp.inventarioMovimientoInventario.tipoMovimiento')"
                ></span>
              </dt>
              <dd class="col-sm-8 pb-3 border-bottom">
                <span
                  class="badge px-3 py-2"
                  :class="
                    movimientoInventario.tipoMovimiento === 'ENTRADA'
                      ? 'bg-success'
                      : 'bg-danger'
                  "
                >
                  {{
                    t$("gatewayApp.TipoMovimiento." + movimientoInventario.tipoMovimiento)
                  }}
                </span>
              </dd>

              <dt class="col-sm-4 text-muted fw-normal py-3">
                <font-awesome-icon
                  icon="boxes"
                  class="me-2 text-institucional"
                ></font-awesome-icon>
                <span
                  v-text="t$('gatewayApp.inventarioMovimientoInventario.cantidad')"
                ></span>
              </dt>
              <dd class="col-sm-8 py-3 border-bottom fw-bold text-dark fs-5">
                {{ movimientoInventario.cantidad }}
              </dd>

              <dt class="col-sm-4 text-muted fw-normal py-3">
                <font-awesome-icon
                  icon="calendar-alt"
                  class="me-2 text-institucional"
                ></font-awesome-icon>
                <span
                  v-text="t$('gatewayApp.inventarioMovimientoInventario.fecha')"
                ></span>
              </dt>
              <dd class="col-sm-8 py-3 border-bottom text-dark">
                {{ movimientoInventario.fecha }}
              </dd>

              <dt class="col-sm-4 text-muted fw-normal py-3">
                <font-awesome-icon
                  icon="comment-dots"
                  class="me-2 text-institucional"
                ></font-awesome-icon>
                <span
                  v-text="t$('gatewayApp.inventarioMovimientoInventario.observacion')"
                ></span>
              </dt>
              <dd class="col-sm-8 py-3 border-bottom italic text-muted">
                {{ movimientoInventario.observacion || "Sin observaciones adicionales" }}
              </dd>

              <dt class="col-sm-4 text-muted fw-normal pt-3">
                <font-awesome-icon
                  icon="warehouse"
                  class="me-2 text-institucional"
                ></font-awesome-icon>
                <span
                  v-text="t$('gatewayApp.inventarioMovimientoInventario.inventario')"
                ></span>
              </dt>
              <dd class="col-sm-8 pt-3 fw-bold">
                <div
                  v-if="
                    movimientoInventario.inventario && movimientoInventario.inventario.id
                  "
                >
                  <router-link
                    class="text-institucional text-decoration-none"
                    :to="{
                      name: 'InventarioView',
                      params: { inventarioId: movimientoInventario.inventario.id },
                    }"
                  >
                    <font-awesome-icon
                      icon="external-link-alt"
                      class="small me-1"
                    ></font-awesome-icon>
                    {{
                      movimientoInventario.inventario.nombre ||
                      movimientoInventario.inventario.id
                    }}
                  </router-link>
                </div>
                <span v-else class="text-muted">N/A</span>
              </dd>
            </dl>
          </div>

          <div class="card-footer bg-light d-flex justify-content-between py-3 border-0">
            <button
              type="submit"
              @click.prevent="previousState()"
              class="btn btn-outline-secondary px-4 shadow-sm"
              data-cy="entityDetailsBackButton"
            >
              <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;
              <span v-text="t$('entity.action.back')"></span>
            </button>

            <router-link
              v-if="movimientoInventario.id"
              :to="{
                name: 'MovimientoInventarioEdit',
                params: { movimientoInventarioId: movimientoInventario.id },
              }"
              custom
              v-slot="{ navigate }"
            >
              <button @click="navigate" class="btn btn-institucional px-4 shadow-sm">
                <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;
                <span v-text="t$('entity.action.edit')"></span>
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./movimiento-inventario-details.component.ts"></script>

<style scoped>
/* PALETA PANTONE INSTITUCIONAL */
.text-institucional {
  color: #9b2247 !important;
}
.bg-institucional {
  background-color: #9b2247 !important;
}
.btn-institucional {
  background-color: #9b2247 !important;
  border-color: #9b2247 !important;
  color: white !important;
}
.btn-institucional:hover {
  background-color: #7a1a37 !important;
  border-color: #7a1a37 !important;
}

/* ESTILOS DE COMPONENTE */
.card {
  border-radius: 12px;
  overflow: hidden;
}
.jh-entity-details dt {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.italic {
  font-style: italic;
}
.badge {
  font-weight: 500;
  border-radius: 6px;
}
</style>
