#!/bin/bash

# Claude Code Environment Variables Setup Script
# This script sets up the core environment variables for Claude Code

# Set your values here
ANTHROPIC_AUTH_TOKEN="cf1..."
ANTHROPIC_BASE_URL="https://api.z.ai/api/anthropic"
ANTHROPIC_MODEL="GLM-4.6"
ANTHROPIC_SMALL_FAST_MODEL="GLM-4.5-Air"

# Export the environment variables
export ANTHROPIC_AUTH_TOKEN="$ANTHROPIC_AUTH_TOKEN"
export ANTHROPIC_BASE_URL="$ANTHROPIC_BASE_URL"
export ANTHROPIC_MODEL="$ANTHROPIC_MODEL"
export ANTHROPIC_SMALL_FAST_MODEL="$ANTHROPIC_SMALL_FAST_MODEL"
