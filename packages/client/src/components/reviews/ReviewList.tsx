import {useMutation, useQuery} from '@tanstack/react-query';
import {HiSparkles} from 'react-icons/hi2';
import 'react-loading-skeleton/dist/skeleton.css';
import {Button} from '../ui/button';
import ReviewSkeleton from './ReviewSkeleton';
import StarRating from './StarRating';
import {reviewsApi, type GetReviewsResponse, type SummarizeResponse} from './reviewsApi';

type Props = {
  productId: number;
};

const ReviewList = ({productId}: Props) => {
  const {
    data: reviewData,
    isLoading,
    error,
  } = useQuery<GetReviewsResponse>({
    queryKey: ['reviews', productId],
    queryFn: () => reviewsApi.fetchReviews(productId),
  });
  // const [summarizeError, setSummarizeError] = useState('');

  const summaryMutation = useMutation<SummarizeResponse>({
    mutationFn: () => reviewsApi.summarizeReviews(productId),
    // onSuccess: () => {
    //   queryClient.invalidateQueries({queryKey: ['reviews', productId]});
    // },
    // onError: () => {
    //   setSummarizeError('An error occurred while summarizing reviews, please try again!');
    // },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5 text-left">
        {[1, 2, 3].map(id => (
          <ReviewSkeleton key={id} />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500"> Could not fetch reviews try again! </p>;
  }

  if (!reviewData || reviewData.reviews.length === 0) {
    return <div>No reviews found for this product.</div>;
  }

  const currentSummary = reviewData?.summary?.message || summaryMutation?.data?.summary.message;

  return (
    <div className="text-left">
      <div className="mb-5">
        {currentSummary ? (
          <>
            <b className="text-lg font-semibold">Summary:</b>
            <p>{currentSummary} </p>
          </>
        ) : (
          <div>
            <Button
              onClick={() => summaryMutation.mutate()}
              className="cursor-pointer"
              disabled={summaryMutation.isPending}
            >
              <HiSparkles />
              Summarize
            </Button>
            {summaryMutation.isPending && (
              <div className="py-3">
                <ReviewSkeleton />
              </div>
            )}
            {summaryMutation.isError && <p className="text-red-500 py-2">Could't summarize reviews, Try again!</p>}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-5 items-start text-left">
        {reviewData.reviews.map(review => (
          <div key={`${review.author}-${review.createdAt}`}>
            <div className="font-semibold">Author: {review.author}</div>
            <div>
              Rating: <StarRating value={review.rating} />{' '}
            </div>
            <p className="py-2">Review: {review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
