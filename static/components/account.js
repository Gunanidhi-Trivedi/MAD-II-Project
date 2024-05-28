export default {
    template: `
    <div style="padding-top: 50px;">
        <div class="row">
            <div class="row-lg-12" style="padding-bottom: 5px;">
                <div class="section-title">
                    <h2 style="text-align: center;">My Account</h2>
                </div>
            </div>
            <div class="row-lg-12" style="padding-bottom: 5px;">
                <h6 style="padding-left: 50px;">Name : {{user_name}}</h6>
                <h6 style="padding-left: 50px;">Email ID : {{user_email}}</h6>
            </div>
            <div class="row-lg-12" v-if="role != 'admin'">
                <div class="section-title">
                    <h4 style="text-align: center;">Start Your Store</h4>
                </div>
                <div v-if="applied == 'No'">
                    <h6 style="padding-left: 50px;">{{store_remark}}</h6>
                    <div class='text-danger' v-if="error != null" style="padding-left: 50px;">*{{error}}</div>
                    <form v-on:submit.prevent="apply" style="padding-left: 50px;">
                        <h6>Name: <br><input type="text" required v-model="name"></h6>
                        <h6>Email ID: <br><input type="email" required v-model="email"></h6>
                        <h6>Store Name: <br><input type="text" required v-model="store_name"></h6>
                        <button type="submit">Apply</button>
                    </form>
                </div>
                <div v-if="applied == 'Yes'">
                    <h6 style="padding-left: 50px;">{{store_remark}}</h6>
                </div>
            </div>
        </div>
        <div class="row" style="padding-top: 50px;">
            <div style="text-align: center;"><button type="button" class="btn btn-primary" @click='logout'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
            <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
          </svg> Logout</button></div>
        </div>
        <div class="row fixed-bottom">
            <hr class="my-4">
            <p style="text-align: center;">&COPY; 2023 Gunanidhi Trivedi </p>
        </div>
    </div>`,
    beforeRouteEnter(to, from, next) {
        const isAuthenticated = localStorage.getItem('auth-token') ? true : false;
        if(!isAuthenticated){
            next({ name: 'Login' })
        } else next()
    },
    data: function() {
        return { 
            user_name: null,
            user_email: null,
            id: localStorage.getItem('user_id'),
            role: localStorage.getItem('role'),
            name:null,
            email:null,
            store_name:null,
            applied: null,
            store_remark: null,
            error: null
        }
    },
    methods: {
        apply: async function(){
            const res = await fetch(`/apply_for_store/${this.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
                body : JSON.stringify({
                    "name": this.name,
                    "email": this.email,
                    "store_name": this.store_name
                }),
            });
            const data = await res.json();
            if (res.status == 200){
                this.name = null;
                this.email = null;
                this.store_name = null;
                this.applied = 'Yes';
                this.store_remark = 'You have applied for the store and your application is under process.';
            } else {
                this.error = data.message;
            }
        },
        logout: function(){
            localStorage.removeItem('auth-token')
            localStorage.removeItem('role')
            localStorage.removeItem('user_id')
            this.$router.push({ path: '/login' })
        }
    },
    mounted: async function(){
        const a = await fetch(`/account_details/${this.id}`, {
            headers: {
                'Authentication-Token': localStorage.getItem('auth-token')
            },
        })
        const account_details = await a.json()
        this.user_name = account_details["user_name"]
        this.user_email = account_details["user_email"]
        this.applied = account_details["apply"]
        this.store_remark = account_details['store_remark']
    }
}
