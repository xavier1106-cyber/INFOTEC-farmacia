<template>
  <div class="container mt-4 pb-5 bg-transparent">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <form
          name="editForm"
          novalidate
          @submit.prevent="save()"
          class="card shadow-lg border-0 rounded-xl overflow-hidden bg-white-opacity animate__animated animate__fadeIn"
        >
          <div class="card-header bg-vino text-white py-3 border-0">
            <h4 class="mb-0 text-center fw-bold">
              <font-awesome-icon icon="file-medical" class="me-2"></font-awesome-icon>
              {{
                historico.id ? "Modificar Registro Histórico" : "Registrar Nueva Entrada"
              }}
            </h4>
          </div>

          <div class="card-body bg-light-soft p-4">
            <div class="card mb-4 shadow-sm border-0 rounded-4">
              <div class="card-header bg-white py-2 border-bottom">
                <h6 class="mb-0 text-guinda fw-bold text-uppercase small">
                  <font-awesome-icon icon="clipboard-check" class="me-1" /> Control de
                  Registro
                </h6>
              </div>
              <div class="card-body row py-3">
                <div class="form-group col-md-4" v-if="historico.id">
                  <label class="form-label small fw-bold text-muted">ID Sistema</label>
                  <input
                    type="text"
                    class="form-control form-control-sm bg-light border-0 rounded-pill px-3"
                    v-model="historico.id"
                    readonly
                  />
                </div>
                <div class="form-group col-md-4">
                  <label class="form-label small fw-bold text-muted">Folio</label>
                  <input
                    type="text"
                    class="form-control form-control-sm bg-light border-0 rounded-pill px-3"
                    v-model="v$.folio.$model"
                    readonly
                  />
                </div>
                <div class="form-group col-md-4">
                  <label class="form-label small fw-bold text-muted">Fecha Emisión</label>
                  <input
                    type="datetime-local"
                    class="form-control form-control-sm bg-light border-0 rounded-pill px-3"
                    :value="convertDateTimeFromServer(v$.fechaEmision.$model)"
                    readonly
                  />
                </div>
              </div>
            </div>

            <div class="row mb-4">
              <div class="col-md-6">
                <div
                  class="card border-0 border-start border-guinda border-4 shadow-sm h-100 rounded-4 bg-light-locked"
                >
                  <div class="card-body">
                    <h6 class="text-guinda fw-bold text-uppercase small mb-3">
                      <font-awesome-icon icon="user-injured" class="me-1" /> Información
                      del Paciente
                    </h6>
                    <div class="mb-2">
                      <label class="form-label small fw-bold text-muted"
                        >Nombre Completo</label
                      >
                      <input
                        type="text"
                        class="form-control form-control-sm bg-light border-0 rounded-pill px-3"
                        v-model="v$.pacienteNombre.$model"
                        readonly
                      />
                    </div>
                    <div class="row small g-2">
                      <div class="col-6">
                        <label class="fw-bold text-muted">ID Paciente</label>
                        <input
                          type="number"
                          class="form-control form-control-sm bg-light border-0 rounded-pill px-3"
                          v-model.number="v$.pacienteId.$model"
                          readonly
                        />
                      </div>
                      <div class="col-6">
                        <label class="fw-bold text-muted">CURP</label>
                        <input
                          type="text"
                          class="form-control form-control-sm bg-light border-0 rounded-pill px-3"
                          v-model="v$.pacienteCurp.$model"
                          readonly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div
                  class="card border-0 border-start border-ocre border-4 shadow-sm h-100 rounded-4 bg-light-locked"
                >
                  <div class="card-body">
                    <h6 class="text-ocre fw-bold text-uppercase small mb-3">
                      <font-awesome-icon icon="user-md" class="me-1" /> Información del
                      Médico
                    </h6>
                    <div class="mb-2">
                      <label class="form-label small fw-bold text-muted"
                        >Nombre del Médico</label
                      >
                      <input
                        type="text"
                        class="form-control form-control-sm bg-light border-0 rounded-pill px-3"
                        v-model="v$.medicoNombre.$model"
                        readonly
                      />
                    </div>
                    <div class="row small g-2">
                      <div class="col-7">
                        <label class="fw-bold text-muted">Especialidad</label>
                        <input
                          type="text"
                          class="form-control form-control-sm bg-light border-0 rounded-pill px-3"
                          v-model="v$.medicoEspecialidad.$model"
                          readonly
                        />
                      </div>
                      <div class="col-5">
                        <label class="fw-bold text-muted">ID Médico</label>
                        <input
                          type="number"
                          class="form-control form-control-sm bg-light border-0 rounded-pill px-3"
                          v-model.number="v$.medicoId.$model"
                          readonly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card shadow-sm border-0 mb-4 rounded-4 overflow-hidden">
              <div
                class="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom"
              >
                <h6 class="mb-0 text-guinda fw-bold text-uppercase small">
                  <font-awesome-icon icon="pills" class="me-1" /> Medicamentos Entregados
                </h6>
                <button
                  type="button"
                  class="btn btn-guinda btn-sm rounded-pill px-3 shadow-sm"
                  @click="agregarMedicamentoRow()"
                >
                  <font-awesome-icon icon="plus" class="me-1"></font-awesome-icon> Agregar
                  Fármaco
                </button>
              </div>
              <div class="card-body p-0">
                <div class="table-responsive">
                  <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light-guinda text-guinda small text-uppercase">
                      <tr>
                        <th class="ps-3" style="width: 12%">ID</th>
                        <th style="width: 28%">Medicamento</th>
                        <th style="width: 15%">Cantidad</th>
                        <th style="width: 35%">Observaciones</th>
                        <th class="text-center" style="width: 10%">Acción</th>
                      </tr>
                    </thead>
                    <tbody class="small">
                      <tr
                        v-for="(med, index) in listaMedsEdicion"
                        :key="index"
                        class="animate__animated animate__fadeIn"
                        :class="{ 'table-info-light': med.isEditing }"
                      >
                        <td class="ps-3">
                          <input
                            type="text"
                            class="form-control form-control-sm font-monospace bg-light border-0 rounded-pill"
                            v-model="med.id"
                            readonly
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            class="form-control form-control-sm fw-bold border-guinda-light rounded-pill px-3"
                            v-model="med.nombre"
                            list="lista-inventario-meds"
                            @change="onMedicamentoChange(index)"
                            placeholder="Buscar..."
                            :disabled="!med.isEditing"
                          />
                        </td>
                        <td>
                          <div class="input-group input-group-sm">
                            <input
                              type="number"
                              class="form-control text-center border-guinda-light rounded-start-pill"
                              v-model.number="med.cantidad"
                              min="1"
                              :disabled="!med.isEditing"
                            />
                            <span
                              class="input-group-text border-guinda-light rounded-end-pill px-2"
                              >pz</span
                            >
                          </div>
                        </td>
                        <td>
                          <input
                            type="text"
                            class="form-control form-control-sm border-guinda-light rounded-pill px-3"
                            v-model="med.observaciones"
                            placeholder="Notas..."
                            :disabled="!med.isEditing"
                          />
                        </td>
                        <td class="text-center">
                          <div class="btn-group">
                            <button
                              v-if="med.isEditing"
                              type="button"
                              class="btn btn-success btn-sm rounded-circle me-1 shadow-sm"
                              @click="confirmarMedicamentoRow(index)"
                              title="Confirmar"
                            >
                              <font-awesome-icon icon="check"></font-awesome-icon>
                            </button>

                            <!--boton para eliminar filas de la receta-->
                            <!--<button
                              type="button"
                              class="btn btn-outline-danger btn-sm rounded-circle shadow-sm"
                              @click="removerMedicamentoRow(index)"
                              title="Eliminar"
                            >
                              <font-awesome-icon icon="trash"></font-awesome-icon>
                            </button>-->
                          </div>
                        </td>
                      </tr>
                      <tr v-if="listaMedsEdicion?.length === 0">
                        <td colspan="5" class="text-center py-4 text-muted italic">
                          <font-awesome-icon icon="info-circle" class="me-2" /> No hay
                          medicamentos en la lista.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <datalist id="lista-inventario-meds" v-if="listaInventario">
              <option v-for="item in listaInventario" :key="item.id" :value="item.nombre">
                Lote: {{ item.lote }} | Stock: {{ item.cantidad }}
              </option>
            </datalist>

            <div class="card shadow-sm border-0 rounded-4">
              <div class="card-body row py-3">
                <div class="form-group col-md-4">
                  <label class="form-label small fw-bold text-muted">Registró</label>
                  <input
                    type="text"
                    class="form-control form-control-sm bg-light border-0 rounded-pill px-3"
                    v-model="v$.usuarioQueRegistro.$model"
                    readonly
                  />
                </div>
                <div class="form-group col-md-4">
                  <label class="form-label small fw-bold text-ocre">Autorizó</label>
                  <input
                    type="text"
                    class="form-control form-control-sm rounded-pill px-3 focus-ocre"
                    v-model="v$.autorizo.$model"
                    placeholder="Nombre de quien autoriza..."
                  />
                </div>
                <div class="form-group col-md-4">
                  <label class="form-label small fw-bold text-muted"
                    >Observaciones Generales</label
                  >
                  <input
                    type="text"
                    class="form-control form-control-sm rounded-pill px-3 focus-guinda"
                    v-model="v$.observaciones.$model"
                    placeholder="Notas adicionales..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            class="card-footer bg-white py-3 d-flex justify-content-between border-0 px-4"
          >
            <button
              type="button"
              class="btn btn-outline-secondary px-4 rounded-pill shadow-sm"
              @click="previousState()"
            >
              <font-awesome-icon icon="ban" class="me-1"></font-awesome-icon> Cancelar
            </button>
            <button
              type="submit"
              :disabled="v$.$invalid || isSaving"
              class="btn btn-guinda px-5 rounded-pill shadow-sm fw-bold"
            >
              <font-awesome-icon icon="save" class="me-1"></font-awesome-icon> Guardar
              Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./historico-update.component.ts"></script>

