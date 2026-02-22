import React from 'react';
import UserSidebar from './UserSidebar';
import { Outlet } from 'react-router-dom';

const UserLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex', background: '#ffffff', minHeight: '100vh' }}>
            <UserSidebar />
            <div style={{ flex: 1, marginLeft: '250px' }}>
                <div style={{ padding: '2rem', height: '100%', boxSizing: 'border-box' }}>
                    {children || <Outlet />}
                </div>
            </div>
        </div>
    );
};

export default UserLayout;
