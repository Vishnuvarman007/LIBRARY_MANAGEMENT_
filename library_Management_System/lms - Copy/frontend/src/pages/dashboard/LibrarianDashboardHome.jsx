import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const LibrarianDashboardHome = () => {
    const [borrowedVsOverdueData, setBorrowedVsOverdueData] = useState([]);
    const [dailyData, setDailyData] = useState([]);
    const [todaysDueBooks, setTodaysDueBooks] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch all borrowing records
            const res = await fetch('http://localhost:8080/api/borrow/all');
            const records = await res.json();
            processChartsData(records);
        } catch (error) {
            console.error("Failed to load librarian dashboard data:", error);
        }
    };

    const processChartsData = (records) => {
        const todayStr = new Date().toISOString().split('T')[0];

        let currentlyBorrowed = 0;
        let overdueCount = 0;
        const dueToday = [];

        // For daily borrowing trend
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            last7Days.push(d.toISOString().split('T')[0]);
        }
        const dailyCounts = {};

        // Analyze borrowing records
        records.forEach(r => {
            // Trend data (count all issues by issueDate)
            if (r.issueDate) {
                dailyCounts[r.issueDate] = (dailyCounts[r.issueDate] || 0) + 1;
            }

            // Status tracking
            if (r.status === 'ISSUED' && !r.returnDate) {
                currentlyBorrowed++;

                if (r.dueDate) {
                    // Check if overdue
                    if (r.dueDate < todayStr) {
                        overdueCount++;
                    }
                    // Check if due today
                    if (r.dueDate === todayStr) {
                        dueToday.push(r);
                    }
                }
            }
        });

        // 1. Borrowed vs Overdue Pie Chart
        setBorrowedVsOverdueData([
            { name: 'On Time / Borrowed', value: currentlyBorrowed - overdueCount },
            { name: 'Overdue', value: overdueCount }
        ]);

        // 2. Daily Borrowing Trend Chart
        const chartData = last7Days.map(date => {
            const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
            return {
                name: dayName,
                borrowed: dailyCounts[date] || 0
            };
        });
        setDailyData(chartData);

        // 3. Today's Due Date list
        setTodaysDueBooks(dueToday);
    };

    const PIE_COLORS = ['#3b82f6', '#ef4444']; // Blue for normal borrowed, Red for overdue

    return (
        <div>
            {/* Today's Due Books (Moved to Top) */}
            <div className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: '#475569', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                    Books Due Today ({new Date().toLocaleDateString()})
                </h3>

                {todaysDueBooks.length === 0 ? (
                    <p style={{ color: '#64748b' }}>No books are scheduled for return today.</p>
                ) : (
                    <table className="table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', borderBottom: '2px solid #e2e8f0' }}>Book Title</th>
                                <th style={{ padding: '1rem', borderBottom: '2px solid #e2e8f0' }}>Borrower</th>
                                <th style={{ padding: '1rem', borderBottom: '2px solid #e2e8f0' }}>Reg ID</th>
                                <th style={{ padding: '1rem', borderBottom: '2px solid #e2e8f0' }}>Issue Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {todaysDueBooks.map((record) => (
                                <tr key={record.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '1rem', fontWeight: '500' }}>{record.book?.title}</td>
                                    <td style={{ padding: '1rem' }}>{record.user?.firstName} {record.user?.lastName}</td>
                                    <td style={{ padding: '1rem' }}>{record.user?.registrationId}</td>
                                    <td style={{ padding: '1rem' }}>{record.issueDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>

                {/* Borrowed vs Overdue */}
                <div className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', minWidth: '0' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#475569' }}>Borrowed vs Overdue Books</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={300}>
                            <PieChart>
                                <Pie
                                    data={borrowedVsOverdueData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {borrowedVsOverdueData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Daily Borrowing Trend */}
                <div className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', minWidth: '0' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#475569' }}>Daily Borrowing Trends</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={300}>
                            <BarChart data={dailyData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="borrowed" fill="#8884d8" name="Books Borrowed" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LibrarianDashboardHome;
