<template>
  <div class="container-fluid pt-2 min-vh-100 bg-transparent">
    <div class="container">
      <div class="row mb-5 align-items-center min-vh-40">
        <div
          :class="
            showLogin && !authenticated ? 'col-md-7 text-left' : 'col-12 text-center'
          "
        >
          <h2 class="display-3 font-weight-bold text-dark mb-2">Sistema de Farmacia</h2>

          <div v-if="!authenticated">
            <p class="lead text-muted mb-4">
              Portal administrativo de INFOTEC para la gestión de inventarios y control de
              suministros médicos.
            </p>

            <b-button
              v-if="!showLogin"
              variant="guinda"
              class="px-5 rounded-pill shadow-lg font-weight-bold py-3 animate__animated animate__pulse animate__infinite"
              @click="showLogin = true"
            >
              INICIAR SESIÓN
            </b-button>

            <div v-if="!showLogin" class="mt-4 text-muted small">
              <font-awesome-icon icon="info-circle" class="mr-2" />
              Acceso restringido a personal autorizado.
            </div>
          </div>

          <div
            v-else
            class="alert alert-custom-brand shadow-sm d-inline-block px-5 py-3 mt-1 animate__animated animate__backInDown"
          >
            <font-awesome-icon icon="check-circle" class="mr-2" />
            Bienvenido de nuevo, <b class="text-uppercase ml-1">{{ username }}</b>
          </div>
        </div>

        <transition name="slide-fade">
          <div class="col-md-5" v-if="showLogin && !authenticated">
            <div class="card border-0 shadow-lg login-card">
              <div
                class="card-header bg-vino text-white d-flex justify-content-between align-items-center py-3"
              >
                <h5 class="mb-0 font-weight-bold">Acceso al Sistema</h5>
                <b-button
                  variant="link"
                  class="text-white p-0 border-0"
                  @click="showLogin = false"
                >
                  <font-awesome-icon icon="times" />
                </b-button>
              </div>

              <div class="card-body p-4 bg-white">
                <div
                  class="alert alert-danger small py-2 animate__animated animate__shakeX"
                  v-if="authenticationError"
                >
                  <font-awesome-icon icon="exclamation-circle" class="mr-1" />
                  Usuario o contraseña incorrectos.
                </div>

                <b-form @submit.prevent="doLogin">
                  <b-form-group
                    label="Usuario"
                    label-for="username"
                    class="font-weight-bold small"
                  >
                    <b-form-input
                      id="username"
                      v-model="login"
                      placeholder="Usuario INFOTEC"
                      class="rounded-pill border-guinda"
                      required
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group
                    label="Contraseña"
                    label-for="password"
                    class="font-weight-bold small"
                  >
                    <b-form-input
                      id="password"
                      type="password"
                      v-model="password"
                      placeholder="••••••••"
                      class="rounded-pill border-guinda"
                      required
                    ></b-form-input>
                  </b-form-group>

                  <div class="d-flex justify-content-between align-items-center mb-4">
                    <b-form-checkbox v-model="rememberMe" class="small"
                      >Recordarme</b-form-checkbox
                    >
                    <b-link
                      :to="'/account/reset/request'"
                      class="text-guinda small font-weight-bold"
                      >¿Olvidó su clave?</b-link
                    >
                  </div>

                  <button
                    type="submit"
                    class="btn btn-guinda btn-block rounded-pill shadow-sm font-weight-bold py-2"
                  >
                    INGRESAR
                  </button>
                </b-form>

                <div class="text-center mt-3 border-top pt-3">
                  <span class="x-small text-muted">¿Eres nuevo en el sistema?</span>
                  <br />
                  <b-link
                    :to="'/register'"
                    class="btn btn-outline-guinda btn-sm rounded-pill mt-2 px-4 font-weight-bold"
                  >
                    CREAR UNA CUENTA
                  </b-link>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <div
        class="row text-center mt-4 animate__animated animate__fadeInUp"
        v-if="authenticated"
      >
        <div
          v-for="(card, index) in [
            {
              title: 'Pacientes',
              desc: 'Gestión de pacientes',
              route: '/paciente',
              icon: 'users',
            },
            {
              title: 'Médicos',
              desc: 'Administrar médicos',
              route: '/medico',
              icon: 'user-md',
            },
            {
              title: 'Inventario',
              desc: 'Medicamentos',
              route: '/inventario',
              icon: 'pills',
            },
            {
              title: 'Histórico',
              desc: 'Actividad',
              route: '/historico',
              icon: 'history',
            },
          ]"
          :key="index"
          class="col-md-3 mb-3"
        >
          <div class="card shadow-sm border-0 module-card h-100">
            <div class="card-body p-4 d-flex flex-column justify-content-between">
              <div>
                <div class="icon-circle mb-3 mx-auto">
                  <font-awesome-icon :icon="card.icon" class="text-guinda" size="lg" />
                </div>
                <h5 class="font-weight-bold text-dark">{{ card.title }}</h5>
                <p class="text-muted small">{{ card.desc }}</p>
              </div>
              <router-link class="btn btn-guinda rounded-pill mt-2" :to="card.route"
                >Entrar</router-link
              >
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-3 animate__animated animate__fadeInUp" v-if="authenticated">
        <div class="col-md-6 mb-3">
          <div class="card border-0 shadow-sm h-100 border-top-warning">
            <div
              class="card-header bg-white border-0 pt-3 d-flex justify-content-between align-items-center"
            >
              <h6 class="font-weight-bold text-warning mb-0">Alertas del sistema</h6>
              <font-awesome-icon
                icon="sync"
                class="text-muted small cursor-pointer"
                @click="loadData"
                :spin="isFetchingData"
              />
            </div>
            <div class="card-body">
              <ul class="custom-list list-unstyled">
                <li
                  v-for="(alerta, i) in alertasSistema"
                  :key="i"
                  class="mb-2 d-flex align-items-start"
                >
                  <font-awesome-icon
                    :icon="
                      alerta.tipo === 'danger' ? 'exclamation-triangle' : 'check-circle'
                    "
                    :class="alerta.tipo === 'danger' ? 'text-danger' : 'text-success'"
                    class="mt-1 mr-2"
                  />
                  <span class="small">{{ alerta.mensaje }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-3">
          <div class="card border-0 shadow-sm h-100 border-top-guinda">
            <div class="card-header bg-white border-0 pt-3">
              <h6 class="font-weight-bold text-guinda mb-0">Actividad reciente</h6>
            </div>
            <div class="card-body">
              <ul class="list-unstyled">
                <li
                  v-for="(act, i) in actividadReciente"
                  :key="i"
                  class="mb-2 pb-2 border-bottom-light d-flex justify-content-between"
                >
                  <span class="small text-dark font-weight-bold">{{ act.texto }}</span>
                  <span class="badge badge-light text-muted x-small align-self-center">{{
                    act.hora
                  }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./home.component.ts"></script>

<style scoped>
/* TRANSICIÓN LATERAL */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.slide-fade-enter-from {
  transform: translateX(120px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(80px);
  opacity: 0;
}

/* PALETA INSTITUCIONAL */
.text-guinda {
  color: #9b2247 !important;
}
.bg-vino {
  background-color: #611232 !important;
}
.border-guinda {
  border-color: #9b2247 !important;
}

.btn-guinda {
  background-color: #9b2247;
  color: white;
  border: none;
  transition: all 0.3s ease;
}
.btn-guinda:hover {
  background-color: #611232;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(155, 34, 71, 0.3);
}

.btn-outline-guinda {
  color: #9b2247;
  border: 1px solid #9b2247;
  background-color: transparent;
  transition: 0.3s;
}
.btn-outline-guinda:hover {
  background-color: #9b2247;
  color: white;
}

/* Forzamos transparencia para que luzca el fondo del App.vue */
.bg-transparent {
  background-color: transparent !important;
}

/* DISEÑO DE TARJETAS */
.login-card {
  border-radius: 20px !important;
  overflow: hidden;
}
.module-card {
  transition: 0.3s ease-in-out;
  border-radius: 15px !important;
}
.module-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.icon-circle {
  width: 55px;
  height: 55px;
  background-color: #fdf2f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.border-top-guinda {
  border-top: 4px solid #9b2247 !important;
}
.border-top-warning {
  border-top: 4px solid #f39c12 !important;
}
.border-bottom-light {
  border-bottom: 1px solid #f0f0f0;
}

.alert-custom-brand {
  background-color: rgba(252, 236, 239, 0.9);
  border-left: 5px solid #9b2247;
  color: #9b2247;
}

.min-vh-40 {
  min-height: 40vh;
}
.x-small {
  font-size: 0.75rem;
}
</style>
