import type {Request, Response} from 'express';
import express from 'express';
import {chatController} from './controllers/chat.controller';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

router.get('/api/', (req: Request, res: Response) => {
  res.send('Welcome to AI Chat API!');
});

router.get('/api/hello', (req: Request, res: Response) => {
  res.json({message: 'Hello World!'});
});

router.post('/api/chat', chatController.sendMessage);

export default router;
