<template>
  <div class="container-fluid py-4 bg-transparent animate__animated animate__fadeIn">
    <div class="row mb-4">
      <div class="col-12 d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <div class="bg-vino text-white rounded-circle p-3 mr-3 shadow-sm icon-header">
            <font-awesome-icon icon="users-cog" />
          </div>
          <div>
            <h2 class="font-weight-bold text-dark mb-0">Gestión de Usuarios</h2>
            <p class="text-muted mb-0 small">
              Administración de accesos, roles y perfiles del sistema
            </p>
          </div>
        </div>

        <div class="d-flex align-items-center">
          <b-button
            variant="outline-secondary"
            class="shadow-sm btn-sm rounded-pill px-4 py-2 font-weight-bold mr-2"
            @click="handleSyncList"
            :disabled="isLoading"
          >
            <font-awesome-icon icon="sync" :spin="isLoading" class="mr-2" />
            ACTUALIZAR
          </b-button>

          <router-link custom v-slot="{ navigate }" :to="{ name: 'JhiUserCreate' }">
            <b-button
              @click="navigate"
              variant="guinda"
              class="shadow-sm btn-sm rounded-pill px-4 py-2 font-weight-bold"
            >
              <font-awesome-icon icon="plus" class="mr-2" /> NUEVO USUARIO
            </b-button>
          </router-link>
        </div>
      </div>
    </div>

    <div class="card shadow-sm border-0 rounded-lg overflow-hidden">
      <div class="table-responsive" v-if="users">
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-institucional text-white">
            <tr>
              <th class="text-white" @click="changeOrder('id')">
                ID
                <jhi-sort-indicator
                  :current-order="propOrder"
                  :reverse="reverse"
                  :field-name="'id'"
                ></jhi-sort-indicator>
              </th>
              <th class="text-white" @click="changeOrder('login')">
                Usuario
                <jhi-sort-indicator
                  :current-order="propOrder"
                  :reverse="reverse"
                  :field-name="'login'"
                ></jhi-sort-indicator>
              </th>
              <th class="text-white" @click="changeOrder('email')">
                Email
                <jhi-sort-indicator
                  :current-order="propOrder"
                  :reverse="reverse"
                  :field-name="'email'"
                ></jhi-sort-indicator>
              </th>
              <th class="text-white text-center">Estado</th>
              <th class="text-white">Perfiles</th>
              <th class="text-white" @click="changeOrder('lastModifiedDate')">
                Última Modificación
                <jhi-sort-indicator
                  :current-order="propOrder"
                  :reverse="reverse"
                  :field-name="'lastModifiedDate'"
                ></jhi-sort-indicator>
              </th>
              <th class="text-white text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td class="font-weight-bold text-institucional">{{ user.id }}</td>
              <td>
                <div class="d-flex align-items-center">
                  <div
                    class="avatar-sm mr-2 bg-light-guinda text-guinda d-flex align-items-center justify-content-center rounded-circle"
                    style="width: 30px; height: 30px"
                  >
                    <font-awesome-icon icon="user" size="xs" />
                  </div>
                  <span class="font-weight-bold text-dark">{{ user.login }}</span>
                </div>
              </td>
              <td class="text-muted small">{{ user.email }}</td>
              <td class="text-center">
                <button
                  class="btn btn-sm rounded-pill px-3 border-0 shadow-xs"
                  :class="user.activated ? 'btn-success-soft' : 'btn-danger-soft'"
                  @click="setActive(user, !user.activated)"
                  :disabled="username === user.login"
                >
                  <font-awesome-icon
                    :icon="user.activated ? 'check-circle' : 'times-circle'"
                    class="mr-1"
                  />
                  {{ user.activated ? "Activo" : "Inactivo" }}
                </button>
              </td>
              <td>
                <div class="d-flex flex-wrap gap-1">
                  <span
                    v-for="authority of user.authorities"
                    :key="authority"
                    class="badge badge-institucional mr-1"
                  >
                    {{ authority }}
                  </span>
                </div>
              </td>
              <td>
                <div class="small text-muted">
                  {{ formatDate(user.lastModifiedDate) }}<br />
                  <span class="x-small"
                    >Por: <b>{{ user.lastModifiedBy }}</b></span
                  >
                </div>
              </td>
              <td class="text-center">
                <div class="btn-group shadow-sm rounded">
                  <router-link
                    :to="{ name: 'JhiUserView', params: { userId: user.login } }"
                    custom
                    v-slot="{ navigate }"
                  >
                    <button
                      @click="navigate"
                      class="btn btn-outline-info btn-sm"
                      title="Ver Detalle"
                    >
                      <font-awesome-icon icon="eye"></font-awesome-icon>
                    </button>
                  </router-link>
                  <router-link
                    :to="{ name: 'JhiUserEdit', params: { userId: user.login } }"
                    custom
                    v-slot="{ navigate }"
                  >
                    <button
                      @click="navigate"
                      class="btn btn-outline-guinda btn-sm"
                      title="Editar"
                    >
                      <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                    </button>
                  </router-link>
                  <b-button
                    @click="prepareRemove(user)"
                    variant="outline-danger"
                    class="btn-sm"
                    :disabled="username === user.login"
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

    <div v-show="users && users.length > 0" class="mt-4">
      <div class="d-flex justify-content-center">
        <jhi-item-count
          :page="page"
          :total="queryCount"
          :itemsPerPage="itemsPerPage"
          class="text-muted small"
        ></jhi-item-count>
      </div>
      <div class="d-flex justify-content-center mt-2">
        <b-pagination
          size="md"
          :total-rows="totalItems"
          v-model="page"
          :per-page="itemsPerPage"
          :change="loadPage(page)"
          class="custom-pagination"
        ></b-pagination>
      </div>
    </div>

    <b-modal
      ref="removeUser"
      id="removeUser"
      header-bg-variant="danger"
      header-text-variant="white"
      @ok="deleteUser()"
    >
      <template #modal-title>Confirmar Eliminación</template>
      <div class="modal-body text-center p-4">
        <font-awesome-icon
          icon="exclamation-triangle"
          size="3x"
          class="text-danger mb-3"
        />
        <p class="fs-5">¿Desea eliminar permanentemente al usuario?</p>
        <b class="text-danger fs-4">{{ removeId }}</b>
      </div>
      <template #modal-footer>
        <button
          type="button"
          class="btn btn-secondary rounded-pill px-4"
          @click="closeDialog()"
        >
          Cancelar
        </button>
        <button
          type="button"
          class="btn btn-danger rounded-pill px-4"
          @click="deleteUser()"
        >
          Eliminar Usuario
        </button>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts" src="./user-management.component.ts"></script>

<style scoped>
/* PALETA INSTITUCIONAL COMPARTIDA */
.text-guinda,
.text-institucional {
  color: #9b2247 !important;
}
.bg-vino,
.bg-institucional {
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
  color: white;
  transform: translateY(-1px);
}

.btn-outline-guinda {
  border-color: #9b2247 !important;
  color: #9b2247 !important;
}
.btn-outline-guinda:hover {
  background-color: #9b2247 !important;
  color: white !important;
}

/* ESTADOS SOFT */
.btn-success-soft {
  background-color: #eafaf1;
  color: #27ae60;
  font-size: 0.75rem;
  font-weight: bold;
}
.btn-danger-soft {
  background-color: #fdedec;
  color: #e74c3c;
  font-size: 0.75rem;
  font-weight: bold;
}

/* TABLA */
.table thead th {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: none;
}
.badge-institucional {
  background-color: #9b2247;
  color: white;
  font-weight: 500;
  padding: 0.4em 0.6em;
}

.icon-header {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

/* PAGINACIÓN */
::v-deep .page-item.active .page-link {
  background-color: #9b2247 !important;
  border-color: #9b2247 !important;
}
::v-deep .page-link {
  color: #9b2247;
}

.x-small {
  font-size: 0.7rem;
}
</style>
