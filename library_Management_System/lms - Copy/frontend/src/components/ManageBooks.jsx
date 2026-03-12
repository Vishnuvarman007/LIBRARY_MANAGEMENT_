import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaBook, FaEye } from 'react-icons/fa';
import BookModal from './BookModal';
import UserBookModal from './UserBookModal';
import { useToast } from '../context/ToastContext';

const ManageBooks = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('ALL'); // ALL, TITLE, AUTHOR, ISBN
    const [showModal, setShowModal] = useState(false);
    const [viewingBook, setViewingBook] = useState(null);
    const [editingBook, setEditingBook] = useState(null);
    const { addToast } = useToast();

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = () => {
        fetch('http://localhost:8080/api/books')
            .then(res => res.json())
            .then(data => {
                setBooks(data);
                setFilteredBooks(data);
            })
            .catch(err => console.error("Failed to fetch books", err));
    };

    useEffect(() => {
        let result = books;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = books.filter(b => {
                if (filterType === 'TITLE') return b.title?.toLowerCase().includes(query);
                if (filterType === 'AUTHOR') return b.author?.toLowerCase().includes(query);
                if (filterType === 'ISBN') return b.isbn?.toLowerCase().includes(query);
                return (
                    b.title?.toLowerCase().includes(query) ||
                    b.author?.toLowerCase().includes(query) ||
                    b.isbn?.toLowerCase().includes(query) ||
                    b.genre?.toLowerCase().includes(query)
                );
            });
        }
        setFilteredBooks(result);
    }, [searchQuery, filterType, books]);

    const handleAddClick = () => {
        setEditingBook(null);
        setShowModal(true);
    };

    const handleEditClick = (book) => {
        setEditingBook(book);
        setShowModal(true);
    };

    const handleViewClick = (book) => {
        setViewingBook(book);
    };

    const handleDeleteClick = async (id) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;

        try {
            const res = await fetch(`http://localhost:8080/api/books/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                addToast('Book deleted successfully', 'success');
                fetchBooks();
            } else {
                addToast('Failed to delete book', 'error');
            }
        } catch (err) {
            addToast("Error deleting book: " + err.message, 'error');
        }
    };

    const handleSaveBook = async (bookData, coverImageFile) => {
        const url = editingBook
            ? `http://localhost:8080/api/books/${editingBook.id}`
            : 'http://localhost:8080/api/books';
        const method = editingBook ? 'PUT' : 'POST';

        try {
            const formData = new FormData();
            formData.append('book', new Blob([JSON.stringify(bookData)], { type: 'application/json' }));
            if (coverImageFile) {
                formData.append('coverImage', coverImageFile);
            }

            const res = await fetch(url, {
                method: method,
                // Do not set Content-Type, browser will automatically set it to multipart/form-data with boundary
                body: formData
            });

            if (res.ok) {
                addToast(editingBook ? 'Book updated!' : 'Book added!', 'success');
                setShowModal(false);
                fetchBooks();
            } else {
                const text = await res.text();
                addToast('Failed to save book: ' + text, 'error');
            }
        } catch (err) {
            addToast("Error saving book: " + err.message, 'error');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#1e293b' }}>Book Inventory</h2>
                    <p style={{ margin: '0.5rem 0 0', color: '#64748b' }}>Manage your library collection</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={handleAddClick}
                    style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <FaPlus /> Add New Book
                </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search books..."
                    style={{
                        flex: 1, padding: '0.75rem 1rem', fontSize: '1rem',
                        fontFamily: 'inherit', border: '1px solid #cbd5e1',
                        borderRadius: '0.5rem', outline: 'none'
                    }}
                />
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    style={{
                        padding: '0.75rem 1rem', fontSize: '1rem',
                        fontFamily: 'inherit', border: '1px solid #cbd5e1',
                        borderRadius: '0.5rem', outline: 'none', background: 'white'
                    }}
                >
                    <option value="ALL">All Fields</option>
                    <option value="TITLE">Title</option>
                    <option value="AUTHOR">Author</option>
                    <option value="ISBN">ISBN</option>
                </select>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1, borderBottom: '2px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b' }}>ID</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b' }}>Title</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b' }}>Author</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b' }}>Genre</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b' }}>Availability</th>
                                <th style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                                        <FaBook style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }} />
                                        <p>No books in inventory. Click "Add New Book" to start.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredBooks.map(b => (
                                    <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.9rem' }}>#{b.id}</td>
                                        <td style={{ padding: '1rem', fontWeight: 500, color: '#1e293b' }}>
                                            {b.title}
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>ISBN: {b.isbn}</div>
                                        </td>
                                        <td style={{ padding: '1rem', color: '#475569' }}>{b.author}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem', color: '#475569' }}>
                                                {b.genre || 'General'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                background: b.availableCopies > 0 ? '#dcfce7' : '#fee2e2',
                                                color: b.availableCopies > 0 ? '#166534' : '#991b1b',
                                                padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold',
                                                display: 'inline-flex', alignItems: 'center', gap: '0.25rem'
                                            }}>
                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
                                                {b.availableCopies} / {b.totalCopies}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleViewClick(b)}
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.5rem', color: '#10b981', borderColor: '#e2e8f0' }}
                                                    title="View Book"
                                                >
                                                    <FaEye />
                                                </button>
                                                <button
                                                    onClick={() => handleEditClick(b)}
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.5rem', color: '#3b82f6', borderColor: '#e2e8f0' }}
                                                    title="Edit Book"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(b.id)}
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.5rem', color: '#ef4444', borderColor: '#e2e8f0' }}
                                                    title="Delete Book"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Book Modal */}
            {showModal && (
                <BookModal
                    book={editingBook}
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveBook}
                />
            )}

            {/* View Book Modal (same as user view) */}
            {viewingBook && (
                <UserBookModal
                    book={viewingBook}
                    onClose={() => setViewingBook(null)}
                />
            )}
        </div>
    );
};

export default ManageBooks;
