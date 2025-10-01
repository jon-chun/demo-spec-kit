// API Configuration and Client
class ModelAPI {
    constructor() {
        this.config = this.loadConfig();
        this.rateLimits = new Map();
    }

    loadConfig() {
        // In production, this would be loaded from a backend
        // For demo purposes, we'll use environment variables
        return {
            openai: {
                apiKey: process.env.OPENAI_API_KEY || 'demo_key',
                url: process.env.OPENAI_API_URL || 'https://api.openai.com/v1',
                model: 'gpt-4'
            },
            anthropic: {
                apiKey: process.env.ANTHROPIC_API_KEY || 'demo_key',
                url: process.env.ANTHROPIC_API_URL || 'https://api.anthropic.com',
                model: 'claude-3-sonnet-20240229'
            },
            google: {
                apiKey: process.env.GOOGLE_API_KEY || 'demo_key',
                url: process.env.GOOGLE_API_URL || 'https://generativelanguage.googleapis.com/v1beta',
                model: 'gemini-pro'
            },
            replicate: {
                apiKey: process.env.REPLICATE_API_KEY || 'demo_key',
                url: process.env.REPLICATE_API_URL || 'https://api.replicate.com/v1',
                model: 'meta/meta-llama-3-70b-instruct'
            }
        };
    }

    checkRateLimit(provider) {
        const now = Date.now();
        const lastCall = this.rateLimits.get(provider) || 0;
        const minInterval = 1000; // 1 second between calls

        if (now - lastCall < minInterval) {
            throw new Error(`Rate limit exceeded for ${provider}. Please wait.`);
        }
        this.rateLimits.set(provider, now);
    }

    async callOpenAI(prompt) {
        this.checkRateLimit('openai');

        if (this.config.openai.apiKey === 'demo_key') {
            return this.generateDemoResponse('OpenAI GPT-4', prompt);
        }

        try {
            const response = await fetch(`${this.config.openai.url}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.config.openai.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.config.openai.model,
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 1000,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API error:', error);
            throw error;
        }
    }

    async callAnthropic(prompt) {
        this.checkRateLimit('anthropic');

        if (this.config.anthropic.apiKey === 'demo_key') {
            return this.generateDemoResponse('Anthropic Claude', prompt);
        }

        try {
            const response = await fetch(`${this.config.anthropic.url}/messages`, {
                method: 'POST',
                headers: {
                    'x-api-key': this.config.anthropic.apiKey,
                    'Content-Type': 'application/json',
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: this.config.anthropic.model,
                    max_tokens: 1000,
                    messages: [{ role: 'user', content: prompt }]
                })
            });

            if (!response.ok) {
                throw new Error(`Anthropic API error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.content[0].text;
        } catch (error) {
            console.error('Anthropic API error:', error);
            throw error;
        }
    }

    async callGoogle(prompt) {
        this.checkRateLimit('google');

        if (this.config.google.apiKey === 'demo_key') {
            return this.generateDemoResponse('Google Gemini', prompt);
        }

        try {
            const response = await fetch(
                `${this.config.google.url}/models/${this.config.google.model}:generateContent?key=${this.config.google.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            maxOutputTokens: 1000,
                            temperature: 0.7
                        }
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`Google API error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Google API error:', error);
            throw error;
        }
    }

    async callReplicate(prompt) {
        this.checkRateLimit('replicate');

        if (this.config.replicate.apiKey === 'demo_key') {
            return this.generateDemoResponse('Meta Llama', prompt);
        }

        try {
            const response = await fetch(`${this.config.replicate.url}/predictions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${this.config.replicate.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    version: 'meta/meta-llama-3-70b-instruct',
                    input: {
                        prompt: prompt,
                        max_tokens: 1000,
                        temperature: 0.7
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Replicate API error: ${response.statusText}`);
            }

            const prediction = await response.json();

            // Poll for completion
            let result;
            do {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const pollResponse = await fetch(`${this.config.replicate.url}/predictions/${prediction.id}`, {
                    headers: {
                        'Authorization': `Token ${this.config.replicate.apiKey}`
                    }
                });
                result = await pollResponse.json();
            } while (result.status === 'starting' || result.status === 'processing');

            if (result.status === 'failed') {
                throw new Error('Replicate prediction failed');
            }

            return result.output.join('');
        } catch (error) {
            console.error('Replicate API error:', error);
            throw error;
        }
    }

    generateDemoResponse(model, prompt) {
        const responses = {
            'OpenAI GPT-4': `As GPT-4, I can provide a comprehensive analysis of your query: "${prompt}". My response focuses on accuracy, creativity, and detailed explanations. I excel at complex reasoning tasks and can provide nuanced perspectives on various topics.`,
            'Anthropic Claude': `Hello! I'm Claude, an AI assistant created by Anthropic. Regarding your question about "${prompt}", I aim to be helpful, harmless, and honest in my responses. I prioritize providing accurate information while maintaining a conversational tone.`,
            'Google Gemini': `I'm Gemini, Google's advanced AI model. For your prompt "${prompt}", I can leverage Google's extensive knowledge base to provide current and relevant information. I'm particularly strong at multi-step reasoning and context understanding.`,
            'Meta Llama': `As Llama 3, Meta's open-source AI model, I respond to "${prompt}" with a focus on accessibility and community-driven development. My training emphasizes helpful, accurate responses while respecting ethical guidelines.`
        };

        return responses[model] || `Demo response for: "${prompt}"`;
    }

    async generateResponse(provider, prompt) {
        switch (provider) {
            case 'gpt-4':
                return this.callOpenAI(prompt);
            case 'claude':
                return this.callAnthropic(prompt);
            case 'gemini':
                return this.callGoogle(prompt);
            case 'llama':
                return this.callReplicate(prompt);
            default:
                throw new Error(`Unknown provider: ${provider}`);
        }
    }
}

// Export for browser use
window.ModelAPI = ModelAPI;