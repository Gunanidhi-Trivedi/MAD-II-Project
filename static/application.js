import navbar from './components/navbar.js';
import router from './components/router.js';

new Vue({
    el: '#app',
    template: `
    <div>
        <navbar/>
        <router-view/>
    </div>
    `,
    router,
    components: {
        navbar,
    },
})