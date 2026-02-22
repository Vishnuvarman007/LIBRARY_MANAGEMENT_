import React, { useState } from 'react';

const IssueBook = () => {
    const [userId, setUserId] = useState('');
    const [bookId, setBookId] = useState('');
    const [message, setMessage] = useState('');

    const handleIssue = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8080/api/borrow/issue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: Number(userId), bookId: Number(bookId) })
            });
            if (!res.ok) throw new Error(await res.text());
            setMessage('Book Issued Successfully!');
            setUserId('');
            setBookId('');
        } catch (err) {
            setMessage('Error: ' + err.message);
        }
    };

    return (
        <div className="card">
            <h3>Issue Book</h3>
            <form onSubmit={handleIssue}>
                <div className="form-group">
                    <label>User ID</label>
                    <input value={userId} onChange={e => setUserId(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Book ID</label>
                    <input value={bookId} onChange={e => setBookId(e.target.value)} required />
                </div>
                <button className="btn btn-primary" type="submit">Issue Book</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default IssueBook;
