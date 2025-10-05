/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import {useEffect, useState} from 'react';
import StarRating from './StarRating';

type Props = {
  productId: number;
};

type Review = {
  id: number;
  author: string;
  content: string;
  rating: number;
  createdAt: number;
};

type GetReviewsResponse = {
  summary: string | null;
  reviews: Review[];
};

const ReviewList = ({productId}: Props) => {
  const [reviewData, setReviewData] = useState<GetReviewsResponse>();

  const fetchReviews = async () => {
    const {data} = await axios.get<GetReviewsResponse>(`/api/products/${productId}/reviews`);
    setReviewData(data);
  };

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews, reviewData]);

  return (
    <div className="flex flex-col gap-5 items-start text-left">
      {reviewData?.reviews.length === 0 && <h1>No reviews found</h1>}
      {reviewData?.reviews.map(review => (
        <div key={review.id}>
          <div className="font-semibold">Author: {review.author}</div>
          {/* <div>Rating: {review.rating}/5</div> */}
          <div>
            Rating: <StarRating value={review.rating} />{' '}
          </div>
          <p className="py-2">Review: {review.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
