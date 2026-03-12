import React, { useState, useEffect } from 'react';
import { FaClock, FaBook, FaUser } from 'react-icons/fa';

const RecentActivity = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // We'll fetch all records and display the top 10 most recent ones
        fetch('http://localhost:8080/api/borrow/all')
            .then(res => res.json())
            .then(data => {
                // Sort by ID descending (most recent first)
                const sorted = data.sort((a, b) => b.id - a.id).slice(0, 10);
                setRecords(sorted);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch borrow records", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading activity...</div>;
    }

    return (
        <div style={{ padding: '0 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Recent Activity</h2>
            </div>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>See who recently borrowed or purchased books.</p>

            {records.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    <FaClock style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }} />
                    <p>No recent borrowing activity.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {records.map(record => (
                        <div key={record.id} className="card" style={{
                            display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                            borderLeft: record.status === 'ISSUED' ? '4px solid #3b82f6' :
                                record.status === 'RETURNED' ? '4px solid #22c55e' : '4px solid #f59e0b'
                        }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#64748b'
                            }}>
                                <FaUser />
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.95rem', color: '#1e293b' }}>
                                    <strong>{record.user.firstName} {record.user.lastName}</strong> ({record.user.email})
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                    <FaBook /> {record.book.title}
                                </div>
                            </div>

                            <div style={{ textAlign: 'right', minWidth: '120px' }}>
                                <div style={{
                                    display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold',
                                    background: record.status === 'ISSUED' ? '#eff6ff' :
                                        record.status === 'RETURNED' ? '#dcfce7' : '#fef3c7',
                                    color: record.status === 'ISSUED' ? '#1d4ed8' :
                                        record.status === 'RETURNED' ? '#15803d' : '#b45309'
                                }}>
                                    {record.status}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                                    {record.issueDate ? `Issued: ${record.issueDate}` : `Reserved`}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentActivity;
