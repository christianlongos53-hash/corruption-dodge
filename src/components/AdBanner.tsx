import React, { useEffect } from 'react';

export type AdType = 'skyscraper-left' | 'skyscraper-right' | 'rectangle' | 'mobile-banner';

interface AdBannerProps {
  type: AdType;
  className?: string;
  adClient?: string;
  adSlot?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  type,
  className = '',
  adClient = (import.meta as any).env?.VITE_ADSENSE_CLIENT || '',
  adSlot = (import.meta as any).env?.VITE_ADSENSE_SLOT || ''
}) => {
  useEffect(() => {
    // If real AdSense or ad network credentials are provided, push to adsbygoogle
    if (adClient && adSlot) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense load error:', err);
      }
    }
  }, [adClient, adSlot]);

  const isSkyscraper = type === 'skyscraper-left' || type === 'skyscraper-right';

  return (
    <aside className={`ad-banner-container ad-${type} ${className}`} aria-label="Advertisement">
      <div className="ad-badge-header">
        <span className="ad-badge-text">ADVERTISEMENT</span>
      </div>

      <div className="ad-slot-frame">
        {adClient && adSlot ? (
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format={isSkyscraper ? 'vertical' : type === 'rectangle' ? 'rectangle' : 'horizontal'}
            data-full-width-responsive="true"
          />
        ) : (
          /* Sleek Mock Ad for visual layout & revenue demonstration */
          <div className={`ad-mock-card ad-mock-${type}`}>
            {isSkyscraper && (
              <div className="mock-skyscraper-content">
                <div className="mock-ad-brand">
                  <span className="mock-ad-icon">🇵🇭</span>
                  <span className="mock-ad-title">Bayan Muna</span>
                </div>
                <div className="mock-ad-art">
                  <div className="mock-ad-graphic"></div>
                </div>
                <div className="mock-ad-copy">
                  <h4>Support Philippine Public Infrastructure</h4>
                  <p>Say NO to Ghost Projects! Report substandard roads and blocked drainage.</p>
                </div>
                <div className="mock-ad-cta">
                  <span>Learn More</span>
                </div>
                <div className="mock-ad-footer">
                  <span>Hotline 8888</span>
                </div>
              </div>
            )}

            {type === 'rectangle' && (
              <div className="mock-rectangle-content">
                <div className="mock-ad-top">
                  <span className="mock-tag">SPONSORED</span>
                  <span className="mock-sponsor">Philippine Heritage & Civic Fund</span>
                </div>
                <div className="mock-ad-body">
                  <div className="mock-thumb">🏛️</div>
                  <div className="mock-text">
                    <h4>Rebuild Our Nation</h4>
                    <p>Support community disaster-preparedness and drainage upgrades.</p>
                  </div>
                </div>
                <button className="mock-btn" type="button">Visit Portal</button>
              </div>
            )}

            {type === 'mobile-banner' && (
              <div className="mock-mobile-content">
                <span className="mock-icon">⚡</span>
                <span className="mock-text"><strong>Pro Tip:</strong> Dodge pork barrels to fund nationwide flood defenses!</span>
                <span className="mock-badge">Ad</span>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default AdBanner;
