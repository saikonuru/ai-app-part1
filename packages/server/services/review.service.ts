import {type Review} from '../generated/prisma';
import {llmClient, type ChatResponse} from '../llm/llmClient';
import {reviewRepository} from '../repositories/review.repository';

export const reviewService = {
  async getReviews(productId: number, limit?: number): Promise<Review[]> {
    return reviewRepository.getReviews(productId, limit);
  },

  async summarizeReviews(
    productId: number,
    limit?: number
  ): Promise<ChatResponse> {
    const prompt = ``;
    return await llmClient.generateText({
      // model: process.env.LLM_MODEL,
      prompt,
      temperature: 0.2,
      maxTokens: 500,
      conversationId: `reviews-${productId}`,
    });

    //return reviewRepository.getReviews(productId, limit);
  },
};
