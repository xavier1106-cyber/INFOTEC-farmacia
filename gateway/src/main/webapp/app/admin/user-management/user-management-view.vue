<template>
  <div class="container py-5 animate__animated animate__fadeIn">
    <div class="row justify-content-center">
      <div class="col-md-10 col-lg-8">
        <div v-if="user" class="card shadow-lg border-0 rounded-lg overflow-hidden">
          <div
            class="bg-vino p-4 text-white d-flex align-items-center justify-content-between"
          >
            <div class="d-flex align-items-center">
              <div
                class="bg-white text-guinda rounded-circle p-3 mr-3 shadow-sm d-flex align-items-center justify-content-center"
                style="width: 70px; height: 70px"
              >
                <font-awesome-icon icon="user" size="2x" />
              </div>
              <div>
                <h2 class="mb-0 font-weight-bold" style="font-size: 1.5rem">
                  {{ user.login }}
                </h2>
                <span class="badge badge-light text-guinda px-3 rounded-pill">
                  ID: {{ user.id }}
                </span>
              </div>
            </div>
            <div class="text-right">
              <b-badge
                pill
                class="px-4 py-2 shadow-sm"
                :variant="user.activated ? 'success' : 'danger'"
              >
                <font-awesome-icon
                  :icon="user.activated ? 'check-circle' : 'times-circle'"
                  class="mr-1"
                />
                {{ user.activated ? "Cuenta Activa" : "Cuenta Inactiva" }}
              </b-badge>
            </div>
          </div>

          <div class="card-body p-5 bg-white">
            <div class="row">
              <div class="col-md-6 mb-4">
                <h5 class="text-guinda font-weight-bold border-bottom pb-2 mb-3">
                  <font-awesome-icon icon="id-card" class="mr-2" /> Información Personal
                </h5>
                <dl class="user-details">
                  <dt class="text-muted small text-uppercase">Nombre Completo</dt>
                  <dd class="font-weight-bold text-dark">
                    {{ user.firstName }} {{ user.lastName }}
                  </dd>

                  <dt class="text-muted small text-uppercase">Correo Electrónico</dt>
                  <dd class="text-primary">{{ user.email }}</dd>

                  <dt class="text-muted small text-uppercase">Idioma de Interfaz</dt>
                  <dd>
                    <span class="badge badge-light border text-dark">{{
                      user.langKey
                    }}</span>
                  </dd>
                </dl>
              </div>

              <div class="col-md-6 mb-4">
                <h5 class="text-guinda font-weight-bold border-bottom pb-2 mb-3">
                  <font-awesome-icon icon="shield-alt" class="mr-2" /> Roles Asignados
                </h5>
                <div class="d-flex flex-wrap gap-2">
                  <span
                    v-for="authority of user.authorities"
                    :key="authority"
                    class="badge badge-institucional p-2 mr-2 mb-2"
                  >
                    <font-awesome-icon icon="user-shield" class="mr-1" /> {{ authority }}
                  </span>
                </div>
              </div>

              <div class="col-12 mt-3">
                <div
                  class="bg-light rounded p-3 d-flex justify-content-between align-items-center border"
                >
                  <div class="small">
                    <span class="text-muted">Creado por:</span>
                    <b class="text-dark">{{ user.createdBy }}</b>
                    <span class="mx-2 text-muted">|</span>
                    <span class="text-muted">Fecha:</span>
                    <b class="text-dark">{{ formatDate(user.createdDate) }}</b>
                  </div>
                  <div class="small text-right">
                    <span class="text-muted">Último cambio por:</span>
                    <b class="text-dark">{{ user.lastModifiedBy }}</b
                    ><br />
                    <span class="text-muted">El:</span>
                    <b class="text-dark">{{ formatDate(user.lastModifiedDate) }}</b>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card-footer bg-light p-4 d-flex justify-content-between">
            <router-link custom v-slot="{ navigate }" :to="{ name: 'JhiUser' }">
              <b-button
                @click="navigate"
                variant="outline-secondary"
                class="rounded-pill px-4 shadow-sm font-weight-bold"
              >
                <font-awesome-icon icon="arrow-left" class="mr-2" /> VOLVER AL LISTADO
              </b-button>
            </router-link>

            <router-link
              custom
              v-slot="{ navigate }"
              :to="{ name: 'JhiUserEdit', params: { userId: user.login } }"
            >
              <b-button
                @click="navigate"
                variant="guinda"
                class="rounded-pill px-4 shadow-sm font-weight-bold"
              >
                <font-awesome-icon icon="pencil-alt" class="mr-2" /> EDITAR USUARIO
              </b-button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./user-management-view.component.ts"></script>

<style scoped>
/* PALETA INSTITUCIONAL */
.text-guinda {
  color: #9b2247 !important;
}
.bg-vino {
  background-color: #611232 !important;
}

.badge-institucional {
  background-color: #9b2247;
  color: white;
  font-weight: 500;
}

.btn-guinda {
  background-color: #9b2247;
  color: white;
  border: none;
}
.btn-guinda:hover {
  background-color: #611232;
  color: white;
}

/* ESTILOS DE LISTA DE DETALLES */
.user-details dt {
  margin-bottom: 0;
  letter-spacing: 0.5px;
}
.user-details dd {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.card {
  transition: all 0.3s ease;
}

.gap-2 {
  gap: 0.5rem;
}
</style>
