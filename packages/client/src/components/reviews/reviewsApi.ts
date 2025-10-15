import axios from 'axios';

export type Review = {
  author: string;
  content: string;
  rating: number;
  createdAt: number;
};

export type GetReviewsResponse = {
  summary: {id: string; message: string} | null;
  reviews: Review[];
};

export type SummarizeResponse = {
  summary: {id: string; message: string};
};

export const reviewsApi = {
  async fetchReviews(productId: number) {
    return await axios.get<GetReviewsResponse>(`/api/products/${productId}/reviews`).then(res => res.data);
  },
  async summarizeReviews(productId: number) {
    return await axios.post<SummarizeResponse>(`/api/products/${productId}/reviews/summarize`).then(res => res.data);
  },
};
