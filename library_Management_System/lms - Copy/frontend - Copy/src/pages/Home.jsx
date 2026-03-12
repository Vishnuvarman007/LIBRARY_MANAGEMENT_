import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <section className="hero-section">
                <div className="container">
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'white' }}>Library Management Simplified</h1>
                    <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: '0.9', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                        Experience the future of library systems. Manage books, track borrowing, and explore knowledge with our state-of-the-art platform.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/login" className="btn btn-secondary" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Login</Link>
                        <Link to="/register" className="btn" style={{ backgroundColor: 'white', color: 'var(--primary-color)', fontWeight: 'bold', border: 'none' }}>Get Started</Link>
                    </div>
                </div>
            </section>

            <section className="features" style={{ padding: '2rem 0 5rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem' }}>Why Choose Librario?</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Powerful features for every role in the ecosystem.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <div className="card" style={{ borderTop: '4px solid var(--primary-color)' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🎓 Members</h3>
                            <p style={{ color: 'var(--text-muted)' }}>
                                Search our extensive collection, check real-time availability, and manage your borrowing history effortlessly.
                            </p>
                        </div>
                        <div className="card" style={{ borderTop: '4px solid var(--success)' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📚 Librarians</h3>
                            <p style={{ color: 'var(--text-muted)' }}>
                                Streamlined tools to manage book inventory, issue/return books, and handle day-to-day operations.
                            </p>
                        </div>
                        <div className="card" style={{ borderTop: '4px solid var(--warning)' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>⚡ Admins</h3>
                            <p style={{ color: 'var(--text-muted)' }}>
                                Full administrative control over users, books, and insights with comprehensive reporting dashboards.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <footer style={{ backgroundColor: '#1e293b', color: '#f8fafc', padding: '3rem 0', marginTop: 'auto' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>Librario</h2>
                    <p style={{ opacity: '0.7' }}>&copy; 2026 Library Management System. Built for excellence.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
