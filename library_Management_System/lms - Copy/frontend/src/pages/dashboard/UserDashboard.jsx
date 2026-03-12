import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserLayout from '../../components/user/UserLayout';
import UserProfile from '../../components/user/UserProfile';
import UserLoans from '../../components/user/UserLoans';
import UserHistory from '../../components/user/UserHistory';
import UserSettings from '../../components/user/UserSettings';
import BookSearch from '../../components/BookSearch';
import Membership from '../../components/Membership';
import MyFavorites from '../../components/user/MyFavorites';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
    const { user } = useAuth();

    return (
        <UserLayout>
            <Routes>
                <Route path="profile" element={<UserProfile />} />
                <Route path="loans" element={<UserLoans />} />
                <Route path="search" element={<BookSearch />} />
                <Route path="history" element={<UserHistory />} />
                <Route path="favorites" element={<MyFavorites />} />
                <Route path="membership" element={<Membership />} />
                <Route path="settings" element={<UserSettings />} />
                <Route path="" element={<Navigate to="profile" replace />} />
            </Routes>
        </UserLayout>
    );
};

export default UserDashboard;
