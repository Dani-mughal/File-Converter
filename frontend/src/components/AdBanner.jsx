import React, { useEffect, useState, useRef } from 'react';

const AdBanner = ({ slot, format = 'auto', responsive = 'true' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasNoFill, setHasNoFill] = useState(false);
  const adRef = useRef(null);
  const observerRef = useRef(null);
  const pushAttempted = useRef(false);

  useEffect(() => {
    // If we've already marked as no-fill, don't try again
    if (hasNoFill) return;

    const checkAdStatus = () => {
      const ins = adRef.current;
      if (!ins) return;

      // AdSense sets data-ad-status to "filled" or "unfilled"
      const status = ins.getAttribute('data-ad-status');
      
      // Also check for child nodes (iframe) which is more reliable for "loaded"
      const hasContent = ins.getElementsByTagName('iframe').length > 0 || ins.children.length > 0;

      if (status === 'filled' || hasContent) {
        setIsLoaded(true);
      } else if (status === 'unfilled') {
        setHasNoFill(true);
      }
    };

    // Initialize MutationObserver to watch for changes in the 'ins' element
    observerRef.current = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        checkAdStatus();
      });
    });

    if (adRef.current) {
      observerRef.current.observe(adRef.current, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ['data-ad-status', 'style']
      });

      // Safe push
      if (!pushAttempted.current) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushAttempted.current = true;
        } catch (e) {
          console.error("AdSense push error:", e);
          setHasNoFill(true);
        }
      }
      
      // Initial check
      checkAdStatus();
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasNoFill]);

  // If ad failed to fill, render nothing
  if (hasNoFill) return null;

  return (
    <div 
      className={`ad-container my-8 flex justify-center overflow-hidden rounded-xl transition-opacity duration-500 ${isLoaded ? 'opacity-100 h-auto' : 'opacity-0 h-0'}`}
      style={{ display: isLoaded ? 'flex' : 'none' }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', minWidth: isLoaded ? '300px' : '0', minHeight: isLoaded ? '100px' : '0' }}
        data-ad-client="ca-pub-2473063429655469"
        data-ad-slot={slot || "7910868238"}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

export default AdBanner;
