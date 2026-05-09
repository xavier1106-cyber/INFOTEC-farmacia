<template>
  <b-navbar data-cy="navbar" toggleable="md" type="dark" class="bg-primary">
    <b-navbar-brand class="logo" b-link to="/">
      <img
        src="/content/images/infotec3.jpg"
        alt="Logo Infotec"
        style="height: 40px; width: auto"
      />
      <span class="navbar-title"></span>
    </b-navbar-brand>

    <b-navbar-toggle
      right
      class="jh-navbar-toggler d-lg-none"
      href="javascript:void(0);"
      data-toggle="collapse"
      target="header-tabs"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <font-awesome-icon icon="bars" />
    </b-navbar-toggle>

    <b-collapse is-nav id="header-tabs">
      <b-navbar-nav class="ml-auto">
        <!-- BOTÓN INICIO -->
        <b-nav-item to="/" exact v-if="authenticated">
          <span>
            <font-awesome-icon icon="home" />
            <span v-text="t$('global.menu.home')"></span>
          </span>
        </b-nav-item>

        <!-- BOTÓN ENTIDADES ACTIVADO -->
        <!-- <b-nav-item-dropdown
          right
          id="entity-menu"
          v-if="
            authenticated &&
            hasAnyAuthority([
              'ROLE_ADMIN',
              'ROLE_ALMACEN',
              'ROLE_FARMACEUTICO',
              'ROLE_USER',
            ])
          "
          active-class="active"
          class="pointer"
          data-cy="entity"
        >
          <template #button-content>
            <span class="navbar-dropdown-menu">
              <font-awesome-icon icon="th-list" />
              <span class="no-bold" v-text="t$('global.menu.entities.main')"></span>
            </span>
          </template>

          <entities-menu></entities-menu>
        </b-nav-item-dropdown>-->

        <!-- ADMINISTRACIÓN ACTIVA -->
        <b-nav-item-dropdown
          right
          id="admin-menu"
          v-if="hasAnyAuthority('ROLE_ADMIN') && authenticated"
          :class="{ 'router-link-active': subIsActive('/admin') }"
          active-class="active"
          class="pointer"
          data-cy="adminMenu"
        >
          <template #button-content>
            <span class="navbar-dropdown-menu">
              <font-awesome-icon icon="users-cog" />
              <span class="no-bold" v-text="t$('global.menu.admin.main')"></span>
            </span>
          </template>

          <b-dropdown-item to="/admin/user-management" active-class="active">
            <font-awesome-icon icon="users" />
            <span v-text="t$('global.menu.admin.userManagement')"></span>
          </b-dropdown-item>

          <b-dropdown-item to="/admin/metrics" active-class="active">
            <font-awesome-icon icon="tachometer-alt" />
            <span v-text="t$('global.menu.admin.metrics')"></span>
          </b-dropdown-item>

          <b-dropdown-item to="/admin/health" active-class="active">
            <font-awesome-icon icon="heart" />
            <span v-text="t$('global.menu.admin.health')"></span>
          </b-dropdown-item>

          <b-dropdown-item to="/admin/configuration" active-class="active">
            <font-awesome-icon icon="cogs" />
            <span v-text="t$('global.menu.admin.configuration')"></span>
          </b-dropdown-item>

          <b-dropdown-item to="/admin/logs" active-class="active">
            <font-awesome-icon icon="tasks" />
            <span v-text="t$('global.menu.admin.logs')"></span>
          </b-dropdown-item>
        </b-nav-item-dropdown>

        <!-- BOTÓN IDIOMA COMENTADO -->
        <!--
        <b-nav-item-dropdown
          id="languagesnavBarDropdown"
          right
          v-if="languages && Object.keys(languages).length > 1"
        >
          ...
        </b-nav-item-dropdown>
        -->

        <!-- BOTÓN CUENTA COMENTADO -->
        <!--
        <b-nav-item-dropdown
          right
          href="javascript:void(0);"
          id="account-menu"
        >
          ...
        </b-nav-item-dropdown>
        -->

        <b-nav-item-dropdown
          right
          href="javascript:void(0);"
          id="account-menu"
          :class="{ 'router-link-active': subIsActive('/account') }"
          active-class="active"
          class="pointer"
          data-cy="accountMenu"
        >
          <template #button-content>
            <span class="navbar-dropdown-menu">
              <!-- Icono usuario -->
              <font-awesome-icon icon="user" />

              <!-- Texto botón -->
              <span class="no-bold" v-text="t$('global.menu.account.main')"></span>
            </span>
          </template>

          <!-- Botón configuración -->
          <!--<b-dropdown-item to="/account/settings" v-if="authenticated">
            <font-awesome-icon icon="wrench" />
            <span v-text="t$('global.menu.account.settings')"></span>
          </b-dropdown-item>-->

          <!-- Botón contraseña -->
          <!--<b-dropdown-item to="/account/password" v-if="authenticated">
            <font-awesome-icon icon="lock" />
            <span v-text="t$('global.menu.account.password')"></span>
          </b-dropdown-item>-->

          <!-- Botón cerrar sesión -->
          <b-dropdown-item v-if="authenticated" @click="logout()">
            <font-awesome-icon icon="sign-out-alt" />
            <span v-text="t$('global.menu.account.logout')"></span>
          </b-dropdown-item>

          <!-- Botón iniciar sesión -->
          <!-- <b-dropdown-item v-if="!authenticated" @click="openLogin()">
            <font-awesome-icon icon="sign-in-alt" />
            <span v-text="t$('global.menu.account.login')"></span>
          </b-dropdown-item>-->
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang="ts" src="./jhi-navbar.component.ts"></script>

<style scoped>
.navbar-version {
  font-size: 0.65em;
}

@media screen and (min-width: 768px) {
  .jh-navbar-toggler {
    display: none;
  }
}

@media screen and (min-width: 768px) and (max-width: 1150px) {
  span span {
    display: none;
  }
}

.navbar-title {
  display: inline-block;
}

.navbar-brand.logo {
  padding: 0 7px;
}
</style>
