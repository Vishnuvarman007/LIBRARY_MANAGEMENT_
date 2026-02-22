import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex', background: '#f1f5f9', minHeight: '100vh' }}>
            <Sidebar />
            <div style={{ flex: 1, marginLeft: '250px' }}>
                <div style={{ padding: '2rem' }}>
                    {children || <Outlet />}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
