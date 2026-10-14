import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * useScrollReveal Hook
 * Automatically attaches an IntersectionObserver to elements with `.reveal-up`
 * so that text, cards, and sections smoothly transition from bottom to top
 * when they enter the viewport for the first time.
 */
export function useScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    // If browser doesn't support IntersectionObserver or reduced motion is preferred
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal-up').forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal-up').forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.08
      }
    );

    // Initial query
    const elements = document.querySelectorAll('.reveal-up');
    elements.forEach((el) => observer.observe(el));

    // Also observe new elements added dynamically
    const mutationObserver = new MutationObserver(() => {
      const newElements = document.querySelectorAll('.reveal-up:not(.is-revealed)');
      newElements.forEach((el) => observer.observe(el));
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);
}
