<template>
  <div class="container-fluid py-4 bg-transparent animate__animated animate__fadeIn">
    <div class="row justify-content-center">
      <div class="col-md-10 col-lg-8">
        <div class="card shadow-lg border-0 rounded-xl overflow-hidden bg-white-opacity">
          <div class="card-header bg-vino text-white py-3">
            <h4 class="mb-0 fw-bold">
              <font-awesome-icon
                :icon="inventario.id ? 'pencil-alt' : 'plus'"
                class="me-2"
              />

              <span
                id="gatewayApp.inventarioInventario.home.createOrEditLabel"
                data-cy="InventarioCreateUpdateHeading"
                v-text="t$('gatewayApp.inventarioInventario.home.createOrEditLabel')"
              ></span>
            </h4>
          </div>

          <div class="card-body p-4">
            <form name="editForm" novalidate @submit.prevent="save()">
              <div class="row">
                <div class="col-12 mb-4" v-if="inventario.id">
                  <label
                    class="form-label small fw-bold text-muted"
                    for="id"
                    v-text="t$('global.field.id')"
                  ></label>

                  <input
                    type="text"
                    class="form-control rounded-pill bg-light border-0 px-3"
                    id="id"
                    name="id"
                    v-model="inventario.id"
                    readonly
                  />
                </div>

                <div class="col-md-4 mb-3">
                  <label
                    class="form-label small fw-bold text-guinda"
                    v-text="t$('gatewayApp.inventarioInventario.claveMedicamento')"
                    for="inventario-claveMedicamento"
                  ></label>

                  <input
                    type="text"
                    class="form-control rounded-pill focus-guinda"
                    name="claveMedicamento"
                    id="inventario-claveMedicamento"
                    data-cy="claveMedicamento"
                    :class="{
                      'is-valid':
                        !v$.claveMedicamento.$invalid && v$.claveMedicamento.$dirty,

                      'is-invalid':
                        v$.claveMedicamento.$invalid && v$.claveMedicamento.$dirty,
                    }"
                    v-model="v$.claveMedicamento.$model"
                    required
                  />
                </div>

                <div class="col-md-8 mb-3">
                  <label
                    class="form-label small fw-bold text-guinda"
                    v-text="t$('gatewayApp.inventarioInventario.nombre')"
                    for="inventario-nombre"
                  ></label>

                  <input
                    type="text"
                    class="form-control rounded-pill focus-guinda"
                    name="nombre"
                    id="inventario-nombre"
                    data-cy="nombre"
                    :class="{
                      'is-valid': !v$.nombre.$invalid && v$.nombre.$dirty,

                      'is-invalid': v$.nombre.$invalid && v$.nombre.$dirty,
                    }"
                    v-model="v$.nombre.$model"
                    required
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label
                    class="form-label small fw-bold text-guinda"
                    v-text="t$('gatewayApp.inventarioInventario.presentacion')"
                    for="inventario-presentacion"
                  ></label>

                  <input
                    type="text"
                    class="form-control rounded-pill focus-guinda"
                    name="presentacion"
                    id="inventario-presentacion"
                    data-cy="presentacion"
                    v-model="v$.presentacion.$model"
                    required
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label
                    class="form-label small fw-bold text-guinda"
                    v-text="t$('gatewayApp.inventarioInventario.lote')"
                    for="inventario-lote"
                  ></label>

                  <input
                    type="text"
                    class="form-control rounded-pill focus-guinda"
                    name="lote"
                    id="inventario-lote"
                    data-cy="lote"
                    v-model="v$.lote.$model"
                    required
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label
                    class="form-label small fw-bold text-guinda"
                    v-text="t$('gatewayApp.inventarioInventario.cantidad')"
                    for="inventario-cantidad"
                  ></label>

                  <div class="input-group">
                    <span
                      class="input-group-text bg-light-guinda border-0 rounded-start-pill text-guinda"
                    >
                      <font-awesome-icon icon="cubes" />
                    </span>

                    <input
                      type="number"
                      class="form-control border-start-0 rounded-end-pill focus-guinda"
                      name="cantidad"
                      id="inventario-cantidad"
                      v-model.number="v$.cantidad.$model"
                      required
                    />
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label
                    class="form-label small fw-bold text-guinda"
                    v-text="t$('gatewayApp.inventarioInventario.cantidadMinima')"
                    for="inventario-cantidadMinima"
                  ></label>

                  <div class="input-group">
                    <span
                      class="input-group-text bg-light-ocre border-0 rounded-start-pill text-ocre"
                    >
                      <font-awesome-icon icon="bell" />
                    </span>

                    <input
                      type="number"
                      class="form-control border-start-0 rounded-end-pill focus-guinda"
                      name="cantidadMinima"
                      id="inventario-cantidadMinima"
                      v-model.number="v$.cantidadMinima.$model"
                      required
                    />
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label
                    class="form-label small fw-bold text-guinda"
                    v-text="t$('gatewayApp.inventarioInventario.fechaCaducidad')"
                    for="inventario-fechaCaducidad"
                  ></label>

                  <div class="input-group shadow-sm rounded-pill overflow-hidden border">
                    <b-input-group-prepend>
                      <b-form-datepicker
                        v-model="v$.fechaCaducidad.$model"
                        name="fechaCaducidad"
                        button-only
                        today-button
                        reset-button
                        close-button
                        button-variant="light"
                        class="border-0"
                      >
                      </b-form-datepicker>
                    </b-input-group-prepend>

                    <b-form-input
                      id="inventario-fechaCaducidad"
                      type="text"
                      class="form-control border-0"
                      name="fechaCaducidad"
                      v-model="v$.fechaCaducidad.$model"
                      required
                    />
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label
                    class="form-label small fw-bold text-guinda"
                    v-text="t$('gatewayApp.inventarioInventario.ubicacion')"
                    for="inventario-ubicacion"
                  ></label>

                  <input
                    type="text"
                    class="form-control rounded-pill focus-guinda"
                    name="ubicacion"
                    id="inventario-ubicacion"
                    v-model="v$.ubicacion.$model"
                    required
                  />
                </div>

                <div class="col-12 mt-3 mb-4">
                  <div class="form-check form-switch custom-switch-guinda">
                    <input
                      type="checkbox"
                      class="form-check-input shadow-none"
                      name="controlado"
                      id="inventario-controlado"
                      data-cy="controlado"
                      v-model="v$.controlado.$model"
                    />

                    <label
                      class="form-check-label fw-bold text-dark"
                      v-text="t$('gatewayApp.inventarioInventario.controlado')"
                      for="inventario-controlado"
                    ></label>
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-end gap-3 border-top pt-4 mt-2">
                <button
                  type="button"
                  id="cancel-save"
                  class="btn btn-outline-secondary rounded-pill px-4 shadow-sm"
                  @click="previousState()"
                >
                  <font-awesome-icon icon="ban" class="me-1"></font-awesome-icon>

                  <span v-text="t$('entity.action.cancel')"></span>
                </button>

                <button
                  type="submit"
                  id="save-entity"
                  :disabled="v$.$invalid || isSaving"
                  class="btn btn-guinda rounded-pill px-5 shadow"
                >
                  <font-awesome-icon icon="save" class="me-1"></font-awesome-icon>

                  <span v-text="t$('entity.action.save')"></span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./inventario-update.component.ts"></script>

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

.bg-light-ocre {
  background-color: #fcf8ee;
}

.text-ocre {
  color: #a57f2c !important;
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

/* INPUTS Y DISEÑO */

.rounded-xl {
  border-radius: 20px !important;
}

.bg-white-opacity {
  background-color: rgba(255, 255, 255, 0.95);

  backdrop-filter: blur(5px);
}

.focus-guinda:focus {
  border-color: #9b2247;

  box-shadow: 0 0 0 0.25rem rgba(155, 34, 71, 0.15);
}

/* SWITCH PERSONALIZADO */

.custom-switch-guinda .form-check-input:checked {
  background-color: #9b2247;

  border-color: #9b2247;
}

.form-check-input {
  cursor: pointer;

  width: 3em;

  height: 1.5em;
}

.form-label {
  margin-bottom: 0.4rem;

  letter-spacing: 0.5px;
}

/* VALIDACIONES */

.is-invalid {
  border-color: #dc3545 !important;
}

.is-valid {
  border-color: #2e7d32 !important;
}
</style>
