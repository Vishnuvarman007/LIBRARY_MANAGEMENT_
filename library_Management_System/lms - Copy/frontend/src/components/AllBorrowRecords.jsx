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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#1e293b' }}>Borrow Records</h2>
                    <p style={{ margin: '0.5rem 0 0', color: '#64748b' }}>Monitor all book lending history</p>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1, borderBottom: '2px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b' }}>ID</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b' }}>User</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b' }}>Book</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b' }}>Issue Date</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b' }}>Due Date</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b' }}>Returned On</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                                        <p>No borrow records found.</p>
                                    </td>
                                </tr>
                            ) : (
                                records.map(r => (
                                    <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.9rem' }}>#{r.id}</td>
                                        <td style={{ padding: '1rem', fontWeight: 500, color: '#1e293b' }}>
                                            {r.user.firstName} {r.user.lastName}
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>{r.user.email}</div>
                                        </td>
                                        <td style={{ padding: '1rem', color: '#475569' }}>{r.book.title}</td>
                                        <td style={{ padding: '1rem', color: '#475569' }}>{r.issueDate ? new Date(r.issueDate).toLocaleDateString() : '-'}</td>
                                        <td style={{ padding: '1rem', color: '#475569' }}>{r.dueDate ? new Date(r.dueDate).toLocaleDateString() : '-'}</td>
                                        <td style={{ padding: '1rem', color: '#475569' }}>
                                            {r.returnDate ? new Date(r.returnDate).toLocaleDateString() : <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not Returned</span>}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                background: r.status === 'RETURNED' ? '#dcfce7' : (r.status === 'OVERDUE' ? '#fee2e2' : '#fef9c3'),
                                                color: r.status === 'RETURNED' ? '#166534' : (r.status === 'OVERDUE' ? '#991b1b' : '#854d0e'),
                                                padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold',
                                                display: 'inline-flex', alignItems: 'center', gap: '0.25rem'
                                            }}>
                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
                                                {r.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllBorrowRecords;
