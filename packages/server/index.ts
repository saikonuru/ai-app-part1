import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import express from 'express';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import z from 'zod';

dotenv.config();

// Configure the OpenAI client to connect to the local Ollama server
const ollama = new OpenAI({
   baseURL: 'http://localhost:11434/v1',
   apiKey: 'ollama', // required but not used
});

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

const conversations = new Map<string, ChatCompletionMessageParam[]>();

const queryLocalLLM = async (messages: ChatCompletionMessageParam[]) => {
   const response = await ollama.chat.completions.create({
      model: process.env.LLM_MODEL || 'llama3', // Provide a default model
      messages: messages,
      temperature: 0.3,
      max_tokens: 1000,
   });

   return response.choices[0]?.message;
};

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt is too long (max 1000 characters)'),
   conversationId: z.uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
   const parseResult = chatSchema.safeParse(req.body);

   if (!parseResult.success) {
      res.status(400).json(parseResult.error.format());
      return;
   }

   const { prompt, conversationId } = req.body;

   // Get or create conversation history
   let conversationHistory = conversations.get(conversationId);
   if (!conversationHistory) {
      conversationHistory = [
         {
            role: 'system',
            content:
               'You are a helpful assistant that provides short and concise answers to questions.',
         },
      ];
      conversations.set(conversationId, conversationHistory);
   }

   // Add user's new prompt to the history
   conversationHistory.push({ role: 'user', content: prompt });

   try {
      const assistantMessage = await queryLocalLLM(conversationHistory);

      // Add assistant's response to history
      if (assistantMessage) {
         conversationHistory.push(assistantMessage);
      }

      if (assistantMessage?.content) {
         res.json({
            message: assistantMessage.content,
            conversationId: conversationId,
         });
      }
   } catch (error) {
      console.error('Error calling LLM:', error);
      // If the API call fails, remove the user's last message from the history
      // so they can try again without the failed message being part of the context.
      conversationHistory.pop();
      if (error instanceof OpenAI.APIError) {
         return res
            .status(error.status || 500)
            .json({ message: error.message, type: error.type });
      }
      res.status(500).json({
         message:
            'An unexpected error occurred while communicating with the assistant.',
      });
   }
});

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
