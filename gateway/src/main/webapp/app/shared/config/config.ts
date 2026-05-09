import { type IntlDateTimeFormats, createI18n } from 'vue-i18n';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

// --- IMPORTACIONES ESTÁNDAR ---
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faAsterisk } from '@fortawesome/free-solid-svg-icons/faAsterisk';
import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faBell } from '@fortawesome/free-solid-svg-icons/faBell';
import { faBook } from '@fortawesome/free-solid-svg-icons/faBook';
import { faCloud } from '@fortawesome/free-solid-svg-icons/faCloud';
import { faCogs } from '@fortawesome/free-solid-svg-icons/faCogs';
import { faDatabase } from '@fortawesome/free-solid-svg-icons/faDatabase';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faFlag } from '@fortawesome/free-solid-svg-icons/faFlag';
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faList } from '@fortawesome/free-solid-svg-icons/faList';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faRoad } from '@fortawesome/free-solid-svg-icons/faRoad';
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faSort } from '@fortawesome/free-solid-svg-icons/faSort';
import { faSortDown } from '@fortawesome/free-solid-svg-icons/faSortDown';
import { faSortUp } from '@fortawesome/free-solid-svg-icons/faSortUp';
import { faSync } from '@fortawesome/free-solid-svg-icons/faSync';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons/faTachometerAlt';
import { faTasks } from '@fortawesome/free-solid-svg-icons/faTasks';
import { faThList } from '@fortawesome/free-solid-svg-icons/faThList';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons/faUserPlus';
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';
import { faUsersCog } from '@fortawesome/free-solid-svg-icons/faUsersCog';
import { faWrench } from '@fortawesome/free-solid-svg-icons/faWrench';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons/faCalendarAlt';
import { faBoxes } from '@fortawesome/free-solid-svg-icons/faBoxes';
import { faDollyFlatbed } from '@fortawesome/free-solid-svg-icons/faDollyFlatbed';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';

// --- ICONOS PARA MÓDULOS DE INVENTARIO Y FARMACIA ---
import { faUserMd } from '@fortawesome/free-solid-svg-icons/faUserMd';
import { faHistory } from '@fortawesome/free-solid-svg-icons/faHistory';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons/faCommentDots';
import { faFileMedical } from '@fortawesome/free-solid-svg-icons/faFileMedical';
import { faPills } from '@fortawesome/free-solid-svg-icons/faPills';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons/faFolderOpen';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faCapsules } from '@fortawesome/free-solid-svg-icons/faCapsules';
import { faBarcode } from '@fortawesome/free-solid-svg-icons/faBarcode';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons/faMapMarkerAlt';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons/faLayerGroup';
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons/faCalendarCheck';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons/faShieldAlt';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons/faExchangeAlt';
import { faTag } from '@fortawesome/free-solid-svg-icons/faTag';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp';

// --- ICONOS DE UI, GRÁFICAS Y ALERTAS ---
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine';
import { faChartPie } from '@fortawesome/free-solid-svg-icons/faChartPie';
import { faChartBar } from '@fortawesome/free-solid-svg-icons/faChartBar';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons/faBoxOpen';
import { faUserShield } from '@fortawesome/free-solid-svg-icons/faUserShield';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faHourglassHalf } from '@fortawesome/free-solid-svg-icons/faHourglassHalf';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash';
import { faRedo } from '@fortawesome/free-solid-svg-icons/faRedo';

// --- ICONOS ADICIONALES PARA FORMULARIOS Y GESTIÓN (RECIÉN AGREGADOS) ---
import { faIdCard } from '@fortawesome/free-solid-svg-icons/faIdCard';
import { faFingerprint } from '@fortawesome/free-solid-svg-icons/faFingerprint';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons/faUserEdit';
import { faLanguage } from '@fortawesome/free-solid-svg-icons/faLanguage';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';

// --- ICONOS DETECTADOS EN CONSOLA ---
import { faBalanceScale } from '@fortawesome/free-solid-svg-icons/faBalanceScale';
import { faShippingFast } from '@fortawesome/free-solid-svg-icons/faShippingFast';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons/faLightbulb';
import { faCalendarTimes } from '@fortawesome/free-solid-svg-icons/faCalendarTimes';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons/faClipboardCheck';
import { faUserInjured } from '@fortawesome/free-solid-svg-icons/faUserInjured';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons/faFileInvoice';
import { faPrint } from '@fortawesome/free-solid-svg-icons/faPrint';

const datetimeFormats: IntlDateTimeFormats = {
  es: {
    short: { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' },
    medium: { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short', hour: 'numeric', minute: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric' },
  },
  en: {
    short: { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' },
    medium: { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short', hour: 'numeric', minute: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric' },
  },
};

export function initFortAwesome(vue) {
  vue.component('font-awesome-icon', FontAwesomeIcon);

  library.add(
    faArrowLeft,
    faAsterisk,
    faBan,
    faBars,
    faBell,
    faBook,
    faCloud,
    faCogs,
    faDatabase,
    faEye,
    faFlag,
    faHeart,
    faHome,
    faList,
    faLock,
    faPencilAlt,
    faPlus,
    faRoad,
    faSave,
    faSearch,
    faSignInAlt,
    faSignOutAlt,
    faSort,
    faSortDown,
    faSortUp,
    faSync,
    faTachometerAlt,
    faTasks,
    faThList,
    faTimes,
    faTimesCircle,
    faTrash,
    faUser,
    faUserPlus,
    faUsers,
    faUsersCog,
    faWrench,
    faCalendarAlt,
    faBoxes,
    faDollyFlatbed,
    faCircle,
    faUserMd,
    faHistory,
    faCommentDots,
    faFileMedical,
    faPills,
    faFolderOpen,
    faExclamationCircle,
    faCapsules,
    faBarcode,
    faMapMarkerAlt,
    faLayerGroup,
    faCalendarCheck,
    faShieldAlt,
    faCheckCircle,
    faExchangeAlt,
    faTag,
    faArrowDown,
    faArrowUp,
    faPlusCircle,
    faChartLine,
    faChartPie,
    faChartBar,
    faBoxOpen,
    faUserShield,
    faInfoCircle,
    faExclamationTriangle,
    faHourglassHalf,
    faEyeSlash,
    faRedo,
    faBalanceScale,
    faShippingFast,
    faLightbulb,
    faCalendarTimes,
    faClock,
    faClipboardCheck,
    faUserInjured,
    faFileInvoice,
    faPrint,
    faIdCard,
    faFingerprint,
    faUserEdit,
    faLanguage,
    faEnvelope
  );
}

export function initI18N(opts: any = {}) {
  return createI18n({
    missingWarn: false,
    fallbackWarn: false,
    legacy: false,
    datetimeFormats,
    silentTranslationWarn: true,
    ...opts,
  });
}