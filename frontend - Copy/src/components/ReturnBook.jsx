import React, { useState } from 'react';

const ReturnBook = () => {
    const [recordId, setRecordId] = useState('');
    const [message, setMessage] = useState('');

    const handleReturn = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:8080/api/borrow/return/${recordId}`, {
                method: 'POST'
            });
            if (!res.ok) throw new Error(await res.text());
            setMessage('Book Returned Successfully!');
            setRecordId('');
        } catch (err) {
            setMessage('Error: ' + err.message);
        }
    };

    return (
        <div className="card">
            <h3>Return Book</h3>
            <form onSubmit={handleReturn}>
                <div className="form-group">
                    <label>Borrow Record ID</label>
                    <input value={recordId} onChange={e => setRecordId(e.target.value)} required />
                </div>
                <button className="btn btn-primary" type="submit">Return Book</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ReturnBook;
