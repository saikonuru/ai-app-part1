import {llmClient, type ChatResponse} from '../llm/llmClient';

export const chatService = {
  async sendMessage(
    prompt: string,
    conversationId: string
  ): Promise<ChatResponse> {
    return await llmClient.generateText({
      // model: process.env.LLM_MODEL,
      prompt,
      temperature: 0.2,
      maxTokens: 500,
      conversationId,
    });
  },
};
