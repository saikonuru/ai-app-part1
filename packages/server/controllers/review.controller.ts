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
    if (isNaN(productId)) {
      return res.status(400).json({error: 'Invalid product Id'});
    }
    try {
      // Limit the number of reviews fetched for summarization (e.g., 20)
      const reviews = await reviewService.getReviews(productId, 20);
      const joinedReviews = reviews.map(r => r.content).join(' ');
      // Simple summary: first 200 characters (replace with real AI summary if needed)
      // const summary =
      //   joinedReviews.length > 0
      //     ? joinedReviews.slice(0, 200) +
      //       (joinedReviews.length > 200 ? '...' : '')
      //     : 'No reviews found.';
      const summary = 'This is a test summary';
      return res.json({summary});
    } catch (error) {
      res.status(500).json({error: 'Failed to summarize reviews'});
    }
  },
};
