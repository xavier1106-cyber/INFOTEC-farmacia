<template>
  <div class="container-fluid py-5 bg-transparent min-vh-100">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card border-0 shadow-lg reset-card animate__animated animate__fadeIn">
          <div class="card-header bg-vino text-white text-center py-4">
            <font-awesome-icon icon="key" size="2x" class="mb-2" />
            <h2
              class="font-weight-bold mb-0"
              v-text="t$('reset.request.title')"
              id="reset-title"
            ></h2>
            <p class="small mb-0 opacity-75">Recupera el acceso a tu cuenta INFOTEC</p>
          </div>

          <div class="card-body p-4 bg-white">
            <div
              class="alert alert-warning-custom shadow-sm mb-4"
              role="alert"
              v-if="!success"
            >
              <div class="d-flex align-items-center">
                <font-awesome-icon icon="info-circle" class="mr-2" />
                <span class="small" v-text="t$('reset.request.messages.info')"></span>
              </div>
            </div>

            <div
              class="alert alert-success shadow-sm text-center animate__animated animate__backInDown"
              role="alert"
              v-if="success"
            >
              <font-awesome-icon icon="check-circle" size="2x" class="mb-2" />
              <p
                class="font-weight-bold mb-2"
                v-text="t$('reset.request.messages.success')"
              ></p>
              <hr />
              <router-link to="/" class="btn btn-success btn-sm rounded-pill px-4">
                VOLVER AL INICIO
              </router-link>
            </div>

            <form
              v-if="!success"
              name="form"
              @submit.prevent="requestReset()"
              no-validate
            >
              <div class="form-group mb-4">
                <label
                  class="form-control-label font-weight-bold small text-muted"
                  for="email"
                  v-text="t$('global.form[\'email.label\']')"
                ></label>
                <div class="input-group">
                  <input
                    type="email"
                    class="form-control rounded-pill border-guinda-light"
                    id="email"
                    name="email"
                    :placeholder="t$('global.form[\'email.placeholder\']')"
                    :class="{
                      'is-invalid':
                        v$.resetAccount.email.$invalid && v$.resetAccount.email.$dirty,
                      'is-valid':
                        !v$.resetAccount.email.$invalid && v$.resetAccount.email.$dirty,
                    }"
                    v-model="v$.resetAccount.email.$model"
                    required
                    data-cy="emailResetPassword"
                  />
                </div>

                <div
                  v-if="v$.resetAccount.email.$anyDirty && v$.resetAccount.email.$invalid"
                  class="invalid-feedback d-block ml-2 mt-1"
                >
                  <small
                    v-if="!v$.resetAccount.email.required"
                    v-text="t$('global.messages.validate.email.required')"
                  ></small>
                  <small
                    v-if="!v$.resetAccount.email.email"
                    v-text="t$('global.messages.validate.email.invalid')"
                  ></small>
                  <small
                    v-if="!v$.resetAccount.email.minLength"
                    v-text="t$('global.messages.validate.email.minlength')"
                  ></small>
                </div>
              </div>

              <button
                type="submit"
                :disabled="v$.resetAccount.$invalid"
                class="btn btn-guinda btn-block rounded-pill shadow-sm font-weight-bold py-2 mb-3"
                data-cy="submit"
              >
                <font-awesome-icon icon="paper-plane" class="mr-2" />
                <span v-text="t$('reset.request.form.button')"></span>
              </button>
            </form>

            <div class="text-center mt-3 border-top pt-3">
              <router-link to="/" class="text-muted small font-weight-bold">
                <font-awesome-icon icon="arrow-left" class="mr-1" />
                Regresar al inicio de sesión
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./reset-password-init.component.ts"></script>

<style scoped>
/* PALETA INSTITUCIONAL INFOTEC */
.bg-vino {
  background-color: #611232 !important;
}
.btn-guinda {
  background-color: #9b2247;
  color: white;
  border: none;
  transition: 0.3s;
}
.btn-guinda:hover:not(:disabled) {
  background-color: #611232;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(155, 34, 71, 0.3);
}

.border-guinda-light {
  border-color: #e2d1d6 !important;
}

/* TARJETA */
.reset-card {
  border-radius: 20px !important;
  overflow: hidden;
}

/* Forzamos que el contenedor sea transparente para ver el fondo del App.vue */
.bg-transparent {
  background-color: transparent !important;
}

.alert-warning-custom {
  background-color: #fff9e6;
  border-left: 4px solid #f39c12;
  color: #856404;
}

.opacity-75 {
  opacity: 0.75;
}

/* AJUSTES DE VALIDACIÓN */
.is-invalid {
  border-color: #dc3545 !important;
}
.is-valid {
  border-color: #28a745 !important;
}
</style>
