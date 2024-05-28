from flask import request, jsonify
from flask import current_app as app
from application.data.models import *
from flask_security import auth_required, roles_required
from time import perf_counter_ns
from application.utilis.cache import cache

@app.route('/categories', methods=['GET'])
@cache.cached(key_prefix='categories')
def categories():
    # start = perf_counter_ns()
    categories = Category.query.all()
    cat_list = []
    for category in categories:
        cat_list.append(category.CatName)
    # stop = perf_counter_ns()
    # print("Categories Api time : ", stop-start)
    return jsonify({'categories': cat_list})

@app.route('/products', methods=['GET'])
@cache.cached(key_prefix='products')
def products():
    categories = Category.query.all()
    product_list = {}
    for category in categories:
        cat = "%" + category.CatName + "%"
        cat_product = Product.query.filter(Product.Category.like(cat)).all()
        product = {}

        for prod in cat_product:
            store = Store.query.filter(Store.StoreID==prod.Store).scalar()
            product[str(prod.ProductID)] = dict(name=prod.ProductName,manufacturer=prod.Manufacturer,weight=str(prod.Unit_weight) +" "+ prod.Unit_measurement,price=prod.Unit_price,store=store.StoreName,id=prod.ProductID,stock=prod.Stock)
        
        product_list[category.CatName] = product
    return jsonify(product_list)

@app.route('/search', methods=['POST'])
def search():
    q = request.json['query']
    query = "%" + q + "%"
    result = {}
    product1 = []
    product2 = []
    product3 = []
    product4 = []
    try:
        product4 = Product.query.filter(Product.Unit_price <= int(q)).all()
    except:
        product1 = Product.query.filter(Product.Category.like(query)).all()
        product2 = Product.query.filter(Product.ProductName.like(query)).all()
        product3 = Product.query.filter(Product.Manufacturer.like(query)).all()
    
    products = product1 + product2 + product3 + product4
    for prod in products:
        store = Store.query.filter(Store.StoreID==prod.Store).scalar()
        result[str(prod.ProductID)] = dict(name=prod.ProductName,manufacturer=prod.Manufacturer,weight=str(prod.Unit_weight) +" "+ prod.Unit_measurement,price=prod.Unit_price,store=store.StoreName,id=prod.ProductID,stock=prod.Stock)
    return jsonify(result)

@app.route('/cart_data/<int:id>', methods=['GET'])
@auth_required("token")
@cache.memoize(50)
def cart_data(id):
    my_cart = Cart.query.filter(Cart.id == id).all()
    prod_list ={}
    total_amount = 0
    for obj in my_cart:
        prod = Product.query.filter(Product.ProductID == obj.ProductID).scalar()
        store = Store.query.filter(Store.StoreID==prod.Store).scalar()
        prod_list[obj.CartID] = dict(name=prod.ProductName, manufacturer=prod.Manufacturer, unit_weight=str(prod.Unit_weight) +" "+ prod.Unit_measurement,unit_price=prod.Unit_price,store=store.StoreName,product_id=prod.ProductID,quantity=obj.Quantity,amount=prod.Unit_price*obj.Quantity,user_id=obj.id,cart_id=obj.CartID)
        total_amount += prod.Unit_price*obj.Quantity
    cart = dict(products=prod_list,total_amount=total_amount)
    return jsonify(cart)

@app.route('/orderlist/<int:id>', methods=['GET'])
@auth_required("token")
@cache.memoize(50)
def orderlist(id):
    my_orders = Orders.query.filter(Orders.id == id).all()
    order_list = {}
    for prod in my_orders:
        prod_details = Product.query.filter(Product.ProductID == prod.ProductID).scalar()
        store = Store.query.filter(Store.StoreID==prod_details.Store).scalar()
        order_list[str(prod.OrderID)] = dict(name=prod_details.ProductName,manufacturer=prod_details.Manufacturer,seller=store.StoreName,rate=prod_details.Unit_price,quantity=prod.Quantity,amount=prod_details.Unit_price*prod.Quantity,date=prod.Date,unit_weight=str(prod_details.Unit_weight) +" "+ prod_details.Unit_measurement)
    return jsonify(order_list)

