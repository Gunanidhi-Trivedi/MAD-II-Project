export default {
    template: `
    <div style="padding-top: 50px;">
        <div class="row">
            <div class="row-lg-12" style="padding-bottom: 5px;">
                <div class="section-title">
                    <h2 style="text-align: center;">Search</h2>
                </div>
            </div>
        </div>
        <div class="row">
            <h6 style="padding-left: 50px;">Search Based on Category/Product Name/Brand/Price</h6>
            <form v-on:submit.prevent="search" style="padding-left: 50px;">
                <h6><input type="text" required v-model="query" name="query"></h6>
                <button type="submit">Search</button>
                <button type="reset">Cancel</button>
            </form>
            <p style="padding-left: 50px;">Note:- If you enter price, then you will see the products with unit price less than or equal to the entered amount.</p>
            <div class="col" v-for="product in result" style="padding-top: 30px;">
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">{{product["name"]}} <span class="badge bg-warning" v-if="product['stock'] <= 0">Stockout</span></h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">{{product["weight"]}} <br> {{product["manufacturer"]}}</h6>
                        <p class="card-text"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
                        <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z"/>
                        </svg>{{product["price"]}} <br> {{product["store"]}}</p>
                        <div>
                            <div style="padding-bottom: 5px;">
                                <div class='text-danger' v-if="error != null">*{{error}}</div>
                                <form>
                                    Quantity: <input type="number" v-model="quantity" min="1" max="product['stock']" required style="width: 150px;" placeholder="1">
                                </form>
                            </div>
                            <button type="button" class="btn btn-outline-success" @click="addtocart(product['id'])" v-if="product['stock'] > 0">Add</button>
                        </div>
                    </div>
                </div>
            </div>
            <hr class="my-4">
        </div>
        <div class="row fixed-bottom">
            <hr class="my-4">
            <p style="text-align: center;">&COPY; 2023 Gunanidhi Trivedi </p>
        </div>
    </div>`,
    data: function() {
        return {
            id: localStorage.getItem('user_id'),
            query: null,
            result: null,
            quantity: 1,
            error: null,
            isAuthenticated: localStorage.getItem('auth-token') ? true : false
        }
    },
    methods: {
        search: function(){
            fetch(`/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify({
                    "query": this.query
                }),
            })
            .then(response => response.json())
            .then(data => this.result = data);
        },
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
    }
}
