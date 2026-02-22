import React from 'react';
import { FaBars, FaBell, FaSearch } from 'react-icons/fa';

const Topbar = () => {
    return (
        <div style={{
            height: '60px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 900,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            marginLeft: '250px' // Offset for sidebar
        }}>
            {/* Left: Branding or Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>Library Administration</h2>
            </div>

            {/* Right: Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {/* Search */}
                <div style={{ position: 'relative' }}>
                    <FaSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="text" placeholder="Search..." style={{
                        padding: '0.5rem 0.5rem 0.5rem 2.2rem',
                        borderRadius: '20px',
                        border: '1px solid #e2e8f0',
                        outline: 'none',
                        fontSize: '0.9rem',
                        width: '200px'
                    }} />
                </div>

                {/* Notifications */}
                <div style={{ position: 'relative', cursor: 'pointer' }}>
                    <FaBell style={{ fontSize: '1.2rem', color: '#64748b' }} />
                    <span style={{
                        position: 'absolute', top: '-5px', right: '-5px',
                        background: '#ef4444', color: 'white',
                        borderRadius: '50%', width: '15px', height: '15px',
                        fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>3</span>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
