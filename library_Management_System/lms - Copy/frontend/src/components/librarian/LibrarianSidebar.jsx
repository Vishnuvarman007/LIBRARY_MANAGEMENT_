import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBook, FaBoxOpen, FaUndo, FaBell, FaSignOutAlt, FaClipboardList, FaTachometerAlt, FaClipboardCheck } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const LibrarianSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/librarian/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
        { path: '/librarian/manage', icon: <FaBook />, label: 'Manage Books' },
        { path: '/librarian/manage-due', icon: <FaClipboardCheck />, label: 'Manage Due' },
        { path: '/librarian/requests', icon: <FaBell />, label: 'Book Requests' },
        { path: '/librarian/records', icon: <FaClipboardList />, label: 'Borrow Records' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="sidebar" style={{
            width: '250px',
            height: 'calc(100vh - 74px)',
            background: '#1e293b',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: '73px',
            zIndex: 1000
        }}>
            {/* User Profile Section */}
            <div style={{ padding: '2rem', textAlign: 'center', borderBottom: '1px solid #334155' }}>
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%', background: '#10b981',
                    margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem', fontWeight: 'bold'
                }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'L'}
                </div>
                <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem' }}>{user?.name || 'Librarian'}</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>{user?.email || 'Librarian'}</p>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '1rem 0' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link to={item.path} style={{
                                display: 'flex', alignItems: 'center', padding: '0.75rem 1.5rem',
                                color: isActive(item.path) ? '#fff' : '#94a3b8',
                                background: isActive(item.path) ? '#0f172a' : 'transparent',
                                textDecoration: 'none',
                                borderLeft: isActive(item.path) ? '4px solid #10b981' : '4px solid transparent',
                                transition: 'all 0.2s'
                            }}>
                                <span style={{ marginRight: '0.75rem' }}>{item.icon}</span>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Logout */}
            <div style={{ padding: '1rem', borderTop: '1px solid #334155' }}>
                <button onClick={handleLogout} style={{
                    display: 'flex', alignItems: 'center', width: '100%', padding: '0.75rem',
                    background: 'transparent', border: '1px solid #ef4444', color: '#ef4444',
                    borderRadius: '0.5rem', cursor: 'pointer', justifyContent: 'center',
                    transition: 'all 0.2s'
                }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ef4444'; }}
                >
                    <FaSignOutAlt style={{ marginRight: '0.5rem' }} /> Logout
                </button>
            </div>
        </div>
    );
};

export default LibrarianSidebar;
