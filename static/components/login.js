export default {
    template: `
    <div class='d-flex justify-content-center' style="margin-top: 25vh">
        <div class="mb-3 p-5 bg-light">
            <div class='text-danger' v-if="error != null">*{{error}}</div>
            <label for="user-email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model="email">
            <label for="user-password" class="form-label">Password</label>
            <input type="password" class="form-control" id="user-password" v-model="password">
            <button class="btn btn-primary mt-2" @click='login' > Login </button>
            <button class="btn btn-link" @click='signup'> Sign up </button>
        </div> 
    </div>
    `,
    data: function() {
        return {
            email: null,
            password: null,
            error: null,
        }
    },
    methods: {
        login: async function() {
            const res = await fetch('/user_login', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "email": this.email,
                    "password": this.password 
                }),
            })
            const data = await res.json()
            if (res.ok) {
                localStorage.setItem('auth-token', data.token)
                localStorage.setItem('role', data.role)
                localStorage.setItem('user_id', data.user_id)
                this.$router.push({ path: '/' })
            } else {
                this.error = data.message
            }
        },
        signup: function(){
            this.$router.push({ path: '/signup' });
        }
    },
}