import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserSettings = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div style={{ width: '100%' }}>
            <h2 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '2rem' }}>Account Settings</h2>

            <div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage your account preferences and application settings.</p>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
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

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                        <div>
                            <h4 style={{ margin: 0 }}>Sign Out</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sign out of your account safely.</p>
                        </div>
                        <button onClick={() => { logout(); navigate('/'); }} className="btn btn-secondary" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>Logout</button>
                    </div>

                    <div style={{ padding: '1rem', border: '1px solid var(--danger)', borderRadius: '0.5rem', background: '#fff1f2' }}>
                        <h4 style={{ color: 'var(--danger)', margin: '0 0 0.5rem 0' }}>Danger Zone</h4>
                        <button className="btn" style={{ background: 'var(--danger)', color: 'white' }}>Delete Account</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSettings;
