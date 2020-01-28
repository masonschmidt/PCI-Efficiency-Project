import aiohttp
import asyncio

async def get(url):
    async with aiohttp.ClientSession() as session:
        session.stream(True)
        async with session.get(url) as response:
            return response

loop = asyncio.get_event_loop()

coroutines = [get("http://127.0.0.1:3001/generator/{}/powerProduced".format(i)) for i in range(8)]

def keep_going(loop):
    results = asyncio.gather(*coroutines)
    print(results)

loop.call_soon(keep_going, loop)
loop.run_forever()
