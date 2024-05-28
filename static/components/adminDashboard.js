export default {
    template: `
    <div class="container" style="padding-top: 50px;">
        <div class="bg-white rounded-lg d-block d-sm-flex">
            <div class="profile-tab-nav border border-dark rounded-3" style="height: 600px; width: 285px;">
                <div style="height: 200px;"></div>
                <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    <a class="nav-link active" id="categories-tab" data-toggle="pill" href="#categories" role="tab"
                        aria-controls="categories" aria-selected="true"> Categories
                    </a>
                    <a class="nav-link" id="add-category-tab" data-toggle="pill" href="#add-category" role="tab"
                        aria-controls="add-category" aria-selected="false"> Add category
                    </a>
                    <a class="nav-link" id="edit-category-tab" data-toggle="pill" href="#edit-category" role="tab"
                        aria-controls="edit-category" aria-selected="false"> Edit Category
                    </a>
                    <a class="nav-link" id="remove-category-tab" data-toggle="pill" href="#remove-category" role="tab"
                        aria-controls="remove-category" aria-selected="false"> Remove Category
                    </a>
                    <a class="nav-link" id="manager-tab" data-toggle="pill" href="#manager" role="tab"
                        aria-controls="manager" aria-selected="false"> Store Managers' Request
                    </a>
                    <a class="nav-link" id="add-store-tab" data-toggle="pill" href="#add-store" role="tab"
                        aria-controls="add-store" aria-selected="false"> Approve New Store
                    </a>
                    <a class="nav-link" id="store-tab" data-toggle="pill" href="#store" role="tab"
                        aria-controls="store" aria-selected="false"> Stores
                    </a>
                </div>
            </div>
            <div style="width: 10px;"></div>
            <div class="tab-content p-4 p-md-5 border border-dark rounded-3" id="v-pills-tabContent">
                <div class="tab-pane fade show active" id="categories" role="tabpanel" aria-labelledby="categories-tab" style="width: 895px;">
                    <h3 class="mb-4" style="text-align: center;">Categories</h3>
                    <ul>
                        <li v-for="category in categories"><h6>{{category}}</h6></li>
                    </ul>
                </div>
                <div class="tab-pane fade" id="add-category" role="tabpanel" aria-labelledby="add-category-tab" style="width: 895px;">
                    <h3 class="mb-4" style="text-align: center;">Add Category</h3>
                    <div class='text-danger' v-if="add_error != null">*{{add_error}}</div>
                    <form v-on:submit.prevent="add_category" style="padding-left: 50px;">
                        <h6>Category Name: <input type="text" required v-model="category_name" name="category_name"></h6>
                        <button type="submit">Add Category</button>
                    </form>
                </div>
                <div class="tab-pane fade" id="edit-category" role="tabpanel" aria-labelledby="edit-category-tab" style="width: 895px;">
                    <h3 class="mb-4" style="text-align: center;">Edit Category</h3>
                    <div class='text-danger' v-if="edit_error != null">*{{edit_error}}</div>
                    <h5>Select a category to edit:</h5>
                    <div v-for="category in categories" style="padding-left: 50px;">
                        <h6><input type="radio" name="select_category" v-on:click="selected_category = category">{{category}}</h6>
                    </div>
                    <br>
                    <form v-on:submit.prevent="edit_category" style="padding-left: 50px;">
                        <h6>New Name: <input type="text" required v-model="edit_category_name" name="category_name"></h6>
                        <button type="submit">Edit Category</button>
                        <button type="reset">Cancel</button>
                    </form>
                </div>
                <div class="tab-pane fade" id="remove-category" role="tabpanel" aria-labelledby="remove-category-tab" style="width: 895px;">
                    <h3 class="mb-4" style="text-align: center;">Remove Category</h3>
                    <div class='text-danger' v-if="remove_error != null">*{{remove_error}}</div>
                    <h5>Select a category to remove:</h5>
                    <div v-for="category in categories" style="padding-left: 50px;">
                        <h6><input type="radio" name="remove_category" v-on:click="remove_cat = category">{{category}}</h6>
                    </div>
                    <br>
                    <!-- Button trigger modal -->
                    <div style="padding-left: 50px;">
                        <button type="button" data-bs-toggle="modal" data-bs-target="#categoryModal">Remove Category</button>
                    </div>

                    <!-- Modal -->
                    <div class="modal fade" id="categoryModal" tabindex="-1" aria-labelledby="categoryModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="categoryModalLabel">Remove Confirmation</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <p>Are you sure that you want to remove {{remove_cat}} category ?</p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                                    <button type="button" class="btn btn-primary" v-on:click="remove_category" data-bs-dismiss="modal">Yes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab-pane fade" id="manager" role="tabpanel" aria-labelledby="manager-tab" style="width: 895px;">
                    <h3 class="mb-4" style="text-align: center;">Approve Category Alteration Request</h3>
                    <div class='text-danger' v-if="reject_error != null">*{{reject_error}}</div>
                    <div>
                        <h5 class="mb-4">Request to add new categories</h5>
                        <div class='text-danger' v-if="add_error != null">*Select a request</div>
                        <div class="row">
                            <div class="col" style="text-align: center;"><h6>Select</h6></div>
                            <div class="col" style="text-align: center;"><h6>Category Name</h6></div>
                            <div class="col" style="text-align: center;"><h6>Store ID</h6></div>
                            <div class="col" style="text-align: center;"><h6>Store Name</h6></div>
                            <div class="col" style="text-align: center;"><h6>Store Manager</h6></div>
                            <hr class="my-4">
                        </div>
                        <div class="row" v-for="request in requests['add']">
                            <div class="col" style="text-align: center;"><h6><input type="radio" name="new_cat" v-on:click="category_name = request['cat_name'],requestID = request['requestID']"></h6></div>
                            <div class="col" style="text-align: center;"><h6>{{request['cat_name']}}</h6></div>
                            <div class="col" style="text-align: center;"><h6>{{request['storeID']}}</h6></div>
                            <div class="col" style="text-align: center;"><h6>{{request['store_name']}}</h6></div>
                            <div class="col" style="text-align: center;"><h6>{{request['manager']}}</h6></div>
                            <hr class="my-4">
                        </div>
                        <button type="button" v-on:click="add_category">Approve Request</button>
                        <button type="button" v-on:click="delete_request">Reject Request</button>
                    </div>
                    <hr class="my-4">
                    <div>
                        <h5 class="mb-4">Request to edit existing categories</h5>
                        <div class='text-danger' v-if="edit_error != null">Select a request</div>
                        <div class="row">
                            <div class="col" style="text-align: center;"><h6>Select</h6></div>
                            <div class="col" style="text-align: center;"><h6>Category Name</h6></div>
                            <div class="col" style="text-align: center;"><h6>New Name Requested</h6></div>
                            <div class="col" style="text-align: center;"><h6>Store ID</h6></div>
                            <div class="col" style="text-align: center;"><h6>Store Name</h6></div>
                            <div class="col" style="text-align: center;"><h6>Store Manager</h6></div>
                            <hr class="my-4">
                        </div>
                        <div class="row" v-for="request in requests['edit']">
                            <div class="col" style="text-align: center;"><h6><input type="radio" name="new_cat" v-on:click="selected_category = request['cat_name'],edit_category_name = request['new_cat_name'],requestID = request['requestID']"></h6></div>
                            <div class="col" style="text-align: center;"><h6>{{request['cat_name']}}</h6></div>
                            <div class="col" style="text-align: center;"><h6>{{request['new_cat_name']}}</h6></div>
                            <div class="col" style="text-align: center;"><h6>{{request['storeID']}}</h6></div>
                            <div class="col" style="text-align: center;"><h6>{{request['store_name']}}</h6></div>
                            <div class="col" style="text-align: center;"><h6>{{request['manager']}}</h6></div>
                            <hr class="my-4">
                        </div>
                        <button type="button" v-on:click="edit_category">Approve Request</button>
                        <button type="button" v-on:click="delete_request">Reject Request</button>
                    </div>
                    <hr class="my-4">
                    <div>
                        <h5 class="mb-4">Request to remove existing categories</h5>
                        <div class='text-danger' v-if="remove_error != null">*Select a request</div>
                        <div class="row">
                            <div class="col" style="text-align: center;"><h6>Select</h6></div>
                            <div class="col" style="text-align: center;"><h6>Category Name</h6></div>
                            <div class="col" style="text-align: center;"><h6>Store ID</h6></div>
                            <div class="col" style="text-align: center;"><h6>Store Name</h6></div>
                            <div class="col" style="text-align: center;"><h6>Store Manager</h6></div>
                            <hr class="my-4">
                        </div>
                        <div class="row" v-for="request in requests['remove']">
                            <div class="col" style="text-align: center;"><h6><input type="radio" name="new_cat" v-on:click="remove_cat = request['cat_name'],requestID = request['requestID']"></h6></div>
                            <div class="col" style="text-align: center;"><h6>{{request['cat_name']}}</h6></div>
                            <div class="col" style="text-align: center;"><h6>{{request['storeID']}}</h6></div>
                            <div class="col" style="text-align: center;"><h6>{{request['store_name']}}</h6></div>
                            <div class="col" style="text-align: center;"><h6>{{request['manager']}}</h6></div>
                            <hr class="my-4">
                        </div>
                        <button type="button" v-on:click="remove_category">Approve Request</button>
                        <button type="button" v-on:click="delete_request">Reject Request</button>
                    </div>
                </div>
                <div class="tab-pane fade" id="add-store" role="tabpanel" aria-labelledby="add-store-tab" style="width: 895px;">
                    <h3 class="mb-4" style="text-align: center;">Approve New Store</h3>
                    <div class="row">
                        <div class="col-md-1" style="text-align: center;"><h6>Application ID</h6></div>
                        <div class="col-md-1" style="text-align: center;"><h6>User ID</h6></div>
                        <div class="col-md-2" style="text-align: center;"><h6>User Name</h6></div>
                        <div class="col-md-3" style="text-align: center;"><h6>User EmailID</h6></div>
                        <div class="col-md-2" style="text-align: center;"><h6>Store Name</h6></div>
                        <div class="col-md-3" style="text-align: center;"><h6>Approve/Reject</h6></div>
                        <hr class="my-4">
                    </div>
                    <div class="row" v-for="application in applications">
                        <div class="col-md-1" style="text-align: center;"><h6>{{application['applicationID']}}</h6></div>
                        <div class="col-md-1" style="text-align: center;"><h6>{{application['id']}}</h6></div>
                        <div class="col-md-2" style="text-align: center;"><h6>{{application['user_name']}}</h6></div>
                        <div class="col-md-3" style="text-align: center;"><h6>{{application['email']}}</h6></div>
                        <div class="col-md-2" style="text-align: center;"><h6>{{application['store_name']}}</h6></div>
                        <div class="col-md-3" style="text-align: center;">
                            <button type="button" v-on:click="approve_application(application['applicationID'])">Approve</button>
                            <button type="button" v-on:click="reject_application(application['applicationID'])">Reject</button>
                        </div>
                        <hr class="my-4">
                    </div>
                </div>
                <div class="tab-pane fade" id="store" role="tabpanel" aria-labelledby="store-tab" style="width: 895px;">
                    <h3 class="mb-4" style="text-align: center;">Stores</h3>
                    <div class="row">
                        <div class="col-md-1" style="text-align: center;"><h6>Store ID</h6></div>
                        <div class="col-md-2" style="text-align: center;"><h6>Store Name</h6></div>
                        <div class="col-md-1" style="text-align: center;"><h6>Seller ID</h6></div>
                        <div class="col-md-2" style="text-align: center;"><h6>Seller Name</h6></div>
                        <div class="col-md-3" style="text-align: center;"><h6>Seller EmailID</h6></div>
                        <hr class="my-4">
                    </div>
                    <div class="row" v-for="store in stores">
                        <div class="col-md-1" style="text-align: center;"><h6>{{store['storeID']}}</h6></div>
                        <div class="col-md-2" style="text-align: center;"><h6>{{store['store_name']}}</h6></div>
                        <div class="col-md-1" style="text-align: center;"><h6>{{store['sellerID']}}</h6></div>
                        <div class="col-md-2" style="text-align: center;"><h6>{{store['seller_name']}}</h6></div>
                        <div class="col-md-3" style="text-align: center;"><h6>{{store['emailID']}}</h6></div>
                        <hr class="my-4">
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
            categories: [],
            category_name: null,
            selected_category: null,
            edit_category_name: null,
            remove_cat: null,
            applications: {},
            stores: {},
            requests: {},
            requestID: null,
            reject_error: null,
            add_error: null,
            edit_error: null,
            remove_error: null
        }
    },
    methods: {
        add_category: async function(){
            const res = await fetch(`/add_category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
                body : JSON.stringify({
                    "category_name": this.category_name,
                }),
            });
            const data = await res.json();
            if (res.status == 200){
                this.category_name = null;
                this.delete_request();
            } else {
                this.add_error = data.message;
            }
        },
        edit_category: async function(){
            const res = await fetch(`/edit_category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
                body : JSON.stringify({
                    "old_name": this.selected_category,
                    "new_name": this.edit_category_name
                }),
            });
            const data = await res.json();
            if (res.status == 200){
                this.edit_category_name = null;
                this.selected_category = null;
                this.delete_request();
            } else {
                this.edit_error = data.message;
            }
        },
        remove_category: async function(){
            const res = await fetch(`/remove_category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
                body : JSON.stringify({
                    "cat_name": this.remove_cat,
                }),
            });
            const data = await res.json();
            if (res.status == 200){
                this.remove_cat = null;
                this.delete_request();
            } else {
                this.remove_error = data.message;
            }
        },
        approve_application: function(applicationID){
            fetch(`/approve_application`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
                body : JSON.stringify({
                    "applicationID": applicationID,
                }),
            });
        },
        reject_application: function(applicationID){
            fetch(`/reject_application`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
                body : JSON.stringify({
                    "applicationID": applicationID,
                }),
            });
        },
        delete_request: async function(){
            if (this.requestID != null){
                const res = await fetch(`/delete_request`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': localStorage.getItem('auth-token')
                    },
                    body : JSON.stringify({
                        "requestID": this.requestID,
                    }),
                });
                const data = await res.json();
                if (res.status == 200){
                    this.requestID = null;
                } else {
                    this.reject_error = data.message;
                }
            } else {
                this.reject_error = "Select a request";
            }
        }
    },
    mounted: async function() {
        const x = await fetch('/categories')
        const data = await x.json()
        this.categories = data["categories"]

        const j = await fetch('/store_application', {
            headers: {
                'Authentication-Token': localStorage.getItem('auth-token')
            },
        })
        const store_applications = await j.json()
        this.applications = store_applications

        const k = await fetch('/store_list', {
            headers: {
                'Authentication-Token': localStorage.getItem('auth-token')
            },
        })
        const store_list = await k.json()
        this.stores = store_list

        const f = await fetch('/request_list', {
            headers: {
                'Authentication-Token': localStorage.getItem('auth-token')
            },
        })
        const request_list = await f.json()
        this.requests = request_list
    }
}
