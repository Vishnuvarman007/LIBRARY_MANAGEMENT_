import React, { useState, useEffect } from 'react';

const BookSearch = ({ onReserve }) => {
    const [books, setBooks] = useState([]);
    const [query, setQuery] = useState('');

    const fetchBooks = async (searchQuery = '') => {
        const url = searchQuery
            ? `http://localhost:8080/api/books/search?query=${searchQuery}`
            : 'http://localhost:8080/api/books';

        const res = await fetch(url);
        const data = await res.json();
        setBooks(data);
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBooks(query);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Search Books</h3>
            </div>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem',}}>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by title, author, or ISBN..."
                    style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary">Search</button>
            </form>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {books.map(book => (
                    <div key={book.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{book.title}</h4>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.9rem' }}>by {book.author}</p>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <span style={{ background: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>{book.genre || 'General'}</span>
                                <span style={{ background: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>ISBN: {book.isbn}</span>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <span style={{
                                    display: 'inline-block',
                                    width: '10px', height: '10px', borderRadius: '50%',
                                    background: book.availableCopies > 0 ? 'var(--success)' : 'var(--danger)',
                                    marginRight: '0.5rem'
                                }}></span>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    {book.availableCopies > 0 ? `${book.availableCopies} Available` : 'Out of Stock'}
                                </span>
                            </div>

                            {onReserve && book.availableCopies > 0 && (
                                <button
                                    onClick={() => onReserve(book.id)}
                                    className="btn btn-primary"
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                >
                                    Reserve
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {books.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>No books found.</p>}
        </div>
    );
};

export default BookSearch;
