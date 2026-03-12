package com.lms.backend.service;

import com.lms.backend.model.Book;
import com.lms.backend.model.BookRequestMessage;
import com.lms.backend.model.User;
import com.lms.backend.repository.BookRepository;
import com.lms.backend.repository.BookRequestMessageRepository;
import com.lms.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookRequestMessageService {
        @Autowired
        private BookRequestMessageRepository requestRepository;
        @Autowired
        private UserRepository userRepository;
        @Autowired
        private BookRepository bookRepository;
        @Autowired
        private BorrowService borrowService;
        @Autowired
        private EmailService emailService;
        @Autowired
        private com.lms.backend.repository.MembershipRepository membershipRepository;
        @Autowired
        private com.lms.backend.repository.BorrowRecordRepository borrowRecordRepository;

        public BookRequestMessage createRequest(Long userId, Long bookId, String message) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                Book book = bookRepository.findById(bookId)
                                .orElseThrow(() -> new RuntimeException("Book not found"));

                BookRequestMessage request = new BookRequestMessage();
                request.setUser(user);
                request.setBook(book);
                request.setMessage(message);
                request.setStatus("PENDING");
                request.setRequestDate(LocalDateTime.now());

                BookRequestMessage savedRequest = requestRepository.save(request);

                // Notify librarians via real EmailService
                String emailBody = "Dear Librarian,\n\nUser " + user.getFirstName() + " " + user.getLastName() +
                                " (" + user.getEmail() + ") has requested the book '" + book.getTitle() + "'.\n\n" +
                                "Message: " + message + "\n\n" +
                                "Please log in to the LMS portal to approve or reject this request.";

                // We assume a generic librarian email for now or fetch ADMIN role
                String librarianEmail = "admin@lms.com";
                try {
                        emailService.sendEmail(librarianEmail, "New Book Request: " + book.getTitle(), emailBody);
                } catch (Exception e) {
                        System.err.println("Failed to send notification email to librarian: " + e.getMessage());
                }

                return savedRequest;
        }

        @Transactional
        public BookRequestMessage respondToRequest(Long requestId, String status, String responseMessage, Long adminId,
                        Long dueDateOffsetDays) {
                BookRequestMessage request = requestRepository.findById(requestId)
                                .orElseThrow(() -> new RuntimeException("Request not found"));

                if (!"PENDING".equals(request.getStatus())) {
                        throw new RuntimeException("Request is already processed");
                }

                request.setStatus(status);
                request.setResponseDate(LocalDateTime.now());

                BookRequestMessage savedRequest = requestRepository.save(request);

                User user = request.getUser();
                Book book = request.getBook();

                if ("APPROVED".equals(status)) {
                        // Issue the book
                        borrowService.issueBook(user.getId(), book.getId(), dueDateOffsetDays);

                        String emailBody = "Dear " + user.getFirstName() + ",\n\nYour request for the book '" +
                                        book.getTitle() + "' (Book Number: " + book.getId() + ") has been APPROVED.\n" +
                                        "The book has been issued to your account and is due for return in "
                                        + dueDateOffsetDays + " days.\n\n" +
                                        "Librarian Note: " + responseMessage;
                        emailService.sendEmail(user.getEmail(), "Book Request Approved", emailBody);
                } else if ("REJECTED".equals(status)) {
                        String emailBody = "Dear " + user.getFirstName() + ",\n\nYour request for the book '" +
                                        book.getTitle() + "' has been REJECTED.\nLibrarian Note: " + responseMessage;
                        emailService.sendEmail(user.getEmail(), "Book Request Rejected", emailBody);
                }

                return savedRequest;
        }

        public List<BookRequestMessage> getPendingRequests() {
                return requestRepository.findByStatus("PENDING");
        }

        public List<BookRequestMessage> getUserRequests(Long userId) {
                return requestRepository.findByUserId(userId);
        }
}
