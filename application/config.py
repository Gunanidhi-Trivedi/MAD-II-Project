# SQLite database configuration relative to the app instance folder
SQLALCHEMY_DATABASE_URI = 'sqlite:///MyGroceryStoreDB.db'
# Generated using secrets.token_urlsafe()
SECRET_KEY = 'U27tl54cvSwy8X_0cnPw2oOqExSbrFN4dMdOmk9dDOU'
# Generated a salt using: secrets.SystemRandom().getrandbits(128)
SECURITY_PASSWORD_SALT = '43908036545860023342522554710463755873'
SECURITY_EMAIL_VALIDATOR_ARGS = {"check_deliverability": False}
# SECURITY_REGISTERABLE = True
# SECURITY_CONFIRMABLE = False
# SECURITY_SEND_REGISTER_EMAIL = False
# SECURITY_UNAUTHORIZED_VIEW = None
SQLALCHEMY_TRACK_MODIFICATIONS = False
WTF_CSRF_ENABLED = False
SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'
CACHE_TYPE = "RedisCache"
CACHE_REDIS_HOST = "localhost"
CACHE_REDIS_PORT = 6379
CACHE_REDIS_DB = 3
CACHE_DEFAULT_TIMEOUT = 300