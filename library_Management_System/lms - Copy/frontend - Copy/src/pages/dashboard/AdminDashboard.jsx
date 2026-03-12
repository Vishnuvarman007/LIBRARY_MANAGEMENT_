import React, { useState } from 'react';
import ManageBooks from '../../components/ManageBooks';
import UserList from '../../components/UserList';
import AllBorrowRecords from '../../components/AllBorrowRecords';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');

    const tabs = [
        { id: 'users', label: 'Manage Users' },
        { id: 'books', label: 'Manage Books' },
        { id: 'records', label: 'View Records' }
    ];

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Admin Console</h2>
                <div style={{ background: 'white', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', border: activeTab === tab.id ? 'none' : '1px solid transparent' }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="card" style={{ padding: '1.5rem', minHeight: '500px' }}>
                {activeTab === 'users' && <UserList />}
                {activeTab === 'books' && <ManageBooks />}
                {activeTab === 'records' && <AllBorrowRecords />}
            </div>
        </div>
    );
};

export default AdminDashboard;
