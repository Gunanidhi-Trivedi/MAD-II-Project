export default {
    template:`
    <div class='d-flex justify-content-center' style="margin-top: 25vh">
        <div class="mb-3 p-5 bg-light">
            <div class='text-danger' v-if="error != null">*{{error}}</div>
            <label for="user-name" class="form-label">Your Name</label>
            <input type="text" class="form-control" id="user-name" v-model="name">
            <label for="user-email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model="email">
            <label for="user-password" class="form-label">Password</label>
            <input type="password" class="form-control" id="user-password" v-model="password">
            <button class="btn btn-primary mt-2" @click='signup' > Sing up </button>
        </div> 
    </div>
    `,
    data: function() {
        return {
            name: null,
            email: null,
            password: null,
            error: null,
        }
    },
    methods: {
        signup: async function() {
            const res = await fetch('/signup', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "name": this.name,
                    "email": this.email,
                    "password": this.password 
                }),
            })
            const data = await res.json()
            if (res.ok) {
                this.$router.push({ path: '/login' })
            } else {
                this.error = data.message
            }
        }
    }
}