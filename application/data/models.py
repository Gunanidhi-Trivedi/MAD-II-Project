from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin

db = SQLAlchemy()

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('User.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class User(db.Model, UserMixin):
    __tablename__ = 'User'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    UserName = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    Role = db.Column(db.String, nullable=False, default="User")
    Apply = db.Column(db.String, nullable=False, default="No")
    Store_remark = db.Column(db.String, nullable=True)
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role', secondary='roles_users', backref=db.backref('User', lazy='dynamic'))
    cart = db.relationship("Cart", backref='User', lazy='dynamic', primaryjoin="User.id == Cart.id")

class Category(db.Model):
    __tablename__ = 'Category'
    CatID = db.Column(db.Integer, autoincrement=True, primary_key=True)
    CatName = db.Column(db.String, nullable=False, unique=True)
    Products = db.relationship("Product", backref='Product_Category',cascade="all, delete", lazy='dynamic', primaryjoin="Category.CatName == Product.Category") # Each categrory has one to many relationship with products.

class Product(db.Model):
    __tablename__ = 'Product'
    ProductID = db.Column(db.Integer, autoincrement=True, primary_key=True)
    ProductName = db.Column(db.String, nullable=False)
    Manufacturer = db.Column(db.String, nullable=True)
    Expiry_date = db.Column(db.String, nullable=True)
    Unit_weight = db.Column(db.Double, nullable=False)
    Unit_measurement = db.Column(db.String, nullable=False)
    Unit_price = db.Column(db.Double, nullable=False)
    Category = db.Column(db.String, db.ForeignKey("Category.CatName"), nullable=False)
    Store = db.Column(db.Integer, db.ForeignKey("Store.StoreID"),nullable=True)
    Stock = db.Column(db.Integer, nullable=True)

class Cart(db.Model):
    __tablename__ = 'Cart'
    CartID = db.Column(db.Integer, autoincrement=True, primary_key=True)
    id = db.Column(db.Integer, db.ForeignKey("User.id"), nullable=False)
    ProductID = db.Column(db.Integer, db.ForeignKey("Product.ProductID"), nullable=False)
    Quantity = db.Column(db.Integer, nullable=False)

class Store(db.Model):
    __tablename__ = 'Store'
    StoreID = db.Column(db.Integer, autoincrement=True, primary_key=True)
    StoreName = db.Column(db.String, nullable=False)
    id = db.Column(db.Integer, db.ForeignKey("User.id"), nullable=False)
    Products = db.relationship("Product", backref="Product's_seller", cascade="all, delete", lazy='dynamic', primaryjoin="Store.StoreID == Product.Store")

class Store_Application(db.Model):
    __tablename__ = 'Store_Application'
    ApplicationID = db.Column(db.Integer, autoincrement=True, primary_key=True)
    Name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    Store_name = db.Column(db.String, nullable=False)
    id = db.Column(db.Integer, db.ForeignKey("User.id"), nullable=False)

class Orders(db.Model):
    __tablename__ = 'Orders'
    OrderID = db.Column(db.Integer, autoincrement=True, primary_key=True)
    id = db.Column(db.Integer, db.ForeignKey("User.id"), nullable=False)
    ProductID = db.Column(db.Integer, db.ForeignKey("Product.ProductID"), nullable=False)
    Quantity = db.Column(db.Integer, nullable=False)
    Date = db.Column(db.String, nullable=False)

class Request(db.Model):
    __tablename__ = 'Request'
    RequestID = db.Column(db.Integer, autoincrement=True, primary_key=True)
    id = db.Column(db.Integer, nullable=False)
    StoreID = db.Column(db.Integer, nullable=False)
    Cat_name = db.Column(db.String, nullable=False)
    New_cat_name = db.Column(db.String, nullable=False)
    Type = db.Column(db.String, nullable=False)