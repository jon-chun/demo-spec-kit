import os
import sys
from openai import OpenAI

# 1. Read the API key from the environment variables.
# The standard environment variable for the OpenAI API is OPENAI_API_KEY.
api_key = os.getenv("ANTHROPIC_AUTH_TOKEN") # ("OPENAI_API_KEY")

# 2. Add a check to ensure the API key was found.
if not api_key:
    print("Error: The OPENAI_API_KEY environment variable is not set.")
    print("Please set your API key before running the script, e.g.:")
    print("export OPENAI_API_KEY='your_api_key_here'")
    sys.exit(1) # Exit the script with an error code

# 3. Initialize the OpenAI client with the key from the environment.
# The OpenAI library automatically reads from OPENAI_API_KEY by default.
client = OpenAI()

# The rest of your code remains the same, but the model name is updated.
# response = client.chat.completions.create(
#     model="gpt-5-mini",  # Use the latest flagship model
#     messages=[
#         {"role": "user", "content": "As a marketing expert, please create an attractive slogan for my product."},
#         {"role": "assistant", "content": "Sure, to craft a compelling slogan, please tell me more about your product."},
#         {"role": "user", "content": "GPT-5-mini Model"},
#     ],
#     max_completion_tokens=4096, # Corrected parameter name
#     temperature=0.6
# )

result = client.responses.create(
    model="gpt-5-mini",
    input="Tell me about GPT-5-mini Model.",
    reasoning={ "effort": "low" },
    text={ "verbosity": "low" },
)

# Get complete response
# print(response.choices[0].message)

print(result.output_text)