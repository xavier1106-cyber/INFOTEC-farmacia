import { createRouter as createVueRouter, createWebHistory } from 'vue-router';

const Home = () => import('@/core/home/home.vue');
const Error = () => import('@/core/error/error.vue');
import account from '@/router/account';
import admin from '@/router/admin';
import entities from '@/router/entities';
import pages from '@/router/pages';
import { useStore } from '@/store';

export const createRouter = () =>
  createVueRouter({

    
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        name: 'Home',
        component: Home,
      },
      {
        path: '/forbidden',
        name: 'Forbidden',
        component: Error,
        meta: { error403: true },
      },
      {
        path: '/not-found',
        name: 'NotFound',
        component: Error,
        meta: { error404: true },
      },
      ...account,
      ...admin,
      entities,
      ...pages,
    ],
  });

const router = createRouter();

router.beforeResolve(async (to, from, next) => {
  const store = useStore();
  const authenticated = store.authenticated;
  const roles = store.account?.authorities || [];

  // 2. Lógica de redirección según tus requerimientos (Xavier)
  if (to.path === '/' && authenticated) {
    if (roles.includes('ROLE_ADMIN')) {
      return next(); // El Admin se queda en el Home/Dashboard principal
    } 
    if (roles.includes('ROLE_ALMACEN')) {
      return next({ name: 'Inventario' }); // Redirige a Inventario
    } 
    if (roles.includes('ROLE_USER')) {
      return next({ name: 'Buscador' }); // Redirige a Buscador
    }
    if (roles.includes('ROLE_FARMACEUTICO')) {
      return next({ name: 'Home' }); // Farmacéutico ve la principal
    }
  }
  if (!to.matched.length) {
    next({ path: '/not-found' });
    return;
  }
  next();
});



export default router;
