import { lazy, Suspense } from 'react';
import LoadingSpinner from '../LoadingSpinner';

// Lazy load chart components
export const SiparisChart = lazy(() => import('./SiparisChart'));
export const IstasyonChart = lazy(() => import('./IstasyonChart'));
export const UretimTrendChart = lazy(() => import('./UretimTrendChart'));
export const PerformansChart = lazy(() => import('./PerformansChart'));

// Chart wrapper with loading state
export const ChartWrapper = ({ children }) => (
  <Suspense fallback={
    <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <LoadingSpinner />
    </div>
  }>
    {children}
  </Suspense>
);