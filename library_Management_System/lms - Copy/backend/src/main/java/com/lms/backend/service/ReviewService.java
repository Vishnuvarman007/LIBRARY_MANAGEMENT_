package com.lms.backend.service;

import com.lms.backend.model.Book;
import com.lms.backend.model.Review;
import com.lms.backend.model.User;
import com.lms.backend.repository.BookRepository;
import com.lms.backend.repository.ReviewRepository;
import com.lms.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    public Review addReview(Long userId, Long bookId, Integer rating, String comment) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        if (userId == null) throw new RuntimeException("User ID cannot be null");
        if (bookId == null) throw new RuntimeException("Book ID cannot be null");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        Review review = new Review(user, book, rating, comment);
        return reviewRepository.save(review);
    }

    public List<Review> getReviewsForBook(Long bookId) {
        return reviewRepository.findByBookIdOrderByCreatedAtDesc(bookId);
    }
}
