"use client";

import { Star } from "lucide-react";

interface Review {
    id: string;
    studentName: string;
    rating: number;
    comment: string;
    date: string;
}

interface ReviewsDisplayProps {
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
}

export default function ReviewsDisplay({ reviews, averageRating, totalReviews }: ReviewsDisplayProps) {
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Reviews & Rating</h3>
                    <div className="flex items-center space-x-2 mt-1">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-5 h-5 ${star <= Math.round(averageRating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-2xl font-bold text-gray-800">{averageRating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500">({totalReviews} reviews)</span>
                    </div>
                </div>
            </div>

            {reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No reviews yet</p>
                    <p className="text-sm mt-1">Complete sessions to receive reviews</p>
                </div>
            ) : (
                <div className="space-y-4 max-h-64 overflow-y-auto">
                    {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                            <div className="flex items-center justify-between mb-2">
                                <p className="font-medium text-gray-800">{review.studentName}</p>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            {review.comment && (
                                <p className="text-sm text-gray-600 mb-1">{review.comment}</p>
                            )}
                            <p className="text-xs text-gray-400">{review.date}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
