import React, {useEffect} from 'react';
import mediumZoom from 'medium-zoom';
import {useLocation} from '@docusaurus/router';

const SELECTOR = 'article img, .markdown img';

export default function Root({children}) {
  const location = useLocation();

  useEffect(() => {
    const zoom = mediumZoom(SELECTOR, {
      background: 'rgba(0, 0, 0, 0.85)',
      margin: 24,
    });

    return () => zoom.detach();
  }, [location.pathname]);

  return <>{children}</>;
}
