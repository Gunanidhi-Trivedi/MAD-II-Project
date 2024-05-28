from flask import request, jsonify
from datetime import date
from flask import current_app as app
from application.data.models import *
from flask_security import auth_required, roles_required
from application.utilis.cache import cache

@app.route('/addtocart', methods=['POST'])
@auth_required("token")
def addtocart():
    product_id = request.json['product_id']
    user_id = request.json['user_id']
    quantity = request.json['quantity']
    if not quantity:
        return jsonify({"message": "Quantity Not Provided"}), 400
    
    if int(quantity) < 0:
        return jsonify({"message" : "Invalid Quantity"}), 400
    
    prod_details = Product.query.filter(Product.ProductID == product_id).scalar()
    
    if int(quantity) > prod_details.Stock:
        return jsonify({"message": "Not Enough Stock"}), 400
    
    try:
        new_product = Cart(id=user_id,ProductID=product_id,Quantity=quantity)
        db.session.add(new_product)
        db.session.commit()
        cache.clear()
        return jsonify({"message":"Success"}), 200
    except:
        return jsonify({"message":"Server Error"}), 500

@app.route('/removefromcart', methods=['POST'])
@auth_required("token")
def removefromcart():
    product_id = request.json['product_id']
    user_id = request.json['user_id']
    cart_id = request.json['cart_id']
    cart_prod = Cart.query.filter(Cart.id == user_id, Cart.ProductID == product_id,Cart.CartID == cart_id).scalar()
    try:
        db.session.delete(cart_prod)
        db.session.commit()
        cache.clear()
        return jsonify({"message":"Success"}), 200
    except:
        return jsonify({"message":"Server Error"}), 500

@app.route('/placeorder',methods=['POST'])
@auth_required("token")
def order():
    user_id = request.json['user_id']
    my_cart = Cart.query.filter(Cart.id == user_id).all()
    today_date = date.today()
    try:
        for prod in my_cart:
            prod_details = Product.query.filter(Product.ProductID == prod.ProductID).scalar()
            prod_details.Stock = prod_details.Stock - prod.Quantity
            db.session.commit()
            new_order = Orders(id=user_id,ProductID=prod.ProductID,Quantity=prod.Quantity,Date=today_date)
            db.session.add(new_order)
            db.session.commit()
        
        for prod in my_cart:
            db.session.delete(prod)
            db.session.commit()
        cache.clear()
        return jsonify({"message":"Success"}), 200
    except:
        return jsonify({"message":"Server Error"}), 500

@app.route('/apply_for_store/<int:id>',methods=['POST'])
@auth_required("token")
@roles_required("shopper")
def apply_for_store(id):
    name = request.json['name']
    email = request.json['email']
    store_name = request.json['store_name']
    if not name or not email or not store_name:
        return jsonify({"message": "Field Missing"}), 400
    user_details = db.one_or_404(db.select(User).filter_by(id=id))
    if name != user_details.UserName:
        return jsonify({"message": "Wrong User Name"}), 400
    if email != user_details.email:
        return jsonify({"message": "Wrong Email"}), 400
    user_details.Apply = 'Yes'
    user_details.Store_remark = 'You have applied for the store and your application is under process.'
    db.session.commit()
    new_application = Store_Application(Name=name,email=email,Store_name=store_name,id=id)
    try:
        db.session.add(new_application)
        db.session.commit()
        cache.clear()
        return jsonify({"message":"Success"}), 200
    except:
        return jsonify({"message":"Server Error"}), 500

