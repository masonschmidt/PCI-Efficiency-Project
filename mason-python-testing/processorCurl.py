import pycurl, json

BASE_URL = "http://127.0.0.1:5000/generator/"
HARD_CODE_URL = "http://127.0.0.1:5000/generator/1/fuelConsumed"
num_gens = 100
num_gens = num_gens + 1

def on_receive_fuel(data):
    content = json.loads(data)
    print(content)

def on_receive_power(data):
    content = json.loads(data)

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
    m.perform()
