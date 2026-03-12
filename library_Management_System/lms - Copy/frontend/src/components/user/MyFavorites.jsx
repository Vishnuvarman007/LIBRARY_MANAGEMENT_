import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserBookModal from '../UserBookModal';

const MyFavorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const { user } = useAuth();

    const actualUserId = user?.id || user?.user?.id;

    useEffect(() => {
        if (actualUserId) {
            fetchFavorites();
        }
    }, [actualUserId]);

    const fetchFavorites = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/favorites/user/${actualUserId}`);
            const data = await res.json();
            setFavorites(data);
        } catch (error) {
            console.error("Failed to fetch favorites", error);
        }
    };

    return (
        <div>
            <h2>My Favorites</h2>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>Books you have saved for later.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem' }}>
                {favorites.map(favorite => (
                    <div
                        key={favorite.id}
                        className="card"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            padding: 0,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                        onClick={() => setSelectedBook(favorite.book)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                        }}
                    >
                        {/* Cover Image */}
                        <div style={{
                            height: '280px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderBottom: '1px solid #e2e8f0',
                            background: '#e2e8f0',
                            overflow: 'hidden'
                        }}>
                            {favorite.book.coverImage ? (
                                <img 
                                    src={`http://localhost:8080/api/books/image/${encodeURIComponent(favorite.book.coverImage)}`}
                                    alt={favorite.book.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = '<span style="color: #94a3b8">No Cover Image</span>';
                                    }}
                                />
                            ) : (
                                <span style={{ color: '#94a3b8' }}>No Cover Image</span>
                            )}
                        </div>

                        {/* Details */}
                        <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {favorite.book.title}
                            </h4>
                            <p style={{ color: '#64748b', margin: 0, fontSize: '0.85rem' }}>{favorite.book.author}</p>

                            {favorite.book.isPremium && (
                                <span style={{
                                    background: '#fef3c7', color: '#92400e',
                                    padding: '0.2rem 0.5rem', borderRadius: '4px',
                                    fontSize: '0.7rem', marginTop: '0.5rem', alignSelf: 'flex-start',
                                    fontWeight: 'bold'
                                }}>
                                    PREMIUM
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {favorites.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>You haven't saved any books yet.</p>}

            {selectedBook && (
                <UserBookModal
                    book={selectedBook}
                    onClose={() => {
                        setSelectedBook(null);
                        fetchFavorites(); // Refresh in case it was unfavorited
                    }}
                />
            )}
        </div>
    );
};

export default MyFavorites;
