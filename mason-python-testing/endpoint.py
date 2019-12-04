import time
import random
from random import randrange
from datetime import datetime
from datetime import timezone
from flask import Flask, Response, stream_with_context
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.memory import MemoryJobStore
from apscheduler.executors.pool import ThreadPoolExecutor
from pytz import utc
import redis
import json

#constant to specify how many generators to start with the server
number_of_generators = 100
number_of_generators = number_of_generators + 1
#constant to specify how long between data updates
delay_fuel = 5
delay_power = 10

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
def putGeneratorFuelValues():
    for i in range(1,number_of_generators):
        conn.publish('generator{}fuel'.format(i),
        '{}'.format(randrange(100)).encode('utf-8'))

#the function the scheduler runs to update the values for each generator
def putGeneratorPowerValues():
    for i in range(1,number_of_generators):
        conn.publish('generator{}power'.format(i),
        '{}'.format(randrange(100, 340)).encode('utf-8'))

#adds the function putGeneratosValue to the scheduler to run every 5 seconds
job_fuel = scheduler.add_job(putGeneratorFuelValues, 'interval', seconds=delay_fuel)
job_power = scheduler.add_job(putGeneratorPowerValues, 'interval', seconds=delay_power)

# when the user inputs the path .../generator/someidvalue/fuelConsumed this
#function begins yielding generator values every 5 seconds for fuel consumed
@app.route('/generator/<id>/fuelConsumed')
def getFuelConsumed(id):
    pubsub = conn.pubsub()
    pubsub.subscribe(['generator{}fuel'.format(id)])
    def generate():
        try:
            while True:
                for item in pubsub.listen():
                    if item['data'] != 1:
                        current_time = datetime.now(timezone.utc).isoformat()
                        yield json.dumps({
                        'generator': id,
                        'time': current_time,
                        'fuelConsumed': item['data'].decode('utf-8')})
        except GeneratorExit:
            pubsub.close()
    return Response(generate(), mimetype='text/plain')

# when the user inputs the path .../generator/someidvalue/powerProduced this
#function begins yielding generator values every 5 seconds for power produced
@app.route('/generator/<id>/powerProduced')
def getPowerProduced(id):
    pubsub = conn.pubsub()
    pubsub.subscribe(['generator{}power'.format(id)])
    def generate():
        try:
            while True:
                for item in pubsub.listen():
                    if item['data'] != 1:
                        current_time = datetime.now(timezone.utc).isoformat()
                        yield json.dumps({
                        'generator': id,
                        'time': current_time,
                        'powerProduced': item['data'].decode('utf-8')})
        except GeneratorExit:
            pubsub.close()
    return Response(generate(), mimetype='text/plain')


#this is here if you want to run the script instead of running through flask
if __name__ == '__main__':
    app.run()
