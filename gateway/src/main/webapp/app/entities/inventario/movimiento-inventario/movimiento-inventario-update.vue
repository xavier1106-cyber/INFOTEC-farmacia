<template>
  <div class="container mt-4 mb-5">
    <div class="row justify-content-center">
      <div class="col-md-10 col-lg-8">
        <form
          name="editForm"
          novalidate
          @submit.prevent="save()"
          class="card shadow-sm border-0"
        >
          <div class="card-header bg-institucional text-white py-3">
            <h2
              id="gatewayApp.inventarioMovimientoInventario.home.createOrEditLabel"
              data-cy="MovimientoInventarioCreateUpdateHeading"
              class="h4 mb-0 fw-bold"
            >
              <font-awesome-icon
                :icon="movimientoInventario.id ? 'pencil-alt' : 'plus'"
                class="me-2"
              />
              {{ t$("gatewayApp.inventarioMovimientoInventario.home.createOrEditLabel") }}
            </h2>
          </div>

          <div class="card-body p-4">
            <div class="row">
              <div class="form-group col-12 mb-3" v-if="movimientoInventario.id">
                <label
                  for="id"
                  class="form-label fw-bold text-muted small"
                  v-text="t$('global.field.id')"
                ></label>
                <input
                  type="text"
                  class="form-control bg-light"
                  id="id"
                  name="id"
                  v-model="movimientoInventario.id"
                  readonly
                />
              </div>

              <div class="form-group col-md-6 mb-3">
                <label
                  class="form-label fw-bold text-dark"
                  v-text="t$('gatewayApp.inventarioMovimientoInventario.tipoMovimiento')"
                  for="movimiento-inventario-tipoMovimiento"
                ></label>
                <select
                  class="form-select shadow-none"
                  name="tipoMovimiento"
                  :class="{
                    'is-valid': !v$.tipoMovimiento.$invalid && v$.tipoMovimiento.$dirty,
                    'is-invalid': v$.tipoMovimiento.$invalid && v$.tipoMovimiento.$dirty,
                  }"
                  v-model="v$.tipoMovimiento.$model"
                  id="movimiento-inventario-tipoMovimiento"
                  data-cy="tipoMovimiento"
                  required
                >
                  <option
                    v-for="tipoMovimiento in tipoMovimientoValues"
                    :key="tipoMovimiento"
                    :value="tipoMovimiento"
                  >
                    {{ t$("gatewayApp.TipoMovimiento." + tipoMovimiento) }}
                  </option>
                </select>
                <div v-if="v$.tipoMovimiento.$anyDirty && v$.tipoMovimiento.$invalid">
                  <small
                    class="text-danger"
                    v-for="error of v$.tipoMovimiento.$errors"
                    :key="error.$uid"
                    >{{ error.$message }}</small
                  >
                </div>
              </div>

              <div class="form-group col-md-6 mb-3">
                <label
                  class="form-label fw-bold text-dark"
                  v-text="t$('gatewayApp.inventarioMovimientoInventario.cantidad')"
                  for="movimiento-inventario-cantidad"
                ></label>
                <input
                  type="number"
                  class="form-control shadow-none"
                  name="cantidad"
                  id="movimiento-inventario-cantidad"
                  data-cy="cantidad"
                  :class="{
                    'is-valid': !v$.cantidad.$invalid && v$.cantidad.$dirty,
                    'is-invalid': v$.cantidad.$invalid && v$.cantidad.$dirty,
                  }"
                  v-model.number="v$.cantidad.$model"
                  required
                />
                <div v-if="v$.cantidad.$anyDirty && v$.cantidad.$invalid">
                  <small
                    class="text-danger"
                    v-for="error of v$.cantidad.$errors"
                    :key="error.$uid"
                    >{{ error.$message }}</small
                  >
                </div>
              </div>

              <div class="form-group col-md-6 mb-3">
                <label
                  class="form-label fw-bold text-dark"
                  v-text="t$('gatewayApp.inventarioMovimientoInventario.fecha')"
                  for="movimiento-inventario-fecha"
                ></label>
                <div class="input-group">
                  <b-form-datepicker
                    aria-controls="movimiento-inventario-fecha"
                    v-model="v$.fecha.$model"
                    name="fecha"
                    class="form-control shadow-none"
                    :locale="currentLanguage"
                    button-only
                    today-button
                    reset-button
                    close-button
                    button-variant="outline-institucional"
                  >
                  </b-form-datepicker>
                  <b-form-input
                    id="movimiento-inventario-fecha"
                    data-cy="fecha"
                    type="text"
                    class="form-control shadow-none"
                    name="fecha"
                    :class="{
                      'is-valid': !v$.fecha.$invalid && v$.fecha.$dirty,
                      'is-invalid': v$.fecha.$invalid && v$.fecha.$dirty,
                    }"
                    v-model="v$.fecha.$model"
                    required
                    placeholder="YYYY-MM-DD"
                  />
                </div>
                <div v-if="v$.fecha.$anyDirty && v$.fecha.$invalid">
                  <small
                    class="text-danger"
                    v-for="error of v$.fecha.$errors"
                    :key="error.$uid"
                    >{{ error.$message }}</small
                  >
                </div>
              </div>

              <div class="form-group col-md-6 mb-3">
                <label
                  class="form-label fw-bold text-dark"
                  v-text="t$('gatewayApp.inventarioMovimientoInventario.inventario')"
                  for="movimiento-inventario-inventario"
                ></label>
                <select
                  class="form-select shadow-none"
                  id="movimiento-inventario-inventario"
                  data-cy="inventario"
                  name="inventario"
                  v-model="movimientoInventario.inventario"
                >
                  <option :value="null">-- Seleccionar Inventario --</option>
                  <option
                    :value="
                      movimientoInventario.inventario &&
                      inventarioOption.id === movimientoInventario.inventario.id
                        ? movimientoInventario.inventario
                        : inventarioOption
                    "
                    v-for="inventarioOption in inventarios"
                    :key="inventarioOption.id"
                  >
                    {{ inventarioOption.nombre }}
                  </option>
                </select>
              </div>

              <div class="form-group col-12 mb-3">
                <label
                  class="form-label fw-bold text-dark"
                  v-text="t$('gatewayApp.inventarioMovimientoInventario.observacion')"
                  for="movimiento-inventario-observacion"
                ></label>
                <textarea
                  class="form-control shadow-none"
                  rows="3"
                  name="observacion"
                  id="movimiento-inventario-observacion"
                  data-cy="observacion"
                  :class="{
                    'is-valid': !v$.observacion.$invalid && v$.observacion.$dirty,
                    'is-invalid': v$.observacion.$invalid && v$.observacion.$dirty,
                  }"
                  v-model="v$.observacion.$model"
                ></textarea>
                <div v-if="v$.observacion.$anyDirty && v$.observacion.$invalid">
                  <small
                    class="text-danger"
                    v-for="error of v$.observacion.$errors"
                    :key="error.$uid"
                    >{{ error.$message }}</small
                  >
                </div>
              </div>
            </div>
          </div>

          <div
            class="card-footer bg-light d-flex justify-content-end py-3 border-0 gap-2"
          >
            <button
              type="button"
              id="cancel-save"
              data-cy="entityCreateCancelButton"
              class="btn btn-outline-secondary"
              @click="previousState()"
            >
              <font-awesome-icon icon="ban"></font-awesome-icon>&nbsp;<span
                v-text="t$('entity.action.cancel')"
              ></span>
            </button>
            <button
              type="submit"
              id="save-entity"
              data-cy="entityCreateSaveButton"
              :disabled="v$.$invalid || isSaving"
              class="btn btn-institucional px-4"
            >
              <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span
                v-text="t$('entity.action.save')"
              ></span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./movimiento-inventario-update.component.ts"></script>

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
.btn-institucional:hover:not(:disabled) {
  background-color: #7a1a37 !important;
  border-color: #7a1a37 !important;
}
.btn-outline-institucional {
  border-color: #9b2247 !important;
  color: #9b2247 !important;
}

/* ESTILOS DE FORMULARIO */
.card {
  border-radius: 12px;
  overflow: hidden;
}
.form-label {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.form-control,
.form-select {
  border: 1px solid #ced4da;
  border-radius: 6px;
  padding: 0.6rem 0.75rem;
}
.form-control:focus,
.form-select:focus {
  border-color: #9b2247;
  box-shadow: 0 0 0 0.2rem rgba(155, 34, 71, 0.15);
}

/* VALIDACIONES */
.is-valid {
  border-color: #28a745 !important;
}
.is-invalid {
  border-color: #dc3545 !important;
}
</style>
