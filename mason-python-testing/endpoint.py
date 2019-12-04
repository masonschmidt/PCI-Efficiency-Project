import time
import random
from random import randrange
from datetime import datetime
from datetime import timezone
from flask import Flask, Response, stream_with_context, g, session
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.memory import MemoryJobStore
from apscheduler.executors.pool import ThreadPoolExecutor
from pytz import utc
import redis
import json

#constant to specify how many generators to start with the server
number_of_generators = 500
number_of_generators = number_of_generators + 1
#constant to specify how long between data updates
delay_fuel = 5
delay_power = 10

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

#a redis_connection to the background storage that all instances share.
def get_redis_connection():
    if not hasattr(g, 'redis_conn'):
        session.redis_conn = redis.Redis()
    return session.redis_conn

#basically creates the flask server
def create_app():
    app = Flask(__name__)

    with app.app_context():
        get_redis_connection()

    return app

app = create_app()

#starts the scheduler
scheduler.start()

#the function the scheduler runs to update the values for each generator
def putGeneratorFuelValues():
    redis_conn = get_redis_connection()
    for i in range(1,number_of_generators):
        redis_conn.publish('generator{}fuel'.format(i),
        '{}'.format(randrange(100)).encode('utf-8'))

#the function the scheduler runs to update the values for each generator
def putGeneratorPowerValues():
    redis_conn = get_redis_connection()
    for i in range(1,number_of_generators):
        redis_conn.publish('generator{}power'.format(i),
        '{}'.format(randrange(100, 340)).encode('utf-8'))

#adds the function putGeneratosValue to the scheduler to run every 5 seconds
job_fuel = scheduler.add_job(putGeneratorFuelValues, 'interval', seconds=delay_fuel)
job_power = scheduler.add_job(putGeneratorPowerValues, 'interval', seconds=delay_power)

# when the user inputs the path .../generator/someidvalue/fuelConsumed this
#function begins yielding generator values every 5 seconds for fuel consumed
@app.route('/generator/<id>/fuelConsumed')
def getFuelConsumed(id):
    def generate():
        redis_conn = get_redis_connection()
        pubsub = redis_conn.pubsub()
        pubsub.subscribe(['generator{}fuel'.format(id)])
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
            pubsub.unsubscribe()
            pubsub.close()
    return Response(generate(), mimetype='text/plain')

# when the user inputs the path .../generator/someidvalue/powerProduced this
#function begins yielding generator values every 5 seconds for power produced
@app.route('/generator/<id>/powerProduced')
def getPowerProduced(id):
    def generate():
        redis_conn = get_redis_connection()
        pubsub = redis_conn.pubsub()
        pubsub.subscribe(['generator{}power'.format(id)])
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
            pubsub.unsubscribe()
            pubsub.close()
    return Response(generate(), mimetype='text/plain')


#this is here if you want to run the script instead of running through flask
if __name__ == '__main__':
    app.run()
