import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Membership = () => {
    const [plans, setPlans] = useState([]);
    const [currentMemberships, setCurrentMemberships] = useState([]);
    const { user } = useAuth();
    const { addToast } = useToast();

    useEffect(() => {
        fetchPlans();
        if (user?.id) fetchCurrentMemberships();
    }, [user]);

    const fetchPlans = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/plans');
            const data = await res.json();
            setPlans(data);
        } catch (error) {
            console.error("Failed to fetch plans", error);
        }
    };

    const fetchCurrentMemberships = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/members/user/${user.id}`);
            const data = await res.json();
            setCurrentMemberships(data);
        } catch (error) {
            console.error("Failed to fetch memberships", error);
        }
    };

    const subscribeToPlan = async (planId) => {
        try {
            const res = await fetch('http://localhost:8080/api/members', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, planId })
            });
            if (res.ok) {
                addToast('Subscribed to plan successfully!', 'success');
                fetchCurrentMemberships();
            } else {
                const text = await res.text();
                addToast('Failed to subscribe: ' + text, 'error');
            }
        } catch (err) {
            addToast('Error subscribing to plan', 'error');
        }
    };

    // Find the current active/pending membership to determine button states
    const activeOrPendingMembership = currentMemberships.find(m => m.status === 'APPROVED' || m.status === 'PENDING' || m.status === 'ACTIVE');

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Membership Plans</h2>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>Subscribe to access premium books and extra features. Plans require Admin approval upon request.</p>

            {currentMemberships.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#1e293b' }}>Your Current Requests</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {currentMemberships.map(m => (
                            <div key={m.id} style={{
                                padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0',
                                background: m.status === 'APPROVED' || m.status === 'ACTIVE' ? '#dcfce7' : m.status === 'REJECTED' ? '#fee2e2' : '#fef9c3',
                                color: m.status === 'APPROVED' || m.status === 'ACTIVE' ? '#166534' : m.status === 'REJECTED' ? '#991b1b' : '#854d0e',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}>
                                <div>
                                    <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{m.plan.name} Plan</strong>
                                    <span style={{ fontSize: '0.9rem' }}>
                                        {m.status === 'APPROVED' || m.status === 'ACTIVE' ? `Active until: ${new Date(m.endDate).toLocaleDateString()}` : `Requested on: ${new Date(m.startDate).toLocaleDateString()}`}
                                    </span>
                                </div>
                                <span style={{
                                    fontWeight: 'bold', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem',
                                    background: m.status === 'APPROVED' || m.status === 'ACTIVE' ? '#22c55e' : m.status === 'REJECTED' ? '#ef4444' : '#eab308',
                                    color: 'white'
                                }}>
                                    {m.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                {plans.length === 0 ? (
                    <p>No plans available at the moment.</p>
                ) : (
                    plans.map(plan => (
                        <div key={plan.id} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', textAlign: 'center', border: '2px solid transparent', transition: 'border-color 0.2s' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1e293b' }}>{plan.name}</h3>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '1rem' }}>
                                ${plan.price || '0.00'}
                            </div>
                            <p style={{ color: '#64748b', marginBottom: '1rem', flex: 1 }}>{plan.description || `Enjoy premium access for ${plan.durationInMonths} month(s).`}</p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', textAlign: 'left', color: '#475569', fontSize: '0.9rem' }}>
                                <li style={{ marginBottom: '0.5rem' }}>✓ <strong>{plan.maxBooks}</strong> Max Books at a time</li>
                                <li style={{ marginBottom: '0.5rem' }}>✓ <strong>{plan.premiumBooks === 0 ? 'No' : plan.premiumBooks}</strong> Premium Books allowed</li>
                                <li style={{ marginBottom: '0.5rem' }}>✓ <strong>{plan.borrowDueDays}</strong> Days return period</li>
                            </ul>

                            <button
                                className={`btn ${activeOrPendingMembership ? 'btn-secondary' : 'btn-primary'}`}
                                style={{ width: '100%', padding: '0.75rem', opacity: activeOrPendingMembership ? 0.5 : 1, cursor: activeOrPendingMembership ? 'not-allowed' : 'pointer' }}
                                onClick={() => !activeOrPendingMembership && subscribeToPlan(plan.id)}
                                disabled={!!activeOrPendingMembership}
                            >
                                {activeOrPendingMembership ? 'Subscription in Progress' : 'Subscribe'}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Membership;