@app.route('/approve_application', methods=['POST'])
@auth_required("token")
@roles_required("admin")
def approve_application():
    applicationID = request.json['applicationID']
    application = db.one_or_404(db.select(Store_Application).filter_by(ApplicationID=applicationID))
    user_details = db.one_or_404(db.select(User).filter_by(id=application.id))
    roles_users = db.one_or_404(db.select(RolesUsers).filter_by(user_id=application.id))
    user_details.Role = 'Store Manager'
    user_details.Store_remark = 'Hurray! your application is approved. You can now sell products on our platform. Happy Selling!!'
    roles_users.role_id = 2
    db.session.commit()
    new_store = Store(StoreName=application.Store_name,id=application.id)
    try:
        db.session.add(new_store)
        db.session.delete(application)
        db.session.commit()
        cache.clear()
        return jsonify({"message":"Success"}), 200
    except:
        return jsonify({"message":"Server Error"}), 500

@app.route('/reject_application', methods=['POST'])
@auth_required("token")
@roles_required("admin")
def reject_application():
    applicationID = request.json['applicationID']
    application = db.one_or_404(db.select(Store_Application).filter_by(ApplicationID=applicationID))
    user_details = db.one_or_404(db.select(User).filter_by(id=application.id))
    user_details.Store_remark = 'Sorry, your application is rejected. If you wish, you can re-apply.'
    user_details.Apply = 'No'
    db.session.commit()
    try:
        db.session.delete(application)
        db.session.commit()
        cache.clear()
        return jsonify({"message":"Success"}), 200
    except:
        return jsonify({"message":"Server Error"}), 500
    
@app.route('/add_category',methods=['POST'])
@auth_required("token")
@roles_required("admin")
def add_category():
    cat_name = request.json['category_name']
    if not cat_name:
        return jsonify({"message": "Category Name Not Entered"}), 400
    try:
        new_cat = Category(CatName=cat_name)
        db.session.add(new_cat)
        db.session.commit()
        cache.clear()
        return jsonify({"message":"Success"}), 200
    except:
        return jsonify({"message":"Server Error"}), 500

@app.route('/edit_category', methods=['POST'])
@auth_required("token")
@roles_required("admin")
def edit_category():
    old_name = request.json['old_name']
    new_name = request.json['new_name']
    if not old_name or not new_name:
        return jsonify({"message": "Field Missing"}), 400
    try:
        cat = Category.query.filter(Category.CatName == old_name).scalar()
        cat.CatName = new_name
        db.session.commit()
        cache.clear()
        return jsonify({"message":"Success"}), 200
    except:
        return jsonify({"message":"Server Error"}), 500

@app.route('/remove_category', methods=['POST'])
@auth_required("token")
@roles_required("admin")
def remove_category():
    cat = request.json['cat_name']
    if not cat:
        return jsonify({"message": "Select a category to remove"}), 400
    try:
        remove_cat = Category.query.filter(Category.CatName == cat).scalar()
        db.session.delete(remove_cat)
        db.session.commit()
        cache.clear()
        return jsonify({"message":"Success"}), 200
    except:
        return jsonify({"message":"Server Error"}), 500

@app.route('/remove_product', methods=['POST'])
@auth_required("token")
@roles_required("store_manager")
def remove_product():
    product_id = request.json['product_id']
    try:
        remove_prod = Product.query.filter(Product.ProductID == product_id).scalar()
        db.session.delete(remove_prod)
        db.session.commit()
        cache.clear()
        return jsonify({"message":"Success"}), 200
    except:
        return jsonify({"message":"Server Error"}), 500

@app.route('/add_product', methods=['POST'])
@auth_required("token")
@roles_required("store_manager")
def add_product():
    store_id = request.json['storeID']
    product_name = request.json['product_name']
    manufacturer = request.json['manufacturer']
    expiry_date = request.json['expiry_date']
    unit_weight = request.json['unit_weight']
    unit_measurement = request.json['unit_measurement']
    unit_price = request.json['unit_price']
    stock = request.json['stock']
    category = request.json['category']
    if not product_name or not unit_weight or not unit_measurement or not unit_price or not stock or not category:
        return jsonify({"message": "Empty Fields"}), 400
    
    try:
        new_product = Product(ProductName=product_name,Manufacturer=manufacturer,Expiry_date=expiry_date,Unit_weight=unit_weight,Unit_measurement=unit_measurement,Unit_price=unit_price,Category=category,Store=store_id,Stock=stock)
        db.session.add(new_product)
        db.session.commit()
        cache.clear()
        return jsonify({"message":"Success"}), 200
    except:
        return jsonify({"message":"Server Error"}), 500

