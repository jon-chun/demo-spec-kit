#!/bin/bash

# OpenAI Environment Variables Setup Script
# This script sets up the core environment variables for the OpenAI API

# --- ACTION REQUIRED ---
# Replace the placeholder below with your actual OpenAI API key.
# You can find your key at: https://platform.openai.com/api-keys
OPENAI_API_KEY="your_openai_api_key_here"

# Standard OpenAI API endpoint
OPENAI_BASE_URL="https://api.openai.com/v1"

# Set primary and fast models based on the latest OpenAI offerings
# Using the powerful 'gpt-5' as the default model.
OPENAI_MODEL="gpt-5"
# Using the efficient and cost-effective 'gpt-5-mini' for smaller/faster tasks.
OPENAI_SMALL_FAST_MODEL="gpt-5-mini"

# Export the environment variables
export OPENAI_API_KEY="$OPENAI_API_KEY"
export OPENAI_BASE_URL="$OPENAI_BASE_URL"
export OPENAI_MODEL="$OPENAI_MODEL"
export OPENAI_SMALL_FAST_MODEL="$OPENAI_SMALL_FAST_MODEL"

echo "OpenAI environment variables have been set."