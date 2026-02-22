import React, { useState, useEffect } from 'react';

const AllBorrowRecords = () => {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/borrow/all')
            .then(res => res.json())
            .then(data => setRecords(data));
    }, []);

    return (
        <div>
            <h3>All Borrow Records</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#eee', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th style={{ padding: '10px' }}>User</th>
                        <th style={{ padding: '10px' }}>Book</th>
                        <th style={{ padding: '10px' }}>Issue Date</th>
                        <th style={{ padding: '10px' }}>Return Date</th>
                        <th style={{ padding: '10px' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map(r => (
                        <tr key={r.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '10px' }}>{r.id}</td>
                            <td style={{ padding: '10px' }}>{r.user.firstName} ({r.user.email})</td>
                            <td style={{ padding: '10px' }}>{r.book.title}</td>
                            <td style={{ padding: '10px' }}>{r.issueDate}</td>
                            <td style={{ padding: '10px' }}>{r.returnDate || '-'}</td>
                            <td style={{ padding: '10px' }}>{r.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllBorrowRecords;
