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

    return (
        <div style={{ width: '100%' }}>
            <h2 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '2rem' }}>My Loans & Reservations</h2>

            <div>
                {loading ? <p>Loading...</p> : (
                    activeRecords.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>No active books or reservations.</p>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {activeRecords.map(r => {
                                const isReserved = r.status === 'RESERVED';

                                return (
                                    <div key={r.id} style={{ border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isReserved ? '#fffbeb' : 'white' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                <span style={{
                                                    fontSize: '0.75rem', fontWeight: 'bold',
                                                    padding: '0.1rem 0.5rem', borderRadius: '1rem',
                                                    background: isReserved ? 'var(--warning)' : 'var(--primary-color)',
                                                    color: 'white'
                                                }}>
                                                    {r.status}
                                                </span>
                                                <h4 style={{ margin: 0 }}>{r.book.title}</h4>
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                                {isReserved ? `Expires on: ${r.dueDate}` : `Due Date: ${r.dueDate}`}
                                            </p>
                                        </div>
                                        <div>
                                            {isReserved && (
                                                <button onClick={() => handleCancel(r.id)} className="btn" style={{ border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default UserLoans;
