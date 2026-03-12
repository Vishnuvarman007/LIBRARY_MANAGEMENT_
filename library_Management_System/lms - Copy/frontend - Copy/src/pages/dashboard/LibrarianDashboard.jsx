import React, { useState } from 'react';
import IssueBook from '../../components/IssueBook';
import ReturnBook from '../../components/ReturnBook';
import ManageBooks from '../../components/ManageBooks';

const LibrarianDashboard = () => {
    const [activeTab, setActiveTab] = useState('manage');

    const tabs = [
        { id: 'manage', label: 'Manage Books' },
        { id: 'issue', label: 'Issue Book' },
        { id: 'return', label: 'Return Book' }
    ];

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Librarian Workspace</h2>
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

            <div style={{ animation: 'fadeIn 0.3s ease' }}>
                {activeTab === 'manage' && <ManageBooks />}
                {activeTab === 'issue' && (
                    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                        <IssueBook />
                    </div>
                )}
                {activeTab === 'return' && (
                    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                        <ReturnBook />
                    </div>
                )}
            </div>
        </div>
    );
};

export default LibrarianDashboard;
