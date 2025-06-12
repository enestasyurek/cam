import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message) => {
    addToast(message, 'success');
  }, [addToast]);

  const error = useCallback((message) => {
    addToast(message, 'error', 5000);
  }, [addToast]);

  const warning = useCallback((message) => {
    addToast(message, 'warning', 4000);
  }, [addToast]);

  const info = useCallback((message) => {
    addToast(message, 'info');
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };
};