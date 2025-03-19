from google import genai
client = genai.Client(api_key="AIzaSyDaEhdj-zDKUKFqJIQQNkA6SN8qGjIjPi4")

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="What is life",
    )

print(response.text)