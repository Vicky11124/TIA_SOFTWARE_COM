import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Track page views with Meta Pixel on route changes
    // Check if navigator.webdriver or HeadlessChrome is active to avoid tracking during build-time pre-rendering
    const isPuppeteer = 
      navigator.webdriver || 
      (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.includes("HeadlessChrome"));

    if (!isPuppeteer && typeof (window as any).fbq === "function") {
      (window as any).fbq('track', 'PageView');
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
