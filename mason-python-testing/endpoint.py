import time
import random
from random import randrange
from datetime import datetime
from flask import Flask, Response, g

app = Flask(__name__)

@app.route('/generator/<id>/fuelConsumed')
def getFuelConsumed(id):
    def generate():
        value = randrange(100)
        while True:
            current_time = "{}".format(datetime.now().isoformat())
            value = randrange(100)
            yield "generator: {}\ntime: {}\nfuelConsumed: {}\n".format(id, current_time, value)
            time.sleep(5)
    return Response(generate(), mimetype='text/plain')

@app.route('/generator/<id>/powerProduced')
def getPowerProduced(id):
    def generate():
        value = randrange(100)
        while True:
            current_time = "{}".format(datetime.now().isoformat())
            value = randrange(100)
            yield "generator: {}\ntime: {}\npowerProduced: {}\n".format(id, current_time, value)
            time.sleep(10)
    return Response(generate(), mimetype='text/plain')

if __name__ == '__main__':
    app.run()
