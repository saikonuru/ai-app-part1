import type {ChatCompletionMessageParam} from 'openai/resources/chat/completions';

const conversations = new Map<string, ChatCompletionMessageParam[]>();

const DEFAULT_SYSTEM_PROMPT = `You are a helpful assistant. Based on the conversation history, 
       provide a short and concise answer to the user's question.`;
//  Do not repeat the conversation history in your response.`;

const getConversationHistory = (conversationId: string) => {
  let conversationHistory = conversations.get(conversationId);
  if (!conversationHistory) {
    conversationHistory = [
      {
        role: 'system',
        content: process.env.SYSTEM_PROMPT || DEFAULT_SYSTEM_PROMPT,
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
