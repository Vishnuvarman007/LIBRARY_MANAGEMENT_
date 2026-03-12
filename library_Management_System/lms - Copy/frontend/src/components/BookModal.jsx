import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaImage } from 'react-icons/fa';

const BookModal = ({ book, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        genre: '',
        totalCopies: 1,
        availableCopies: 1,
        publisher: '',
        isPremium: false
    });
    const [coverImageFile, setCoverImageFile] = useState(null);

    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title || '',
                author: book.author || '',
                isbn: book.isbn || '',
                genre: book.genre || '',
                totalCopies: book.totalCopies || 1,
                availableCopies: book.availableCopies || 1,
                publisher: book.publisher || '',
                isPremium: book.isPremium || false
            });
        }
    }, [book]);

    const handleFileChange = (e) => {
        setCoverImageFile(e.target.files[0]);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalData = { ...formData, totalCopies: formData.availableCopies };
        onSave(finalData, coverImageFile);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1100, backdropFilter: 'blur(4px)'
        }}>
            <div className="card" style={{
                width: '100%', maxWidth: '600px', background: 'white', borderRadius: '1rem',
                padding: '0', position: 'relative', animation: 'slideIn 0.2s ease-out',
                maxHeight: '90vh', overflowY: 'auto'
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
                            <label>Available Copies</label>
                            <input name="availableCopies" type="number" value={formData.availableCopies} onChange={handleChange} required style={{ width: '100%' }} />
                        </div>
                        <div className="form-group">
                            <label>Publisher</label>
                            <input name="publisher" value={formData.publisher} onChange={handleChange} placeholder="e.g. Penguin Books" style={{ width: '100%' }} />
                        </div>
                        <div className="form-group">
                            <label>Cover Image</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                                <label style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
                                    padding: '0.5rem 1rem', background: '#f8fafc', border: '2px dashed #cbd5e1',
                                    borderRadius: '0.5rem', color: '#64748b', transition: 'all 0.2s', margin: 0
                                }}
                                    onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#94a3b8'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                                >
                                    <FaImage style={{ fontSize: '1.25rem', color: '#10b981' }} />
                                    <span style={{ fontWeight: '500' }}>Select Image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                                <span style={{
                                    fontSize: '0.85rem', color: coverImageFile ? '#166534' : '#94a3b8',
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1
                                }}>
                                    {coverImageFile ? coverImageFile.name : 'No image chosen'}
                                </span>
                            </div>
                        </div>
                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', gridColumn: '1 / -1' }}>
                            <input type="checkbox" name="isPremium" checked={formData.isPremium} onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })} id="premium-check" style={{ width: 'auto' }} />
                            <label htmlFor="premium-check" style={{ marginBottom: 0 }}>Premium Book (Requires Membership)</label>
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
