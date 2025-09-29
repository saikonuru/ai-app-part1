import type {Request, Response} from 'express';
import {reviewService} from '../services/review.service';

export const reviewsController = {
  async getReviewers(req: Request, res: Response) {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({error: 'Invalid product Id'});
    }

    try {
      const reviews = await reviewService.getReviews(productId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({error: 'Failed to fetch reviews'});
    }
  },

  async summarizeReviews(req: Request, res: Response) {
    const productId = Number(req.params.id);
    const conversationId = String(
      req.query.conversationId || req.body.conversationId
    );
    if (isNaN(productId)) {
      return res.status(400).json({error: 'Invalid product Id'});
    }

    if (!conversationId) {
      return res.status(400).json({error: 'Invalid conversationId'});
    }

    try {
      const summary = await reviewService.summarizeReviews(
        productId,
        conversationId
      );
      return res.json({summary});
    } catch (error) {
      res.status(500).json({error: 'Failed to summarize reviews'});
    }
  },
};
