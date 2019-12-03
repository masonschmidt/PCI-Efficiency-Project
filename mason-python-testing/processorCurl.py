import pycurl, json
import time

BASE_URL = "http://127.0.0.1:5000/generator/"
HARD_CODE_URL = "http://127.0.0.1:5000/generator/1/fuelConsumed"
num_gens = 2
num_gens = num_gens + 1

start_times = dict()
power_totals = dict()
fuel_totals = dict()

def on_receive_fuel(data):
    content = json.loads(data)
    generator = content['generator']
    if not ('generator{}fuel'.format(generator) in start_times):
        start_times['generator{}fuel'.format(generator)] = content['time']

    if 'generator{}'.format(generator) not in fuel_totals:
        fuel_totals['generator{}'.format(generator)] = 0
    fuel_temp = fuel_totals['generator{}'.format(generator)]
    fuel_totals['generator{}'.format(generator)] = fuel_temp + int(content['fuelConsumed'])
    print(fuel_totals['generator{}'.format(generator)])


def on_receive_power(data):
    content = json.loads(data)
    generator = content['generator']
    if not ('generator{}power'.format(generator) in start_times):
        start_times['generator{}power'.format(generator)] = content['time']

    if 'generator{}'.format(generator) not in power_totals:
        power_totals['generator{}'.format(generator)] = 0

    power_temp = power_totals['generator{}'.format(generator)]
    power_totals['generator{}'.format(generator)] = power_temp + int(content['powerProduced'])


# Pre-allocate a list of curl objects
m = pycurl.CurlMulti()

for gen_num in range(1, num_gens):
    conn_fuel = pycurl.Curl()
    conn_fuel.setopt(pycurl.URL, '{}{}/fuelConsumed'.format(BASE_URL, gen_num))
    conn_fuel.setopt(pycurl.WRITEFUNCTION, on_receive_fuel)
    m.add_handle(conn_fuel)

    conn_power = pycurl.Curl()
    conn_power.setopt(pycurl.URL, '{}{}/powerProduced'.format(BASE_URL, gen_num))
    conn_power.setopt(pycurl.WRITEFUNCTION, on_receive_power)
    m.add_handle(conn_power)

while 1:
    ret, num_handles = m.perform()
    time.sleep(0.1)
