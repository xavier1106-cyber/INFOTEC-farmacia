<template>
  <div
    class="container-fluid min-vh-100 page-container bg-transparent"
    @click="cerrarListas"
  >
    <div class="container pt-4 pb-5">
      <div class="d-flex justify-content-between align-items-center mb-4 no-print">
        <h2
          class="mb-0 color-institucional-dark fw-bold animate__animated animate__fadeInLeft"
        >
          Buscador General
        </h2>

        <router-link
          to="/historico"
          class="btn btn-outline-institucional shadow-sm rounded-pill px-4 animate__animated animate__fadeInRight"
        >
          <font-awesome-icon icon="list" class="me-2" /> Ir a Historial de Recetas
        </router-link>
      </div>

      <div class="row no-print animate__animated animate__fadeIn">
        <div class="col-md-4 mb-3">
          <div
            class="card p-3 shadow-sm buscador-card border-institucional-light h-100"
            @click.stop
          >
            <label class="color-institucional-dark font-weight-bold mb-2">
              <font-awesome-icon icon="user" class="me-1" /> Paciente:
            </label>
            <input
              v-model="pacienteQuery"
              @input="buscarPacientes"
              @focus="buscarPacientes"
              placeholder="ID o nombre..."
              class="form-control rounded-pill focus-institucional"
              autocomplete="off"
            />
            <ul
              v-if="pacientes && pacientes.length"
              class="list-group resultados-dropdown shadow-lg"
            >
              <li
                class="list-group-item list-group-item-action"
                v-for="p in pacientes"
                :key="p.id"
                @click="seleccionarPaciente(p)"
              >
                {{ p.id }} - {{ p.nombre }} {{ p.apellidoP }}
              </li>
            </ul>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div
            class="card p-3 shadow-sm buscador-card border-institucional-light h-100"
            @click.stop
          >
            <label class="color-institucional-dark font-weight-bold mb-2">
              <font-awesome-icon icon="user-md" class="me-1" /> Médico:
            </label>
            <input
              v-model="medicoQuery"
              @input="buscarMedicos"
              @focus="buscarMedicos"
              placeholder="ID o nombre..."
              class="form-control rounded-pill focus-institucional"
              autocomplete="off"
            />
            <ul
              v-if="medicos && medicos.length"
              class="list-group resultados-dropdown shadow-lg"
            >
              <li
                class="list-group-item list-group-item-action"
                v-for="m in medicos"
                :key="m.id"
                @click="seleccionarMedico(m)"
              >
                {{ m.id }} - {{ m.nombre }}
              </li>
            </ul>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div
            class="card p-3 shadow-sm buscador-card border-institucional-light h-100"
            @click.stop
          >
            <label class="color-institucional-dark font-weight-bold mb-2">
              <font-awesome-icon icon="pills" class="me-1" /> Medicamento:
            </label>
            <input
              v-model="medicamentoQuery"
              @input="buscarMedicamentos"
              @focus="buscarMedicamentos"
              placeholder="Escriba para buscar..."
              class="form-control rounded-pill focus-institucional"
              autocomplete="off"
            />
            <ul
              v-if="medicamentos && medicamentos.length"
              class="list-group resultados-dropdown shadow-lg"
            >
              <li
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                v-for="m in medicamentos"
                :key="m.id"
                @click="seleccionarMedicamento(m)"
              >
                <div>
                  <span class="fw-bold">{{ m.id }} - {{ m.nombre }}</span
                  ><br />
                  <small class="text-muted">Stock: {{ m.cantidad }}</small>
                </div>
                <span v-if="m.controlado" class="badge bg-warning text-dark"
                  >Controlado</span
                >
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        class="card mt-4 shadow-lg printable-area border-0 content-card animate__animated animate__slideInUp"
      >
        <div class="card-header bg-institucional text-white text-center py-3 no-print">
          <h6 class="mb-0 fw-bold uppercase-tracking">Resumen de Receta</h6>
        </div>

        <div class="only-print text-center mb-4 pt-4">
          <h3 class="color-institucional fw-bold text-uppercase">Receta Médica</h3>
          <p class="text-muted small">Servicios de Salud - Comprobante de Entrega</p>
          <hr />
        </div>

        <div class="card-body p-4 bg-white">
          <h6 class="color-institucional mb-3 fw-bold border-bottom pb-2">
            Datos del Paciente
          </h6>
          <table
            class="table table-sm table-bordered mb-4 rounded shadow-sm overflow-hidden"
          >
            <tr>
              <th class="bg-light-guinda text-guinda" style="width: 120px">ID</th>
              <td>{{ receta.pacienteId || "---" }}</td>
              <th class="bg-light-guinda text-guinda" style="width: 120px">Nombre</th>
              <td>{{ receta.pacienteNombre || "No seleccionado" }}</td>
            </tr>
            <tr>
              <th class="bg-light-guinda text-guinda">Edad</th>
              <td>{{ receta.edad || "---" }}</td>
              <th class="bg-light-guinda text-guinda">Sexo</th>
              <td>{{ receta.sexo || "---" }}</td>
            </tr>
          </table>

          <h6 class="color-institucional mb-3 fw-bold border-bottom pb-2">
            Datos del Médico
          </h6>
          <table
            class="table table-sm table-bordered mb-4 rounded shadow-sm overflow-hidden"
          >
            <tr>
              <th class="bg-light-guinda text-guinda" style="width: 120px">ID</th>
              <td>{{ receta.medicoId || "---" }}</td>
              <th class="bg-light-guinda text-guinda" style="width: 120px">Nombre</th>
              <td>{{ receta.medicoNombre || "No seleccionado" }}</td>
            </tr>
            <tr>
              <th class="bg-light-guinda text-guinda">Especialidad</th>
              <td colspan="3">{{ receta.especialidad || "---" }}</td>
            </tr>
          </table>

          <h6 class="color-institucional mb-3 fw-bold border-bottom pb-2">
            Medicamentos Solicitados
          </h6>
          <div class="table-responsive">
            <table
              class="table table-hover table-bordered align-middle text-center mb-3 shadow-sm"
            >
              <thead class="bg-vino text-white">
                <tr>
                  <th style="width: 40px">#</th>
                  <th>Medicamento</th>
                  <th style="width: 100px">Cant.</th>
                  <th style="width: 80px" class="no-print">Stock</th>
                  <th style="width: 130px" class="no-print">Status</th>
                  <th>Observaciones</th>
                  <th style="width: 120px" class="no-print">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="receta.medicamentos.length === 0">
                  <td colspan="7" class="text-muted py-4 text-center">
                    <font-awesome-icon
                      icon="folder-open"
                      class="mb-2 d-block mx-auto text-muted opacity-50"
                      size="2x"
                    />
                    No hay medicamentos agregados a esta receta.
                  </td>
                </tr>
                <tr
                  v-for="(med, index) in receta.medicamentos"
                  :key="med._uid"
                  :class="{
                    'table-danger-light': med.medicamentoId && med.cantidad > med.stock,
                    'table-narcotico': med.controlado,
                  }"
                >
                  <td>{{ index + 1 }}</td>
                  <td class="text-start">
                    <span v-if="!med.editando">
                      <b v-if="med.controlado" class="text-danger no-print">⚠️ </b
                      >{{ med.nombre }}
                    </span>
                    <input
                      v-else
                      v-model="med.nombre"
                      class="form-control form-control-sm"
                    />
                  </td>
                  <td>
                    <span v-if="!med.editando" class="fw-bold">{{ med.cantidad }}</span>
                    <input
                      v-else
                      type="number"
                      v-model.number="med.cantidad"
                      min="1"
                      class="form-control form-control-sm text-center mx-auto"
                      style="width: 70px"
                    />
                  </td>
                  <td class="no-print">
                    <span :class="{ 'text-danger fw-bold': med.stock === 0 }">{{
                      med.stock
                    }}</span>
                  </td>
                  <td class="no-print">
                    <span v-if="med.controlado" class="badge badge-narcotico"
                      >NARCÓTICO</span
                    >
                    <span
                      v-else-if="med.stock >= med.cantidad && med.stock > 0"
                      class="badge bg-success rounded-pill"
                      >Disponible</span
                    >
                    <span v-else class="badge bg-danger rounded-pill">{{
                      med.stock === 0 ? "Sin stock" : "Insuficiente"
                    }}</span>
                  </td>
                  <td class="text-start">
                    <span v-if="!med.editando">{{ med.indicaciones }}</span>
                    <input
                      v-else
                      v-model="med.indicaciones"
                      class="form-control form-control-sm"
                    />
                  </td>
                  <td class="no-print">
                    <button
                      v-if="!med.editando"
                      class="btn btn-outline-institucional btn-sm me-1 rounded-pill"
                      @click="editarMedicamento(index)"
                    >
                      Editar
                    </button>
                    <button
                      v-else
                      class="btn btn-success btn-sm me-1 rounded-pill"
                      @click="guardarEdicion(index)"
                    >
                      OK
                    </button>
                    <button
                      class="btn btn-outline-danger btn-sm rounded-pill"
                      @click="eliminarMedicamento(index)"
                    >
                      <font-awesome-icon icon="times" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card-footer bg-light-gray text-center py-4 no-print">
          <button
            class="btn btn-institucional-light btn-lg shadow-sm text-white me-3 px-4 rounded-pill"
            :disabled="receta.medicamentos.length === 0"
            @click="imprimirBorrador"
          >
            <font-awesome-icon icon="print" class="me-2" /> Imprimir Vista Previa
          </button>
          <button
            class="btn btn-institucional-dark btn-lg shadow-sm text-white px-4 rounded-pill"
            :disabled="
              receta.medicamentos.length === 0 || !receta.pacienteId || !receta.medicoId
            "
            @click="registrarHistorico"
          >
            <font-awesome-icon icon="save" class="me-2" /> Registrar y Finalizar
          </button>
        </div>
      </div>
    </div>

    <div v-if="mostrarModalAdmin" class="modal-overlay">
      <div
        class="modal-content-custom shadow-lg border-institucional-dark animate__animated animate__zoomIn"
      >
        <div class="modal-header-custom bg-institucional-dark text-white p-3 text-center">
          <h5 class="mb-0 font-weight-bold">Autorización de Narcóticos</h5>
        </div>
        <div class="p-4 bg-white">
          <div class="text-center mb-4">
            <font-awesome-icon
              icon="exclamation-triangle"
              class="text-warning mb-2"
              size="3x"
            />
            <p>
              Se requiere acceso de administrador para autorizar medicamentos controlados.
            </p>
          </div>
          <div class="mb-3 text-start">
            <label class="form-label small fw-bold">Usuario Administrador:</label>
            <input
              type="text"
              v-model="adminCredentials.usuario"
              class="form-control rounded-pill focus-institucional"
            />
          </div>
          <div class="mb-4 text-start">
            <label class="form-label small fw-bold">Contraseña:</label>
            <input
              type="password"
              v-model="adminCredentials.password"
              class="form-control rounded-pill focus-institucional"
              @keyup.enter="validarYAutorizarAdmin"
            />
          </div>
          <div class="d-flex justify-content-between">
            <button
              class="btn btn-light rounded-pill px-4"
              @click="mostrarModalAdmin = false"
            >
              Cancelar
            </button>
            <button
              class="btn btn-institucional-dark text-white rounded-pill px-4 shadow-sm"
              @click="validarYAutorizarAdmin"
            >
              Autorizar y Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./buscador.component.ts"></script>

