import aiohttp
import asyncio
import json

generator_data = []

async def get(url, session, gen_num):
    async with session.get(url) as response:
        async for data, _ in response.content.iter_chunks():
            generator_data.append(data)
            if(gen_num == 3000):
                print(len(generator_data))
        return response

loop = asyncio.ProactorEventLoop()
asyncio.set_event_loop(loop)

conn = aiohttp.TCPConnector(limit=0)
session = aiohttp.ClientSession(connector=conn)

coroutines = [get("http://127.0.0.1:3001/generator/{}/powerProduced".format(i), session, i) for i in range(1, 3001)]

results = loop.run_until_complete(asyncio.gather(*coroutines))
