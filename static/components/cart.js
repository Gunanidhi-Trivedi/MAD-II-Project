export default {
    template: `
    <div style="padding-top: 50px;">
        <div class="row">
            <div class="row-lg-12" style="padding-bottom: 5px;">
                <div class="section-title">
                    <h2 style="text-align: center;">My Cart</h2>
                </div>
            </div>
            <div class="row row-cols-4" v-if="show">
                <div class="col" v-for="product in cart['products']" style="padding-bottom: 30px;">
                    <div class="card" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">{{product["name"]}}</h5>
                            <h6 class="card-subtitle mb-2 text-body-secondary">{{product["unit_weight"]}} <br> {{product["manufacturer"]}}</h6>
                            <p class="card-text"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
                            <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z"/>
                            </svg>{{product["unit_price"]}} <br> {{product["store"]}} <br> Quantity: {{product["quantity"]}} <br> Amount: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
                            <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z"/>
                            </svg>{{product["amount"]}}</p>
                            <button type="button" class="btn btn-outline-danger" @click="removefromcart(product['product_id'],product['cart_id'])">Remove</button> <!-- create method on click that will add the product in cart-->
                        </div>
                    </div>
                </div>
            </div>
            <div class="row-lg-12" v-if="!show" style="text-align: center; padding-top: 50px;">
                <h6>Your order is confirmed</h6> <br>
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                </svg>
            </div>
            <div class="row-lg-12" style="padding-top: 100px;" v-if="show">
                <div class="col-lg-4 offset-lg-4">
                    <h5 style="text-align: center;">Total Amount Payable: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
                    <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z"/>
                    </svg>{{cart['total_amount']}}</h5> 
                    <div style="text-align: center;"><button type="button" class="btn btn-success" @click="order()">Proceed</button></div>
                </div>
            </div>
        </div>
        <div class="row fixed-bottom">
            <hr class="my-4">
            <p style="text-align: center;">&COPY; 2023 Gunanidhi Trivedi</p>
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
            cart: {},
            id: localStorage.getItem('user_id'),
            key: 0,
            show: true,
        }
    },
    methods: {
        removefromcart: function(product_id,cart_id){
            fetch('/removefromcart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
                body : JSON.stringify({
                    "product_id": product_id,
                    "user_id": this.id,
                    "cart_id": cart_id
                }),
            });
            this.key += 1;
        },
        order: function(){
            fetch('/placeorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
                body : JSON.stringify({
                    "user_id": this.id,
                }),
            });
            this.show = false;
        }
    },
    mounted: async function(){
        const c = await fetch(`/cart_data/${this.id}`, {
            headers: {
                'Authentication-Token': localStorage.getItem('auth-token')
            },
        })
        const cart_data = await c.json()
        this.cart = cart_data
    }
}
