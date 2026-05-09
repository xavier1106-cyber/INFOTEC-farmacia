<template>
  <div class="container-fluid py-5 bg-light-gray min-vh-100 bg-infotec-watermark">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div
          class="card border-0 shadow-lg register-card animate__animated animate__fadeIn"
        >
          <div class="card-header bg-vino text-white text-center py-4">
            <font-awesome-icon icon="user-plus" size="2x" class="mb-2" />
            <h2
              class="font-weight-bold mb-0"
              v-text="t$('register.title')"
              id="register-title"
            ></h2>
            <p class="small mb-0 opacity-75">
              Crea una nueva cuenta en el sistema INFOTEC
            </p>
          </div>

          <div class="card-body p-4 bg-white">
            <div
              class="alert alert-success shadow-sm text-center"
              role="alert"
              v-if="success"
            >
              <div v-html="t$('register.messages.success')"></div>
              <hr />
              <router-link
                to="/"
                class="btn btn-success btn-sm rounded-pill px-4 font-weight-bold"
              >
                VOLVER AL INICIO
              </router-link>
            </div>

            <div
              class="alert alert-danger shadow-sm"
              role="alert"
              v-if="error"
              v-html="t$('register.messages.error.fail')"
            ></div>
            <div
              class="alert alert-danger shadow-sm"
              role="alert"
              v-if="errorUserExists"
              v-html="t$('register.messages.error.userexists')"
            ></div>
            <div
              class="alert alert-danger shadow-sm"
              role="alert"
              v-if="errorEmailExists"
              v-html="t$('register.messages.error.emailexists')"
            ></div>

            <form
              id="register-form"
              name="registerForm"
              @submit.prevent="register()"
              v-if="!success"
              no-validate
            >
              <div class="form-group mb-3">
                <label
                  class="form-control-label font-weight-bold small text-muted"
                  for="username"
                  v-text="t$('global.form[\'username.label\']')"
                ></label>
                <input
                  type="text"
                  class="form-control rounded-pill border-guinda-light"
                  v-model="v$.registerAccount.login.$model"
                  id="username"
                  name="login"
                  :class="{
                    'is-invalid':
                      v$.registerAccount.login.$invalid &&
                      v$.registerAccount.login.$dirty,
                  }"
                  required
                  :placeholder="t$('global.form[\'username.placeholder\']')"
                />
                <div
                  v-if="
                    v$.registerAccount.login.$anyDirty &&
                    v$.registerAccount.login.$invalid
                  "
                  class="invalid-feedback ml-2"
                >
                  <small
                    v-if="!v$.registerAccount.login.required"
                    v-text="t$('register.messages.validate.login.required')"
                  ></small>
                </div>
              </div>

              <div class="form-group mb-3">
                <label
                  class="form-control-label font-weight-bold small text-muted"
                  for="email"
                  v-text="t$('global.form[\'email.label\']')"
                ></label>
                <input
                  type="email"
                  class="form-control rounded-pill border-guinda-light"
                  id="email"
                  name="email"
                  :class="{
                    'is-invalid':
                      v$.registerAccount.email.$invalid &&
                      v$.registerAccount.email.$dirty,
                  }"
                  v-model="v$.registerAccount.email.$model"
                  required
                  :placeholder="t$('global.form[\'email.placeholder\']')"
                />
              </div>

              <div class="row">
                <div class="col-md-6 form-group mb-3">
                  <label
                    class="form-control-label font-weight-bold small text-muted"
                    for="firstPassword"
                    v-text="t$('global.form[\'newpassword.label\']')"
                  ></label>
                  <input
                    type="password"
                    class="form-control rounded-pill border-guinda-light"
                    id="firstPassword"
                    v-model="v$.registerAccount.password.$model"
                    :class="{
                      'is-invalid':
                        v$.registerAccount.password.$invalid &&
                        v$.registerAccount.password.$dirty,
                    }"
                    required
                    :placeholder="t$('global.form[\'newpassword.placeholder\']')"
                  />
                </div>
                <div class="col-md-6 form-group mb-3">
                  <label
                    class="form-control-label font-weight-bold small text-muted"
                    for="secondPassword"
                    >Confirmar contraseña</label
                  >
                  <input
                    type="password"
                    class="form-control rounded-pill border-guinda-light"
                    id="secondPassword"
                    v-model="v$.confirmPassword.$model"
                    :class="{
                      'is-invalid':
                        v$.confirmPassword.$invalid && v$.confirmPassword.$dirty,
                    }"
                    required
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                :disabled="v$.$invalid"
                class="btn btn-guinda btn-block rounded-pill shadow-sm font-weight-bold py-2 mb-3"
              >
                <font-awesome-icon icon="save" class="mr-2" />
                <span v-text="t$('register.form.button')"></span>
              </button>
            </form>

            <div class="alert alert-warning-custom text-center rounded-lg mt-3 py-2">
              <span class="small">¿Ya tienes cuenta?</span>
              <router-link to="/" class="alert-link small font-weight-bold ml-1">
                Inicia sesión aquí
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./register.component.ts"></script>

<style scoped>
/* ESTILOS INSTITUCIONALES */
.text-guinda {
  color: #9b2247 !important;
}
.bg-vino {
  background-color: #611232 !important;
}
.border-guinda-light {
  border-color: #e2d1d6 !important;
}
.border-guinda-light:focus {
  border-color: #9b2247 !important;
  box-shadow: 0 0 0 0.2rem rgba(155, 34, 71, 0.1);
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
}
.btn-guinda:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.register-card {
  border-radius: 20px !important;
  overflow: hidden;
}

.bg-infotec-watermark {
  background-image: url("assets/fondo4.jpeg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 55%;
  background-attachment: fixed;
}

.alert-warning-custom {
  background-color: #fff9e6;
  border: 1px dashed #f39c12;
  color: #856404;
}

.opacity-75 {
  opacity: 0.75;
}
.is-invalid {
  border-color: #dc3545 !important;
}
.invalid-feedback {
  display: block;
  font-size: 0.75rem;
}
</style>
