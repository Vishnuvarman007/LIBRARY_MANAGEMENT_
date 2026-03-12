import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { FaCheck, FaTimes, FaUserClock } from 'react-icons/fa';

const PendingMemberships = () => {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8080/api/members/pending');
            const data = await res.json();
            setPending(data);
        } catch (error) {
            console.error("Failed to fetch pending memberships", error);
            addToast("Failed to fetch pending memberships.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, isApprove) => {
        const action = isApprove ? 'approve' : 'reject';
        try {
            const res = await fetch(`http://localhost:8080/api/members/${id}/${action}`, {
                method: 'POST'
            });

            if (res.ok) {
                addToast(`Membership ${action}d successfully!`, 'success');
                fetchPending();
            } else {
                const text = await res.text();
                addToast(`Failed: ${text}`, 'error');
            }
        } catch (error) {
            addToast(`Error processing ${action}.`, 'error');
        }
    };

    return (
        <div style={{ padding: '0 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Pending Memberships</h2>
                <button onClick={fetchPending} className="btn btn-secondary">Refresh</button>
            </div>

            <p style={{ color: '#64748b', marginBottom: '2rem' }}>Review and approve user membership subscriptions.</p>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 15px', color: '#64748b' }}>User ID</th>
                            <th style={{ padding: '12px 15px', color: '#64748b' }}>User Name</th>
                            <th style={{ padding: '12px 15px', color: '#64748b' }}>Plan Requested</th>
                            <th style={{ padding: '12px 15px', color: '#64748b' }}>Request Date</th>
                            <th style={{ padding: '12px 15px', color: '#64748b', textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>Loading requests...</td></tr>
                        ) : pending.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
                                    <FaUserClock style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.5 }} />
                                    <div>No pending memberships at this time.</div>
                                </td>
                            </tr>
                        ) : (
                            pending.map(req => (
                                <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 15px', fontWeight: 'bold', color: '#64748b' }}>
                                        #{req.user.id}
                                    </td>
                                    <td style={{ padding: '12px 15px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: '600', color: '#1e293b' }}>{req.user.firstName} {req.user.lastName}</span>
                                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{req.user.email}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 15px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: '600', color: '#1e293b' }}>{req.plan.name}</span>
                                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>${req.plan.price} / {req.plan.durationInMonths} Mo</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 15px', color: '#475569' }}>
                                        {req.startDate ? new Date(req.startDate).toLocaleDateString() : '-'}
                                    </td>
                                    <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleAction(req.id, true)}
                                                className="btn btn-primary"
                                                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0.4rem', borderRadius: '50%', width: '35px', height: '35px', background: '#22c55e', borderColor: '#22c55e' }}
                                                title="Approve"
                                            >
                                                <FaCheck />
                                            </button>
                                            <button
                                                onClick={() => handleAction(req.id, false)}
                                                className="btn btn-secondary"
                                                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0.4rem', borderRadius: '50%', width: '35px', height: '35px', color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2' }}
                                                title="Reject"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PendingMemberships;