<style scoped>
.page-container {
  position: relative;
  z-index: 1;
}

.page-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.4);
  z-index: -1;
}

/* COLORES Y FUENTES */
.color-institucional {
  color: #9b2247 !important;
}
.color-institucional-dark {
  color: #611232 !important;
}
.bg-institucional {
  background-color: #9b2247 !important;
}
.bg-vino {
  background-color: #611232 !important;
}
.text-guinda {
  color: #9b2247 !important;
}
.bg-light-guinda {
  background-color: #fdf2f5;
}

/* BOTONES */
.btn-institucional-light {
  background-color: #9b2247;
  border-color: #9b2247;
  transition: 0.3s;
}
.btn-institucional-light:hover:not(:disabled) {
  background-color: #7a1b38;
  transform: translateY(-2px);
}
.btn-institucional-dark {
  background-color: #611232;
  border-color: #611232;
  transition: 0.3s;
}
.btn-institucional-dark:hover:not(:disabled) {
  background-color: #4a0d26;
  transform: translateY(-2px);
}
.btn-outline-institucional {
  color: #9b2247;
  border: 1.5px solid #9b2247;
  background-color: white;
  transition: 0.3s;
}
.btn-outline-institucional:hover {
  background-color: #9b2247;
  color: white;
}

/* TARJETAS Y DROPDOWNS */
.content-card {
  border-radius: 15px !important;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.98);
}
.buscador-card {
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(155, 34, 71, 0.2);
}
.resultados-dropdown {
  position: absolute;
  top: 85px;
  left: 0;
  width: 100%;
  z-index: 1050;
  max-height: 250px;
  overflow-y: auto;
  border-radius: 10px;
  border: 1.5px solid #9b2247;
}

/* TABLAS Y BADGES */
.table-narcotico td {
  background-color: #fff3cd !important;
  border-left: 4px solid #611232;
}
.table-danger-light td {
  background-color: #fcecef !important;
}
.badge-narcotico {
  background-color: #611232;
  color: white;
  border-radius: 50px;
  padding: 5px 12px;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-content-custom {
  background-color: white;
  width: 90%;
  max-width: 450px;
  border-radius: 20px;
  overflow: hidden;
}

.focus-institucional:focus {
  border-color: #9b2247;
  box-shadow: 0 0 0 0.25rem rgba(155, 34, 71, 0.15);
}

@media print {
  .no-print {
    display: none !important;
  }
  .only-print {
    display: block !important;
  }
  .content-card {
    border: none !important;
    box-shadow: none !important;
  }
  .page-container::before {
    display: none;
  }
}
</style>
