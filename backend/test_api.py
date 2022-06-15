import requests

response = requests.put("http://localhost:5000/userdata", {"Test": "test"})
print(response.json())