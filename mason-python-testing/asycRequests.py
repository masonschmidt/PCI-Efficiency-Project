import aiohttp
import asyncio
import json

AWS_PATH = "s3.example-region.amazonaws.com"
POWER_BUCKET = "powerbucket"
FUEL_BUCKET = "fuelbucket"
AWS_AUTH = "example auth string"

generator_data = dict()

async def get(url, session, gen_num, data_type):
    async with session.get(url) as response:
        async for data, _ in response.content.iter_chunks():
            if(url not in generator_data):
                generator_data[url] = []
            generator_data[url].append(data)
            if(data_type == 'power' && len(generator_data[url]) >= 6):
                async with session.put("{}.{}/".format(POWER_BUCKET, AWS_PATH),
                    data=b'example_data', auth=AWS_AUTH)
            elif(data_type == 'fuel' && len(generator_data[url]) >= 12):
                async with session.put("{}.{}/".format(FUEL_BUCKET, AWS_PATH),
                    data=b'example_data', auth=AWS_AUTH)
            if(gen_num == 3000):
                #print("length: {}, url: {}".format(len(generator_data), url))
                print(url)
        return response

loop = asyncio.ProactorEventLoop()
asyncio.set_event_loop(loop)

conn = aiohttp.TCPConnector(limit=0)
timeout = aiohttp.ClientTimeout(total=0)
session = aiohttp.ClientSession(connector=conn, timeout=timeout)

coroutines = []
for i in range(1, 3001):
    power_url = "http://127.0.0.1:3001/generator/{}/powerProduced".format(i)
    fuel_url = "http://127.0.0.1:3001/generator/{}/fuelConsumed".format(i)
    coroutines.append(get(power_url, session, i, 'power'))
    coroutines.append(get(fuel_url, session, i, 'fuel'))

#coroutines = [get("http://127.0.0.1:3001/generator/{}/powerProduced".format(i), session, i) for i in range(1, 3001)]

results = loop.run_until_complete(asyncio.gather(*coroutines))
