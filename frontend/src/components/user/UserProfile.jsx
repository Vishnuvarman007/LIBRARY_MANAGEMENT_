import React from 'react';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
    const { user } = useAuth();

    // Parse JSON safely
    const academicInfo = user?.academicInfoJson ? JSON.parse(user.academicInfoJson) : [];
    const workExperience = user?.workExperienceJson ? JSON.parse(user.workExperienceJson) : [];

    if (!user) return <div>Loading...</div>;

    return (
        <div style={{ width: '100%' }}>
            <h2 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '2rem' }}>My Profile</h2>

            <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                    {/* Basic Info */}
                    <div>
                        <h4 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Personal Information</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.8rem', fontSize: '0.95rem' }}>
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

                        <h4 style={{ color: 'var(--primary-color)', marginBottom: '1rem', marginTop: '2rem' }}>Work Experience</h4>
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
        </div>
    );
};

export default UserProfile;
