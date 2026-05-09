<template>
  <div class="container-fluid py-4 bg-transparent animate__animated animate__fadeIn">
    <div class="d-flex justify-content-between align-items-center flex-wrap mb-4">
      <h2 id="page-heading" data-cy="InventarioHeading" class="mb-0 color-guinda fw-bold">
        <font-awesome-icon icon="boxes" class="me-2" />

        <span
          v-text="t$('gatewayApp.inventarioInventario.home.title')"
          id="inventario-heading"
        ></span>
      </h2>

      <div class="d-flex align-items-center">
        <div class="me-2" style="width: 350px">
          <div class="input-group shadow-sm">
            <span class="input-group-text bg-white border-end-0 rounded-start-pill">
              <font-awesome-icon icon="search" class="text-guinda" />
            </span>

            <input
              type="text"
              class="form-control border-start-0 rounded-end-pill focus-guinda"
              placeholder="Buscar medicamento..."
              v-model="filtroTexto"
            />
          </div>
        </div>

        <button
          class="btn btn-outline-guinda rounded-circle me-2"
          @click="handleSyncList"
          :disabled="isFetching"
        >
          <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
        </button>

        <router-link :to="{ name: 'InventarioCreate' }" custom v-slot="{ navigate }">
          <button
            @click="navigate"
            id="jh-create-entity"
            data-cy="entityCreateButton"
            class="btn btn-guinda shadow-sm rounded-pill px-4"
          >
            <font-awesome-icon icon="plus" class="me-1"></font-awesome-icon> Nuevo
            Registro
          </button>
        </router-link>
      </div>
    </div>

    <div class="mb-4 d-flex gap-2">
      <button
        class="btn btn-success shadow-sm rounded-pill px-4"
        @click="showEntradaModal = true"
      >
        <font-awesome-icon icon="plus-circle" class="me-1"></font-awesome-icon> Registrar
        Entrada
      </button>

      <button
        class="btn btn-secondary shadow-sm rounded-pill px-4"
        @click="irMovimientos"
      >
        <font-awesome-icon icon="history" class="me-1"></font-awesome-icon> Ver Historial
      </button>

      <button class="btn btn-dark shadow-sm rounded-pill px-4" @click="toggleGraficas">
        <font-awesome-icon
          :icon="showGraficas ? 'eye-slash' : 'chart-line'"
          class="me-1"
        ></font-awesome-icon>

        {{ showGraficas ? "Ocultar Estadísticas" : "Estadísticas" }}
      </button>
    </div>

    <div
      v-if="showGraficas"
      class="mb-4 shadow-lg rounded-lg bg-white-transparent p-3 animate__animated animate__zoomIn"
    >
      <graficas-inventario @preparar-resurtido="abrirResurtidoDesdeGrafica" />
    </div>

    <div class="card shadow-lg border-0 rounded-xl overflow-hidden">
      <div class="card-header bg-vino text-white py-3">
        <h5 class="mb-0 font-weight-bold">Existencias en Almacén</h5>
      </div>

      <div class="card-body p-0 bg-white-opacity">
        <div
          class="table-responsive"
          v-if="inventariosFiltrados && inventariosFiltrados.length > 0"
        >
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light-guinda text-guinda">
              <tr>
                <th class="border-0">ID</th>

                <th class="border-0">Clave</th>

                <th class="border-0">Nombre</th>

                <th class="border-0">Presentación</th>

                <th class="border-0">Lote</th>

                <th class="border-0 text-center">Cantidad</th>

                <th class="border-0 text-center">Mínimo</th>

                <th class="border-0">Caducidad</th>

                <th class="border-0">Ubicación</th>

                <th class="border-0 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="inventario in inventariosFiltrados" :key="inventario.id">
                <td class="text-muted">#{{ inventario.id }}</td>

                <td>
                  <code class="text-dark fw-bold">{{ inventario.claveMedicamento }}</code>
                </td>

                <td class="fw-bold">{{ inventario.nombre }}</td>

                <td class="small">{{ inventario.presentacion }}</td>

                <td>
                  <span class="badge bg-light text-dark border">{{
                    inventario.lote
                  }}</span>
                </td>

                <td class="text-center">
                  <span
                    :class="[
                      'badge rounded-pill px-3',

                      inventario.cantidad <= 50
                        ? 'bg-danger'
                        : 'bg-success-light text-success',
                    ]"
                  >
                    {{ inventario.cantidad }}
                  </span>
                </td>

                <td class="text-center text-muted small">
                  {{ inventario.cantidadMinima }}
                </td>

                <td>{{ inventario.fechaCaducidad }}</td>

                <td>
                  <small
                    ><font-awesome-icon icon="map-marker-alt" class="me-1 text-muted" />{{
                      inventario.ubicacion
                    }}</small
                  >
                </td>

                <td class="text-center">
                  <div class="btn-group shadow-sm rounded-pill overflow-hidden">
                    <router-link
                      :to="{
                        name: 'InventarioView',

                        params: { inventarioId: inventario.id },
                      }"
                      custom
                      v-slot="{ navigate }"
                    >
                      <button
                        @click="navigate"
                        class="btn btn-info-light btn-sm"
                        title="Ver detalle"
                      >
                        <font-awesome-icon icon="eye"></font-awesome-icon>
                      </button>
                    </router-link>

                    <router-link
                      :to="{
                        name: 'InventarioEdit',

                        params: { inventarioId: inventario.id },
                      }"
                      custom
                      v-slot="{ navigate }"
                    >
                      <button
                        @click="navigate"
                        class="btn btn-primary-light btn-sm"
                        title="Editar"
                      >
                        <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                      </button>
                    </router-link>

                    <b-button
                      @click="prepareRemove(inventario)"
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

        <div v-else class="text-center py-5">
          <font-awesome-icon
            icon="box-open"
            size="3x"
            class="text-muted mb-3 opacity-50"
          />

          <p class="text-muted">
            No se encontraron medicamentos con los criterios de búsqueda.
          </p>
        </div>
      </div>
    </div>

    <b-modal
      v-model="showEntradaModal"
      title="📦 Registrar Entrada de Medicamento"
      hide-footer
      centered
      header-class="bg-success text-white border-0"
      content-class="border-0 shadow-lg rounded-xl"
    >
      <div class="p-2">
        <div class="mb-3">
          <label class="form-label fw-bold small text-muted">MEDICAMENTO</label>

          <input
            list="medicamentos-data"
            class="form-control rounded-pill"
            v-model="entrada.nombre"
            placeholder="Escribe para buscar..."
          />

          <datalist id="medicamentos-data">
            <option v-for="inv in inventarios" :key="inv.id" :value="inv.nombre">
              Lote: {{ inv.lote }} | Stock: {{ inv.cantidad }}
            </option>
          </datalist>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold small text-muted">CANTIDAD A INGRESAR</label>

          <input
            type="number"
            class="form-control rounded-pill"
            v-model.number="entrada.cantidad"
            placeholder="0"
            min="1"
          />
        </div>

        <div class="mb-4">
          <label class="form-label fw-bold small text-muted">OBSERVACIÓN / NOTA</label>

          <textarea
            class="form-control"
            v-model="entrada.observacion"
            placeholder="Ej: Reabastecimiento semanal"
            rows="2"
            style="border-radius: 15px"
          ></textarea>
        </div>

        <div class="d-flex justify-content-end gap-2 border-top pt-3">
          <b-button
            variant="light"
            class="rounded-pill px-4"
            @click="showEntradaModal = false"
            >Cancelar</b-button
          >

          <b-button
            variant="success"
            class="rounded-pill px-4 shadow-sm"
            @click="guardarEntrada"
            :disabled="!entrada.nombre || entrada.cantidad <= 0"
          >
            <font-awesome-icon icon="save" class="me-1" /> Registrar Entrada
          </b-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts" src="./inventario.component.ts"></script>

<style scoped>
/* PALETA INFOTEC */

.color-guinda {
  color: #9b2247 !important;
}

.text-guinda {
  color: #9b2247 !important;
}

.bg-vino {
  background-color: #611232 !important;
}

.bg-light-guinda {
  background-color: #fdf2f5;
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
}

.btn-outline-guinda:hover {
  background-color: #9b2247;

  color: white;
}

/* ESTILOS DE TABLA Y CARDS */

.rounded-xl {
  border-radius: 15px !important;
}

.bg-white-transparent {
  background-color: rgba(255, 255, 255, 0.8);

  backdrop-filter: blur(5px);
}

.bg-white-opacity {
  background-color: rgba(255, 255, 255, 0.95);
}

.bg-success-light {
  background-color: #e8f5e9;
}

.focus-guinda:focus {
  border-color: #9b2247;

  box-shadow: 0 0 0 0.25rem rgba(155, 34, 71, 0.15);
}

/* BOTONES DE ACCIÓN LIGEROS */

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

.table-hover tbody tr:hover {
  background-color: rgba(155, 34, 71, 0.03);
}
</style>
