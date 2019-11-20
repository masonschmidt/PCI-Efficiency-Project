import time
import random
from random import randrange
from datetime import datetime
from flask import Flask, Response, g
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.memory import MemoryJobStore
from apscheduler.executors.pool import ThreadPoolExecutor
from pytz import utc
import redis

app = Flask(__name__)

jobstores = {
    'default': MemoryJobStore()
}

executors = {
    'default': ThreadPoolExecutor(20)
}

job_defaults = {
    'coalesce': False,
    'max_instances': 3
}

scheduler = BackgroundScheduler(jobstores=jobstores, executors=executors, job_defaults=job_defaults, time=utc)

conn = redis.Redis()

scheduler.start()

def putGeneratorValues():
    for i in range(1,10):
        conn.set('generator{}fuel'.format(i), randrange(100))
        conn.set('generator{}power'.format(i), randrange(100))

job = scheduler.add_job(putGeneratorValues, 'interval', seconds=5)

@app.route('/generator/<id>/fuelConsumed')
def getFuelConsumed(id):
    def generate():
        value = randrange(100)
        while True:
            current_time = "{}".format(datetime.now().isoformat())
            value = randrange(100)
            yield "generator: {}\ntime: {}\nfuelConsumed: {}\ntest: {}\n".format(id, current_time, value, conn.get('generator{}fuel'.format(id)))
            time.sleep(5)
    return Response(generate(), mimetype='text/plain')

@app.route('/generator/<id>/powerProduced')
def getPowerProduced(id):
    def generate():
        value = randrange(100)
        while True:
            current_time = "{}".format(datetime.now().isoformat())
            value = randrange(100)
            yield "generator: {}\ntime: {}\npowerProduced: {}\ntest: {}\n".format(id, current_time, value, , conn.get('generator{}power'.format(id)))
            time.sleep(10)
    return Response(generate(), mimetype='text/plain')




if __name__ == '__main__':
    app.run()
