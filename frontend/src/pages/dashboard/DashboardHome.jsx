import React, { useState, useEffect } from 'react';
import { FaUsers, FaBook, FaClipboardList, FaExclamationTriangle } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DashboardHome = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalBooks: 0,
        issuedBooks: 0,
        availableBooks: 0
    });
    const [pieData, setPieData] = useState([]);
    const [dailyData, setDailyData] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        // Fetch all data in parallel
        Promise.all([
            fetch('http://localhost:8080/api/users').then(res => res.json()),
            fetch('http://localhost:8080/api/books').then(res => res.json()),
            fetch('http://localhost:8080/api/borrow/all').then(res => res.json())
        ]).then(([users, books, records]) => {

            // Calculate Stats
            const issued = records.filter(r => !r.returnDate).length; // Currently issued (not returned)
            const totalBooks = books.length;
            const availableBooks = totalBooks > issued ? totalBooks - issued : 0; // Simple approximation, assumes 1 copy per book entry unless detailed copy tracking exists. 
            // Better: Sum of 'availableCopies' from books if backend supports it. But 'issued' count from records gives current active loans.
            // Let's use records for 'Borrowed' and total - borrowed for 'Available' for the pie chart visual.

            setStats({
                totalUsers: users.length,
                totalBooks: totalBooks,
                issuedBooks: issued,
                availableBooks: availableBooks
            });

            // Pie Chart Data: Books Available vs Borrowed
            setPieData([
                { name: 'Available', value: availableBooks },
                { name: 'Borrowed', value: issued }
            ]);

            // Daily Borrowing Trends
            // 1. Generate last 7 days
            const last7Days = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                last7Days.push(d.toISOString().split('T')[0]);
            }

            // 2. Count records per day
            const dailyCounts = {};
            records.forEach(r => {
                const date = r.issueDate;
                if (date) {
                    dailyCounts[date] = (dailyCounts[date] || 0) + 1;
                }
            });

            // 3. Map to chart data with Weekday Name
            const chartData = last7Days.map(date => {
                const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' }); // e.g., Mon, Tue
                return {
                    name: dayName,
                    borrowed: dailyCounts[date] || 0
                };
            });
            setDailyData(chartData);

            // Recent Activity
            // records sorted by ID desc or date desc
            const sortedRecords = [...records].sort((a, b) => b.id - a.id).slice(0, 5);
            setRecentActivity(sortedRecords);

        }).catch(err => console.error("Failed to load dashboard data", err));
    }, []);

    const PIE_COLORS = ['#10b981', '#3b82f6']; // Green (Available), Blue (Borrowed)

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>Dashboard Overview</h2>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard icon={<FaUsers />} title="Total Users" value={stats.totalUsers} color="#8b5cf6" />
                <StatCard icon={<FaBook />} title="Total Books" value={stats.totalBooks} color="#64748b" />
                <StatCard icon={<FaClipboardList />} title="Books Borrowed" value={stats.issuedBooks} color="#3b82f6" />
                <StatCard icon={<FaExclamationTriangle />} title="Books Available" value={stats.availableBooks} color="#10b981" />
            </div>

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>

                {/* Available vs Borrowed Pie Chart */}
                <div className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#475569' }}>Library Utilization</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
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
                <div className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#475569' }}>Daily Borrowing Trends</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
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

            {/* Recent Activity Table */}
            <div className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginBottom: '1rem', color: '#475569' }}>Recent Activity</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', color: '#64748b' }}>User</th>
                                <th style={{ padding: '1rem', color: '#64748b' }}>Action</th>
                                <th style={{ padding: '1rem', color: '#64748b' }}>Book</th>
                                <th style={{ padding: '1rem', color: '#64748b' }}>Date</th>
                                <th style={{ padding: '1rem', color: '#64748b' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentActivity.map(record => (
                                <tr key={record.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '1rem', fontWeight: '500' }}>{record.user ? record.user.firstName : 'Unknown'}</td>
                                    <td style={{ padding: '1rem' }}>
                                        {record.status === 'ISSUED' ? 'Borrowed' : (record.status === 'RETURNED' ? 'Returned' : record.status)}
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--primary-color)' }}>{record.book ? record.book.title : 'Unknown'}</td>
                                    <td style={{ padding: '1rem', color: '#64748b' }}>{record.issueDate}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold',
                                            background: record.status === 'RETURNED' ? '#dcfce7' : (record.status === 'ISSUED' ? '#dbeafe' : '#fff7ed'),
                                            color: record.status === 'RETURNED' ? '#166534' : (record.status === 'ISSUED' ? '#1e40af' : '#c2410c')
                                        }}>
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {recentActivity.length === 0 && <tr><td colSpan="5" style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8' }}>No recent activity.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, color }) => (
    <div style={{
        background: 'white', padding: '1.5rem', borderRadius: '1rem',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderLeft: `5px solid ${color}`
    }}>
        <div>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>{title}</p>
            <h3 style={{ margin: '0.5rem 0 0', fontSize: '1.8rem', color: '#1e293b' }}>{value}</h3>
        </div>
        <div style={{
            width: '50px', height: '50px', borderRadius: '50%',
            background: `${color}20`, color: color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem'
        }}>
            {icon}
        </div>
    </div>
);

export default DashboardHome;
