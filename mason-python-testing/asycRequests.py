import aiohttp
import asyncio
import json

async def get(url, session):
    async with session.get(url) as response:
        async for data, _ in response.content.iter_chunks():
            print (data)
        return response

loop = asyncio.get_event_loop()

session = aiohttp.ClientSession()

coroutines = [get("http://127.0.0.1:3001/generator/{}/powerProduced".format(i), session) for i in range(2999)]

results = loop.run_until_complete(asyncio.gather(*coroutines))
