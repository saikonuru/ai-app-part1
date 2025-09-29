import OpenAI from 'openai';
import {LLMError} from '../llm-error';
import {conversationRepository} from '../repositories/conversation.repository';

const client = new OpenAI({
  baseURL: process.env.LLM_BASE_URL || 'http://localhost:11434/v1',
  apiKey: 'ollama', // required but not used
});

type ChatOptions = {
  model?: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  conversationId?: string;
};

export type ChatResponse = {
  id: string;
  message: string;
};

export const llmClient = {
  async generateText({
    model = process.env.LLM_MODEL || 'llama3',
    prompt,
    temperature = 0.2,
    maxTokens = 300,
    conversationId,
  }: ChatOptions): Promise<ChatResponse> {
    let messages;
    if (conversationId) {
      conversationRepository.addMessageToConversation(conversationId, {
        role: 'user',
        content: prompt,
      });
      messages = conversationRepository.getConversationHistory(conversationId);
    } else {
      messages = [{role: 'user' as const, content: prompt}];
    }

    try {
      console.log('Calling LLM');
      const response = await client.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      });
      if (!response.choices?.length || !response.choices[0]?.message?.content) {
        throw new LLMError('No response from LLM', 502, 'no_llm_response');
      }
      const response_text = response.choices[0].message.content;
      if (conversationId) {
        conversationRepository.addMessageToConversation(conversationId, {
          role: 'assistant',
          content: response_text,
        });
      }
      return {
        id: response.id,
        message: response_text,
      };
    } catch (error) {
      if (conversationId) {
        conversationRepository.removeLastMessageFromConversation(
          conversationId
        );
      }

      // Wrap the specific LLM error in a generic LLMError
      if (error instanceof OpenAI.APIError) {
        throw new LLMError(error.message, error.status, error.type, error);
      }

      // Re-throw a generic error for other cases
      throw new LLMError(
        'An unexpected error occurred while communicating with the assistant.',
        500,
        'internal_server_error',
        error
      );
    }
  },
};
