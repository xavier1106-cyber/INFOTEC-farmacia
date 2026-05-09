<template>
  <div id="app" class="main-app-wrapper">
    <ribbon></ribbon>

    <div id="app-header">
      <jhi-navbar></jhi-navbar>
    </div>

    <div class="container-fluid p-0 main-content">
      <router-view></router-view>

      <b-modal id="login-page" hide-footer lazy>
        <template #modal-title>
          <span data-cy="loginTitle" id="login-title" v-text="t$('login.title')"></span>
        </template>
        <login-form></login-form>
      </b-modal>

      <jhi-footer></jhi-footer>
    </div>
  </div>
</template>

<script lang="ts" src="./app.component.ts"></script>

<style scoped>
/* Contenedor raíz para asegurar que ocupe toda la pantalla */
.main-app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ESTILO DEL FONDO PRINCIPAL */
.main-content {
  /* Ruta a tu imagen de fondo */
  background-image: url("../../../content/images/fondo.jpeg");
  background-repeat: no-repeat;
  background-position: center center;

  /* 'cover' asegura que la imagen llene todo el espacio sin deformarse */
  background-size: cover;

  /* 'fixed' hace que el fondo se quede quieto mientras el contenido se desliza */
  background-attachment: fixed;

  /* Altura mínima para que el fondo siempre cubra hasta abajo */
  min-height: calc(100vh - 56px);
  display: flex;
  flex-direction: column;
}

/* Aseguramos que el router-view crezca para empujar el footer al final */
.main-content > *:first-child {
  flex: 1;
}

/* Estilo opcional para que el fondo no sea tan brillante y canse la vista */
.main-content::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.2); /* Capa muy ligera de color blanco */
  pointer-events: none;
  z-index: 0;
}
</style>
