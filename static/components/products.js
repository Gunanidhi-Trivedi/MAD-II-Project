export default{
    template: `
    <div style="padding-top: 50px;">
        <div class="container" v-for="category in categories">
            <div class="row">
                <div class="row-lg-12" style="padding-bottom: 5px;">
                    <div class="section-title">
                        <h2 style="text-align: center;">{{category}}</h2>
                    </div>
                </div>
                <div class="row row-cols-4">
                    <div class="col" v-for="product in products[category]" style="padding-bottom: 30px;">
                        <div class="card" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title">{{product["name"]}} <span class="badge bg-warning" v-if="product['stock'] <= 0">Stockout</span></h5>
                                <h6 class="card-subtitle mb-2 text-body-secondary">{{product["weight"]}} <br> {{product["manufacturer"]}}</h6>
                                <p class="card-text"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
                                <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z"/>
                                </svg>{{product["price"]}} <br> {{product["store"]}}</p>
                                <div>
                                    <div class='text-danger' v-if="error != null">*{{error}}</div>
                                    <div style="padding-bottom: 5px;">
                                        <form>
                                            Quantity: <input type="number" v-model="quantity" min="1" max="product['stock']" required style="width: 150px;" placeholder="1">
                                        </form>
                                    </div>
                                    <button type="button" class="btn btn-outline-success" @click="addtocart(product['id'])" v-if="product['stock'] > 0">Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <hr class="my-4">
            <p style="text-align: center;">&COPY; 2023 Gunanidhi Trivedi</p>
        </div>
    </div>
        `,
    data: function() {
        return { 
            categories: [],
            products: {},
            quantity: 1,
            id: localStorage.getItem('user_id'),
            error: null,
            isAuthenticated: localStorage.getItem('auth-token') ? true : false
        }
    },
    methods: {
        addtocart: async function(product_id){
            if (!this.isAuthenticated){
                this.$router.push({ path: '/login' })
            }
            else {
                const res = await fetch('/addtocart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': localStorage.getItem('auth-token')
                    },
                    body : JSON.stringify({
                        "product_id": product_id,
                        "user_id": this.id,
                        "quantity": this.quantity
                    }),
                });
                const data = await res.json();
                if (res.status != 200) {
                    this.error = data.message;
                }
                this.quantity = 1;
            }
        }
    },
    mounted: async function() {
        const r = await fetch('/categories')
        const data = await r.json()
        this.categories = data["categories"]

        const s = await fetch("/products")
        const product_data = await s.json()
        this.products = product_data
    }
}
