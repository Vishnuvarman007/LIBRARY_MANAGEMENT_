import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
    const { user: authUser } = useAuth();
    const user = authUser?.user;
    const [memberships, setMemberships] = useState([]);

    useEffect(() => {
        if (user && user.id) {
            fetch(`http://localhost:8080/api/members/user/${user.id}`)
                .then(res => res.json())
                .then(data => setMemberships(data))
                .catch(err => console.error("Error fetching memberships:", err));
        }
    }, [user]);

    // Parse JSON safely
    const academicInfo = user?.academicInfoJson ? JSON.parse(user.academicInfoJson) : [];
    const workExperience = user?.workExperienceJson ? JSON.parse(user.workExperienceJson) : [];

    if (!user) return <div>Loading...</div>;

    return (
        <div style={{ width: '100%' }}>
            <h2 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '2rem' }}>My Profile</h2>

            <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                    {/* Left Column: Basic Info & Membership */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Basic Info */}
                        <div>
                            <h4 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Personal Information</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.8rem', fontSize: '0.95rem' }}>
                                <div style={{ fontWeight: 600, }}>Member ID:</div><div>{user.id}</div>
                                <div style={{ fontWeight: 600, }}>Reg ID:</div><div>{user.registrationId}</div>
                                <div style={{ fontWeight: 600, }}>Role:</div><div><span style={{ background: '#eef2ff', color: 'var(--primary-color)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>{user.role}</span></div>
                                <div style={{ fontWeight: 600, }}>Name:</div><div>{user.firstName} {user.lastName}</div>
                                <div style={{ fontWeight: 600, }}>Email:</div><div>{user.email}</div>
                                <div style={{ fontWeight: 600, }}>Phone:</div><div>{user.phone}</div>
                                <div style={{ fontWeight: 600, }}>Govt ID:</div><div>{user.govtIdType} - {user.govtIdNumber}</div>
                                <div style={{ fontWeight: 600, }}>Gender:</div><div>{user.gender}</div>
                                <div style={{ fontWeight: 600, }}>Marital Status:</div><div>{user.maritalStatus || 'Single'}</div>
                                <div style={{ fontWeight: 600, }}>Address:</div><div>{user.street}, {user.city}, {user.state} - {user.pincode}</div>
                            </div>
                        </div>

                        {/* Membership Details */}
                        <div>
                            <h4 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Membership Details</h4>
                            {memberships.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {memberships.map((membership) => (
                                        <div key={membership.id} style={{
                                            border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem',
                                            background: membership.status === 'APPROVED' ? '#f0fdf4' : membership.status === 'REJECTED' ? '#fef2f2' : '#f8fafc'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <strong style={{ fontSize: '1.1rem' }}>{membership.plan.name} Plan</strong>
                                                <span style={{
                                                    background: membership.status === 'APPROVED' ? '#22c55e' : membership.status === 'REJECTED' ? '#ef4444' : '#f59e0b',
                                                    color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold'
                                                }}>
                                                    {membership.status}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '0.25rem' }}>Duration: {membership.plan.durationMonths} Months</div>
                                            <div style={{ fontSize: '0.9rem', color: '#475569' }}>Total Allowed Books: {membership.plan.maxBooksAllows}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-muted)' }}>No active membership found. You can request one from your dashboard.</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Academic & Work Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Academic Info */}
                        <div>
                            <h4 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Academic Details</h4>
                            {academicInfo.length > 0 ? (
                                <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                                    {academicInfo.map((item, idx) => (
                                        <li key={idx} style={{ marginBottom: '0.5rem' }}>
                                            <strong>{item.degree}</strong> from {item.institution} <br />
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Class of {item.year} • Grade/CGPA: {item.grade}</span>
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
                                            <strong>{item.designation}</strong> at {item.company}
                                        </li>
                                    ))}
                                </ul>
                            ) : <p style={{ color: 'var(--text-muted)' }}>No work experience added.</p>}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
