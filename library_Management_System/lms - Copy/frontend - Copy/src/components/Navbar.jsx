import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="logo">
                    <h2>Librario</h2>
                </Link>
                <ul className="nav-links" style={{ alignItems: 'center' }}>
                    <li><Link to="/">Home</Link></li>
                    {!user ? (
                        <>
                            <li><Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Login</Link></li>
                            <li><Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Register</Link></li>
                        </>
                    ) : (
                        <>
                            {user.role === 'ADMIN' && <li><Link to="/admin/dashboard">Dashboard</Link></li>}
                            {user.role === 'LIBRARIAN' && <li><Link to="/librarian/dashboard">Dashboard</Link></li>}
                            {user.role === 'MEMBER' && <li><Link to="/user/dashboard">Dashboard</Link></li>}
                            <li><button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Logout</button></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
