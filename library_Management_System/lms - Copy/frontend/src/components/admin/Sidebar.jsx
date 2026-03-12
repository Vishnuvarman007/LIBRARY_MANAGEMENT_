import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaBook, FaClipboardList, FaHome, FaSignOutAlt, FaTachometerAlt, FaBell, FaHistory, FaUserClock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/admin/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
        { path: '/admin/users', icon: <FaUser />, label: 'Users' },
        { path: '/admin/books', icon: <FaBook />, label: ' Books' },
        { path: '/admin/records', icon: <FaClipboardList />, label: 'Borrow Records' },
        { path: '/admin/notifications', icon: <FaBell />, label: 'Activity & Requests' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="sidebar" style={{
            width: '250px',
            height: 'calc(100vh - 74px)',
            background: '#1e293b', // Dark blue/slate background
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
                    width: '80px', height: '80px', borderRadius: '50%', background: '#3b82f6',
                    margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem', fontWeight: 'bold'
                }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem' }}>{user?.name || 'Admin'}</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>{user?.email || 'System Admin'}</p>
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
                                borderLeft: isActive(item.path) ? '4px solid #3b82f6' : '4px solid transparent',
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

export default Sidebar;
