import { Router } from 'express';
import {
  createChat,
  sendMessage,
  stopMessage,
  getChats,
  getChatById
} from '../controller/chatController';

const router = Router();

router.post('/chat', createChat);
router.post('/chat/:chatId/message', sendMessage);
router.post('/chat/:chatId/stop', stopMessage);
router.get('/chats', getChats);
router.get('/chat/:chatId', getChatById);

export default router;
