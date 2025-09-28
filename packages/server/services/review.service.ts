import {type Review} from '../generated/prisma';
import {reviewRepository} from '../repositories/review.repository';

export const reviewService = {
  async getReviews(productId: number, limit?: number): Promise<Review[]> {
    return reviewRepository.getReviews(productId, limit);
  },

  async summarizeReviews(productId: number, limit?: number): Promise<Review[]> {
    return reviewRepository.getReviews(productId, limit);
  },
};
