import dayjs from 'dayjs';
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
  storeReviewsSummary(productId: number, summary: string) {
    const now = new Date();
    const expiresAt = dayjs().add(7, 'D').toDate();
    const data = {
      content: summary,
      expiresAt,
      generatedAt: now,
      productId,
    };

    return prisma.summary.upsert({
      where: {productId},
      create: data,
      update: data,
    });
  },
};
