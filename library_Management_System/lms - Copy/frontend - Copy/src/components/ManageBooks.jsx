import React, { useState, useEffect } from 'react';

const ManageBooks = () => {
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', totalCopies: 1, availableCopies: 1, genre: '' });

    const fetchBooks = () => {
        fetch('http://localhost:8080/api/books')
            .then(res => res.json())
            .then(data => setBooks(data));
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleChange = (e) => {
        setNewBook({ ...newBook, [e.target.name]: e.target.value });
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8080/api/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBook)
            });
            if (res.ok) {
                alert('Book added!');
                setNewBook({ title: '', author: '', isbn: '', totalCopies: 1, availableCopies: 1, genre: '' });
                fetchBooks();
            } else {
                alert('Failed to add book');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Add New Book to Inventory</h3>
                <form onSubmit={handleAdd}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div className="form-group">
                            <label>Book Title</label>
                            <input name="title" value={newBook.title} onChange={handleChange} required placeholder="e.g. The Great Gatsby" />
                        </div>
                        <div className="form-group">
                            <label>Author</label>
                            <input name="author" value={newBook.author} onChange={handleChange} required placeholder="e.g. F. Scott Fitzgerald" />
                        </div>
                        <div className="form-group">
                            <label>ISBN</label>
                            <input name="isbn" value={newBook.isbn} onChange={handleChange} required placeholder="e.g. 978-0743273565" />
                        </div>
                        <div className="form-group">
                            <label>Genre</label>
                            <input name="genre" value={newBook.genre} onChange={handleChange} placeholder="e.g. Classic Fiction" />
                        </div>
                        <div className="form-group">
                            <label>Total Copies</label>
                            <input name="totalCopies" type="number" value={newBook.totalCopies} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Available Copies</label>
                            <input name="availableCopies" type="number" value={newBook.availableCopies} onChange={handleChange} required />
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <button className="btn btn-primary" type="submit">Add Book</button>
                    </div>
                </form>
            </div>

            <h3 style={{ marginBottom: '1rem' }}>Inventory List</h3>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <table style={{ width: '100%' }}>
                        <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1 }}>
                            <tr>
                                <th style={{ padding: '1rem' }}>ID</th>
                                <th style={{ padding: '1rem' }}>Title</th>
                                <th style={{ padding: '1rem' }}>Author</th>
                                <th style={{ padding: '1rem' }}>ISBN</th>
                                <th style={{ padding: '1rem' }}>Availability</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map(b => (
                                <tr key={b.id}>
                                    <td style={{ padding: '1rem' }}>{b.id}</td>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{b.title}</td>
                                    <td style={{ padding: '1rem' }}>{b.author}</td>
                                    <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{b.isbn}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            background: b.availableCopies > 0 ? '#dcfce7' : '#fee2e2',
                                            color: b.availableCopies > 0 ? '#166534' : '#991b1b',
                                            padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600
                                        }}>
                                            {b.availableCopies} / {b.totalCopies}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
};

export default ManageBooks;
