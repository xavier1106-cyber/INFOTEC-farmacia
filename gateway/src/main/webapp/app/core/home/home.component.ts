import axios from 'axios';
import { type ComputedRef, defineComponent, inject, ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router'; 
import { Authority } from '@/shared/security/authority'; 

// Tipos
import type LoginService from '@/account/login.service';
import type AccountService from '@/account/account.service';
import InventarioService from '@/entities/inventario/inventario/inventario.service';
import HistoricoService from '@/entities/historico/historico/historico.service';

export default defineComponent({
  compatConfig: { MODE: 3 },
  setup() {
    const router = useRouter(); 
    const loginService = inject<LoginService>('loginService');
    const accountService = inject<AccountService>('accountService');
    const inventarioService = inject('inventarioService', () => new InventarioService());
    const historicoService = inject('historicoService', () => new HistoricoService());

    const authenticated = inject<ComputedRef<boolean>>('authenticated');
    const username = inject<ComputedRef<string>>('currentUsername');

    // Estados de UI
    const showLogin = ref(false);
    const isFetchingData = ref(false);
    const authenticationError = ref(false);

    // Campos del formulario
    const login = ref('');
    const password = ref('');
    const rememberMe = ref(true);

    const alertasSistema = ref([]);
    const actividadReciente = ref([]);

    // --- FUNCIÓN DE REDIRECCIÓN POR ROL ---
    const redirectUserByRole = () => {
      const roles = accountService?.userAuthorities || [];

      // Si es ADMIN, simplemente salimos de la función para que se quede en Home.vue
      if (roles.includes(Authority.ADMIN)) {
        return; 
      }

      // Redirección para el resto de los roles
      if (roles.includes(Authority.ALMACEN)) {
        router.push('/inventario');
      } else if (roles.includes(Authority.FARMACEUTICO)) {
        router.push('/buscador');
      } else if (roles.includes(Authority.USER)) {
        router.push('/buscador');
      }
    };

    // --- LÓGICA DE LOGIN MANUAL ---
    const doLogin = async () => {
      const data = { username: login.value, password: password.value, rememberMe: rememberMe.value };
      try {
        const result = await axios.post('api/authenticate', data);
        const bearerToken = result.headers.authorization;
        
        if (bearerToken && bearerToken.startsWith('Bearer ')) {
          const jwt = bearerToken.slice(7);
          if (rememberMe.value) {
            localStorage.setItem('jhi-authenticationToken', jwt);
            sessionStorage.removeItem('jhi-authenticationToken');
          } else {
            sessionStorage.setItem('jhi-authenticationToken', jwt);
            localStorage.removeItem('jhi-authenticationToken');
          }
        }

        authenticationError.value = false;
        
        if (accountService) {
          await accountService.retrieveAccount();
          // Intentar redirección tras obtener cuenta
          redirectUserByRole();
        }
        
        showLogin.value = false; 
      } catch (err) {
        console.error("Error en login:", err);
        authenticationError.value = true;
      }
    };

    const loadData = async () => {
      // Solo cargamos datos si el usuario está autenticado (evita errores 401 en consola)
      if (!authenticated?.value) return;
      isFetchingData.value = true;
      try {
        const [resInv, resHist] = await Promise.all([
          inventarioService().retrieve({ size: 100 }),
          historicoService().retrieve({ page: 0, size: 5, sort: ['id,desc'] })
        ]);
        
        alertasSistema.value = resInv.data?.filter(m => m.cantidad <= 10) || [];
        actividadReciente.value = (resHist.data || []).map(h => ({
          texto: `Dispensa: ${h.pacienteNombre || 'N/A'} - Folio: ${h.folio || 'N/A'}`,
          hora: h.fecha ? new Date(h.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Hoy'
        }));
      } catch (e) {
        console.warn("Servicios de datos no disponibles o sin permisos");
      }
      isFetchingData.value = false;
    };

    watch(() => authenticated?.value, (val) => {
      if (val) {
        loadData();
        // También activamos la redirección si el estado cambia
        redirectUserByRole();
      }
    });

    onMounted(() => {
      if (authenticated?.value) {
        redirectUserByRole();
        loadData();
      }
    });

    return {
      authenticated,
      username,
      showLogin,
      login,
      password,
      rememberMe,
      authenticationError,
      doLogin,
      alertasSistema,
      actividadReciente,
      isFetchingData,
      loadData,
      t$: useI18n().t
    };
  },
});