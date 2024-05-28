# Importing the required packages.
from flask import Flask
from flask_security import Security
from application.data.sec import datastore
from application import config
from application.data.models import db
from application.jobs.workers import create_celery_app
import flask_excel as excel
from application.utilis.cache import cache

# Initializing the app
app = Flask(__name__)

# Setting the configuration of the app
app.config.from_object(config)
app.app_context().push()

# Initalizing the app with the database extension
db.init_app(app)
app.app_context().push() 

# Initializing the app with the flask_excel extension
excel.init_excel(app)
app.app_context().push()

# Setup Flask-Security
app.security = Security(app, datastore)
app.app_context().push()

# Creating the celery app within the flask app context
cel_app = create_celery_app(app)
app.app_context().push()

# Initializing the cache
cache.init_app(app)
app.app_context().push()

# Platform Access APIs
from application.controllers.platform_access_api import *

# Data Access APIs
from application.controllers.data_access_api import *

# Action Performing APIs
from application.controllers.action_performing_api import *

# Endpoints for the Background Task with Celery & Redis
from application.controllers.celery_endpoint import *

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, port=5000)