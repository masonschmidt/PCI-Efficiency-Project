import requests

response = requests.get("http://127.0.0.1:5000/generator/1/fuelConsumed",
stream=True)

for line in response.iter_lines():
    if line:
        decoded_line = line.decode('utf-8')
        print(decoded_line)

print(response.stats_code)
