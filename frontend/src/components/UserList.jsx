import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { FaEye, FaCheckCircle } from 'react-icons/fa';
import UserDetailModal from './UserDetailModal';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('PENDING'); // 'PENDING' or 'APPROVED'
    const [selectedUser, setSelectedUser] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        fetch('http://localhost:8080/api/users')
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error("Failed to fetch users", err));
    };

    const handleApprove = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/auth/approve/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: null })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Failed to approve user');
            }

            // Success Flow
            setSelectedUser(null);
            fetchUsers();

            // Show popup after small delay
            setTimeout(() => {
                setShowSuccessPopup(true);
                setTimeout(() => setShowSuccessPopup(false), 2000);
            }, 300);

        } catch (error) {
            console.error('Error approving user:', error);
            addToast("Approval failed: " + error.message, "error");
        }
    };

    const filteredUsers = users.filter(u => {
        if (filter === 'PENDING') return u.status === 'PENDING';
        return u.status === 'APPROVED';
    });

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>User Management</h3>
                <div>
                    <button
                        className={`btn ${filter === 'PENDING' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('PENDING')}
                        style={{ marginRight: '0.5rem', borderRadius: '20px' }}
                    >
                        Pending Requests
                    </button>
                    <button
                        className={`btn ${filter === 'APPROVED' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('APPROVED')}
                        style={{ borderRadius: '20px' }}
                    >
                        Active Members
                    </button>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 15px', color: '#64748b' }}>RegNo/ID</th>
                            <th style={{ padding: '12px 15px', color: '#64748b' }}>User</th>
                            <th style={{ padding: '12px 15px', color: '#64748b' }}>Role</th>
                            <th style={{ padding: '12px 15px', color: '#64748b' }}>Contact</th>
                            <th style={{ padding: '12px 15px', color: '#64748b', textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>No users found in this category.</td></tr>
                        ) : (
                            filteredUsers.map(u => (
                                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 15px', fontWeight: 'bold', color: '#64748b' }}>
                                        {u.registrationId ? u.registrationId : `#${u.id}`}
                                    </td>
                                    <td style={{ padding: '12px 15px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: '600', color: '#1e293b' }}>{u.firstName} {u.lastName}</span>
                                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{u.email}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 15px' }}>
                                        <span style={{
                                            background: u.role === 'LIBRARIAN' ? '#e0f2fe' : '#f1f5f9',
                                            color: u.role === 'LIBRARIAN' ? '#0284c7' : '#475569',
                                            padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold'
                                        }}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 15px', fontSize: '0.9rem' }}>
                                        {u.phone}
                                    </td>
                                    <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                                        <button
                                            onClick={() => setSelectedUser(u)}
                                            className="btn btn-secondary"
                                            style={{
                                                padding: '0.4rem', borderRadius: '50%', width: '35px', height: '35px',
                                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'var(--primary-color)', borderColor: 'var(--primary-color)'
                                            }}
                                            title="View Details"
                                        >
                                            <FaEye />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <UserDetailModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onApprove={handleApprove}
                />
            )}

            {/* Success Popup */}
            {showSuccessPopup && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1200, pointerEvents: 'none' // allow clicks through? No, wait 2s is short.
                }}>
                    <div style={{
                        background: 'white', padding: '2rem 3rem', borderRadius: '1rem',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                        textAlign: 'center', animation: 'fadeIn 0.3s ease-out'
                    }}>
                        <div style={{ fontSize: '3rem', color: '#10b981', marginBottom: '1rem' }}>
                            <FaCheckCircle />
                        </div>
                        <h2 style={{ margin: 0, color: '#1e293b' }}>User Approved</h2>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;