@app.route('/account_details/<int:id>', methods=['GET'])
@auth_required("token")
@cache.memoize(50)
def account_deatils(id):
    user_deatils = User.query.filter(User.id == id).scalar()
    return jsonify({'user_name':user_deatils.UserName,'user_email':user_deatils.email,'apply':user_deatils.Apply,'store_remark':user_deatils.Store_remark})

@app.route('/store_application', methods=['GET'])
@auth_required("token")
@roles_required("admin")
@cache.cached(key_prefix='store_application')
def store_application():
    applications = Store_Application.query.all()
    apply_dict = {}
    for appli in applications:
        apply_dict[str(appli.ApplicationID)] = dict(applicationID=appli.ApplicationID,user_name = appli.Name,email = appli.email,store_name = appli.Store_name,id = appli.id)
    return jsonify(apply_dict)

@app.route('/store_list', methods=['GET'])
@auth_required("token")
@roles_required("admin")
@cache.cached(key_prefix='store_list')
def store_list():
    stores = Store.query.all()
    store_list = {}
    for store in stores:
        user_details = db.one_or_404(db.select(User).filter_by(id=store.id))
        store_list[str(store.StoreID)] = dict(storeID=store.StoreID,store_name=store.StoreName,sellerID=store.id,seller_name=user_details.UserName,emailID=user_details.email)
    return jsonify(store_list)

@app.route('/request_list', methods=['GET'])
@auth_required("token")
@roles_required("admin")
@cache.cached(key_prefix='request_list')
def request_list():
    add_request = Request.query.filter(Request.Type == "Add").all()
    edit_request = Request.query.filter(Request.Type == "Edit").all()
    remove_request = Request.query.filter(Request.Type == "Remove").all()
    request_list = {}
    add_request_list = {}
    edit_request_list = {}
    remove_request_list = {}

    for req in add_request:
        user_details = db.one_or_404(db.select(User).filter_by(id=req.id))
        store_details = db.one_or_404(db.select(Store).filter_by(id=req.id,StoreID=req.StoreID))
        add_request_list[str(req.RequestID)] = dict(cat_name=req.Cat_name,new_cat_name=req.New_cat_name,storeID=req.StoreID,store_name=store_details.StoreName,manager=user_details.UserName,requestID=req.RequestID)
    request_list['add'] = add_request_list

    for req in edit_request:
        user_details = db.one_or_404(db.select(User).filter_by(id=req.id))
        store_details = db.one_or_404(db.select(Store).filter_by(id=req.id,StoreID=req.StoreID))
        edit_request_list[str(req.RequestID)] = dict(cat_name=req.Cat_name,new_cat_name=req.New_cat_name,storeID=req.StoreID,store_name=store_details.StoreName,manager=user_details.UserName,requestID=req.RequestID)
    request_list['edit'] = edit_request_list

    for req in remove_request:
        user_details = db.one_or_404(db.select(User).filter_by(id=req.id))
        store_details = db.one_or_404(db.select(Store).filter_by(id=req.id,StoreID=req.StoreID))
        remove_request_list[str(req.RequestID)] = dict(cat_name=req.Cat_name,new_cat_name=req.New_cat_name,storeID=req.StoreID,store_name=store_details.StoreName,manager=user_details.UserName,requestID=req.RequestID)
    request_list['remove'] = remove_request_list
    return jsonify(request_list)

@app.route('/storename/<int:id>',methods=['GET'])
@auth_required("token")
@roles_required("store_manager")
@cache.memoize(50)
def storename(id):
    store = Store.query.filter(Store.id == id).scalar()
    return jsonify({"store_name":store.StoreName,"storeID":store.StoreID})

@app.route('/product_catalogue/<int:StoreID>', methods=['GET'])
@auth_required("token")
@roles_required("store_manager")
@cache.memoize(50)
def product_catalogue(StoreID):
    products = Product.query.filter(Product.Store == StoreID)
    product_catalogue = {}
    for product in products:
        product_catalogue[str(product.ProductID)] = dict(name=product.ProductName,manufacturer=product.Manufacturer,weight=str(product.Unit_weight) +" "+ product.Unit_measurement,price=product.Unit_price,category=product.Category,expiry_date=product.Expiry_date,productID=product.ProductID,unit_weight=product.Unit_weight,unit_measurement=product.Unit_measurement,stock=product.Stock)
    return jsonify(product_catalogue)
