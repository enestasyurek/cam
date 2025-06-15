import React from 'react';

class ChartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Chart error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fee', 
          borderRadius: '8px',
          textAlign: 'center',
          color: '#c00'
        }}>
          <h3>Grafik yüklenirken hata oluştu</h3>
          <p>{this.state.error}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChartErrorBoundary;