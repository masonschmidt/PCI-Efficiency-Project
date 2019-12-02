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
import json

#constant to specify how many generators to start with the server
number_of_generators = 10

#basically creates the flask server
app = Flask(__name__)

#this section is for details about the scheduler that is updating the
#generators in the background
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

#actually creates the scheduler
scheduler = BackgroundScheduler(jobstores=jobstores, executors=executors,
job_defaults=job_defaults, time=utc)

#a connection to the background storage that all instances share.
conn = redis.Redis()

#starts the scheduler
scheduler.start()

#the function the scheduler runs to update the values for each generator
def putGeneratorValues():
    for i in range(1,number_of_generators):
        conn.set('generator{}fuel'.format(i),
        '{}'.format(randrange(100)).encode('utf-8'))
        conn.set('generator{}power'.format(i),
        '{}'.format(randrange(100)).encode('utf-8'))

#adds the function putGeneratosValue to the scheduler to run every 5 seconds
job = scheduler.add_job(putGeneratorValues, 'interval', seconds=5)

# when the user inputs the path .../generator/someidvalue/fuelConsumed this
#function begins yielding generator values every 5 seconds for fuel consumed
@app.route('/generator/<id>/fuelConsumed')
def getFuelConsumed(id):
    def generate():
        value = randrange(100)
        while True:
            current_time = "{}".format(datetime.now().isoformat())
            value = randrange(100)
            yield json.dumps({'generator': id,
            'time': current_time,
            'fuelConsumed': value,
            'testValue': conn.get('generator{}fuel'.format(id)).decode('utf-8')})
            #yield "{ \"generator\":{}}\n{\"time\":{}}\n{\"fuelConsumed\":{}}\n{\"test\":{}}\n".format(id, current_time, value, conn.get('generator{}fuel'.format(id)))
            time.sleep(5)
    return Response(generate(), mimetype='text/plain')

# when the user inputs the path .../generator/someidvalue/powerProduced this
#function begins yielding generator values every 5 seconds for power produced
@app.route('/generator/<id>/powerProduced')
def getPowerProduced(id):
    def generate():
        value = randrange(100)
        while True:
            current_time = "{}".format(datetime.now().isoformat())
            value = randrange(100)
            yield json.dumps({'generator': id,
            'time': current_time,
            'powerProduced': value,
            'testValue': conn.get('generator{}power'.format(id)).decode('utf-8')})
            #yield "generator: {}\ntime: {}\npowerProduced: {}\ntest: {}\n".format(id, current_time, value, conn.get('generator{}power'.format(id)))
            time.sleep(5)
    return Response(generate(), mimetype='text/plain')

#this is here if you want to run the script instead of running through flask
if __name__ == '__main__':
    app.run()
