import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import DashboardHome from './DashboardHome';
import AdminProfile from '../../components/admin/AdminProfile';
import UserList from '../../components/UserList';
import ManageBooks from '../../components/ManageBooks';
import AllBorrowRecords from '../../components/AllBorrowRecords';

const AdminDashboard = () => {
    return (
        <AdminLayout>
            <Routes>
                <Route path="dashboard" element={<DashboardHome />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="users" element={<UserList />} />
                <Route path="books" element={<ManageBooks />} />
                <Route path="records" element={<AllBorrowRecords />} />
                <Route path="" element={<Navigate to="dashboard" replace />} />
            </Routes>
        </AdminLayout>
    );
};

export default AdminDashboard;
