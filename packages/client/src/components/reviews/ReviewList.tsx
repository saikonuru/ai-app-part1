import axios from 'axios';
import {useCallback, useEffect, useState} from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
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
  summary: {id: string; message: string} | null;
  reviews: Review[];
};

const ReviewList = ({productId}: Props) => {
  const [reviewData, setReviewData] = useState<GetReviewsResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const {data} = await axios.get<GetReviewsResponse>(`/api/products/${productId}/reviews`);
      setReviewData(data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      setError('Could not fetch the reviews, Try again!');
      // Optionally, set an error state here to show an error message
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5 text-left">
        {[1, 2, 3].map(id => (
          <div key={id}>
            <Skeleton width={150} />
            <Skeleton width={100} />
            <Skeleton count={2} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error} </p>;
  }

  if (!reviewData || reviewData.reviews.length === 0) {
    return <div>No reviews found for this product.</div>;
  }

  return (
    <div className="flex flex-col gap-5 items-start text-left">
      {reviewData.reviews.map(review => (
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
