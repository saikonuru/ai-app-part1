import {type Review} from '../generated/prisma';
import {llmClient, type ChatResponse} from '../llm/llmClient';
import {reviewRepository} from '../repositories/review.repository';

export const reviewService = {
  async getReviews(productId: number, limit?: number): Promise<Review[]> {
    return reviewRepository.getReviews(productId, limit);
  },

  async summarizeReviews(
    productId: number,
    conversationId: string
  ): Promise<ChatResponse> {
    const reviews = await reviewService.getReviews(productId, 20);
    const joinedReviews = reviews.map(r => r.content).join('\n\n');
    const prompt = `
  Summarize the following customer reviews into a short paragraph
  highlighting key themes, both positive and negative
  do not ask any followup questions:
  ${joinedReviews}

`;

    if (joinedReviews.length <= 0) {
      return {id: 'no-reviews', message: 'No reviews found.'};
    }

    return await llmClient.generateText({
      // model: process.env.LLM_MODEL,
      prompt,
      temperature: 0.2,
      maxTokens: 500,
      conversationId,
    });
  },
};
