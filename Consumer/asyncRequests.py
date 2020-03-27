import aiohttp
import asyncio
import json
import boto3
import time
import dateutil.parser
from datetime import datetime
from datetime import timezone
from botocore.client import Config

#Constansts for use later.
POWER_BUCKET = "power-bucket-test"
FUEL_BUCKET = "fuel-bucket-test"
EFFICIENCY_BUCKET = "pci-effciency-project-test"
BUCKET_ACCESS_KEY = "AKIARKHXIANXJPYDG6NV"
BUCKET_SECRET_ACCESS_KEY = "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"
EFFICIENCY_CONSTANT = 0.29329722222222
BASE_URL = 'http://127.0.0.1:3001'

NUMBER_OF_GENERATORS = 2

AWS_ON = False
AWS_EFF_ON = False

#Dictionary to store data using the url as the key
generator_data = dict()

def create_key(gen_num, time):
    timestamp = dateutil.parser.parse(time)

    timestamp = timestamp.strftime("%Y-%m-%d %H:%M")

    return 'generator{:04d}/{}.json'.format(gen_num, timestamp)

def create_average(data, key):
    avg = 0
    total = 0
    for data_point in data:
        power = data_point[key]
        total = total + power
    avg = total/len(data)
    return avg


def process_eff(gen_num, s3):
    power_data = generator_data["{}/generator/{}/powerProduced".format(BASE_URL, gen_num)]
    fuel_data = generator_data["{}/generator/{}/fuelConsumed".format(BASE_URL, gen_num)]
    generator_data["{}/generator/{}/powerProduced".format(BASE_URL, gen_num)] = []
    generator_data["{}/generator/{}/fuelConsumed".format(BASE_URL, gen_num)] = []

    start_time_power = power_data[0]['time']
    recent_time_power = power_data[11]['time']
    start_time_fuel = fuel_data[0]['time']
    recent_time_fuel = fuel_data[5]['time']

    power_avg = create_average(power_data, 'powerProduced')

    fuel_avg = create_average(power_data, 'fuelConsumed')

    efficiency = (power_avg*EFFICIENCY_CONSTANT)/fuel_avg

    efficiency_json = json.dumps({
    'generator': gen_num,
    'startTimeFuel': start_time_fuel,
    'startTimePower': start_time_power,
    'recentTimeFuel': recent_time_fuel,
    'recentTimePower': recent_time_power,
    'powerTotal': power_total,
    'fuelTotal': fuel_total,
    'avgFuel': fuel_avg,
    'avgPower': power_avg,
    'efficiency': efficiency,
    }, indent=2, sort_keys=True)

    print(efficiency_json)

    print("Sending efficiency data for generator {}...".format(gen_num))

    key = create_key(gen_num, recent_time_power)

    if AWS_ON or AWS_EFF_ON:
        s3.Bucket(EFFICIENCY_BUCKET).put_object(Key=key, Body=efficiency_json)

    print("Efficiency data sent for generator {}".format(gen_num))




#Open a connection with the generator server asynchonously
async def get(url, gen_num, data_type, s3):
    #Actual request to the endpoint
    #Connector with no connection limit
    conn = aiohttp.TCPConnector(limit=0)
    #no timeout
    timeout = aiohttp.ClientTimeout(total=0)
    #Create a session for our connections with the connector and timeout
    async with aiohttp.ClientSession(connector=conn, timeout=timeout) as session:
        async with session.get(url) as response:
            #Iterate over the data (including when new data arrives)
            async for data, _ in response.content.iter_chunks():
                #If the entry is empty initialize a new list
                if(url not in generator_data):
                    generator_data[url] = []

                #Load the received data as a json object (python dict)
                json_content = json.loads(data)

                #append it to the list in the generator_data dictionary at the url location
                generator_data[url].append(json_content)

                #prep the data for transport and ship it to aws if the conditions are met
                if(data_type == 'power' and len(generator_data[url]) >= 12):
                    print("Sending power data for generator {}...".format(gen_num))
                    json_file = json.dumps(generator_data[url], indent=2, sort_keys=True)

                    key = create_key(time, json_content['time'])

                    if AWS_ON:
                        s3.Bucket(POWER_BUCKET).put_object(Key=key, Body=json_file)

                    print("Power data sent for generator {}".format(gen_num))

                    if len(generator_data["{}/generator/{}/fuelConsumed".format(BASE_URL, gen_num)]) >= 6:
                        process_eff(gen_num, s3)

                elif(data_type == 'fuel' and len(generator_data[url]) >= 6):
                    print("Sending fuel data for generator {}...".format(gen_num))
                    json_file = json.dumps(generator_data[url], indent=2, sort_keys=True)

                    key = create_key(time, json_content['time'])

                    if AWS_ON:
                        s3.Bucket(FUEL_BUCKET).put_object(Key=key, Body=json_file)

                    print("Fuel data sent for generator {}".format(gen_num))

                    if len(generator_data["{}/generator/{}/powerProduced".format(BASE_URL, gen_num)]) >= 12:
                        process_eff(gen_num, s3)

            return response


if __name__ == '__main__':
    #Create a loop for the asyncio library (this one is specific for windows
    #because windows only allows 64 simultaneously open ports)
    loop = asyncio.ProactorEventLoop()
    asyncio.set_event_loop(loop)

    if AWS_ON or AWS_EFF_ON:
        s3 = boto3.resource( 's3',
            aws_access_key_id=BUCKET_ACCESS_KEY,
            aws_secret_access_key=BUCKET_SECRET_ACCESS_KEY,
            config=Config(signature_version='s3v4')
        )
    else:
        s3 = ''

    #Create the coroutines to be run and add them to a list
    coroutines = []
    for i in range(1, NUMBER_OF_GENERATORS+1):
        power_url = "{}/generator/{}/powerProduced".format(BASE_URL, i)
        fuel_url = "{}/generator/{}/fuelConsumed".format(BASE_URL, i)
        coroutines.append(get(power_url, i, 'power', s3))
        coroutines.append(get(fuel_url, i, 'fuel', s3))

    #run all the coroutines
    results = loop.run_until_complete(asyncio.gather(*coroutines))
