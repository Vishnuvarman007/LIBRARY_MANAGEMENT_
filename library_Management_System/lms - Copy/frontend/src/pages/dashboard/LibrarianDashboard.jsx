import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LibrarianLayout from '../../components/librarian/LibrarianLayout';
import ManageBooks from '../../components/ManageBooks';
import ManageDue from '../../components/librarian/ManageDue';
import NotificationPanel from '../../components/admin/NotificationPanel';
import AllBorrowRecords from '../../components/AllBorrowRecords';
import LibrarianDashboardHome from './LibrarianDashboardHome';

const LibrarianDashboard = () => {
    return (
        <LibrarianLayout>
            <Routes>
                <Route path="manage" element={<ManageBooks />} />
                <Route path="dashboard" element={<LibrarianDashboardHome />} />
                <Route path="manage-due" element={<ManageDue />} />
                <Route path="requests" element={<NotificationPanel />} />
                <Route path="records" element={<AllBorrowRecords />} />
                <Route path="" element={<Navigate to="dashboard" replace />} />
            </Routes>
        </LibrarianLayout>
    );
};

export default LibrarianDashboard;
