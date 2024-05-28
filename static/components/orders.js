export default {
    template: `
    <div style="padding-top: 50px;">
        <div class="row">
            <div class="row-lg-12" style="padding-bottom: 5px;">
                <div class="section-title">
                    <h2 style="text-align: center;">My Orders</h2>
                </div>
            </div>
            <div class="row">
                <div class="col-md-1" style="text-align: center;"><h6>Date</h6></div>
                <div class="col-md-2" style="text-align: center;"><h6>Product Name</h6></div>
                <div class="col-md-2" style="text-align: center;"><h6>Manufacturer</h6></div>
                <div class="col-md-2" style="text-align: center;"><h6>Seller</h6></div>
                <div class="col-md-1" style="text-align: center;"><h6>Rate (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
                <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z"/>
                </svg>)</h6></div>
                <div class="col-md-1" style="text-align: center;"><h6>Unit Weight</h6></div>
                <div class="col-md-1" style="text-align: center;"><h6>Quantity</h6></div>
                <div class="col-md-2" style="text-align: center;"><h6>Amount (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
                <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z"/>
                </svg>)</h6></div>
                <hr class="my-4">
            </div>
            <div class="row" v-for="product in my_orders">
                <div class="col-md-1" style="text-align: center;"><h6>{{product["date"]}}</h6></div>
                <div class="col-md-2" style="text-align: center;"><h6>{{product["name"]}}</h6></div>
                <div class="col-md-2" style="text-align: center;"><h6>{{product["manufacturer"]}}</h6></div>
                <div class="col-md-2" style="text-align: center;"><h6>{{product["seller"]}}</h6></div>
                <div class="col-md-1" style="text-align: center;"><h6>{{product["rate"]}}</h6></div>
                <div class="col-md-1" style="text-align: center;"><h6>{{product["unit_weight"]}}</h6></div>
                <div class="col-md-1" style="text-align: center;"><h6>{{product["quantity"]}}</h6></div>
                <div class="col-md-2" style="text-align: center;"><h6>{{product["amount"]}}</h6></div>
                <hr class="my-4">
            </div>
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
            my_orders: {},
            id: localStorage.getItem('user_id'),
        }
    },
    mounted: async function(){
        const o = await fetch(`/orderlist/${this.id}`, {
            headers: {
                'Authentication-Token': localStorage.getItem('auth-token')
            },
        })
        const orderlist = await o.json()
        this.my_orders = orderlist
    }
}
