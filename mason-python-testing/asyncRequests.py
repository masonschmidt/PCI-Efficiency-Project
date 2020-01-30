import aiohttp
import asyncio
import json
import boto3
from botocore.client import Config

#Constansts for use later.
POWER_BUCKET = "power-bucket-test"
FUEL_BUCKET = "fuel-bucket-test"
AWS_AUTH = "example auth string"
#BUCKET_NAME = "pci-effciency-project-test"
BUCKET_ACCESS_KEY = "AKIARKHXIANXJPYDG6NV"
BUCKET_SECRET_ACCESS_KEY = "ZeQH9lF5xjd3TkVLnRyVPZjyZ4HfjJh42N1Cor3f"
NUMBER_OF_GENERATORS = 4

AWS_ON = False

#Dictionary to store data using the url as the key
generator_data = dict()

#Open a connection with the generator server asynchonously
async def get(url, session, gen_num, data_type, s3):
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
            if(data_type == 'power' and len(generator_data[url]) >= 12):
                print("Sending power data for generator {}...".format(gen_num))
                json_file = json.dumps(generator_data[url])

                if AWS_ON:
                    s3.Bucket(POWER_BUCKET).put_object(Key='generator{}/{}.json'.format(gen_num,json_content['time']), Body=json_file)

                print("Power data sent for generator {}".format(gen_num))

                generator_data[url] = []
            elif(data_type == 'fuel' and len(generator_data[url]) >= 6):
                print("Sending fuel data for generator {}...".format(gen_num))
                json_file = json.dumps(generator_data[url])

                if AWS_ON:
                    s3.Bucket(FUEL_BUCKET).put_object(Key='generator{}/{}.json'.format(gen_num,json_content['time']), Body=json_file)

                print("Fuel data sent for generator {}".format(gen_num))

                generator_data[url] = []

        return response

#Create a loop for the asyncio library (this one is specific for windows
#because windows only allows 64 simultaneously open ports)
loop = asyncio.ProactorEventLoop()
asyncio.set_event_loop(loop)

#Connector with no connection limit
conn = aiohttp.TCPConnector(limit=0)
#no timeout
timeout = aiohttp.ClientTimeout(total=0)
#Create a session for our connections with the connector and timeout
session = aiohttp.ClientSession(connector=conn, timeout=timeout)

s3 = boto3.resource( 's3',
    aws_access_key_id=BUCKET_ACCESS_KEY,
    aws_secret_access_key=BUCKET_SECRET_ACCESS_KEY,
    config=Config(signature_version='s3v4')
)



#result = s3.get_bucket_acl(Bucket=POWER_BUCKET)
#print(result)

#Create the coroutines to be run and add them to a list
coroutines = []
for i in range(1, NUMBER_OF_GENERATORS+1):
    power_url = "http://127.0.0.1:3001/generator/{}/powerProduced".format(i)
    fuel_url = "http://127.0.0.1:3001/generator/{}/fuelConsumed".format(i)
    coroutines.append(get(power_url, session, i, 'power', s3))
    coroutines.append(get(fuel_url, session, i, 'fuel', s3))

#run all the coroutines
results = loop.run_until_complete(asyncio.gather(*coroutines))
