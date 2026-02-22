import React, { useState, useEffect } from 'react';
import BookSearch from '../../components/BookSearch';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const UserDashboard = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('overview');
    const [records, setRecords] = useState([]);
    const [stats, setStats] = useState({ active: 0, overdue: 0, reserved: 0 });

    const fetchRecords = () => {
        if (user) {
            fetch(`http://localhost:8080/api/borrow/user/${user.id}`)
                .then(res => res.json())
                .then(data => {
                    setRecords(data);
                    const now = new Date();
                    const active = data.filter(r => r.status === 'ISSUED');
                    const reserved = data.filter(r => r.status === 'RESERVED');
                    const overdue = active.filter(r => new Date(r.dueDate) < now);
                    setStats({
                        active: active.length,
                        overdue: overdue.length,
                        reserved: reserved.length
                    });
                })
                .catch(err => console.error("Failed to fetch records:", err));
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [user]);

    const handleReserve = async (bookId) => {
        if (!window.confirm("Do you want to reserve this book?")) return;
        try {
            const res = await fetch('http://localhost:8080/api/borrow/reserve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, bookId })
            });
            if (res.ok) {
                addToast("Book reserved successfully! Please collect within 3 days.", "success");
                fetchRecords();
                setActiveTab('active');
            } else {
                const msg = await res.text();
                addToast("Reservation failed: " + msg, "error");
            }
        } catch (err) {
            console.error(err);
            addToast("Error reserving book.", "error");
        }
    };

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

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'active', label: 'My Books' },
        { id: 'search', label: 'Search & Reserve' },
        { id: 'history', label: 'History' },
        { id: 'profile', label: 'Full Profile' },
        { id: 'settings', label: 'Settings' }
    ];

    // Parse JSON safely
    const academicInfo = user.academicInfoJson ? JSON.parse(user.academicInfoJson) : [];
    const workExperience = user.workExperienceJson ? JSON.parse(user.workExperienceJson) : [];

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            {/* Header & Stats */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Welcome, {user.firstName}!</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div className="card" style={{ padding: '1.5rem', borderLeft: '5px solid var(--primary-color)' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Active Loans</span>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.active}</div>
                    </div>
                    <div className="card" style={{ padding: '1.5rem', borderLeft: '5px solid var(--warning)' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Reserved</span>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>{stats.reserved}</div>
                    </div>
                    <div className="card" style={{ padding: '1.5rem', borderLeft: '5px solid var(--danger)' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Overdue</span>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--danger)' }}>{stats.overdue}</div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="card" style={{ minHeight: '400px', animation: 'fadeIn 0.3s ease' }}>

                {activeTab === 'overview' && (
                    <div>
                        <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <button onClick={() => setActiveTab('search')} className="btn btn-secondary" style={{ padding: '2rem', flexDirection: 'column', gap: '1rem' }}>
                                <span style={{ fontSize: '2rem' }}>🔍</span>
                                <span>Search & Reserve</span>
                            </button>
                            <button onClick={() => setActiveTab('active')} className="btn btn-secondary" style={{ padding: '2rem', flexDirection: 'column', gap: '1rem' }}>
                                <span style={{ fontSize: '2rem' }}>📚</span>
                                <span>My Books</span>
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'active' && (
                    <div>
                        <h3>My Books (Active & Reserved)</h3>
                        {records.filter(r => ['ISSUED', 'RESERVED'].includes(r.status)).length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>No active books.</p>
                        ) : (
                            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                                {records.filter(r => ['ISSUED', 'RESERVED'].includes(r.status)).map(r => {
                                    const isReserved = r.status === 'RESERVED';
                                    const daysLeft = Math.ceil((new Date(r.dueDate) - new Date()) / (1000 * 60 * 60 * 24));

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
                        )}
                    </div>
                )}

                {activeTab === 'search' && <BookSearch onReserve={handleReserve} />}

                {activeTab === 'history' && (
                    <div>
                        <h3>Borrowing History</h3>
                        <table style={{ width: '100%', marginTop: '1rem' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', color: 'var(--text-muted)', textAlign: 'left', fontSize: '0.85rem' }}>
                                    <th style={{ padding: '1rem' }}>Book</th>
                                    <th style={{ padding: '1rem' }}>Action Date</th>
                                    <th style={{ padding: '1rem' }}>Return Date</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map(r => (
                                    <tr key={r.id}>
                                        <td style={{ padding: '1rem' }}>{r.book.title}</td>
                                        <td style={{ padding: '1rem' }}>{r.issueDate}</td>
                                        <td style={{ padding: '1rem' }}>{r.returnDate || '-'}</td>
                                        <td style={{ padding: '1rem', fontWeight: 'bold', color: r.status === 'RETURNED' ? 'var(--success)' : 'var(--text-muted)' }}>{r.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div>
                        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Full Profile</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                            {/* Basic Info */}
                            <div>
                                <h4 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Personal Information</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.5rem', fontSize: '0.95rem' }}>
                                    <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Member ID:</div><div>{user.id}</div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Role:</div><div><span style={{ background: '#eef2ff', color: 'var(--primary-color)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>{user.role}</span></div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Name:</div><div>{user.firstName} {user.lastName}</div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Email:</div><div>{user.email}</div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Phone:</div><div>{user.phone}</div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Govt ID:</div><div>{user.govtIdType} - {user.govtIdNumber}</div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Gender:</div><div>{user.gender}</div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Marital Status:</div><div>{user.maritalStatus || 'Single'}</div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Address:</div><div>{user.street}, {user.city}, {user.state} - {user.pincode}</div>
                                </div>
                            </div>

                            {/* Academic Info */}
                            <div>
                                <h4 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Academic Details</h4>
                                {academicInfo.length > 0 ? (
                                    <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                                        {academicInfo.map((item, idx) => (
                                            <li key={idx} style={{ marginBottom: '0.5rem' }}>
                                                <strong>{item.degree}</strong> from {item.institution} <br />
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Grade: {item.grade}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p style={{ color: 'var(--text-muted)' }}>No academic details added.</p>}
                            </div>

                            {/* Work Experience */}
                            <div>
                                <h4 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Work Experience</h4>
                                {workExperience.length > 0 ? (
                                    <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                                        {workExperience.map((item, idx) => (
                                            <li key={idx} style={{ marginBottom: '0.5rem' }}>
                                                <strong>{item.designation}</strong> at {item.company} <br />
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Since: {item.start}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p style={{ color: 'var(--text-muted)' }}>No work experience added.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div>
                        <h3>Account Settings</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage your account preferences and application settings.</p>

                        <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '600px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                                <div>
                                    <h4 style={{ margin: 0 }}>Email Notifications</h4>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Receive email updates about books.</p>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" defaultChecked />
                                    <span style={{ marginLeft: '1rem', color: 'var(--primary-color)' }}>On</span>
                                </label>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                                <div>
                                    <h4 style={{ margin: 0 }}>Dark Mode</h4>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Switch between light and dark themes.</p>
                                </div>
                                <button className="btn btn-secondary">Toggle</button>
                            </div>

                            <div style={{ padding: '1rem', border: '1px solid var(--danger)', borderRadius: '0.5rem', background: '#fff1f2' }}>
                                <h4 style={{ color: 'var(--danger)', margin: '0 0 0.5rem 0' }}>Danger Zone</h4>
                                <button className="btn" style={{ background: 'var(--danger)', color: 'white' }}>Delete Account</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
