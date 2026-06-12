bind = "127.0.0.1:5000"
workers = 4
worker_class = "sync"
timeout = 120
keepalive = 5
errorlog = "/var/www/studynotes/backend/logs/gunicorn_error.log"
accesslog = "/var/www/studynotes/backend/logs/gunicorn_access.log"
loglevel = "info"
