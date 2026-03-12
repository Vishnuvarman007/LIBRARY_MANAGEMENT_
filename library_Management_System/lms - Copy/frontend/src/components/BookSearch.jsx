import React, { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';
import UserBookModal from './UserBookModal';

const BookSearch = () => {
    const [books, setBooks] = useState([]);
    const [query, setQuery] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);

    // Advanced Filters State
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [isPremiumFilter, setIsPremiumFilter] = useState('ALL'); // 'ALL', 'FREE', 'PREMIUM'
    const [filteredBooks, setFilteredBooks] = useState([]);

    // Derived unique filter lists
    const uniqueGenres = [...new Set(books.map(b => b.genre || 'General'))].filter(Boolean);
    const uniqueAuthors = [...new Set(books.map(b => b.author))].filter(Boolean);

    const fetchBooks = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/books');
            const data = await res.json();
            setBooks(data);
            setFilteredBooks(data);
        } catch (err) {
            console.error("Failed to fetch books", err);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        let result = books;

        // 1. Text Search (Title/ISBN)
        if (query) {
            const lowerQuery = query.toLowerCase();
            result = result.filter(b =>
                b.title?.toLowerCase().includes(lowerQuery) ||
                b.isbn?.toLowerCase().includes(lowerQuery)
            );
        }

        // 2. Genre Filter
        if (selectedGenres.length > 0) {
            result = result.filter(b => selectedGenres.includes(b.genre || 'General'));
        }

        // 3. Author Filter
        if (selectedAuthors.length > 0) {
            result = result.filter(b => selectedAuthors.includes(b.author));
        }

        // 4. Premium Filter
        if (isPremiumFilter === 'PREMIUM') {
            result = result.filter(b => b.isPremium === true);
        } else if (isPremiumFilter === 'FREE') {
            result = result.filter(b => !b.isPremium);
        }

        setFilteredBooks(result);
    }, [query, selectedGenres, selectedAuthors, isPremiumFilter, books]);

    const handleGenreFilterChange = (genre) => {
        setSelectedGenres(prev =>
            prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
        );
    };

    const handleAuthorFilterChange = (author) => {
        setSelectedAuthors(prev =>
            prev.includes(author) ? prev.filter(a => a !== author) : [...prev, author]
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Search Books</h3>
            </div>

            <div style={{ position: 'relative', marginBottom: '1.5rem', zIndex: 10 }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Quick search by title or ISBN..."
                        style={{
                            flex: 1, padding: '0.75rem 1rem', fontSize: '1rem',
                            fontFamily: 'inherit', border: '1px solid #cbd5e1',
                            borderRadius: '0.5rem', outline: 'none'
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="btn btn-secondary"
                        style={{ padding: '0 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: isFilterOpen ? '#3b82f6' : '#cbd5e1', cursor: 'pointer' }}
                        title="Filter Books"
                    >
                        <FaFilter style={{ color: isFilterOpen ? '#3b82f6' : '#64748b' }} />
                    </button>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem', borderRadius: '0.5rem' }}>Search</button>
                </form>

                {/* ---------------- FILTER DROPDOWN CARD ---------------- */}
                {isFilterOpen && (
                    <div className="card" style={{
                        position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                        width: 'max-content', maxWidth: '600px', padding: '1.5rem', zIndex: 20,
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                        display: 'flex', gap: '2rem', flexWrap: 'wrap',
                        border: '1px solid #e2e8f0'
                    }}>

                        {/* Premium / Free */}
                        <div style={{ flex: '1 1 120px' }}>
                            <h5 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem' }}>ACCESS</h5>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {['ALL', 'FREE', 'PREMIUM'].map(type => (
                                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                        <input
                                            type="radio"
                                            name="premiumFilter"
                                            value={type}
                                            checked={isPremiumFilter === type}
                                            onChange={() => setIsPremiumFilter(type)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        {type === 'ALL' ? 'All Books' : type === 'FREE' ? 'Standard (Free)' : 'Premium Only'}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Genre Filter */}
                        {uniqueGenres.length > 0 && (
                            <div style={{ flex: '1 1 120px' }}>
                                <h5 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem' }}>GENRE</h5>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                    {uniqueGenres.map(genre => (
                                        <label key={genre} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedGenres.includes(genre)}
                                                onChange={() => handleGenreFilterChange(genre)}
                                                style={{ cursor: 'pointer', flexShrink: 0 }}
                                            />
                                            {genre}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Author Filter */}
                        {uniqueAuthors.length > 0 && (
                            <div style={{ flex: '1 1 120px' }}>
                                <h5 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem' }}>AUTHOR</h5>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                    {uniqueAuthors.map(author => (
                                        <label key={author} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedAuthors.includes(author)}
                                                onChange={() => handleAuthorFilterChange(author)}
                                                style={{ cursor: 'pointer', flexShrink: 0 }}
                                            />
                                            {author}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                            <button
                                onClick={() => {
                                    setSelectedGenres([]);
                                    setSelectedAuthors([]);
                                    setIsPremiumFilter('ALL');
                                }}
                                className="btn btn-secondary"
                                style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}
                            >
                                Clear Filters
                            </button>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="btn btn-primary"
                                style={{ padding: '0.5rem 1rem' }}
                            >
                                Apply & Close
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ---------------- MAIN BOOK GRID ---------------- */}
            <div>
                {filteredBooks.length === 0 ? (
                    <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', width: '100%' }}>
                        <p style={{ margin: 0, fontSize: '1.1rem' }}>No books match your selected filters or search query.</p>
                        <button
                            onClick={() => {
                                setQuery('');
                                setSelectedGenres([]);
                                setSelectedAuthors([]);
                                setIsPremiumFilter('ALL');
                            }}
                            className="btn btn-secondary"
                            style={{ marginTop: '1rem' }}
                        >
                            Reset Everything
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem' }}>
                        {filteredBooks.map(book => (
                            <div
                                key={book.id}
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
                                onClick={() => setSelectedBook(book)}
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
                                    {book.coverImage ? (
                                        <img 
                                            src={`http://localhost:8080/api/books/image/${encodeURIComponent(book.coverImage)}`}
                                            alt={book.title}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain'
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
                                        {book.title}
                                    </h4>
                                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.85rem' }}>{book.author}</p>

                                    {book.isPremium && (
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
                )}
            </div>

            {selectedBook && (
                <UserBookModal
                    book={selectedBook}
                    onClose={() => setSelectedBook(null)}
                />
            )}
        </div>
    );
};

export default BookSearch;
