import {PrismaClient, type Review} from '../generated/prisma';

// Singleton PrismaClient instance
const prisma = new PrismaClient();

export const reviewRepository = {
  getReviews(productId: number, limit?: number): Promise<Review[]> {
    return prisma.review.findMany({
      where: {productId},
      orderBy: {createdAt: 'desc'},
      take: limit,
    });
  },
};
