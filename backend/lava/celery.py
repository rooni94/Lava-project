import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "lava.settings")

app = Celery("lava")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()


@app.task
def ping():
    return "pong"
