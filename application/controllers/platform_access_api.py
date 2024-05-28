from flask import render_template, request, jsonify
from flask import current_app as app
from application.data.models import *
from application.data.sec import datastore
from werkzeug.security import generate_password_hash, check_password_hash

@app.route('/', methods = ['GET'])
def home():
    return render_template("application.html")

@app.route('/user_login',methods=['POST'])
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message": "email not provided"}), 400

    user = datastore.find_user(email=email)

    if not user:
        return jsonify({"message": "User Not Found"}), 404

    if check_password_hash(user.password, data.get("password")):
        user_details = db.one_or_404(db.select(User).filter_by(email=email))
        return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name, "user_id": user_details.id})
    else:
        return jsonify({"message": "Wrong Password"}), 400

@app.route('/signup', methods=['POST'])
def signup():
    name = request.json['name']
    email = request.json['email']
    password = request.json['password']

    if not name:
        return jsonify({"message": "name not provided"}), 400
    elif not email:
        return jsonify({"message": "email not provided"}), 400
    elif not password:
        return jsonify({"message": "password not provided"}), 400
    
    try:
        datastore.create_user(UserName=name,email=email,password=generate_password_hash(password),roles=["shopper"])
        db.session.commit()
        return jsonify({"message":"Success"}), 200
    except:
        return jsonify({"message":"Server Error"}), 500