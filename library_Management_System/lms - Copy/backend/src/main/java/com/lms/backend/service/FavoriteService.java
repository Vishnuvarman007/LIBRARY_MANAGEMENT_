package com.lms.backend.service;

import com.lms.backend.model.Book;
import com.lms.backend.model.Favorite;
import com.lms.backend.model.User;
import com.lms.backend.repository.BookRepository;
import com.lms.backend.repository.FavoriteRepository;
import com.lms.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteService {
    @Autowired
    private FavoriteRepository favoriteRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookRepository bookRepository;

    public Favorite addFavorite(Long userId, Long bookId) {
        if (favoriteRepository.findByUserIdAndBookId(userId, bookId).isPresent()) {
            throw new RuntimeException("Book already in favorites");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setBook(book);
        return favoriteRepository.save(favorite);
    }

    public void removeFavorite(Long favoriteId) {
        favoriteRepository.deleteById(favoriteId);
    }

    public List<Favorite> getUserFavorites(Long userId) {
        return favoriteRepository.findByUserId(userId);
    }
}
