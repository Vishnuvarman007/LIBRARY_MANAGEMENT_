import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();

    // If no user in context (e.g. reload), redirect to login
    if (!user) {
        // In a real app we might persist the temp session or use a token
        // For now, simple redirect
        setTimeout(() => navigate('/login'), 0);
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            addToast("Password must be at least 6 characters.", "error");
            return;
        }

        if (newPassword !== confirmPassword) {
            addToast("Passwords do not match.", "error");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/update-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, newPassword: newPassword })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to update password');
            }

            const updatedUser = await response.json();

            // Update auth context with new user data (passwordUpdateRequired should be false)
            // We might need to construct the full auth object if the API returns just the user
            // Assuming Login returns { role, id, user: {...} }
            // Let's create a synthetic auth object or re-login.
            // Simplest: just update the local user object in context if possible, 
            // or just navigate to dashboard and let the context hold the old state (but flag is in user obj).

            // Better: update the context.
            // The login() function in AuthContext usually takes the whole payload.
            // Let's reuse the existing structure.
            const authPayload = {
                role: updatedUser.role,
                id: updatedUser.id,
                user: updatedUser
            };
            login(authPayload);

            addToast("Password updated successfully!", "success");

            if (updatedUser.role === 'ADMIN') navigate('/admin/dashboard');
            else if (updatedUser.role === 'LIBRARIAN') navigate('/librarian/dashboard');
            else navigate('/user/dashboard');

        } catch (err) {
            addToast(err.message, "error");
        }
    };

    return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--primary-color)' }}>Set New Password</h2>
                <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-muted)' }}>
                    Please update your password to continue.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '50px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '50px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', borderRadius: '50px' }}>Update Password</button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
