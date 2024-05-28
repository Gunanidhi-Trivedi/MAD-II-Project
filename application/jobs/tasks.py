from celery import shared_task
import time
from application.utilis.my_mail import send_mail
from application.utilis.my_mail_2 import send_mail_2
from application.data.models import *
from datetime import date, timedelta
from flask import render_template
import calendar
import flask_excel as excel

@shared_task()
def send_daily_reminder():
    yesterday_dt = date.today() - timedelta(days=1)
    yesterday_orders = Orders.query.filter(Orders.Date == yesterday_dt).all()
    user_list = []
    for orders in yesterday_orders:
        if orders.id not in user_list:
            user_list.append(orders.id)
    all_users = User.query.all()
    call_user = []
    for users in all_users:
        if users.id not in user_list and users.id != 4:
            call_user.append(users)
    for user in call_user:
        text_msg = render_template("daily_reminder.html", user=user.UserName)
        send_mail(user.email, "Don't miss out exciting offers on grocery", text_msg)

@shared_task()
def send_activity_report():
    user_deatils = User.query.all()
    yesterday_dt = date.today() - timedelta(days=1)
    crr_year = yesterday_dt.year
    crr_month = yesterday_dt.month
    for user in user_deatils:
        date_str = date(crr_year,crr_month,1)
        date_end = date(crr_year,crr_month,calendar.monthrange(crr_year, crr_month)[1])
        orders = Orders.query.filter(Orders.id == user.id, Orders.Date>=date_str, Orders.Date<=date_end).all()
        order_list = []
        total_exp = 0
        for prod in orders:
            prod_details = Product.query.filter(Product.ProductID == prod.ProductID).scalar()
            store = Store.query.filter(Store.StoreID==prod_details.Store).scalar()
            order_list.append(dict(name=prod_details.ProductName,manufacturer=prod_details.Manufacturer,seller=store.StoreName,rate=prod_details.Unit_price,quantity=prod.Quantity,amount=prod_details.Unit_price*prod.Quantity,date=prod.Date,unit_weight=str(prod_details.Unit_weight) +" "+ prod_details.Unit_measurement))
            total_exp += prod_details.Unit_price*prod.Quantity
        text_msg = render_template("activity_report.html", user=user.UserName, order_list=order_list, total_exp=total_exp, email=user.email, month = calendar.month_name[crr_month], year= crr_year)
        send_mail(user.email, "Monthly Activity Report", text_msg)

@shared_task(ignore_result=False)
def download_prod_details(StoreID):
    products = Product.query.filter(Product.Store == StoreID).all()
    product_catalogue = []
    for product in products:
        product_catalogue.append({'productID': product.ProductID,'name' : product.ProductName,'category' : product.Category,'manufacturer' : product.Manufacturer,'expiry_date' : product.Expiry_date,'price' : product.Unit_price,'stock' : product.Stock,'weight' : str(product.Unit_weight) +" "+ product.Unit_measurement})
    
    csv_output = excel.make_response_from_records(product_catalogue,"csv",200,"product_details")
    # time.sleep(5)
    filename = "product_details.csv"

    with open(filename, 'wb') as f:
        f.write(csv_output.data)
    
    store_details = Store.query.filter(Store.StoreID == StoreID).scalar()
    user_details = User.query.filter(User.id == store_details.id).scalar()
    text_msg = render_template("download_alert.html", user=user_details.UserName)
    send_mail_2(user_details.email, "Product Details Downloaded",text_msg,filename)

    return filename
