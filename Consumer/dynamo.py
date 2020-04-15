from __future__ import print_function # Python 2/3 compatibility
import aiohttp
import asyncio
import json
import boto3
import decimal
import time
import dateutil.parser
from datetime import datetime
from datetime import timezone
from botocore.client import Config

#Constansts for use later.
TABLE_NAME = "efficiency"
TABLE_ACCESS_KEY = "AKIARKHXIANXO77WR4X5"
TABLE_SECRET_ACCESS_KEY = "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"
EFFICIENCY_CONSTANT = 0.29329722222222
BASE_URL = 'http://127.0.0.1:3001'

NUMBER_OF_GENERATORS = 5

AWS_ON = False
AWS_EFF_ON = False

#Dictionary to store data using the url as the key
generator_data = dict()

def process_eff(gen_num, dynamodb):
    power_data = generator_data["{}/generator/{}/powerProduced".format(BASE_URL, gen_num)]
    fuel_data = generator_data["{}/generator/{}/fuelConsumed".format(BASE_URL, gen_num)]
    generator_data["{}/generator/{}/powerProduced".format(BASE_URL, gen_num)] = []
    generator_data["{}/generator/{}/fuelConsumed".format(BASE_URL, gen_num)] = []

    start_time_power = power_data[0]['time']
    recent_time_power = power_data[11]['time']
    start_time_fuel = fuel_data[0]['time']
    recent_time_fuel = fuel_data[5]['time']

    power_avg = 0
    power_total = 0
    for data_point in power_data:
        power = data_point['powerProduced']
        power_total = power_total + power
        if AWS_ON:
            table_power.put_item(
               Item={
                   'generator': gen_num,
                   'time': data_point['time'],
                   'powerProduced': str(data_point['powerProduced']),
                }
            )
    power_avg = power_total/12

    fuel_avg = 0
    fuel_total = 0
    for data_point in fuel_data:
        fuel = data_point['fuelConsumed']
        fuel_total = fuel_total + fuel
        if AWS_ON:
            table_fuel.put_item(
               Item={
                   'generator': gen_num,
                   'time': data_point['time'],
                   'fuelConsumed': str(data_point['fuelConsumed']),
                }
            )
    fuel_avg = fuel_total/6

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

    timestamp = dateutil.parser.parse(recent_time_power)

    timestamp = timestamp.strftime("%Y-%m-%d %H:%M")

    if AWS_ON or AWS_EFF_ON:
        table_effciency.put_item(
           Item={
               'generator': gen_num,
               'startTimeFuel': start_time_fuel,
               'startTimePower': start_time_power,
               'recentTimeFuel': recent_time_fuel,
               'recentTimePower': recent_time_power,
               'powerTotal': str(power_total),
               'fuelTotal': str(fuel_total),
               'avgFuel': str(fuel_avg),
               'avgPower': str(power_avg),
               'efficiency':str(efficiency),
            }
        )

    print("Efficiency data sent for generator {}".format(gen_num))

#Open a connection with the generator server asynchonously
async def get(url, gen_num, data_type, dynamodb):
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

                    timestamp = dateutil.parser.parse(json_content['time'])

                    timestamp = timestamp.strftime("%Y-%m-%d %H:%M")

                    if len(generator_data["{}/generator/{}/fuelConsumed".format(BASE_URL, gen_num)]) >= 6:
                        process_eff(gen_num, dynamodb)

                elif(data_type == 'fuel' and len(generator_data[url]) >= 6):
                    print("Sending fuel data for generator {}...".format(gen_num))
                    json_file = json.dumps(generator_data[url], indent=2, sort_keys=True)

                    timestamp = dateutil.parser.parse(json_content['time'])

                    timestamp = timestamp.strftime("%Y-%m-%d %H:%M")

                    if len(generator_data["{}/generator/{}/powerProduced".format(BASE_URL, gen_num)]) >= 12:
                        process_eff(gen_num, dynamodb)

            return response

#Create a loop for the asyncio library (this one is specific for windows
#because windows only allows 64 simultaneously open ports)
loop = asyncio.ProactorEventLoop()
asyncio.set_event_loop(loop)

if AWS_ON or AWS_EFF_ON:
    dynamodb = boto3.resource( 'dynamodb',
        region_name='us-west-2',
        aws_access_key_id=TABLE_ACCESS_KEY,
        aws_secret_access_key=TABLE_SECRET_ACCESS_KEY,
    )
else:
    dynamodb = ''

table_effciency = dynamodb.Table('efficiency')
table_power = dynamodb.Table('power')
table_fuel = dynamodb.Table('fuel')

#Create the coroutines to be run and add them to a list
coroutines = []
for i in range(1, NUMBER_OF_GENERATORS+1):
    power_url = "{}/generator/{}/powerProduced".format(BASE_URL, i)
    fuel_url = "{}/generator/{}/fuelConsumed".format(BASE_URL, i)
    coroutines.append(get(power_url, i, 'power', dynamodb))
    coroutines.append(get(fuel_url, i, 'fuel', dynamodb))

#run all the coroutines
results = loop.run_until_complete(asyncio.gather(*coroutines))
