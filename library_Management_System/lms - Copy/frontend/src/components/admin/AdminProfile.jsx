import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminProfile = () => {
    const { user } = useAuth();

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'var(--primary-color)',
                        color: 'white',
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <h2>{user?.name || 'Admin'}</h2>
                    <span style={{
                        background: '#e0e7ff',
                        color: 'var(--primary-color)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                    }}>
                        Administrator
                    </span>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    <div className="form-group">
                        <label style={{ color: 'var(--text-muted)' }}>Email Address</label>
                        <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{user?.email}</div>
                    </div>

                    <div className="form-group">
                        <label style={{ color: 'var(--text-muted)' }}>User ID</label>
                        <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{user?.id}</div>
                    </div>

                    <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            To change your password or update details, please contact system support or use the dedicated settings panel.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
