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
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                                <th style={{ padding: '12px 15px' }}>Book Title</th>
                                <th style={{ padding: '12px 15px' }}>Issue Date</th>
                                <th style={{ padding: '12px 15px' }}>Due Date</th>
                                <th style={{ padding: '12px 15px' }}>Return Date</th>
                                <th style={{ padding: '12px 15px' }}>Fine (₹)</th>
                                <th style={{ padding: '12px 15px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyRecords.length === 0 ? (
                                <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>No past records found.</td></tr>
                            ) : (
                                historyRecords.map(r => (
                                    <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '12px 15px', fontWeight: 'bold', color: '#1e293b' }}>{r.book.title}</td>
                                        <td style={{ padding: '12px 15px', color: '#475569' }}>{r.issueDate ? new Date(r.issueDate).toLocaleDateString() : '-'}</td>
                                        <td style={{ padding: '12px 15px', color: '#475569' }}>{r.dueDate ? new Date(r.dueDate).toLocaleDateString() : '-'}</td>
                                        <td style={{ padding: '12px 15px', color: '#475569' }}>{r.returnDate ? new Date(r.returnDate).toLocaleDateString() : '-'}</td>
                                        <td style={{ padding: '12px 15px', color: '#ef4444', fontWeight: 'bold' }}>{r.fineAmount ? '₹' + r.fineAmount : '-'}</td>
                                        <td style={{ padding: '12px 15px', fontWeight: 'bold', color: r.status === 'RETURNED' ? '#16a34a' : (r.status === 'CANCELLED' ? '#94a3b8' : '#0284c7') }}>{r.status}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default UserHistory;
