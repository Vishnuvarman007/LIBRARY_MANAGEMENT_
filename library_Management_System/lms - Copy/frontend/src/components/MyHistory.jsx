import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const MyHistory = () => {
    const { user } = useAuth();
    const [records, setRecords] = useState([]);

    useEffect(() => {
        if (user) {
            fetch(`http://localhost:8080/api/borrow/user/${user.id}`)
                .then(res => res.json())
                .then(data => setRecords(data));
        }
    }, [user]);

    return (
        <div>
            <h3>My Borrowing History</h3>
            {records.length === 0 ? <p>No records found.</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ background: '#eee', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>Book</th>
                            <th style={{ padding: '10px' }}>Issue Date</th>
                            <th style={{ padding: '10px' }}>Due Date</th>
                            <th style={{ padding: '10px' }}>Return Date</th>
                            <th style={{ padding: '10px' }}>Fine (₹)</th>
                            <th style={{ padding: '10px' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map(r => (
                            <tr key={r.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px' }}>{r.book.title}</td>
                                <td style={{ padding: '10px' }}>{r.issueDate}</td>
                                <td style={{ padding: '10px' }}>{r.dueDate}</td>
                                <td style={{ padding: '10px' }}>{r.returnDate || '-'}</td>
                                <td style={{ padding: '10px' }}>{r.fineAmount ? '₹' + r.fineAmount : '0'}</td>
                                <td style={{ padding: '10px' }}>{r.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MyHistory;
