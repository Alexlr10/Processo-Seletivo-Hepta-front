import Vue from 'vue';
import App from './App.vue';

// --- PrimeVue: biblioteca de componentes para UI

import PrimeVue from 'primevue/config';
// estilos
import 'primevue/resources/themes/saga-blue/theme.css'; //theme
import 'primevue/resources/primevue.min.css';           //core css
import 'primeicons/primeicons.css';                     //icons
// -- Axios: framework para chamadas a APIs
import axios from 'axios';
import https from 'https';

import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';


Vue.use(PrimeVue, { ripple: true });

Vue.use(ToastService);

Vue.component('Toast', Toast); // Registre o componente Toast globalmente para evitar o aviso de "component has been registered but not used"

// Criando a propriedade global "this.$http" para ser usada pelos componentes para acesso a API's
Vue.prototype.$http = axios.create({
    httpsAgent: new https.Agent({
        // Para desenvolvimto o codigo a seguir desabilita a checagem de certificado em APIs com HTTPS
        rejectUnauthorized: false
    })
});

// --- Configura��es da aplica��o

Vue.prototype.$urlApi = process.env.VUE_APP_API_URL;  // URL da API

// --- Entry point da aplica��o

Vue.config.productionTip = true;

new Vue({
    render: h => h(App)
}).$mount('#app');
