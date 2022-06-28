import requests

# response = requests.put("http://localhost:5000/userdata", {"Test": "test"})

response = requests.get("http://localhost:5000/course_data")
print(response.json())