import time
import random
from random import randrange
from datetime import datetime
from flask import Flask, Response

app = Flask(__name__)

@app.route('/')
def doyouhavethetime():
    def generate():
        while True:
            current_time = "{}".format(datetime.now().isoformat())
            value = randrange(100)
            yield "time: {} \nvalue: {}\n".format(current_time, value)
            time.sleep(5)
    return Response(generate(), mimetype='text/plain')
