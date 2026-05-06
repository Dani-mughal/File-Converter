import React, { useEffect, useState } from 'react';

const AdBanner = ({ slot, format = 'auto', responsive = 'true' }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
      setHasError(true);
    }
  }, []);

  if (hasError) return null;

  return (
    <div className="ad-container my-8 flex justify-center overflow-hidden rounded-xl bg-transparent">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minWidth: '300px', minHeight: '100px', background: 'transparent' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot || "XXXXXXXXXX"}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

export default AdBanner;
