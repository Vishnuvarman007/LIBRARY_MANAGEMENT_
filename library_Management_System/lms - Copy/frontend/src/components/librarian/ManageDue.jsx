import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';

const ManageDue = () => {
    const { addToast } = useToast();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8080/api/borrow/all');
            const data = await res.json();
            // Filter only pending requests
            const pending = data.filter(r => r.status === 'RETURN_REQUESTED' || r.status === 'RENEW_REQUESTED');
            setRequests(pending);
        } catch (err) {
            console.error("Failed to fetch due requests", err);
            addToast("Failed to fetch requests", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApproveReturn = async (id) => {
        if (!window.confirm("Approve this return? The book will be marked available.")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/borrow/approve-return/${id}`, { method: 'POST' });
            if (res.ok) {
                addToast("Return approved successfully.", "success");
                fetchRequests();
            } else {
                const text = await res.text();
                addToast(text || "Failed to approve return.", "error");
            }
        } catch (err) {
            console.error(err);
            addToast("Error approving return.", "error");
        }
    };

    const handleApproveRenew = async (id) => {
        if (!window.confirm("Approve this renewal? The due date will be extended by 5 days.")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/borrow/approve-renew/${id}`, { method: 'POST' });
            if (res.ok) {
                addToast("Renewal approved successfully.", "success");
                fetchRequests();
            } else {
                const text = await res.text();
                addToast(text || "Failed to approve renewal.", "error");
            }
        } catch (err) {
            console.error(err);
            addToast("Error approving renewal.", "error");
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>Manage Due & Requests</h2>

            {loading ? <p>Loading requests...</p> : (
                requests.length === 0 ? (
                    <div className="card" style={{ padding: '2rem', textAlign: 'center', background: 'white', borderRadius: '8px' }}>
                        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No pending return or renewal requests.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table" style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '12px 15px' }}>Request Type</th>
                                    <th style={{ padding: '12px 15px' }}>User</th>
                                    <th style={{ padding: '12px 15px' }}>Book Title</th>
                                    <th style={{ padding: '12px 15px' }}>Current Due Date</th>
                                    <th style={{ padding: '12px 15px', textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(r => {
                                    const isReturn = r.status === 'RETURN_REQUESTED';
                                    return (
                                        <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '12px 15px' }}>
                                                <span style={{
                                                    padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                                                    background: isReturn ? '#dcfce7' : '#e0e7ff',
                                                    color: isReturn ? '#166534' : '#3730a3'
                                                }}>
                                                    {isReturn ? 'RETURN' : 'RENEWAL'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 15px' }}>{r.user.firstName} {r.user.lastName} ({r.user.id})</td>
                                            <td style={{ padding: '12px 15px', fontWeight: 'bold' }}>{r.book.title}</td>
                                            <td style={{ padding: '12px 15px', color: '#ef4444' }}>{r.dueDate ? new Date(r.dueDate).toLocaleDateString() : 'N/A'}</td>
                                            <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                                                {isReturn ? (
                                                    <button onClick={() => handleApproveReturn(r.id)} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                                                        Approve Return
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleApproveRenew(r.id)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                                                        Approve Renewal
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )
            )}
        </div>
    );
};

export default ManageDue;