@app.route('/edit_product', methods=['POST'])
@auth_required("token")
@roles_required("store_manager")
def edit_product():
    store_id = request.json['storeID']
    product_id = request.json['productID']
    product_name = request.json['product_name']
    manufacturer = request.json['manufacturer']
    expiry_date = request.json['expiry_date']
    unit_weight = request.json['unit_weight']
    unit_measurement = request.json['unit_measurement']
    unit_price = request.json['unit_price']
    stock = request.json['stock']
    category = request.json['category']
    if not product_name or not unit_weight or not unit_measurement or not unit_price or not stock or not category:
        return jsonify({"message": "Empty Fields"}), 400
    product = Product.query.filter(Product.ProductID == product_id,Product.Store == store_id).scalar()
    product.ProductName = product_name
    product.Manufacturer = manufacturer
    product.Expiry_date = expiry_date
    product.Unit_weight = unit_weight
    product.Unit_measurement = unit_measurement
    product.Unit_price = unit_price
    product.Stock = stock
    product.Category = category
    try:
        db.session.commit()
        cache.clear()
        return jsonify({"message":"Success"}), 200
    except:
        return jsonify({"message":"Server Error"}), 500

@app.route('/request_add_category', methods=['POST'])
@auth_required("token")
@roles_required("store_manager")
def request_add_category():
    cat_name = request.json['cat_name']
    store_id = request.json['storeID']
    user_id = request.json['id']
    if not cat_name:
        return jsonify({"message": "Empty Fields"}), 400
    try:
        new_request = Request(id=user_id,StoreID=store_id,Cat_name=cat_name,New_cat_name="-",Type="Add")
        db.session.add(new_request)
        db.session.commit()
        cache.clear()
        return jsonify({"message":"Success"}), 200
    except:
        return jsonify({"message":"Server Error"}), 500

@app.route('/request_edit_category', methods=['POST'])
@auth_required("token")
@roles_required("store_manager")
def request_edit_category():
    old_name = request.json['old_name']
    new_name = request.json['new_name']
    store_id = request.json['storeID']
    user_id = request.json['id']
    if not old_name or not new_name:
        return jsonify({"message": "Select a category to edit"}), 400
    try:
        new_request = Request(id=user_id,StoreID=store_id,Cat_name=old_name,New_cat_name=new_name,Type="Edit")
        db.session.add(new_request)
        db.session.commit()
        cache.clear()
        return jsonify({"message":"Success"}), 200
    except:
        return jsonify({"message":"Server Error"}), 500

@app.route('/request_remove_category', methods=['POST'])
@auth_required("token")
@roles_required("store_manager")
def request_remove_category():
    cat_name = request.json['cat_name']
    store_id = request.json['storeID']
    user_id = request.json['id']
    if not cat_name:
        return jsonify({"message": "Select a category to remove"}), 400
    try:
        new_request = Request(id=user_id,StoreID=store_id,Cat_name=cat_name,New_cat_name="-",Type="Remove")
        db.session.add(new_request)
        db.session.commit()
        cache.clear()
        return jsonify({"message":"Success"}), 200
    except:
        return jsonify({"message":"Server Error"}), 500

@app.route('/delete_request', methods=['POST'])
@auth_required("token")
@roles_required("admin")
def delete_request():
    request_id = request.json['requestID']
    if not request_id:
        return jsonify({"message": "Select a request to remove"}), 400
    try:
        req = Request.query.filter(Request.RequestID == request_id).scalar()
        db.session.delete(req)
        db.session.commit()
        cache.clear()
        return jsonify({"message":"Success"}), 200
    except:
        return jsonify({"message":"Server Error"}), 500
