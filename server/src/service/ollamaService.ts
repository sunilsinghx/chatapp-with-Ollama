import axios from 'axios';
import type { Response } from 'express';
import {
  setAbortController,
  removeAbortController
} from '../utils/abortController';
import { pool } from '../db/client';

export async function handleOllamaStream(
  { prompt, chatId }: { prompt: string; chatId: string },
  res: Response
) {
  const controller = new AbortController();
  setAbortController(chatId, controller);

  let assistantResponse = ""; // Buffer to hold the full assistant response

  try {
    const response = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model: 'llama2',
        prompt,
        stream: true
      },
      {
        responseType: 'stream',
        signal: controller.signal
      }
    );

    response.data.on('data', (chunk: Buffer) => {
      const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          const text = parsed.response ?? '';
          assistantResponse += text;
          res.write(text); // stream to frontend
        } catch (err) {
          console.error('Invalid stream chunk:', line);
        }
      }            // Stream to frontend
    });

    response.data.on('end', async () => {
      res.end();
      removeAbortController(chatId);

      // 💾 Save assistant message in DB
      if (assistantResponse.trim()) {
        await pool.query(
          "INSERT INTO messages (chat_id, role, content, timestamp) VALUES ($1, $2, $3, NOW())",
          [chatId, "assistant", assistantResponse.trim()]
        );
      }
    });

    response.data.on('error', (err: Error) => {
      console.log('Stream error');
      res.end();
      removeAbortController(chatId);
    });
  } catch (error: any) {
    if (error.name === 'CanceledError' || error.message === 'canceled') {
      console.log(`Stream aborted for chatId: ${chatId}`);
      res.write('[STOPPED]');
      res.end();
    } else {
      console.error('Request failed:', error);
      res.status(500).json({ error: 'Failed to stream response' });
    }
    removeAbortController(chatId);
  }
}

export const generateTitleFromMessage = async (message: string): Promise<string> => {
  const prompt = `What is a short, clean title for this message in just 3 to 4 words for : "${message}"`;

  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama2',
      prompt,
      stream: false // 👈 Disable streaming for one-shot title generation
    });

    return response.data.response.trim();
  } catch (error) {
    console.error('Failed to generate title:', error);
    return 'New Chat'; // fallback title
  }
};