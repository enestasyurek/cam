import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Chart Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          backgroundColor: '#fee', 
          borderRadius: '8px',
          border: '1px solid #fcc'
        }}>
          <h3 style={{ color: '#c00' }}>Grafik yüklenirken hata oluştu</h3>
          <p style={{ color: '#666' }}>{this.state.error?.message || 'Bilinmeyen hata'}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;