import React from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaUsers, FaUniversity, FaBolt, FaRocket, FaSignInAlt, FaBookOpen, FaUserGraduate, FaExchangeAlt, FaChartLine, FaSearch, FaQrcode } from 'react-icons/fa';
import { BiCheckCircle, BiLayer } from 'react-icons/bi';
import { MdSecurity, MdSpeed, MdDevices } from 'react-icons/md';

const Home = () => {
    return (
        <div>
            {/* 2. Hero Section */}
            <section className="hero-section">
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: '800', lineHeight: 1.2, color: 'white' }}>
                        Librario<br /> Smarter Libraries Start Here
                    </h1>
                    <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: '0.9', maxWidth: '700px', margin: '0 auto 2.5rem auto' }}>
                        Smart, Fast & Secure Library Management. Experience the future of library systems with our state-of-the-art platform.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/register" className="btn" style={{ backgroundColor: 'white', color: 'var(--primary-color)', padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '50px' }}>
                            <FaRocket /> Get Started
                        </Link>
                        <Link to="/login" className="btn" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.5)', padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '50px', backdropFilter: 'blur(5px)' }}>
                            <FaSignInAlt /> Login
                        </Link>
                    </div>
                </div>
            </section>

            {/* 3. Key Statistics Section */}
            <section className="stats-section" style={{ marginBottom: '5rem', textAlign: 'center' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                        <div>
                            <h2 style={{ fontSize: '3.5rem', color: 'var(--primary-color)', margin: 0, fontWeight: '800' }}>10,000+</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '500', marginTop: '0.5rem' }}>
                                Books Managed
                            </p>
                        </div>
                        <div>
                            <h2 style={{ fontSize: '3.5rem', color: 'var(--primary-color)', margin: 0, fontWeight: '800' }}>5,000+</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '500', marginTop: '0.5rem' }}>
                                Active Users
                            </p>
                        </div>
                        <div>
                            <h2 style={{ fontSize: '3.5rem', color: 'var(--primary-color)', margin: 0, fontWeight: '500' }}>100+</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '500', marginTop: '0.5rem' }}>
                                Institutions
                            </p>
                        </div>
                        <div>
                            <h2 style={{ fontSize: '3.5rem', color: 'var(--primary-color)', margin: 0, fontWeight: '800' }}>99.9%</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '500', marginTop: '0.5rem' }}>
                                Uptime
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Features Section */}
            <section id="features" style={{ padding: '0 0 2rem 0' }}>
                <div className="container">
                    <div className="section-title" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '0.5rem' }}>Features</h2>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Everything you need to run a modern library.</p>
                    </div>

                    <div className="features-grid">
                        <div className="interactive-card">
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}><FaBookOpen /></div>
                            <h3>Book Management</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Add, update, and categorize books effortlessly. Manage bulk uploads and track ISBNs.</p>
                        </div>
                        <div className="interactive-card">
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}><FaUserGraduate /></div>
                            <h3>Member Management</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Streamlined registration, ID generation, and profile management for students.</p>
                        </div>
                        <div className="interactive-card">
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}><FaExchangeAlt /></div>
                            <h3>Issue & Return</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Track borrowing in real-time with due date reminders and auto-fine calculation.</p>
                        </div>
                        <div className="interactive-card">
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}><FaChartLine /></div>
                            <h3>Analytics</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Gain insights with reports on borrowed books, active members, and monthly trends.</p>
                        </div>
                        <div className="interactive-card">
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}><FaSearch /></div>
                            <h3>Smart Search</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Advanced filtering by title, author, and category for quick book discovery.</p>
                        </div>
                        <div className="interactive-card">
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}><FaQrcode /></div>
                            <h3>QR / RFID Ready</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Future-proof your library with fast check-in and check-out integration support.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. How It Works Section */}
            <section id="how-it-works" style={{ backgroundColor: '#f8fafc', padding: '5rem 0' }}>
                <div className="container">
                    <div className="section-title">
                        <h2>How It Works</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Get started in 4 simple steps.</p>
                    </div>

                    <div className="how-it-works-grid">
                        <div className="interactive-card">
                            <div className="circle-icon">1</div>
                            <h3>Register Library</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Sign up and set up your library profile.</p>
                        </div>
                        <div className="interactive-card">
                            <div className="circle-icon">2</div>
                            <h3>Add Inventory</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Upload books and add members to the system.</p>
                        </div>
                        <div className="interactive-card">
                            <div className="circle-icon">3</div>
                            <h3>Issue Books</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Start issuing books using our easy interface.</p>
                        </div>
                        <div className="interactive-card">
                            <div className="circle-icon">4</div>
                            <h3>Track & Report</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Generate insightful reports and track progress.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Roles Section */}
            <section style={{ padding: '5rem 0' }}>
                <div className="container">
                    <div className="section-title">
                        <h2>Tailored for Everyone</h2>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
                        <div className="interactive-card" style={{ borderLeft: '5px solid var(--primary-color)', alignItems: 'flex-start', textAlign: 'left', maxWidth: '400px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ background: '#e0f2fe', padding: '10px', borderRadius: '50%', color: 'var(--primary-color)' }}><BiLayer size={24} /></div>
                                <h3 style={{ margin: 0 }}>For Librarians</h3>
                            </div>
                            <ul style={{ paddingLeft: '1.2rem', marginTop: '1rem', color: 'var(--text-muted)' }}>
                                <li>Manage entire book inventory</li>
                                <li>Handle issue/return transactions</li>
                                <li>View comprehensive dashboards</li>
                                <li>Manage fines and users</li>
                            </ul>
                        </div>
                        <div className="interactive-card" style={{ borderLeft: '5px solid var(--success)', alignItems: 'flex-start', textAlign: 'left', maxWidth: '400px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ background: '#dcfce7', padding: '10px', borderRadius: '50%', color: '#16a34a' }}><FaUserGraduate size={24} /></div>
                                <h3 style={{ margin: 0 }}>For Students</h3>
                            </div>
                            <ul style={{ paddingLeft: '1.2rem', marginTop: '1rem', color: 'var(--text-muted)' }}>
                                <li>Search and reserve books</li>
                                <li>View borrowing history</li>
                                <li>Check due dates and fines</li>
                                <li>Mobile-friendly access</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Why Choose Us */}
            <section style={{ padding: '5rem 0' }}>
                <div className="container">
                    <div className="section-title">
                        <h2>Why Choose Librario?</h2>
                    </div>
                    <div className="features-grid">
                        <div className="interactive-card">
                            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary-color)' }}><MdSpeed /></div>
                            <h3>Fast & Easy</h3>
                            <p>Optimized for performance and speed.</p>
                        </div>
                        <div className="interactive-card">
                            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary-color)' }}><MdSecurity /></div>
                            <h3>Secure</h3>
                            <p>Enterprise-grade security for your data.</p>
                        </div>
                        <div className="interactive-card">
                            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary-color)' }}><FaChartLine /></div>
                            <h3>Data-Driven</h3>
                            <p>Real-time insights to make better decisions.</p>
                        </div>
                        <div className="interactive-card">
                            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary-color)' }}><MdDevices /></div>
                            <h3>Mobile Responsive</h3>
                            <p>Access your library from any device.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 12. Footer Section */}
            <footer className="footer-section" id="contact">
                <div className="container">
                    <div className="footer-grid">
                        <div>
                            <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>Librario</h3>
                            <p style={{ lineHeight: '1.8' }}>
                                Empowering institutions with intelligent library management solutions.
                                Simple, fast, and secure.
                            </p>
                        </div>
                        <div>
                            <h4 style={{ color: 'white', marginBottom: '1.5rem' }}>Quick Links</h4>
                            <ul className="footer-links">
                                <li><a href="#features">Features</a></li>
                                <li><a href="#how-it-works">Pricing</a></li>
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/register">Register</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ color: 'white', marginBottom: '1.5rem' }}>Contact Us</h4>
                            <ul className="footer-links">
                                <li>📧 support@librario.com</li>
                                <li>📞 +91 9867532104</li>
                                <li>🏢 Chennai</li>
                            </ul>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid #334155', paddingTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
                        <p>
                            &copy; 2026 Librario. All rights reserved. |
                            <a href="#" style={{ marginLeft: '1rem' }}>Privacy Policy</a> |
                            <a href="#" style={{ marginLeft: '1rem' }}>Terms & Conditions</a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
