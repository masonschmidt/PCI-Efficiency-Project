import aiohttp
import asyncio
import json
import time

#Constansts for use later.
AWS_PATH = "s3.example-region.amazonaws.com"
POWER_BUCKET = "powerbucket"
FUEL_BUCKET = "fuelbucket"
AWS_AUTH = "example auth string"

AWS_ON = False

#Dictionary to store data using the url as the key
generator_data = dict()

#Open a connection with the generator server asynchonously
async def get(url, session, gen_num, data_type):
    #Actual request to the endpoint
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
            if(data_type == 'power' and len(generator_data[url]) >= 6):
                json_file = json.dumps(generator_data[url])

                if AWS_ON:
                    async with session.put("{}.{}/generator{}/{}.json".format(POWER_BUCKET, AWS_PATH, gen_num, json_content['time']),json=json_file)

                #reset data
                generator_data[url] = []

            elif(data_type == 'fuel' and len(generator_data[url]) >= 12):
                json_file = json.dumps(generator_data[url])

                if AWS_ON:
                    async with session.put("{}.{}/generator{}/{}.json".format(FUEL_BUCKET, AWS_PATH, gen_num, json_content['time']),json=json_file)

                #reset data
                generator_data[url] = []

            #For debugging
            if(gen_num == 3000):
                print("Current time: {}, URL: {}".format(time.time() - starting_time, url))

        return response

starting_time = time.time()
#Create a loop for the asyncio library (this one is specific for windows
#because windows only allows 64 simultaneously open ports)
loop = asyncio.ProactorEventLoop()
asyncio.set_event_loop(loop)

#Header for all put requests to AWS
headers={"Authorization": AWS_AUTH}
#Connector with no connection limit
conn = aiohttp.TCPConnector(limit=0)
#no timeout
timeout = aiohttp.ClientTimeout(total=0)
#Create a session for our connections with the connector and timeout
session = aiohttp.ClientSession(connector=conn, timeout=timeout, headers=headers)

#Create the coroutines to be run and add them to a list
coroutines = []
for i in range(1, 3001):
    power_url = "http://127.0.0.1:3001/generator/{}/powerProduced".format(i)
    fuel_url = "http://127.0.0.1:3001/generator/{}/fuelConsumed".format(i)
    coroutines.append(get(power_url, session, i, 'power'))
    coroutines.append(get(fuel_url, session, i, 'fuel'))

loop_begin_time = time.time() - starting_time
print("Loop beggining at time: {}".format(loop_begin_time))

#run all the coroutines
results = loop.run_until_complete(asyncio.gather(*coroutines))
