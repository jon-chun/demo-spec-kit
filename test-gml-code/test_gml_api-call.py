import os
import sys
from zai import ZaiClient

# 1. Read the API key from the environment variables.
# Your .sh script exports ANTHROPIC_AUTH_TOKEN, so we read that variable here.
api_key = os.getenv("ANTHROPIC_AUTH_TOKEN")

# 2. Add a check to ensure the API key was found.
if not api_key:
    print("Error: The ANTHROPIC_AUTH_TOKEN environment variable is not set.")
    print("Please load your environment variables before running the script, e.g.:")
    print("source ./.env-cc_gml_api.sh")
    sys.exit(1) # Exit the script with an error code

# 3. Initialize the ZaiClient with the key from the environment.
client = ZaiClient(api_key=api_key)

# The rest of your code remains the same.
response = client.chat.completions.create(
    model="glm-4.6",
    messages=[
        {"role": "user", "content": "As a marketing expert, please create an attractive slogan for my product."},
        {"role": "assistant", "content": "Sure, to craft a compelling slogan, please tell me more about your product."},
        {"role": "user", "content": "Z.AI Open Platform"}
    ],
    thinking={
        "type": "enabled",
    },
    max_tokens=4096,
    temperature=0.6
)

# Get complete response
print(response.choices[0].message)