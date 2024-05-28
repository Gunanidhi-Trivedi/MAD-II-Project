from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

SMTP_SERVER_HOST = "localhost"
SMTP_SERVER_PORT = 1025
SENDER_EMAIL = "admin@email.com"
SENDER_PASSWORD = "#*Sat@29"

def send_mail(to, subject, message_body):
    msg = MIMEMultipart()
    msg["To"] = to
    msg["From"] = SENDER_EMAIL
    msg["Subject"] = subject

    msg.attach(MIMEText(message_body, "html"))

    server = smtplib.SMTP(host=SMTP_SERVER_HOST, port=SMTP_SERVER_PORT)
    server.login(user=SENDER_EMAIL, password=SENDER_PASSWORD)
    server.send_message(msg)
    server.quit()