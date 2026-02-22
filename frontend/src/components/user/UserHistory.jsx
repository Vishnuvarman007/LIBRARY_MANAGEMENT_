import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const UserHistory = () => {
    const { user } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(true);
            fetch(`http://localhost:8080/api/borrow/user/${user.id}`)
                .then(res => res.json())
                .then(data => {
                    setRecords(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch records:", err);
                    setLoading(false);
                });
        }
    }, [user]);

    const historyRecords = records.filter(r => r.status === 'RETURNED' || r.status === 'CANCELLED');

    return (
        <div style={{ width: '100%' }}>
            <h2 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '2rem' }}>Borrowing History</h2>

            <div>
                {loading ? <p>Loading...</p> : (
                    <table style={{ width: '100%' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', color: 'var(--text-muted)', textAlign: 'left', fontSize: '0.85rem' }}>
                                <th style={{ padding: '1rem' }}>Book</th>
                                <th style={{ padding: '1rem' }}>Action Date</th>
                                <th style={{ padding: '1rem' }}>Return Date</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(r => (
                                <tr key={r.id}>
                                    <td style={{ padding: '1rem' }}>{r.book.title}</td>
                                    <td style={{ padding: '1rem' }}>{r.issueDate}</td>
                                    <td style={{ padding: '1rem' }}>{r.returnDate || '-'}</td>
                                    <td style={{ padding: '1rem', fontWeight: 'bold', color: r.status === 'RETURNED' ? 'var(--success)' : (r.status === 'CANCELLED' ? 'var(--text-muted)' : 'var(--primary-color)') }}>{r.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default UserHistory;
