<template>
  <div class="container-fluid py-4 bg-transparent animate__animated animate__fadeIn">
    <div class="d-flex justify-content-between align-items-center flex-wrap mb-4">
      <h2
        id="page-heading"
        data-cy="MovimientoInventarioHeading"
        class="mb-0 color-guinda fw-bold"
      >
        <font-awesome-icon icon="history" class="me-2" />
        <span
          v-text="t$('gatewayApp.inventarioMovimientoInventario.home.title')"
          id="movimiento-inventario-heading"
        ></span>
      </h2>

      <div class="d-flex align-items-center mt-2 mt-md-0">
        <router-link :to="{ name: 'Inventario' }" custom v-slot="{ navigate }">
          <button
            @click="navigate"
            class="btn btn-outline-secondary rounded-pill me-2 shadow-sm px-3"
          >
            <font-awesome-icon icon="arrow-left" class="me-1" />
            <span>Regresar a Inventario</span>
          </button>
        </router-link>

        <button
          class="btn btn-outline-guinda rounded-pill me-2 shadow-sm px-3"
          @click="handleSyncList"
          :disabled="isFetching"
        >
          <font-awesome-icon
            icon="sync"
            :spin="isFetching"
            class="me-1"
          ></font-awesome-icon>
          <span
            v-text="t$('gatewayApp.inventarioMovimientoInventario.home.refreshListLabel')"
          ></span>
        </button>
      </div>
    </div>

    <div
      class="alert alert-custom-info shadow-sm rounded-pill text-center animate__animated animate__headShake"
      v-if="!isFetching && movimientoInventarios && movimientoInventarios.length === 0"
    >
      <font-awesome-icon icon="info-circle" class="me-2" />
      <span v-text="t$('gatewayApp.inventarioMovimientoInventario.home.notFound')"></span>
    </div>

    <div class="card shadow-lg border-0 rounded-xl overflow-hidden main-card-history">
      <div class="card-header bg-vino text-white py-3">
        <h5 class="mb-0 fw-bold">
          <font-awesome-icon icon="exchange-alt" class="me-2" /> Registro de Auditoría
        </h5>
      </div>

      <div class="card-body p-0 bg-white-opacity">
        <div
          class="table-responsive"
          v-if="movimientoInventarios && movimientoInventarios.length > 0"
        >
          <table class="table table-hover align-middle mb-0 custom-table">
            <thead class="bg-light-guinda text-guinda">
              <tr>
                <th @click="changeOrder('id')" class="cursor-pointer">
                  <span v-text="t$('global.field.id')"></span>
                  <jhi-sort-indicator
                    :current-order="propOrder"
                    :reverse="reverse"
                    :field-name="'id'"
                  ></jhi-sort-indicator>
                </th>
                <th
                  @click="changeOrder('tipoMovimiento')"
                  class="cursor-pointer text-center"
                >
                  <font-awesome-icon icon="tag" class="small me-1" />
                  <span
                    v-text="
                      t$('gatewayApp.inventarioMovimientoInventario.tipoMovimiento')
                    "
                  ></span>
                  <jhi-sort-indicator
                    :current-order="propOrder"
                    :reverse="reverse"
                    :field-name="'tipoMovimiento'"
                  ></jhi-sort-indicator>
                </th>
                <th @click="changeOrder('cantidad')" class="cursor-pointer text-center">
                  <span
                    v-text="t$('gatewayApp.inventarioMovimientoInventario.cantidad')"
                  ></span>
                  <jhi-sort-indicator
                    :current-order="propOrder"
                    :reverse="reverse"
                    :field-name="'cantidad'"
                  ></jhi-sort-indicator>
                </th>
                <th @click="changeOrder('fecha')" class="cursor-pointer">
                  <font-awesome-icon icon="calendar-alt" class="small me-1" />
                  <span
                    v-text="t$('gatewayApp.inventarioMovimientoInventario.fecha')"
                  ></span>
                  <jhi-sort-indicator
                    :current-order="propOrder"
                    :reverse="reverse"
                    :field-name="'fecha'"
                  ></jhi-sort-indicator>
                </th>
                <th>
                  <font-awesome-icon icon="pills" class="small me-1" />
                  <span
                    v-text="t$('gatewayApp.inventarioMovimientoInventario.inventario')"
                  ></span>
                </th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="movimientoInventario in movimientoInventarios"
                :key="movimientoInventario.id"
                data-cy="entityTable"
              >
                <td class="small fw-bold">#{{ movimientoInventario.id }}</td>
                <td class="text-center">
                  <span
                    :class="[
                      'badge rounded-pill px-3 py-2',
                      movimientoInventario.tipoMovimiento === 'ENTRADA'
                        ? 'bg-success-light text-success'
                        : 'bg-danger-light text-danger',
                    ]"
                  >
                    <font-awesome-icon
                      :icon="
                        movimientoInventario.tipoMovimiento === 'ENTRADA'
                          ? 'arrow-down'
                          : 'arrow-up'
                      "
                      class="me-1 small"
                    />
                    {{
                      t$(
                        "gatewayApp.TipoMovimiento." + movimientoInventario.tipoMovimiento
                      )
                    }}
                  </span>
                </td>
                <td class="text-center fw-bold">{{ movimientoInventario.cantidad }}</td>
                <td class="small">{{ movimientoInventario.fecha }}</td>
                <td>
                  <div
                    v-if="
                      movimientoInventario.inventario &&
                      movimientoInventario.inventario.id
                    "
                  >
                    <router-link
                      :to="{
                        name: 'InventarioView',
                        params: { inventarioId: movimientoInventario.inventario.id },
                      }"
                      class="text-guinda fw-bold no-underline"
                    >
                      {{ movimientoInventario.inventario.nombre }}
                    </router-link>
                  </div>
                  <span v-else class="text-muted italic">Sin referencia</span>
                </td>
                <td class="text-center">
                  <div class="btn-group shadow-sm rounded-pill overflow-hidden">
                    <!--<router-link
                      :to="{
                        name: 'MovimientoInventarioView',
                        params: { movimientoInventarioId: movimientoInventario.id },
                      }"
                      custom
                      v-slot="{ navigate }"
                    >
                      <button
                        @click="navigate"
                        class="btn btn-info-light btn-sm"
                        title="Detalles"
                      >
                        <font-awesome-icon icon="eye"></font-awesome-icon>
                      </button>
                    </router-link>-->
                    <router-link
                      :to="{
                        name: 'MovimientoInventarioEdit',
                        params: { movimientoInventarioId: movimientoInventario.id },
                      }"
                      custom
                      v-slot="{ navigate }"
                    >
                      <!--<button
                        @click="navigate"
                        class="btn btn-primary-light btn-sm"
                        title="Editar"
                      >
                        <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                      </button>-->
                    </router-link>
                    <b-button
                      @click="prepareRemove(movimientoInventario)"
                      variant="danger-light"
                      class="btn btn-sm"
                      v-b-modal.removeEntity
                      title="Eliminar"
                    >
                      <font-awesome-icon icon="times"></font-awesome-icon>
                    </b-button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-show="movimientoInventarios && movimientoInventarios.length > 0" class="mt-4">
      <div class="row justify-content-center mb-2">
        <jhi-item-count
          :page="page"
          :total="queryCount"
          :itemsPerPage="itemsPerPage"
          class="small text-muted"
        ></jhi-item-count>
      </div>
      <div class="row justify-content-center">
        <b-pagination
          size="md"
          :total-rows="totalItems"
          v-model="page"
          :per-page="itemsPerPage"
          class="custom-pagination shadow-sm"
        ></b-pagination>
      </div>
    </div>

    <b-modal
      ref="removeEntity"
      id="removeEntity"
      centered
      header-bg-variant="danger"
      header-text-variant="white"
    >
      <template #modal-title>
        <span v-text="t$('entity.delete.title')"></span>
      </template>
      <div class="modal-body text-center p-4">
        <font-awesome-icon icon="exclamation-circle" size="3x" class="text-danger mb-3" />
        <p
          class="h6"
          v-text="
            t$('gatewayApp.inventarioMovimientoInventario.delete.question', {
              id: removeId,
            })
          "
        ></p>
        <p class="text-muted small">
          Esta acción no se puede deshacer en el historial de auditoría.
        </p>
      </div>
      <template #modal-footer>
        <div class="d-flex gap-2 w-100 justify-content-center">
          <button
            type="button"
            class="btn btn-light rounded-pill px-4"
            @click="closeDialog()"
            v-text="t$('entity.action.cancel')"
          ></button>
          <button
            type="button"
            class="btn btn-danger rounded-pill px-4"
            @click="removeMovimientoInventario()"
            v-text="t$('entity.action.delete')"
          ></button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts" src="./movimiento-inventario.component.ts"></script>

