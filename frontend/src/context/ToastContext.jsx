import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [alert, setAlert] = useState(null);

    const addToast = useCallback((message, type = 'info') => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 2000);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {alert && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 2000,
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem 3rem',
                        borderRadius: '1rem',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        textAlign: 'center',
                        maxWidth: '90%',
                        width: '400px',
                        animation: 'scaleIn 0.2s ease-out',
                        borderTop: `6px solid ${alert.type === 'error' ? '#ef4444' : alert.type === 'success' ? '#10b981' : '#3b82f6'}`
                    }}>
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            marginBottom: '1rem',
                            color: alert.type === 'error' ? '#ef4444' : alert.type === 'success' ? '#10b981' : '#1e293b'
                        }}>
                            {alert.type === 'error' ? 'Error' : alert.type === 'success' ? 'Success' : 'Notice'}
                        </div>
                        <p style={{ fontSize: '1.1rem', color: '#334155', margin: 0, lineHeight: '1.5' }}>
                            {alert.message}
                        </p>
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
};
