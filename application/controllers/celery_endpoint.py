import application.jobs.tasks as tasks
from flask import current_app as app
from celery.result import AsyncResult
from celery.schedules import crontab
from flask import jsonify, send_file
from celery import current_app as cel_app
from flask_security import auth_required, roles_required

@cel_app.on_after_configure.connect
def daily_reminder(sender, **kwargs):
    # Sends alert everyday at 7:30 am.
    sender.add_periodic_task(
        crontab(hour=13, minute=7),
        tasks.send_daily_reminder.s(),
        name= "Send Daily Reminder"
    )

@cel_app.on_after_configure.connect
def monthly_activity_report(sender, **kwargs):
    # Execute on the first day of every month.
    sender.add_periodic_task(
        crontab(hour=13,minute=7, day_of_month='28'),
        tasks.send_activity_report.s(),
        name = "Send Activity Report"
    )

@app.get('/download_prod_details/<int:StoreID>')
@auth_required("token")
@roles_required("store_manager")
def download_prod_details(StoreID):
    task = tasks.download_prod_details.delay(StoreID)
    return jsonify({"task-id": task.id})

@app.get('/get-csv/<task_id>')
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        return send_file(filename, as_attachment=True)
    else:
        return jsonify({"message": "Task Pending"}), 404
