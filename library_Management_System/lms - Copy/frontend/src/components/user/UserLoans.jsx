import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const UserLoans = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRecords = () => {
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
    };

    useEffect(() => {
        fetchRecords();
    }, [user]);

    const handleCancel = async (recordId) => {
        if (!window.confirm("Cancel this reservation?")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/borrow/cancel/${recordId}`, {
                method: 'POST'
            });
            if (res.ok) {
                addToast("Reservation cancelled.", "success");
                fetchRecords();
            } else {
                addToast("Failed to cancel.", "error");
            }
        } catch (err) { console.error(err); addToast("Error cancelling.", "error"); }
    };

    const handleRequestReturn = async (recordId) => {
        if (!window.confirm("Request to return this book?")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/borrow/request-return/${recordId}`, {
                method: 'POST'
            });
            if (res.ok) {
                addToast("Return requested successfully.", "success");
                fetchRecords();
            } else {
                const text = await res.text();
                console.error(`Return Request Failed: ${res.status} ${res.statusText}`, text);
                addToast(`Failed: ${text || res.statusText}`, "error");
            }
        } catch (err) { console.error(err); addToast("Error requesting return.", "error"); }
    };

    const handleRequestRenew = async (recordId) => {
        if (!window.confirm("Request to renew this book for 5 more days?")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/borrow/request-renew/${recordId}`, {
                method: 'POST'
            });
            if (res.ok) {
                addToast("Renewal requested successfully.", "success");
                fetchRecords();
            } else {
                const text = await res.text();
                console.error(`Renew Request Failed: ${res.status} ${res.statusText}`, text);
                addToast(`Failed: ${text || res.statusText}`, "error");
            }
        } catch (err) { console.error(err); addToast("Error requesting renewal.", "error"); }
    };

    const activeRecords = records.filter(r => ['ISSUED', 'RESERVED', 'RETURN_REQUESTED', 'RENEW_REQUESTED'].includes(r.status));

    return (
        <div style={{ width: '100%' }}>
            <h2 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '2rem' }}>My Loans & Reservations</h2>

            <div>
                {loading ? <p>Loading...</p> : (
                    activeRecords.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>No active books or reservations.</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '12px 15px' }}>Book Title</th>
                                    <th style={{ padding: '12px 15px' }}>Issue Date</th>
                                    <th style={{ padding: '12px 15px' }}>Due Date</th>
                                    <th style={{ padding: '12px 15px' }}>Return Date</th>
                                    <th style={{ padding: '12px 15px' }}>Fine (₹)</th>
                                    <th style={{ padding: '12px 15px' }}>Status</th>
                                    <th style={{ padding: '12px 15px', textAlign: 'center' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeRecords.map(r => {
                                    const isReserved = r.status === 'RESERVED';

                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0); // normalize for day-only comparison
                                    const dueDate = r.dueDate ? new Date(r.dueDate) : null;
                                    let currentFine = 0;
                                    if (dueDate && today > dueDate && ['ISSUED', 'RETURN_REQUESTED'].includes(r.status)) {
                                        const diffTime = Math.abs(today - dueDate);
                                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                        currentFine = diffDays * 10;
                                    }

                                    return (
                                        <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9', background: isReserved ? '#fefce8' : 'white' }}>
                                            <td style={{ padding: '12px 15px', fontWeight: 'bold', color: '#1e293b' }}>{r.book.title}</td>
                                            <td style={{ padding: '12px 15px', color: '#475569' }}>{r.issueDate ? new Date(r.issueDate).toLocaleDateString() : '-'}</td>
                                            <td style={{ padding: '12px 15px', color: '#475569' }}>{r.dueDate ? new Date(r.dueDate).toLocaleDateString() : '-'}</td>
                                            <td style={{ padding: '12px 15px', color: '#475569' }}>{r.returnDate ? new Date(r.returnDate).toLocaleDateString() : '-'}</td>
                                            <td style={{ padding: '12px 15px', color: '#ef4444', fontWeight: 'bold' }}>{currentFine > 0 ? '₹' + currentFine : '-'}</td>
                                            <td style={{ padding: '12px 15px' }}>
                                                <span style={{
                                                    fontSize: '0.8rem', fontWeight: 'bold', padding: '0.3rem 0.6rem', borderRadius: '4px',
                                                    background: isReserved ? '#fde047' : '#bae6fd',
                                                    color: isReserved ? '#854d0e' : '#0369a1'
                                                }}>
                                                    {r.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                                                {isReserved && (
                                                    <button onClick={() => handleCancel(r.id)} className="btn btn-secondary" style={{ color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                                                        Cancel
                                                    </button>
                                                )}
                                                {r.status === 'ISSUED' && (
                                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                        <button onClick={() => handleRequestReturn(r.id)} className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                                                            Return
                                                        </button>
                                                        <button onClick={() => handleRequestRenew(r.id)} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                                                            Renew
                                                        </button>
                                                    </div>
                                                )}
                                                {(r.status === 'RETURN_REQUESTED' || r.status === 'RENEW_REQUESTED') && (
                                                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>Pending Approval...</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )
                )}
            </div>
        </div>
    );
};

export default UserLoans;
