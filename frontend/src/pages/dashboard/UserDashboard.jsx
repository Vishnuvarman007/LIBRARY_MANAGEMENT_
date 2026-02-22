import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserLayout from '../../components/user/UserLayout';
import UserProfile from '../../components/user/UserProfile';
import UserLoans from '../../components/user/UserLoans';
import UserHistory from '../../components/user/UserHistory';
import UserSettings from '../../components/user/UserSettings';
import BookSearch from '../../components/BookSearch';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const UserDashboard = () => {
    const { user } = useAuth();
    const { addToast } = useToast();

    // Passing handleReserve down to BookSearch if needed, or BookSearch can handle it internally if refactored.
    // For now, assuming BookSearch needs a prop or handles it. 
    // Let's check BookSearch. If it needs a prop, we need to wrap it.
    // However, BookSearch implementation in previous turns showed it takes `onReserve`.

    const handleReserve = async (bookId) => {
        if (!window.confirm("Do you want to reserve this book?")) return;
        try {
            const res = await fetch('http://localhost:8080/api/borrow/reserve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, bookId })
            });
            if (res.ok) {
                addToast("Book reserved successfully! Please collect within 3 days.", "success");
            } else {
                const msg = await res.text();
                addToast("Reservation failed: " + msg, "error");
            }
        } catch (err) {
            console.error(err);
            addToast("Error reserving book.", "error");
        }
    };

    return (
        <UserLayout>
            <Routes>
                <Route path="profile" element={<UserProfile />} />
                <Route path="loans" element={<UserLoans />} />
                <Route path="search" element={<BookSearch onReserve={handleReserve} />} />
                <Route path="history" element={<UserHistory />} />
                <Route path="settings" element={<UserSettings />} />
                <Route path="" element={<Navigate to="profile" replace />} />
            </Routes>
        </UserLayout>
    );
};

export default UserDashboard;
