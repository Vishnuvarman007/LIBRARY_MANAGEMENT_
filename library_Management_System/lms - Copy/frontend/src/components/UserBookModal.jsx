import React, { useState, useEffect } from 'react';
import { FaTimes, FaHeart, FaRegHeart, FaPaperPlane, FaStar } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const UserBookModal = ({ book, onClose }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteId, setFavoriteId] = useState(null);
    const [isRequesting, setIsRequesting] = useState(false);

    // Reviews state
    const [reviews, setReviews] = useState([]);
    const [newReviewComment, setNewReviewComment] = useState('');
    const [newReviewRating, setNewReviewRating] = useState(5);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const { addToast } = useToast();
    const { user } = useAuth();
    const currentUserRole = user?.role || user?.user?.role;
    const actualUserId = user?.id || user?.user?.id;

    useEffect(() => {
        if (actualUserId && book?.id) {
            // Fetch Favorites
            fetch(`http://localhost:8080/api/favorites/user/${actualUserId}`)
                .then(res => res.json())
                .then(data => {
                    const fav = data.find(f => f.book.id === book.id);
                    if (fav) {
                        setIsFavorite(true);
                        setFavoriteId(fav.id);
                    }
                })
                .catch(err => console.error(err));
        }

        if (book?.id) {
            fetchReviews();
        }
    }, [actualUserId, book]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/reviews/book/${book.id}`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        }
    };

    const handleFavoriteToggle = async () => {
        if (!actualUserId) {
            addToast('Error: User ID not found.', 'error');
            return;
        }

        try {
            if (isFavorite && favoriteId) {
                const res = await fetch(`http://localhost:8080/api/favorites/${favoriteId}`, {
                    method: 'DELETE'
                });
                if (res.ok) {
                    addToast('Removed from favorites', 'success');
                    setIsFavorite(false);
                    setFavoriteId(null);
                } else {
                    addToast('Could not remove favorite', 'error');
                }
            } else {
                const res = await fetch('http://localhost:8080/api/favorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: actualUserId, bookId: book.id })
                });
                if (res.ok) {
                    const newFav = await res.json();
                    addToast('Added to favorites!', 'success');
                    setIsFavorite(true);
                    setFavoriteId(newFav.id);
                } else {
                    const err = await res.text();
                    addToast('Could not add to favorites: ' + err, 'error');
                }
            }
        } catch (error) {
            addToast('Error handling favorite', 'error');
        }
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();

        if (!actualUserId) {
            addToast('Error: User ID not found. Please log in again.', 'error');
            return;
        }

        setIsRequesting(true);
        try {
            const res = await fetch('http://localhost:8080/api/messages/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: actualUserId, bookId: book.id, message: "I would like to request this book." })
            });
            if (res.ok) {
                addToast('Request sent to librarian!', 'success');
                onClose();
            } else {
                const err = await res.text();
                addToast('Failed to send request: ' + err, 'error');
            }
        } catch (error) {
            addToast('Error sending request', 'error');
        } finally {
            setIsRequesting(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!actualUserId) {
            addToast('Please login to leave a review', 'error');
            return;
        }
        if (!newReviewComment.trim()) return;

        setIsSubmittingReview(true);
        try {
            const res = await fetch('http://localhost:8080/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: actualUserId,
                    bookId: book.id,
                    rating: newReviewRating,
                    comment: newReviewComment
                })
            });

            if (res.ok) {
                addToast('Review submitted successfully!', 'success');
                setNewReviewComment('');
                setNewReviewRating(5);
                fetchReviews(); // Refresh list
            } else {
                const err = await res.text();
                addToast('Failed to submit review: ' + err, 'error');
            }
        } catch (error) {
            addToast('Error submitting review', 'error');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1100, backdropFilter: 'blur(8px)', padding: '2rem'
        }}>
            <div className="card" style={{
                width: '100%', maxWidth: '900px', maxHeight: '90vh', background: 'white',
                borderRadius: '1.5rem', padding: '0', position: 'relative',
                animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)', display: 'flex',
                flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
                {/* Action Buttons at top right boundary */}
                <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', display: 'flex', gap: '0.75rem', zIndex: 10 }}>
                    <button onClick={handleFavoriteToggle} style={{
                        background: '#f1f5f9', border: 'none', cursor: 'pointer',
                        fontSize: '1.2rem', color: isFavorite ? '#e11d48' : '#64748b', width: '36px', height: '36px',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                        onMouseOver={(e) => { e.currentTarget.style.background = isFavorite ? '#ffe4e6' : '#e2e8f0'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                        title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    >
                        {isFavorite ? <FaHeart /> : <FaRegHeart />}
                    </button>
                    <button onClick={onClose} style={{
                        background: '#f1f5f9', border: 'none', cursor: 'pointer',
                        fontSize: '1.2rem', color: '#64748b', width: '36px', height: '36px',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#334155'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
                        title="Close"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Top Section: Top Layout (Left Image, Right Details) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', flexShrink: 0 }}>
                    {/* Left side: Image */}
                    <div style={{
                        width: '320px',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        minHeight: '380px', 
                        borderRight: '1px solid #f1f5f9',
                        background: '#f8fafc',
                        overflow: 'hidden'
                    }}>
                        {book.coverImage ? (
                            <img 
                                src={`http://localhost:8080/api/books/image/${encodeURIComponent(book.coverImage)}`}
                                alt={book.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<span style="color: #94a3b8; font-size: 1.1rem; font-weight: 500">No Cover Image</span>';
                                }}
                            />
                        ) : (
                            <span style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: '500' }}>No Cover Image</span>
                        )}
                    </div>

                    {/* Right side: Details */}
                    <div style={{ flex: 1, padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', paddingRight: '2rem' }}>
                            <div>
                                <h2 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '2rem', fontWeight: '700', lineHeight: 1.2 }}>{book.title}</h2>
                                <p style={{ margin: 0, color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>by <span style={{ color: '#3b82f6' }}>{book.author}</span></p>
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
                                    {book.publisher || 'Unknown Publisher'}
                                </span>
                                <span style={{ background: '#eff6ff', color: '#2563eb', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
                                    {book.genre || 'General'}
                                </span>
                                {book.isPremium && (
                                    <span style={{ background: '#fef3c7', color: '#d97706', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
                                        ★ Premium Book
                                    </span>
                                )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{
                                    display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%',
                                    background: book.availableCopies > 0 ? '#10b981' : '#ef4444',
                                    boxShadow: book.availableCopies > 0 ? '0 0 0 4px #d1fae5' : '0 0 0 4px #fee2e2'
                                }}></span>
                                <strong style={{ color: book.availableCopies > 0 ? '#059669' : '#b91c1c', fontSize: '1.05rem' }}>
                                    {book.availableCopies > 0 ? `${book.availableCopies} Copies Available` : 'Currently Out of Stock'}
                                </strong>
                            </div>
                        </div>

                        {/* Actions wrapper positioned at bottom of right column */}
                        <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem' }}>
                            {currentUserRole === 'USER' && (
                                <>
                                    <button
                                        onClick={async () => {
                                            if (!actualUserId) {
                                                addToast('Please log in to borrow books', 'error');
                                                return;
                                            }
                                            if (book.availableCopies <= 0) {
                                                addToast('Book is not available', 'error');
                                                return;
                                            }
                                            try {
                                                const res = await fetch('http://localhost:8080/api/borrow/issue', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ userId: actualUserId, bookId: book.id })
                                                });
                                                if (res.ok) {
                                                    addToast('Book borrowed successfully!', 'success');
                                                    onClose();
                                                } else {
                                                    const err = await res.text();
                                                    addToast('Failed to borrow: ' + err, 'error');
                                                }
                                            } catch (error) {
                                                addToast('Error borrowing book', 'error');
                                            }
                                        }}
                                        className="btn btn-primary"
                                        disabled={book.availableCopies <= 0}
                                        style={{
                                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                            padding: '0.875rem', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: '600',
                                            opacity: book.availableCopies <= 0 ? 0.5 : 1,
                                            background: book.availableCopies > 0 ? '#10b981' : undefined
                                        }}>
                                        <FaPaperPlane /> Borrow Now
                                    </button>
                                    <button
                                        onClick={handleRequestSubmit}
                                        className="btn btn-secondary"
                                        disabled={isRequesting}
                                        style={{
                                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                            padding: '0.875rem', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: '600'
                                        }}>
                                        <FaPaperPlane /> {isRequesting ? 'Requesting...' : 'Request Help'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Scrollable Reviews */}
                <div style={{
                    flex: 1, background: '#f8fafc', borderTop: '1px solid #e2e8f0',
                    padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column',
                    overflow: 'hidden' // Container holds firm
                }}>
                    <h3 style={{ margin: '0 0 1.5rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaStar style={{ color: '#fbbf24' }} /> User Reviews ({reviews.length})
                    </h3>

                    {/* Scrollable List */}
                    <div style={{ overflowY: 'auto', flex: 1, paddingRight: '1rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {reviews.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem 0', fontStyle: 'italic' }}>
                                No reviews yet. Be the first to share your thoughts!
                            </div>
                        ) : (
                            reviews.map(review => (
                                <div key={review.id} style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #f1f5f9', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <strong style={{ color: '#1e293b' }}>{review.user?.firstName || 'User'} {review.user?.lastName || ''}</strong>
                                        <div style={{ color: '#fbbf24', display: 'flex', gap: '2px' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} color={i < review.rating ? '#fbbf24' : '#e2e8f0'} />
                                            ))}
                                        </div>
                                    </div>
                                    <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                        "{review.comment}"
                                    </p>
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>


                </div>
            </div>
        </div>
    );
};

export default UserBookModal;
