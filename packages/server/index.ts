import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import express from 'express';
import { z } from 'zod';
import { LLMError } from './llm-error';
import { chatSchema } from './repository/chat.schema';
import { chatService } from './services/chat.service';
dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.post('/api/chat', async (req: Request, res: Response) => {
   const parseResult = chatSchema.safeParse(req.body);

   if (!parseResult.success) {
      res.status(400).json(z.treeifyError(parseResult.error));
      return;
   }

   const { prompt, conversationId } = parseResult.data;

   try {
      const llmResponse = await chatService.sendMessage(prompt, conversationId);

      res.json({
         message: llmResponse.message,
         conversationId: conversationId,
      });
   } catch (error) {
      console.error('Error calling LLM:', error);
      if (error instanceof LLMError) {
         return res.status(error.status).json({
            message: error.message,
            type: error.type,
         });
      }
      // Fallback for any other unexpected errors
      return res.status(500).json({
         message:
            'An unexpected error occurred while communicating with the assistant.',
      });
   }
});

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
