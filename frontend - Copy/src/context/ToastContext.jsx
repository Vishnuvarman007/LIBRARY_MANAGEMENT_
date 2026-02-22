import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 3000);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {toasts.map(toast => (
                    <div key={toast.id} style={{
                        background: toast.type === 'error' ? '#fee2e2' : toast.type === 'success' ? '#dcfce7' : 'white',
                        color: toast.type === 'error' ? '#991b1b' : toast.type === 'success' ? '#166534' : '#1e293b',
                        padding: '1rem 1.5rem',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        borderLeft: `5px solid ${toast.type === 'error' ? '#ef4444' : toast.type === 'success' ? '#22c55e' : '#3b82f6'}`,
                        minWidth: '300px',
                        animation: 'slideIn 0.3s ease'
                    }}>
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                            {toast.type === 'error' ? 'Error' : toast.type === 'success' ? 'Success' : 'Notification'}
                        </div>
                        <div style={{ fontSize: '0.9rem' }}>{toast.message}</div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
