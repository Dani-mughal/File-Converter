import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_MEASUREMENT_ID = 'G-Y50BTSB341';

/**
 * AnalyticsTracker component
 * 
 * This component listens for route changes using react-router-dom's useLocation hook
 * and manually triggers a Google Analytics page_view event.
 * This is necessary for Single Page Applications (SPAs) where the browser doesn't
 * perform a full reload on navigation.
 */
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
      });
      console.log(`[GA] Page view tracked: ${location.pathname}${location.search}`);
    }
  }, [location]);

  return null; // This component doesn't render anything
};

export default AnalyticsTracker;
