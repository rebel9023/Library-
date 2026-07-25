import axios from 'axios';
import { env } from '../config/env';

export class OllamaService {
  /**
   * Sends prompt to Ollama Qwen 3 (8B) and gets full response text.
   */
  public static async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await axios.post(`${env.OLLAMA_URL}/api/generate`, {
        model: env.OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.2, // Low temperature for high factual accuracy
          top_p: 0.9,
          num_ctx: 4096
        }
      }, { timeout: 15000 });

      return response.data?.response || '';
    } catch (err) {
      console.warn('Ollama service request warning (Ollama container offline or loading):', (err as Error).message);
      return ''; // Return empty string to trigger guardrail smart synthesis
    }
  }

  /**
   * Stream response from Ollama Qwen 3 (8B)
   */
  public static async streamResponse(prompt: string, onToken: (token: string) => void): Promise<void> {
    try {
      const response = await axios.post(`${env.OLLAMA_URL}/api/generate`, {
        model: env.OLLAMA_MODEL,
        prompt: prompt,
        stream: true,
        options: {
          temperature: 0.2,
          top_p: 0.9
        }
      }, { responseType: 'stream', timeout: 30000 });

      response.data.on('data', (chunk: Buffer) => {
        try {
          const lines = chunk.toString().split('\n').filter(Boolean);
          for (const line of lines) {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              onToken(parsed.response);
            }
          }
        } catch (e) {
          // Ignore partial line parses
        }
      });

      return new Promise((resolve) => {
        response.data.on('end', resolve);
        response.data.on('error', resolve);
      });
    } catch (err) {
      console.warn('Ollama streaming fallback engaged:', (err as Error).message);
    }
  }
}