<style scoped>
/* PALETA INSTITUCIONAL */
.color-guinda {
  color: #9b2247 !important;
}
.bg-vino {
  background-color: #611232 !important;
}
.bg-light-guinda {
  background-color: #fcecef;
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

.btn-outline-guinda {
  color: #9b2247;
  border: 1.5px solid #9b2247;
  background: white;
}
.btn-outline-guinda:hover {
  background-color: #9b2247;
  color: white;
}

/* TABLA Y CARDS */
.rounded-xl {
  border-radius: 15px !important;
}
.bg-white-opacity {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
}

.custom-table thead th {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 15px;
  border-bottom: none;
}

.bg-success-light {
  background-color: #e8f5e9;
  color: #2e7d32;
}
.bg-danger-light {
  background-color: #fcecef;
  color: #9b2247;
}

/* ACCIONES */
.btn-info-light {
  background: #e3f2fd;
  color: #1976d2;
  border: none;
}
.btn-primary-light {
  background: #e8eaf6;
  color: #3f51b5;
  border: none;
}
.btn-danger-light {
  background: #fbe9e7;
  color: #d32f2f;
  border: none;
}

.no-underline {
  text-decoration: none;
}
.no-underline:hover {
  text-decoration: underline;
}

.alert-custom-info {
  background-color: #fdf2f5;
  color: #9b2247;
  border: 1px solid rgba(155, 34, 71, 0.2);
}

.cursor-pointer {
  cursor: pointer;
}

/* PAGINACIÓN */
::v-deep .custom-pagination .page-item.active .page-link {
  background-color: #9b2247;
  border-color: #9b2247;
}
::v-deep .custom-pagination .page-link {
  color: #611232;
  border-radius: 5px;
  margin: 0 2px;
}
</style>
