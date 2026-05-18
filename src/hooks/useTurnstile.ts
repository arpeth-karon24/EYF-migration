'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          theme?: string;
          callback?: (token: string) => void;
        }
      ) => string;
      reset: (widgetId: string) => void;
      getResponse: (widgetId: string) => string;
    };
  }
}

const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

export function useTurnstile(
  containerRef: React.RefObject<HTMLDivElement | null>,
  theme: 'light' | 'dark' = 'light'
) {
  const widgetIdRef = useRef<string | null>(null);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!siteKey) {
      console.error('NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set');
      return;
    }

    const initWidget = () => {
      if (containerRef.current && window.turnstile && !widgetIdRef.current) {
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme,
            callback: (t: string) => setToken(t),
          });
        } catch (error) {
          console.error('Failed to initialize Turnstile widget:', error);
        }
      }
    };

    // If script already loaded, init immediately
    if (window.turnstile) {
      initWidget();
      return;
    }

    // Check if script tag already exists in DOM
    const existing = document.querySelector(`script[src="${TURNSTILE_SCRIPT_URL}"]`);
    if (existing) {
      // Script is loading — wait for it
      existing.addEventListener('load', initWidget);
      return () => existing.removeEventListener('load', initWidget);
    }

    // Load the script fresh
    const script = document.createElement('script');
    script.src = TURNSTILE_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = initWidget;
    document.body.appendChild(script);

    return () => {
      // Only remove the script if we added it and no widget was rendered yet
      if (!widgetIdRef.current) {
        try { document.body.removeChild(script); } catch {}
      }
    };
  }, [containerRef, theme]);

  const reset = () => {
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
      setToken('');
    }
  };

  return { token, reset, widgetId: widgetIdRef.current };
}
