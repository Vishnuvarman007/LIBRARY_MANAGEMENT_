import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (location.pathname === '/register') return null;

    return (
        <nav className="navbar">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '95%' }}>
                {/* Left: Logo */}
                <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>Librario</h2>
                </Link>

                {/* Center: Menu - Only show on Home Page */}
                {location.pathname === '/' && (
                    <ul className="nav-links" style={{ display: 'flex', gap: '2rem', listStyle: 'none', padding: 0, margin: 0 }}>
                        <li><a href="#features">Features</a></li>
                        <li><a href="#how-it-works">How It Works</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                )}

                {/* Right: Login/Register or Profile */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {!user ? (
                        <>
                            <Link to="/login" style={{ fontWeight: '600', color: 'var(--primary-color)' }}>Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', borderRadius: '50px' }}>Register</Link>
                        </>
                    ) : (
                        <div
                            title="Go to Dashboard"
                            onClick={() => {
                                if (user.role === 'ADMIN') navigate('/admin/dashboard');
                                else if (user.role === 'USER') navigate('/user/dashboard');
                                else navigate('/librarian/dashboard');
                            }}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'var(--primary-color)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                userSelect: 'none'
                            }}
                        >
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
