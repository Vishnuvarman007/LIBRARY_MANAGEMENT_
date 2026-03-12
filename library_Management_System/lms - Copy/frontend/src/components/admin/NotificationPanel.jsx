import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { FaCheck, FaTimes, FaEnvelope, FaUserPlus, FaBookReader, FaUndo } from 'react-icons/fa';

const NotificationPanel = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ACTIVITY'); // 'ACTIVITY' or 'REQUESTS'
    const [activityFeed, setActivityFeed] = useState([]);
    const { addToast } = useToast();

    // Modal state
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');
    const [isApproving, setIsApproving] = useState(false);
    const [dueDate, setDueDate] = useState(''); // Only required when approving

    useEffect(() => {
        fetchRequests();
        fetchActivity();
    }, []);

    const fetchActivity = async () => {
        try {
            const [usersRes, borrowsRes] = await Promise.all([
                fetch('http://localhost:8080/api/users'),
                fetch('http://localhost:8080/api/borrow/all')
            ]);

            const users = await usersRes.json();
            const borrows = await borrowsRes.json();

            // Transform into unified feed
            const userEvents = users.map(u => ({
                id: `u-${u.id}`,
                numericId: u.id,
                type: 'USER_REGISTERED',
                message: `User ${u.firstName} ${u.lastName} registered an account.`,
                timestamp: u.id // Simulating time using ID since there's no creation date
            }));

            const borrowEvents = borrows.map(b => ({
                id: `b-${b.id}`,
                numericId: b.id,
                type: b.status === 'ISSUED' ? 'BOOK_BORROWED' : 'BOOK_RETURNED',
                message: `User ${b.user.firstName} ${b.status === 'ISSUED' ? 'borrowed' : 'returned'} the book "${b.book.title}".`,
                timestamp: b.id + 1000 // Offset slightly to mix them
            }));

            const combined = [...userEvents, ...borrowEvents]
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 50); // Keep top 50 recent events

            setActivityFeed(combined);
        } catch (error) {
            console.error("Failed to fetch activity", error);
        }
    };

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8080/api/messages/pending');
            const data = await res.json();
            setRequests(data);
        } catch (error) {
            console.error("Failed to fetch requests", error);
            addToast("Failed to fetch notifications.", "error");
        } finally {
            setLoading(false);
        }
    };

    const openResponseModal = (request, approving) => {
        setSelectedRequest(request);
        setIsApproving(approving);

        // Setup initial dates
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        setDueDate(nextWeek.toISOString().split('T')[0]);
    };

    const handleSendResponse = async (approved) => {
        if (!selectedRequest) return;

        const offsetDays = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));

        const payload = {
            status: approved ? 'APPROVED' : 'REJECTED',
            responseMessage: approved ? 'Approved.' : 'Rejected.',
            adminId: 1, // Fallback, could use context if available
            dueDateOffset: approved ? (offsetDays > 0 ? offsetDays : 1) : 0
        };

        try {
            const res = await fetch(`http://localhost:8080/api/messages/respond/${selectedRequest.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                addToast(`Request ${approved ? 'approved' : 'rejected'} successfully and email sent!`, 'success');
                setSelectedRequest(null);
                fetchRequests();
            } else {
                const text = await res.text();
                addToast(`Failed: ${text}`, 'error');
            }
        } catch (error) {
            addToast('Error processing request.', 'error');
        }
    };

    return (
        <div style={{ padding: '0 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#1e293b' }}>Notification & Activity Panel</h2>
                    <p style={{ margin: '0.5rem 0 0', color: '#64748b' }}>Track recent system activity and manage student requests.</p>
                </div>
                <div>
                    <button
                        className={`btn ${activeTab === 'ACTIVITY' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('ACTIVITY')}
                        style={{ marginRight: '0.5rem', borderRadius: '20px' }}
                    >
                        Recent Activity
                    </button>
                    <button
                        className={`btn ${activeTab === 'REQUESTS' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('REQUESTS')}
                        style={{ borderRadius: '20px' }}
                    >
                        Pending Requests
                    </button>
                    <button onClick={() => { fetchRequests(); fetchActivity(); }} className="btn btn-secondary" style={{ marginLeft: '1rem', borderRadius: '20px' }}>
                        Refresh
                    </button>
                </div>
            </div>

            {activeTab === 'ACTIVITY' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {activityFeed.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                            <p>No recent activity found.</p>
                        </div>
                    ) : (
                        activityFeed.map(event => (
                            <div key={event.id} className="card" style={{
                                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem',
                                borderLeft: event.type === 'USER_REGISTERED' ? '4px solid #8b5cf6' :
                                    (event.type === 'BOOK_BORROWED' ? '4px solid #3b82f6' : '4px solid #10b981')
                            }}>
                                <div style={{
                                    width: '45px', height: '45px', borderRadius: '50%',
                                    background: event.type === 'USER_REGISTERED' ? '#ede9fe' :
                                        (event.type === 'BOOK_BORROWED' ? '#eff6ff' : '#dcfce7'),
                                    color: event.type === 'USER_REGISTERED' ? '#7c3aed' :
                                        (event.type === 'BOOK_BORROWED' ? '#2563eb' : '#16a34a'),
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                                }}>
                                    {event.type === 'USER_REGISTERED' ? <FaUserPlus /> :
                                        (event.type === 'BOOK_BORROWED' ? <FaBookReader /> : <FaUndo />)}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '1.05rem', color: '#1e293b', fontWeight: '500' }}>
                                        {event.message}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                                        Event ID: #{event.numericId}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                                <th style={{ padding: '12px 15px', color: '#64748b' }}>User ID</th>
                                <th style={{ padding: '12px 15px', color: '#64748b' }}>User Name</th>
                                <th style={{ padding: '12px 15px', color: '#64748b' }}>Requested Book</th>
                                <th style={{ padding: '12px 15px', color: '#64748b' }}>Book Number</th>
                                <th style={{ padding: '12px 15px', color: '#64748b', textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>Loading notifications...</td></tr>
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
                                        <FaEnvelope style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.5 }} />
                                        <div>No new reading requests at this time.</div>
                                    </td>
                                </tr>
                            ) : (
                                requests.map(request => (
                                    <tr key={request.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '12px 15px', fontWeight: 'bold', color: '#64748b' }}>
                                            #{request.user.id}
                                        </td>
                                        <td style={{ padding: '12px 15px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: '600', color: '#1e293b' }}>{request.user.firstName} {request.user.lastName}</span>
                                                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{request.user.email}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 15px' }}>
                                            <span style={{ fontWeight: '600', color: '#1e293b' }}>{request.book.title}</span>
                                        </td>
                                        <td style={{ padding: '12px 15px' }}>
                                            <span style={{ color: '#64748b' }}>#{request.book.id}</span>
                                        </td>
                                        <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => {
                                                        setSelectedRequest(request);
                                                        openResponseModal(request, null); // Load dates just in case
                                                    }}
                                                    className="btn btn-secondary"
                                                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0.4rem', borderRadius: '50%', width: '35px', height: '35px', color: '#0284c7', borderColor: '#bae6fd', background: '#e0f2fe' }}
                                                    title="View Details"
                                                >
                                                    <i className="fa-solid fa-eye" style={{ fontSize: '1rem' }}></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Response Modal */}
            {selectedRequest && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1100, backdropFilter: 'blur(4px)'
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '550px', padding: 0, borderRadius: '1rem', overflow: 'hidden' }}>

                        {/* VIEW & ACTION MODE */}
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: '#1e293b' }}>Request Details</h3>
                            <button onClick={() => setSelectedRequest(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}><FaTimes /></button>
                        </div>
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* User Details */}
                            <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px' }}>
                                <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>User Information</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
                                    <div><strong>Name:</strong> {selectedRequest.user.firstName} {selectedRequest.user.lastName}</div>
                                    <div><strong>User ID:</strong> #{selectedRequest.user.id}</div>
                                    <div><strong>Email:</strong> {selectedRequest.user.email}</div>
                                    <div><strong>Phone:</strong> {selectedRequest.user.phone || 'N/A'}</div>
                                </div>
                            </div>

                            {/* Book Details */}
                            <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '8px' }}>
                                <h4 style={{ margin: '0 0 0.5rem 0', color: '#92400e' }}>Book Information</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem', color: '#92400e' }}>
                                    <div><strong>Title:</strong> {selectedRequest.book.title}</div>
                                    <div><strong>Book ID:</strong> #{selectedRequest.book.id}</div>
                                    <div><strong>Author:</strong> {selectedRequest.book.author}</div>
                                    <div><strong>Premium:</strong> {selectedRequest.book.premium ? 'Yes' : 'No'}</div>
                                    <div><strong>Available Copies:</strong> {selectedRequest.book.availableCopies}</div>
                                </div>
                            </div>

                            {/* Due Date Input embedded inside the card directly */}
                            <div className="form-group" style={{ marginTop: '0.5rem' }}>
                                <label style={{ fontWeight: 'bold', color: '#1e293b' }}>Set Due Date (Required for Issuance)</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={dueDate}
                                    min={new Date().toISOString().split('T')[0]} // Cannot be in the past
                                    onChange={(e) => setDueDate(e.target.value)}
                                    required
                                />
                                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                                    If approved, this date will be sent via email to the student automatically.
                                </div>
                            </div>

                            {/* Actions directly inside the form using one handleSendResponse flow. We'll set state first, then trigger form manually or rely on buttons */}
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button
                                    onClick={() => handleSendResponse(true)}
                                    className="btn btn-primary"
                                    style={{ flex: 1, background: '#22c55e', borderColor: '#22c55e', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <FaCheck /> Approve & Issue
                                </button>
                                <button
                                    onClick={() => handleSendResponse(false)}
                                    className="btn btn-secondary"
                                    style={{ flex: 1, color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <FaTimes /> Reject
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationPanel;
