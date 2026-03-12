import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('PENDING'); // 'PENDING' or 'APPROVED'
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
                method: 'POST'
            });
            if (!response.ok) {
                const text = await response.text();
                throw new Error(text);
            }
            addToast("User approved and email sent!", "success");
            fetchUsers(); // Refresh list
        } catch (error) {
            addToast("Approval failed: " + error.message, "error");
        }
    };

    const filteredUsers = users.filter(u => {
        if (filter === 'PENDING') return u.status === 'PENDING';
        // Show all non-pending (APPROVED, REJECTED) in Active/Other tab, or just APPROVED
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
                            <th style={{ padding: '12px 15px', color: '#64748b' }}>Name</th>
                            <th style={{ padding: '12px 15px', color: '#64748b' }}>Email</th>
                            <th style={{ padding: '12px 15px', color: '#64748b' }}>Role</th>
                            <th style={{ padding: '12px 15px', color: '#64748b' }}>Details</th>
                            <th style={{ padding: '12px 15px', color: '#64748b' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>No users found in this category.</td></tr>
                        ) : (
                            filteredUsers.map(u => (
                                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 15px', fontWeight: '500' }}>{u.firstName} {u.lastName}</td>
                                    <td style={{ padding: '12px 15px' }}>{u.email}</td>
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
                                        <div>Phones: {u.phone}</div>
                                        {u.idProofPath && <a href={`http://localhost:8080/${u.idProofPath}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>View ID Proof</a>}
                                    </td>
                                    <td style={{ padding: '12px 15px' }}>
                                        {u.status === 'PENDING' && (
                                            <button
                                                onClick={() => handleApprove(u.id)}
                                                className="btn btn-primary"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', borderRadius: '6px' }}
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {u.status === 'APPROVED' && <span style={{ color: '#22c55e', fontWeight: 'bold' }}>Active</span>}
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

export default UserList;
