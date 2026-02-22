import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';

const BookModal = ({ book, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        genre: '',
        totalCopies: 1,
        availableCopies: 1
    });

    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title || '',
                author: book.author || '',
                isbn: book.isbn || '',
                genre: book.genre || '',
                totalCopies: book.totalCopies || 1,
                availableCopies: book.availableCopies || 1
            });
        }
    }, [book]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1100, backdropFilter: 'blur(4px)'
        }}>
            <div className="card" style={{
                width: '100%', maxWidth: '600px', background: 'white', borderRadius: '1rem',
                padding: '0', position: 'relative', animation: 'slideIn 0.2s ease-out'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.5rem', borderBottom: '1px solid #e2e8f0',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: '#f8fafc', borderRadius: '1rem 1rem 0 0'
                }}>
                    <h3 style={{ margin: 0, color: '#1e293b' }}>{book ? 'Edit Book' : 'Add New Book'}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Book Title</label>
                            <input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. The Great Gatsby" style={{ width: '100%' }} />
                        </div>
                        <div className="form-group">
                            <label>Author</label>
                            <input name="author" value={formData.author} onChange={handleChange} required placeholder="e.g. F. Scott Fitzgerald" style={{ width: '100%' }} />
                        </div>
                        <div className="form-group">
                            <label>ISBN</label>
                            <input name="isbn" value={formData.isbn} onChange={handleChange} required placeholder="e.g. 978-0743273565" style={{ width: '100%' }} disabled={!!book} />
                        </div>
                        <div className="form-group">
                            <label>Genre</label>
                            <input name="genre" value={formData.genre} onChange={handleChange} placeholder="e.g. Classic Fiction" style={{ width: '100%' }} />
                        </div>
                        <div className="form-group">
                            <label>Total Copies</label>
                            <input name="totalCopies" type="number" value={formData.totalCopies} onChange={handleChange} required style={{ width: '100%' }} />
                        </div>
                        <div className="form-group">
                            <label>Available Copies</label>
                            <input name="availableCopies" type="number" value={formData.availableCopies} onChange={handleChange} required style={{ width: '100%' }} />
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                        <button type="button" onClick={onClose} className="btn btn-secondary" style={{ marginRight: '1rem' }}>Cancel</button>
                        <button type="submit" className="btn btn-primary">
                            <FaSave style={{ marginRight: '0.5rem' }} /> Save Book
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookModal;
