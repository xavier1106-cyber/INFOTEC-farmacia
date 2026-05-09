import { Authority } from '@/shared/security/authority';
/* tslint:disable */
// prettier-ignore
const Entities = () => import('@/entities/entities.vue');

const Inventario = () => import('@/entities/inventario/inventario/inventario.vue');
const InventarioUpdate = () => import('@/entities/inventario/inventario/inventario-update.vue');
const InventarioDetails = () => import('@/entities/inventario/inventario/inventario-details.vue');

const Paciente = () => import('@/entities/paciente/paciente/paciente.vue');
const PacienteUpdate = () => import('@/entities/paciente/paciente/paciente-update.vue');
const PacienteDetails = () => import('@/entities/paciente/paciente/paciente-details.vue');

const Medico = () => import('@/entities/medico/medico/medico.vue');
const MedicoUpdate = () => import('@/entities/medico/medico/medico-update.vue');
const MedicoDetails = () => import('@/entities/medico/medico/medico-details.vue');

const Historico = () => import('@/entities/historico/historico/historico.vue');
const HistoricoUpdate = () => import('@/entities/historico/historico/historico-update.vue');
const HistoricoDetails = () => import('@/entities/historico/historico/historico-details.vue');

const vista_graficas = () => import('@/entities/historico/historico/vista_graficas.vue');
const graficasInventario = () => import('@/entities/inventario/inventario/graficas_inventario.vue');
const buscador = () => import('@/entities/buscador/buscador.vue');

const MovimientoInventario = () => import('@/entities/inventario/movimiento-inventario/movimiento-inventario.vue');
const MovimientoInventarioUpdate = () => import('@/entities/inventario/movimiento-inventario/movimiento-inventario-update.vue');
const MovimientoInventarioDetails = () => import('@/entities/inventario/movimiento-inventario/movimiento-inventario-details.vue');

export default {
  path: '/',
  component: Entities,
  children: [
    // --- INVENTARIO ---
    {
      path: 'inventario',
      name: 'Inventario',
      component: Inventario,
      meta: { authorities: [Authority.ADMIN, Authority.ALMACEN, Authority.FARMACEUTICO] },
    },
    {
      path: 'inventario/new',
      name: 'InventarioCreate',
      component: InventarioUpdate,
      meta: { authorities: [Authority.ADMIN, Authority.ALMACEN] },
    },
    {
      path: 'inventario/:inventarioId/view',
      name: 'InventarioView',
      component: InventarioDetails,
      meta: { authorities: [Authority.ADMIN, Authority.ALMACEN, Authority.FARMACEUTICO] },
    },
    {
      path: 'inventario/:inventarioId/edit',
      name: 'InventarioEdit',
      component: InventarioUpdate,
      meta: { authorities: [Authority.ADMIN, Authority.ALMACEN] },
    },
    {
      path: 'inventario/graficas_inventario',
      name: 'graficas_inventario',
      component: graficasInventario,
      meta: { authorities: [Authority.ADMIN, Authority.ALMACEN, Authority.FARMACEUTICO] },
    },

    // --- PACIENTES ---
    {
      path: 'paciente',
      name: 'Paciente',
      component: Paciente,
      meta: { authorities: [Authority.ADMIN, Authority.FARMACEUTICO] },
    },
    {
      path: 'paciente/new',
      name: 'PacienteCreate',
      component: PacienteUpdate,
      meta: { authorities: [Authority.ADMIN] },
    },
    {
      path: 'paciente/:pacienteId/view',
      name: 'PacienteView',
      component: PacienteDetails,
      meta: { authorities: [Authority.ADMIN, Authority.FARMACEUTICO] },
    },
    {
      path: 'paciente/:pacienteId/edit',
      name: 'PacienteEdit',
      component: PacienteUpdate,
      meta: { authorities: [Authority.ADMIN] },
    },

    // --- MÉDICOS ---
    {
      path: 'medico',
      name: 'Medico',
      component: Medico,
      meta: { authorities: [Authority.ADMIN, Authority.FARMACEUTICO] },
    },
    {
      path: 'medico/new',
      name: 'MedicoCreate',
      component: MedicoUpdate,
      meta: { authorities: [Authority.ADMIN] },
    },
    {
      path: 'medico/:medicoId/view',
      name: 'MedicoView',
      component: MedicoDetails,
      meta: { authorities: [Authority.ADMIN, Authority.FARMACEUTICO] },
    },
    {
      path: 'medico/:medicoId/edit',
      name: 'MedicoEdit',
      component: MedicoUpdate,
      meta: { authorities: [Authority.ADMIN] },
    },

    // --- HISTÓRICO ---
    {
      path: 'historico',
      name: 'Historico',
      component: Historico,
      meta: { authorities: [Authority.ADMIN, Authority.FARMACEUTICO, Authority.USER] },
    },
    {
      path: 'historico/new',
      name: 'HistoricoCreate',
      component: HistoricoUpdate,
      meta: { authorities: [Authority.ADMIN, Authority.USER] },
    },
    {
      path: 'historico/:historicoId/view',
      name: 'HistoricoView',
      component: HistoricoDetails,
      meta: { authorities: [Authority.ADMIN, Authority.FARMACEUTICO, Authority.USER] },
    },

    {
      path: 'historico/:historicoId/edit',
      name: 'HistoricoEdit', 
      component: HistoricoUpdate,
      meta: { authorities: [Authority.ADMIN] },
    },
    {
      path: 'historico/Vista_graficas',
      name: 'Vista_graficas',
      component: vista_graficas,
      meta: { authorities: [Authority.ADMIN, Authority.FARMACEUTICO] },
    },

    // --- BUSCADOR ---
    {
      path: 'buscador',
      name: 'Buscador',
      component: buscador,
      meta: { authorities: [Authority.ADMIN, Authority.USER, Authority.FARMACEUTICO, Authority.ALMACEN] },
    },

    // --- MOVIMIENTOS ---
    {
      path: 'movimiento-inventario',
      name: 'MovimientoInventario',
      component: MovimientoInventario,
      meta: { authorities: [Authority.ADMIN, Authority.ALMACEN, Authority.FARMACEUTICO] },
    },
    {
      path: 'movimiento-inventario/new',
      name: 'MovimientoInventarioCreate',
      component: MovimientoInventarioUpdate,
      meta: { authorities: [Authority.ADMIN, Authority.ALMACEN] },
    },
    {
      path: 'movimiento-inventario/:movimientoInventarioId/edit',
      name: 'MovimientoInventarioEdit', // <--- ESTA ES LA QUE TE DABA ERROR
      component: MovimientoInventarioUpdate,
      meta: { authorities: [Authority.ADMIN, Authority.ALMACEN] },
    },
    {
      path: 'movimiento-inventario/:movimientoInventarioId/view',
      name: 'MovimientoInventarioView',
      component: MovimientoInventarioDetails,
      meta: { authorities: [Authority.ADMIN, Authority.ALMACEN, Authority.FARMACEUTICO] },
    }
  ],
};