import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '../services/api';

/**
 * Hook to automatically track page views for CRP analytics
 */
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Record page view in backend CRP telemetry
    trackEvent('page_view', {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash
    });
  }, [location.pathname, location.search, location.hash]);
}
