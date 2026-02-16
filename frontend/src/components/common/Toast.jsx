import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        top: '2rem',
        right: '2rem',
        background: type === 'success' 
          ? 'linear-gradient(135deg, #10b981, #059669)' 
          : 'linear-gradient(135deg, #ef4444, #dc2626)',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        zIndex: 10000,
        animation: 'slideIn 0.3s ease',
        maxWidth: '400px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}
    >
      <span style={{ fontSize: '1.5rem' }}>
        {type === 'success' ? '✅' : '❌'}
      </span>
      <span style={{ flex: 1, fontWeight: '500' }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '1.5rem',
          cursor: 'pointer',
          padding: '0',
          lineHeight: '1'
        }}
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
