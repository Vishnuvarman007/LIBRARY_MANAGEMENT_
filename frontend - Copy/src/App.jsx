import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ChangePassword from './pages/ChangePassword';
import { AuthProvider } from './context/AuthContext';

import AdminDashboard from './pages/dashboard/AdminDashboard';
import LibrarianDashboard from './pages/dashboard/LibrarianDashboard';
import UserDashboard from './pages/dashboard/UserDashboard';

import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/change-password" element={<ChangePassword />} />

            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/librarian/*" element={<LibrarianDashboard />} />
            <Route path="/user/*" element={<UserDashboard />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
