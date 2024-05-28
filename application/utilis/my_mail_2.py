from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import smtplib

SMTP_SERVER_HOST = "localhost"
SMTP_SERVER_PORT = 1025
SENDER_EMAIL = "admin@email.com"
SENDER_PASSWORD = "#*Sat@29"

def send_mail_2(to, subject, message_body,filename):
    msg = MIMEMultipart()
    msg["To"] = to
    msg["From"] = SENDER_EMAIL
    msg["Subject"] = subject

    msg.attach(MIMEText(message_body, "html"))

    attachment = open(filename, "rb")

    part = MIMEBase('application', 'octet-stream')
    part.set_payload((attachment).read())
    encoders.encode_base64(part)
    part.add_header('Content-Disposition', "attachment; filename= %s" % filename)

    msg.attach(part)

    server = smtplib.SMTP(host=SMTP_SERVER_HOST, port=SMTP_SERVER_PORT)
    server.login(user=SENDER_EMAIL, password=SENDER_PASSWORD)
    server.send_message(msg)
    server.quit()