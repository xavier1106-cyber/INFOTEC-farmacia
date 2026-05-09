<template>
  <div class="container py-5 animate__animated animate__fadeIn">
    <div class="row justify-content-center">
      <div class="col-md-10 col-lg-8">
        <div class="card shadow-lg border-0 rounded-lg overflow-hidden">
          <div class="bg-vino p-4 text-white d-flex align-items-center">
            <div
              class="bg-white text-guinda rounded-circle p-3 mr-3 shadow-sm d-flex align-items-center justify-content-center"
              style="width: 60px; height: 60px"
            >
              <font-awesome-icon
                :icon="userAccount.id ? 'user-edit' : 'user-plus'"
                size="lg"
              />
            </div>
            <div>
              <h2
                class="mb-0 font-weight-bold"
                style="font-size: 1.5rem"
                v-text="t$('userManagement.home.createOrEditLabel')"
              ></h2>
              <p class="mb-0 small text-white-50">
                Complete la información del usuario y asigne los permisos correspondientes
              </p>
            </div>
          </div>

          <div class="card-body p-5 bg-white">
            <form name="editForm" novalidate @submit.prevent="save()" v-if="userAccount">
              <div class="row">
                <div class="col-12 mb-4" :hidden="!userAccount.id">
                  <label
                    class="form-label text-muted x-small font-weight-bold text-uppercase"
                    v-text="t$('global.field.id')"
                  ></label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-right-0"
                      ><font-awesome-icon icon="fingerprint" class="text-muted"
                    /></span>
                    <input
                      type="text"
                      class="form-control bg-light border-left-0"
                      name="id"
                      v-model="userAccount.id"
                      readonly
                    />
                  </div>
                </div>

                <div class="col-md-6 mb-4">
                  <label
                    class="form-label text-dark font-weight-bold"
                    v-text="t$('userManagement.login')"
                  ></label>
                  <div class="input-group shadow-xs">
                    <span class="input-group-text bg-white border-right-0"
                      ><font-awesome-icon icon="user" class="text-guinda"
                    /></span>
                    <input
                      type="text"
                      class="form-control border-left-0"
                      name="login"
                      :class="{
                        'is-invalid': v$.userAccount.login.$invalid,
                        'is-valid':
                          !v$.userAccount.login.$invalid && v$.userAccount.login.$dirty,
                      }"
                      v-model="v$.userAccount.login.$model"
                    />
                  </div>
                  <div
                    v-if="v$.userAccount.login.$anyDirty && v$.userAccount.login.$invalid"
                    class="mt-1"
                  >
                    <small
                      class="text-danger"
                      v-if="!v$.userAccount.login.required"
                      v-text="t$('entity.validation.required')"
                    ></small>
                    <small
                      class="text-danger"
                      v-if="!v$.userAccount.login.maxLength"
                      v-text="t$('entity.validation.maxlength', { max: 50 })"
                    ></small>
                    <small
                      class="text-danger"
                      v-if="!v$.userAccount.login.pattern"
                      v-text="t$('entity.validation.patternLogin')"
                    ></small>
                  </div>
                </div>

                <div class="col-md-6 mb-4">
                  <label
                    class="form-label text-dark font-weight-bold"
                    v-text="t$('userManagement.email')"
                  ></label>
                  <div class="input-group shadow-xs">
                    <span class="input-group-text bg-white border-right-0"
                      ><font-awesome-icon icon="envelope" class="text-guinda"
                    /></span>
                    <input
                      type="email"
                      class="form-control border-left-0"
                      id="email"
                      name="email"
                      :placeholder="t$('global.form[\'email.placeholder\']')"
                      :class="{
                        'is-invalid': v$.userAccount.email.$invalid,
                        'is-valid':
                          !v$.userAccount.email.$invalid && v$.userAccount.email.$dirty,
                      }"
                      v-model="v$.userAccount.email.$model"
                    />
                  </div>
                  <div
                    v-if="v$.userAccount.email.$anyDirty && v$.userAccount.email.$invalid"
                    class="mt-1"
                  >
                    <small
                      class="text-danger"
                      v-if="!v$.userAccount.email.required"
                      v-text="t$('global.messages.validate.email.required')"
                    ></small>
                    <small
                      class="text-danger"
                      v-if="!v$.userAccount.email.email"
                      v-text="t$('global.messages.validate.email.invalid')"
                    ></small>
                  </div>
                </div>

                <div class="col-md-6 mb-4">
                  <label
                    class="form-label text-dark font-weight-bold"
                    for="firstName"
                    v-text="t$('userManagement.firstName')"
                  ></label>
                  <input
                    type="text"
                    class="form-control shadow-xs"
                    id="firstName"
                    name="firstName"
                    :placeholder="t$('settings.form[\'firstname.placeholder\']')"
                    :class="{
                      'is-valid':
                        !v$.userAccount.firstName.$invalid &&
                        v$.userAccount.firstName.$dirty,
                    }"
                    v-model="v$.userAccount.firstName.$model"
                  />
                </div>

                <div class="col-md-6 mb-4">
                  <label
                    class="form-label text-dark font-weight-bold"
                    for="lastName"
                    v-text="t$('userManagement.lastName')"
                  ></label>
                  <input
                    type="text"
                    class="form-control shadow-xs"
                    id="lastName"
                    name="lastName"
                    :placeholder="t$('settings.form[\'lastname.placeholder\']')"
                    :class="{
                      'is-valid':
                        !v$.userAccount.lastName.$invalid &&
                        v$.userAccount.lastName.$dirty,
                    }"
                    v-model="v$.userAccount.lastName.$model"
                  />
                </div>

                <div class="col-md-6 mb-4 d-flex align-items-center">
                  <div class="custom-control custom-switch custom-switch-guinda">
                    <input
                      type="checkbox"
                      class="custom-control-input"
                      id="activated"
                      name="activated"
                      :disabled="userAccount.id === null"
                      v-model="userAccount.activated"
                    />
                    <label
                      class="custom-control-label font-weight-bold text-dark"
                      for="activated"
                      v-text="t$('userManagement.activated')"
                    ></label>
                  </div>
                </div>

                <div
                  class="col-md-6 mb-4"
                  v-if="languages && Object.keys(languages).length > 0"
                >
                  <label
                    class="form-label text-dark font-weight-bold"
                    for="langKey"
                    v-text="t$('userManagement.langKey')"
                  ></label>
                  <select
                    class="form-control shadow-xs"
                    id="langKey"
                    name="langKey"
                    v-model="userAccount.langKey"
                  >
                    <option v-for="(language, key) in languages" :value="key" :key="key">
                      {{ language.name }}
                    </option>
                  </select>
                </div>

                <div class="col-12 mb-4">
                  <label class="form-label text-dark font-weight-bold"
                    ><font-awesome-icon icon="shield-alt" class="mr-1 text-guinda" />
                    Perfiles de Acceso</label
                  >
                  <select
                    class="form-control shadow-xs select-multiple-custom"
                    multiple
                    name="authority"
                    v-model="userAccount.authorities"
                    style="height: 120px"
                  >
                    <option
                      v-for="authority of authorities"
                      :value="authority"
                      :key="authority"
                      class="p-2"
                    >
                      {{ authority }}
                    </option>
                  </select>
                  <small class="text-muted mt-2 d-block"
                    ><font-awesome-icon icon="info-circle" /> Mantenga presionado Ctrl (o
                    Cmd) para seleccionar múltiples roles.</small
                  >
                </div>
              </div>

              <div
                class="card-footer bg-transparent border-0 px-0 mt-4 d-flex justify-content-between"
              >
                <b-button
                  type="button"
                  variant="outline-secondary"
                  class="rounded-pill px-5 shadow-sm font-weight-bold"
                  @click="previousState()"
                >
                  <font-awesome-icon icon="ban" class="mr-2" />
                  <span v-text="t$('entity.action.cancel')"></span>
                </b-button>

                <b-button
                  type="submit"
                  :disabled="v$.userAccount.$invalid || isSaving"
                  variant="guinda"
                  class="rounded-pill px-5 shadow-sm font-weight-bold"
                >
                  <font-awesome-icon icon="save" class="mr-2" />
                  <span v-text="t$('entity.action.save')"></span>
                </b-button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./user-management-edit.component.ts"></script>

<style scoped>
/* PALETA INSTITUCIONAL */
.text-guinda {
  color: #9b2247 !important;
}
.bg-vino {
  background-color: #611232 !important;
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

/* ESTILOS DE FORMULARIO */
.form-control:focus {
  border-color: #9b2247;
  box-shadow: 0 0 0 0.2rem rgba(155, 34, 71, 0.25);
}

.shadow-xs {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.x-small {
  font-size: 0.7rem;
}

/* SELECT MULTIPLE CUSTOM */
.select-multiple-custom option:checked {
  background-color: #9b2247 !important;
  color: white;
}

/* CUSTOM SWITCH GUINDA */
.custom-switch-guinda .custom-control-input:checked ~ .custom-control-label::before {
  background-color: #9b2247;
  border-color: #9b2247;
}

.input-group-text {
  border-color: #ced4da;
}
</style>
