export default {
    template: `
    <div class="container" style="padding-top: 50px;">
        <div class="bg-white rounded-lg d-block d-sm-flex">
            <div class="profile-tab-nav border border-dark rounded-3" style="height: 600px; width: 285px;">
                <div class="col" style="height: 200px;">
                    <div class="row" style="height: 50px;"></div>
                    <div class="row" style="height: 100px;text-align: center;"><h3>{{store_name}}</h3></div>
                    <div class="row" style="height: 50px;"></div>
                </div>
                <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    <a class="nav-link active" id="products-tab" data-toggle="pill" href="#products" role="tab"
                        aria-controls="products" aria-selected="true"> Products
                    </a>
                    <a class="nav-link" id="add-product-tab" data-toggle="pill" href="#add-product" role="tab"
                        aria-controls="add-product" aria-selected="false"> Add Product
                    </a>
                    <a class="nav-link" id="edit-product-tab" data-toggle="pill" href="#edit-product" role="tab"
                        aria-controls="edit-product" aria-selected="false"> Edit Product
                    </a>
                    <a class="nav-link" id="remove-product-tab" data-toggle="pill" href="#remove-product" role="tab"
                        aria-controls="remove-product" aria-selected="false"> Remove Product
                    </a>
                    <a class="nav-link" id="category-request-tab" data-toggle="pill" href="#category-request" role="tab"
                        aria-controls="category-request" aria-selected="false"> Submit Category Alteration Request
                    </a>
                    <a class="nav-link" id="download-tab" data-toggle="pill" href="#download" role="tab"
                        aria-controls="download" aria-selected="false"> Download Product Details
                    </a>
                </div>
            </div>
            <div style="width: 10px;"></div>
            <div class="tab-content p-4 p-md-5 border border-dark rounded-3" id="v-pills-tabContent">
                <div class="tab-pane fade show active" id="products" role="tabpanel" aria-labelledby="products-tab" style="width: 895px;">
                    <h3 class="mb-4" style="text-align: center;">Products</h3>
                    <div class="row row-cols-3">
                        <div class="col" v-for="product in products" style="padding-bottom: 30px;">
                            <div class="card" style="width: 18rem;">
                                <div class="card-body">
                                    <h5 class="card-title">{{product["name"]}}</h5>
                                    <h6 class="card-subtitle mb-2 text-body-secondary">{{product["weight"]}} <br> {{product["manufacturer"]}}</h6>
                                    <p class="card-text"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
                                    <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z"/>
                                    </svg>{{product["price"]}} <br> {{product["category"]}} <br> Expiry Date : {{product["expiry_date"]}} <br> Stock : {{product["stock"]}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab-pane fade" id="add-product" role="tabpanel" aria-labelledby="add-product-tab" style="width: 895px;">
                    <h3 class="mb-4" style="text-align: center;">Add Product</h3>
                    <div class='text-danger' v-if="error != null">*{{error}}</div>
                    <form v-on:submit.prevent="add_product" style="padding-left: 50px;">
                        <h6>Product Name: <input type="text" required v-model="product_name" name="product_name"></h6>
                        <h6>Manufacturer: <input type="text" v-model="manufacturer" name="manufacturer"></h6>
                        <h6>Expiry Date: <input type="date" v-model="expiry_date" name="expiry_date"></h6>
                        <h6>Unit Weight: <input type="number" required v-model="unit_weight" name="unit_weight" min=0></h6>
                        <h6>Measurement Unit: <input type="text" required v-model="unit_measurement" name="unit_measurement"></h6>
                        <h6>Unit Price: <input type="number" required v-model="unit_price" name="unit_price" min=0></h6>
                        <h6>Stock Quantity: <input type="number" required v-model="stock" name="stock" min=0></h6>
                        <h6>Category: </h6>
                        <div class="row row-cols-3">
                            <div class="col" v-for="cat in categories" style="padding-left: 50px;">
                                <h6><input type="radio" name="prod_category" v-on:click="category = cat" required>{{cat}}</h6>
                            </div>
                        </div>
                        <button type="submit">Add Product</button>
                    </form>
                </div>
                <div class="tab-pane fade" id="edit-product" role="tabpanel" aria-labelledby="edit-product-tab" style="width: 895px;">
                    <h3 class="mb-4" style="text-align: center;">Edit Product</h3>
                    <h5>Select a product to edit:</h5>
                    <div class="row">
                        <div class="col" style="text-align: center;"><h6>Select</h6></div>
                        <div class="col" style="text-align: center;"><h6>Product Name</h6></div>
                        <div class="col" style="text-align: center;"><h6>Manufacturer</h6></div>
                        <div class="col" style="text-align: center;"><h6>Expiry Date</h6></div>
                        <div class="col" style="text-align: center;"><h6>Unit Weight</h6></div>
                        <div class="col" style="text-align: center;"><h6>Measurement Unit</h6></div>
                        <div class="col" style="text-align: center;"><h6>Unit Price</h6></div>
                        <div class="col" style="text-align: center;"><h6>Stock</h6></div>
                        <div class="col" style="text-align: center;"><h6>Category</h6></div>
                        <hr class="my-4">
                    </div>
                    <div class="row" v-for="product in products">
                        <div class="col" style="text-align: center;"><h6><input type="radio" name="select_product" v-on:click="selected_product = product['productID'],edit_product_name = product['name'],edit_manufacturer = product['manufacturer'],edit_unit_weight = product['unit_weight'],edit_unit_measurement = product['unit_measurement'],edit_unit_price = product['price'],edit_stock = product['stock']"></h6></div>
                        <div class="col" style="text-align: center;"><h6>{{product["name"]}}</h6></div>
                        <div class="col" style="text-align: center;"><h6>{{product["manufacturer"]}}</h6></div>
                        <div class="col" style="text-align: center;"><h6>{{product["expiry_date"]}}</h6></div>
                        <div class="col" style="text-align: center;"><h6>{{product["unit_weight"]}}</h6></div>
                        <div class="col" style="text-align: center;"><h6>{{product["unit_measurement"]}}</h6></div>
                        <div class="col" style="text-align: center;"><h6>{{product["price"]}}</h6></div>
                        <div class="col" style="text-align: center;"><h6>{{product["stock"]}}</h6></div>
                        <div class="col" style="text-align: center;"><h6>{{product["category"]}}</h6></div>
                        <hr class="my-4">
                    </div>
                    <div class='text-danger' v-if="error != null">*{{error}}</div>
                    <form v-on:submit.prevent="edit_product" style="padding-left: 50px;">
                        <h6>Product Name: <input type="text" required v-model="edit_product_name" name="product_name"></h6>
                        <h6>Manufacturer: <input type="text" v-model="edit_manufacturer" name="manufacturer"></h6>
                        <h6>Expiry Date: <input type="date" v-model="edit_expiry_date" name="expiry_date"></h6>
                        <h6>Unit Weight: <input type="number" required v-model="edit_unit_weight" name="unit_weight" min=0></h6>
                        <h6>Measurement Unit: <input type="text" required v-model="edit_unit_measurement" name="unit_measurement"></h6>
                        <h6>Unit Price: <input type="number" required v-model="edit_unit_price" name="unit_price" min=0></h6>
                        <h6>Stock Quantity: <input type="number" required v-model="edit_stock" name="stock" min=0></h6>
                        <h6>Category: </h6>
                        <div class="row row-cols-3">
                            <div class="col" v-for="cat in categories" style="padding-left: 50px;">
                                <h6><input type="radio" name="prod_category" v-on:click="edit_category = cat" required>{{cat}}</h6>
                            </div>
                        </div>
                        <button type="submit">Edit Product</button>
                    </form>
                </div>
                <div class="tab-pane fade" id="remove-product" role="tabpanel" aria-labelledby="remove-product-tab" style="width: 895px;">
                    <h3 class="mb-4" style="text-align: center;">Remove Product</h3>
                    <div class="row row-cols-3">
                        <div class="col" v-for="product in products" style="padding-bottom: 30px;">
                            <div class="card" style="width: 18rem;">
                                <div class="card-body">
                                    <h5 class="card-title">{{product["name"]}}</h5>
                                    <h6 class="card-subtitle mb-2 text-body-secondary">{{product["weight"]}} <br> {{product["manufacturer"]}}</h6>
                                    <p class="card-text"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
                                    <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z"/>
                                    </svg>{{product["price"]}} <br> {{product["category"]}} <br> Expiry Date : {{product["expiry_date"]}} <br> Stock : {{product["stock"]}}</p>
                                    <button type="button" class="btn btn-outline-danger" v-on:click="remove_prod = product['name'],remove_prodID = product['productID']" data-bs-toggle="modal" data-bs-target="#removeproductModal">Remove</button>

                                    <!-- Modal -->
                                    <div class="modal fade" id="removeproductModal" tabindex="-1" aria-labelledby="removeproductModalLabel" aria-hidden="true">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h1 class="modal-title fs-5" id="removeproductModalLabel">Remove Confirmation</h1>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div class="modal-body">
                                                    <p>Are you sure that you want to remove {{remove_prod}} from your product offerings ?</p>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                                                    <button type="button" class="btn btn-primary" v-on:click="remove_product" data-bs-dismiss="modal">Yes</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab-pane fade" id="category-request" role="tabpanel" aria-labelledby="category-request-tab" style="width: 895px;">
                    <h3 class="mb-4" style="text-align: center;">Submit Category Alteration Request</h3>
                    <div class="row">
                        <div v-if="add_show">
                            <h5 class="mb-4">Submit request to add new category</h5>
                            <div class='text-danger' v-if="add_error != null">*{{add_error}}</div>
                            <form v-on:submit.prevent="request_add_category" style="padding-left: 50px;">
                                <h6>Category Name: <input type="text" required v-model="category_name" name="category_name"></h6>
                                <button type="submit">Submit Request</button>
                                <button type="reset">Cancel</button>
                            </form>
                        </div>
                        <div v-if="!add_show">
                            <h6>Your request has been submitted. You will be able to see the requested category in the category list, if your request is approved.</h6>
                        </div>
                    </div>
                    <hr class="my-4">
                    <div class="row">
                        <div v-if="edit_show">
                            <h5 class="mb-4">Submit request to edit a category</h5>
                            <div class='text-danger' v-if="edit_error != null">*{{edit_error}}</div>
                            <h6 class="mb-4">Select a category:</h6>
                            <div v-for="category in categories" style="padding-left: 50px;">
                                <h6><input type="radio" name="select_category" v-on:click="selected_category = category">{{category}}</h6>
                            </div>
                            <br>
                            <form v-on:submit.prevent="request_edit_category" style="padding-left: 50px;">
                                <h6>New Name: <input type="text" required v-model="edit_category_name" name="category_name"></h6>
                                <button type="submit">Submit Request</button>
                                <button type="reset">Cancel</button>
                            </form>
                        </div>
                        <div v-if="!edit_show">
                            <h6>Your request has been submitted. You will be able to see the change in category, if your request is approved.</h6>
                        </div>
                    </div>
                    <hr class="my-4">
                    <div class="row">
                        <div v-if="remove_show">
                            <h5 class="mb-4">Submit request to remove a category</h5>
                            <div class='text-danger' v-if="remove_error != null">*{{remove_error}}</div>
                            <h6 class="mb-4">Select a category:</h6>
                            <div v-for="category in categories" style="padding-left: 50px;">
                                <h6><input type="radio" name="remove_category" v-on:click="remove_cat = category">{{category}}</h6>
                            </div>
                            <br>
                            <div style="padding-left: 50px;">
                                <button type="button" v-on:click="request_remove_category">Submit Request</button>
                                <button type="reset">Cancel</button>
                            </div>
                        </div>
                        <div v-if="!remove_show">
                            <h6>Your request has been submitted. Requested category will be removed, if your request is approved.</h6>
                        </div>
                    </div>
                </div>
                <div class="tab-pane fade" id="download" role="tabpanel" aria-labelledby="download-tab" style="width: 895px;">
                    <h3 class="mb-4" style="text-align: center;">Download Product Details</h3>
                    <button type="button" v-on:click="download_prod_details">Download</button>
                    <div class="spinner-border" role="status" v-if="isWaiting">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
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
            id: localStorage.getItem('user_id'),
            StoreID: null,
            store_name: null,
            products: null,
            remove_prod: null,
            remove_prodID: null,
            product_name: null,
            manufacturer: null,
            expiry_date: null,
            unit_weight: null,
            unit_measurement: null,
            unit_price: null,
            stock: null,
            category: null,
            categories: [],
            selected_product: null,
            edit_product_name: null,
            edit_manufacturer: null,
            edit_expiry_date: null,
            edit_unit_weight: null,
            edit_unit_measurement: null,
            edit_unit_price: null,
            edit_stock: null,
            edit_category: null,
            category_name: null,
            add_show: true,
            selected_category: null,
            edit_category_name: null,
            edit_show: true,
            remove_show: true,
            remove_cat: null,
            isWaiting: false,
            error:null,
            add_error: null,
            edit_error: null,
            remove_error: null
        }
    },
    methods: {
        remove_product: function(){
            fetch(`/remove_product`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
                body : JSON.stringify({
                    "product_id": this.remove_prodID,
                }),
            });
            this.remove_prod = null;
            this.remove_prodID = null;
        },
        add_product: function(){
            fetch(`/add_product`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
                body : JSON.stringify({
                    "storeID": this.StoreID,
                    "product_name": this.product_name,
                    "manufacturer": this.manufacturer,
                    "expiry_date": this.expiry_date,
                    "unit_weight": this.unit_weight,
                    "unit_measurement": this.unit_measurement,
                    "unit_price": this.unit_price,
                    "stock": this.stock,
                    "category": this.category
                }),
            })
            .then(response => response.json())
            .then(data => this.error = data.message);
            this.product_name = null;
            this.manufacturer = null;
            this.expiry_date = null;
            this.unit_weight = null;
            this.unit_measurement = null;
            this.unit_price = null;
            this.stock = null;
            this.category = null;
        },
        edit_product: function(){
            fetch(`/edit_product`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
                body : JSON.stringify({
                    "storeID": this.StoreID,
                    "productID": this.selected_product,
                    "product_name": this.edit_product_name,
                    "manufacturer": this.edit_manufacturer,
                    "expiry_date": this.edit_expiry_date,
                    "unit_weight": this.edit_unit_weight,
                    "unit_measurement": this.edit_unit_measurement,
                    "unit_price": this.edit_unit_price,
                    "stock": this.edit_stock,
                    "category": this.edit_category
                }),
            })
            .then(response => response.json())
            .then(data => this.error = data.message);
            this.edit_product_name = null;
            this.selected_product = null;
            this.edit_manufacturer = null;
            this.edit_expiry_date = null;
            this.edit_unit_weight = null;
            this.edit_unit_measurement = null;
            this.edit_unit_price = null;
            this.edit_stock = null;
            this.edit_category = null;
        },
        request_add_category: async function(){
            const res = await fetch(`/request_add_category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
                body : JSON.stringify({
                    "cat_name": this.category_name,
                    "storeID": this.StoreID,
                    "id": this.id
                }),
            });
            const data = await res.json();
            if (res.status == 200){
                this.category_name = null;
                this.add_show = false;
            } else {
                this.add_error = data.message;
            }
        },
        request_edit_category: async function(){
            const res = await fetch(`/request_edit_category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
                body : JSON.stringify({
                    "old_name": this.selected_category,
                    "new_name": this.edit_category_name,
                    "storeID": this.StoreID,
                    "id": this.id
                }),
            });
            const data = await res.json();
            if (res.status == 200){
                this.selected_category= null;
                this.edit_category_name = null;
                this.edit_show = false;
            } else {
                this.edit_error = data.message;
            }
        },
        request_remove_category: async function(){
            const res = await fetch(`/request_remove_category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
                body : JSON.stringify({
                    "cat_name": this.remove_cat,
                    "storeID": this.StoreID,
                    "id": this.id
                }),
            });
            const data = await res.json();
            if (res.status == 200){
                this.remove_show = false;
            } else {
                this.remove_error = data.message;
            }
        },
        download_prod_details: async function(){
            this.isWaiting = true;
            const res = await fetch(`/download_prod_details/${this.StoreID}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
            });
            const data = await res.json();
            if(res.ok){
                const taskId = data['task-id']
                const intv = setInterval(async () => {
                    const csv_res = await fetch(`/get-csv/${taskId}`)
                    if(csv_res.ok){
                        this.isWaiting = false;
                        clearInterval(intv)
                        window.location.href = `/get-csv/${taskId}`
                    }
                }, 1000)
            }
        }
    },
    mounted: async function(){
        const e = await fetch(`/storename/${this.id}`, {
            headers: {
                'Authentication-Token': localStorage.getItem('auth-token')
            },
        })
        const store_name = await e.json()
        this.store_name = store_name['store_name']
        this.StoreID = store_name['storeID']

        const d = await fetch(`/product_catalogue/${this.StoreID}`, {
            headers: {
                'Authentication-Token': localStorage.getItem('auth-token')
            },
        })
        const product_catalogue = await d.json()
        this.products = product_catalogue

        const y = await fetch('/categories')
        const data = await y.json()
        this.categories = data["categories"]
    }
}
