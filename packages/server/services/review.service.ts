import {type Review} from '../generated/prisma';
import {llmClient, type ChatResponse} from '../llm/llmClient';
// import template from '../prompts/summary.txt';
import {conversationRepository, ConversationType} from '../repositories/conversation.repository';
import {reviewRepository} from '../repositories/review.repository';

export const reviewService = {
  async getReviews(productId: number, limit?: number): Promise<Review[]> {
    return reviewRepository.getReviews(productId, limit);
  },

  async summarizeReviews(productId: number, conversationId: string): Promise<ChatResponse> {
    const existingSummary = await reviewRepository.getReviewSummary(productId);
    if (existingSummary && existingSummary.expiresAt > new Date()) {
      return {id: 'existing-summary', message: existingSummary.content};
    }

    const reviews = await this.getReviews(productId, 20);
    const joinedReviews = reviews.map(r => r.content).join('\n\n');

    if (joinedReviews.length <= 0) {
      return {id: 'no-reviews', message: 'No reviews found.'};
    }

    const template = conversationRepository.getInstructions(ConversationType.Review);
    if (!template) {
      return {id: 'no-template', message: 'No template found for review summary.'};
    }
    const prompt = template.replace('{{reviews}}', joinedReviews);
    // console.log(prompt);
    const response = await llmClient.generateText({
      // model: process.env.LLM_MODEL,
      prompt,
      temperature: 0.2,
      maxTokens: 500,
      conversationId,
      conversationType: ConversationType.Review,
    });

    await reviewRepository.storeReviewsSummary(productId, response.message);
    return response;
  },
};
