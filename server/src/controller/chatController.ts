import { Request, Response } from "express";
import { pool } from "../db/client.js";
import { generateTitleFromMessage, handleOllamaStream } from "../service/ollamaService.js";
import {
  getAbortController,
  removeAbortController,
} from "../utils/abortController.js";

export const createChat = async (req: Request, res: Response) => {
  try {
    const id = crypto.randomUUID()
    const result = await pool.query(
      "INSERT INTO chats (id,title, created_at) VALUES ($1,$2, NOW()) RETURNING *",
      [id,""] // empty or "Untitled Chat"
    );

    
    res.status(201).json({ chat: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to create chat"+ err });
  }

};

export const sendMessage = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const { message } = req.body;

  try {
    // Check if chat exists and get its title
    const chatResult = await pool.query("SELECT title FROM chats WHERE id = $1", [chatId]);
    if (chatResult.rows.length === 0) {
      return res.status(404).json({ error: "Chat not found" });
    }
    const chat = chatResult.rows[0];

    // If title is empty, generate from message and update
    if (chat.title === "New Chat" || chat.title.trim() === "") {
      generateTitleFromMessage(message).then(async (newTitle) => {
        if (newTitle?.trim()) {
          await pool.query("UPDATE chats SET title = $1 WHERE id = $2", [newTitle, chatId]);
        }
      }).catch(err=> console.log(err));
    }

    // Now insert the user message into messages table
    await pool.query(
      "INSERT INTO messages (chat_id, role, content, timestamp) VALUES ($1, $2, $3, NOW())",
      [chatId, "user", message]
    );

    // Call your handleOllamaStream to stream LLM response and also save bot response messages
    res.setHeader("Content-Type", "text/event-stream");
    await handleOllamaStream({ prompt: message, chatId }, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
};

export const getChats = async (_req: Request, res: Response) => {
  const result = await pool.query(
    "SELECT * FROM chats ORDER BY created_at DESC"
  );
  res.json(result.rows);
};

export const stopMessage = async (req: Request, res: Response) => {
  const { chatId } = req.params;

  const controller = getAbortController(chatId);
  if (controller) {
    controller.abort();
    removeAbortController(chatId);
    return res.status(200).json({ status: "Stream stopped" });
  }

  res.status(404).json({ error: "No active stream to stop" });
};

export const getChatById = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const result = await pool.query(
    "SELECT * FROM messages WHERE chat_id = $1 ORDER BY timestamp ASC",
    [chatId]
  );
  res.json(result.rows);
};
