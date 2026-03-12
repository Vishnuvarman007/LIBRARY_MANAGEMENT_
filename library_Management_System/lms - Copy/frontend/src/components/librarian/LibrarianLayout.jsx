import React from 'react';
import LibrarianSidebar from './LibrarianSidebar';
import { Outlet } from 'react-router-dom';

const LibrarianLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex', background: '#f1f5f9', minHeight: '100vh' }}>
            <LibrarianSidebar />
            <div style={{ flex: 1, marginLeft: '250px' }}>
                <div style={{ padding: '2rem' }}>
                    {children || <Outlet />}
                </div>
            </div>
        </div>
    );
};

export default LibrarianLayout;
