import React from 'react';
import { FaTimes, FaCheck, FaBan } from 'react-icons/fa';

const UserDetailModal = ({ user, onClose, onApprove }) => {

    if (!user) return null;

    // Parse JSON safely
    const academicInfo = user.academicInfoJson ? JSON.parse(user.academicInfoJson) : [];
    const workExperience = user.workExperienceJson ? JSON.parse(user.workExperienceJson) : [];

    const handleApproveClick = () => {
        onApprove(user.id);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1100, backdropFilter: 'blur(4px)'
        }}>
            <div className="card" style={{
                width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto',
                background: 'white', borderRadius: '1rem', padding: '0', position: 'relative',
                animation: 'slideIn 0.2s ease-out'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.5rem', borderBottom: '1px solid #e2e8f0',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: '#f8fafc', borderRadius: '1rem 1rem 0 0'
                }}>
                    <h3 style={{ margin: 0, color: '#1e293b' }}>User Details</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}>
                        <FaTimes />
                    </button>
                </div>

                <div style={{ padding: '2rem' }}>
                    {/* Basic Info Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{
                            width: '120px', height: '120px', borderRadius: '50%', background: '#e2e8f0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '3rem', fontWeight: 'bold', color: '#94a3b8', margin: '0 auto'
                        }}>
                            {user.firstName.charAt(0)}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Full Name</label>
                                <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{user.firstName} {user.lastName}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Email</label>
                                <div>{user.email}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Phone</label>
                                <div>{user.phone}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Role</label>
                                <div>{user.role}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Registration ID</label>
                                <div>{user.registrationId || 'Pending'}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Status</label>
                                <span style={{
                                    padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem',
                                    background: user.status === 'APPROVED' ? '#dcfce7' : '#fff7ed',
                                    color: user.status === 'APPROVED' ? '#166534' : '#c2410c', fontWeight: 'bold'
                                }}>
                                    {user.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Extended Details */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <div>
                            <h4 style={{ color: 'var(--primary-color)', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Personal & Govt Info</h4>
                            <div style={{ display: 'grid', gap: '0.8rem', fontSize: '0.95rem' }}>
                                <div><strong>ID Type:</strong> {user.govtIdType}</div>
                                <div><strong>ID Number:</strong> {user.govtIdNumber}</div>
                                <div><strong>Address:</strong> {user.street}, {user.city}, {user.state} - {user.pincode}</div>
                                {user.idProofPath && (
                                    <div style={{ marginTop: '0.5rem' }}>
                                        <a href={`http://localhost:8080/${user.idProofPath}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.5rem', fontSize: '0.9rem' }}>
                                            View Uploaded ID Proof
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h4 style={{ color: 'var(--primary-color)', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Academic & Work</h4>
                            {academicInfo.length > 0 && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <h5 style={{ margin: '0 0 0.5rem', fontSize: '0.95rem' }}>Education</h5>
                                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
                                        {academicInfo.map((item, idx) => (
                                            <li key={idx} style={{ marginBottom: '0.25rem' }}>{item.degree} from {item.institution} ({item.grade})</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {workExperience.length > 0 && (
                                <div>
                                    <h5 style={{ margin: '0 0 0.5rem', fontSize: '0.95rem' }}>Experience</h5>
                                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
                                        {workExperience.map((item, idx) => (
                                            <li key={idx} style={{ marginBottom: '0.25rem' }}>{item.designation} at {item.company}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div style={{
                    padding: '1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0',
                    display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderRadius: '0 0 1rem 1rem'
                }}>
                    <button onClick={onClose} className="btn btn-secondary">Close</button>
                    {user.status === 'PENDING' && (
                        <button onClick={handleApproveClick} className="btn btn-primary" style={{ background: 'var(--success)' }}>
                            <FaCheck /> Approve User
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;