<style scoped>
.text-guinda {
  color: #9b2247 !important;
}
.text-vino {
  color: #611232 !important;
}
.text-ocre {
  color: #a57f2c !important;
}
.bg-vino {
  background-color: #611232 !important;
}
.bg-guinda {
  background-color: #9b2247 !important;
}
.bg-light-guinda {
  background-color: #fdf2f5;
}
.bg-light-soft {
  background-color: #f8f9fa;
}

.rounded-xl {
  border-radius: 20px !important;
}
.rounded-4 {
  border-radius: 1rem !important;
}
.bg-white-opacity {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
}

.focus-guinda:focus {
  border-color: #9b2247;
  box-shadow: 0 0 0 0.25rem rgba(155, 34, 71, 0.15);
}
.focus-ocre:focus {
  border-color: #a57f2c;
  box-shadow: 0 0 0 0.25rem rgba(165, 127, 44, 0.15);
}
.border-guinda-light {
  border: 1px solid rgba(155, 34, 71, 0.2);
}

.btn-guinda {
  background-color: #9b2247;
  color: white;
  border: none;
  transition: all 0.3s ease;
}
.btn-guinda:hover:not(:disabled) {
  background-color: #611232;
  transform: translateY(-2px);
}

.table-info-light {
  background-color: rgba(155, 34, 71, 0.03);
}

.table th {
  border: none;
  font-weight: 700;
}
.font-monospace {
  font-family: "Courier New", Courier, monospace;
  font-size: 0.85rem;
}
.italic {
  font-style: italic;
}

.input-group-text {
  background-color: #fdf2f5;
  color: #9b2247;
  font-size: 0.75rem;
}

.bg-light-locked {
  background-color: #fcfcfc;
}
</style>
