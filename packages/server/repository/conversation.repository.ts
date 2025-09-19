import fs from 'fs';
import type {ChatCompletionMessageParam} from 'openai/resources/chat/completions';
import path from 'path';
import template from '../prompts/chatbot.txt';

const conversations = new Map<string, ChatCompletionMessageParam[]>();

const parkIno = fs.readFileSync(
  path.join(__dirname, '..', 'prompts', 'WonderWorld.md'),
  'utf-8'
);

const instructions = template.replace('{{parkIno}}', parkIno);

// const DEFAULT_SYSTEM_PROMPT = `You are a helpful assistant. Based on the conversation history,
//        provide a short and concise answer to the user's question.`;

const getConversationHistory = (conversationId: string) => {
  let conversationHistory = conversations.get(conversationId);
  if (!conversationHistory) {
    conversationHistory = [
      {
        role: 'system',
        // content: process.env.SYSTEM_PROMPT || DEFAULT_SYSTEM_PROMPT,
        content: instructions,
      },
    ];
    conversations.set(conversationId, conversationHistory);
  }
  return conversationHistory;
};

const addMessageToConversation = (
  conversationId: string,
  message: ChatCompletionMessageParam
) => {
  const conversationHistory = getConversationHistory(conversationId);
  conversationHistory.push(message);
};

const removeLastMessageFromConversation = (conversationId: string) => {
  const conversationHistory = getConversationHistory(conversationId);
  conversationHistory.pop();
};

export const conversationRepository = {
  getConversationHistory,
  addMessageToConversation,
  removeLastMessageFromConversation,
};
