import pycurl, json

BASE_URL = "http://127.0.0.1:5000/"
HARD_CODE_URL = "http://127.0.0.1:5000/generator/1/fuelConsumed"

def on_receive(data):
    content = json.loads(data)
    print(content)
    print(content["fuelConsumed"])

conn = pycurl.Curl()
conn.setopt(pycurl.URL, HARD_CODE_URL)
conn.setopt(pycurl.WRITEFUNCTION, on_receive)
conn.perform()
