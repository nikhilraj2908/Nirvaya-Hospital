import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * EyeTrackingButton Component
 *
 * A high-performance, interactive pill-shaped CTA button featuring cartoon-style
 * eyes whose pupils smoothly follow the user's cursor across the entire viewport
 * and blink naturally at random intervals.
 *
 * Performance note: Cursor tracking uses a direct requestAnimationFrame loop
 * and DOM mutations on pupil refs, completely avoiding React state re-renders
 * during mouse movements.
 */
export default function EyeTrackingButton({
  label = 'Pre-book a Slot',
  to = '/pre-book',
  onClick,
  className = '',
  variant = 'navy',
  size = 'md',
  ariaLabel,
  showMobileShortText = true
}) {
  const buttonRef = useRef(null);
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);
  const eyesContainerRef = useRef(null);

  // Blink state (only used for eyelid CSS class)
  const [isBlinking, setIsBlinking] = useState(false);

  // Mouse & Pupil Tracking Coordinate Refs (bypasses React re-renders)
  const mouseCoords = useRef({ x: -1000, y: -1000 });
  const hasMouseMoved = useRef(false);
  const currentPupilLeft = useRef({ x: 0, y: 0 });
  const currentPupilRight = useRef({ x: 0, y: 0 });
  const targetPupilLeft = useRef({ x: 0, y: 0 });
  const targetPupilRight = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);
  const blinkTimeoutRef = useRef(null);
  const doubleBlinkTimeoutRef = useRef(null);

  // 1. Mouse Tracking with Smooth Lerp Animation Frame
  useEffect(() => {
    // Check if user prefers reduced motion or is on touch-only device
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isTouchDevice =
      typeof window !== 'undefined' &&
      (window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
        'ontouchstart' in window);

    // If reduced motion is requested, do not initialize eye tracking
    if (prefersReducedMotion) return;

    const handlePointerMove = (e) => {
      mouseCoords.current.x = e.clientX;
      mouseCoords.current.y = e.clientY;
      hasMouseMoved.current = true;
    };

    // Only listen to mouse movements on non-touch or pointer devices
    if (!isTouchDevice) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    }

    // Animation Loop using requestAnimationFrame
    const updatePupilPositions = () => {
      if (hasMouseMoved.current && !isTouchDevice) {
        // Calculate target for Left Eye
        if (leftEyeRef.current) {
          const rect = leftEyeRef.current.getBoundingClientRect();
          const eyeCenterX = rect.left + rect.width / 2;
          const eyeCenterY = rect.top + rect.height / 2;

          const dx = mouseCoords.current.x - eyeCenterX;
          const dy = mouseCoords.current.y - eyeCenterY;
          const angle = Math.atan2(dy, dx);
          const distance = Math.hypot(dx, dy);

          // Constrain movement to 28-30% of eye radius so pupils never clip
          const maxTravel = (rect.width / 2) * 0.3;
          // Scale travel smoothly based on distance from eye
          const travel = Math.min(maxTravel, distance * 0.05);

          targetPupilLeft.current.x = Math.cos(angle) * travel;
          targetPupilLeft.current.y = Math.sin(angle) * travel;
        }

        // Calculate target for Right Eye (separate center for realistic parallax)
        if (rightEyeRef.current) {
          const rect = rightEyeRef.current.getBoundingClientRect();
          const eyeCenterX = rect.left + rect.width / 2;
          const eyeCenterY = rect.top + rect.height / 2;

          const dx = mouseCoords.current.x - eyeCenterX;
          const dy = mouseCoords.current.y - eyeCenterY;
          const angle = Math.atan2(dy, dx);
          const distance = Math.hypot(dx, dy);

          const maxTravel = (rect.width / 2) * 0.3;
          const travel = Math.min(maxTravel, distance * 0.05);

          targetPupilRight.current.x = Math.cos(angle) * travel;
          targetPupilRight.current.y = Math.sin(angle) * travel;
        }

        // Smooth Interpolation (Lerp factor = 0.18 for fluid, natural glide)
        currentPupilLeft.current.x +=
          (targetPupilLeft.current.x - currentPupilLeft.current.x) * 0.18;
        currentPupilLeft.current.y +=
          (targetPupilLeft.current.y - currentPupilLeft.current.y) * 0.18;

        currentPupilRight.current.x +=
          (targetPupilRight.current.x - currentPupilRight.current.x) * 0.18;
        currentPupilRight.current.y +=
          (targetPupilRight.current.y - currentPupilRight.current.y) * 0.18;

        // Directly apply transform to pupil elements (zero React re-renders!)
        if (leftPupilRef.current) {
          leftPupilRef.current.style.transform = `translate3d(${currentPupilLeft.current.x.toFixed(
            2
          )}px, ${currentPupilLeft.current.y.toFixed(2)}px, 0)`;
        }
        if (rightPupilRef.current) {
          rightPupilRef.current.style.transform = `translate3d(${currentPupilRight.current.x.toFixed(
            2
          )}px, ${currentPupilRight.current.y.toFixed(2)}px, 0)`;
        }
      }

      rafId.current = requestAnimationFrame(updatePupilPositions);
    };

    rafId.current = requestAnimationFrame(updatePupilPositions);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // 2. Natural Blinking Animation Loop (3 to 6-second random intervals + subtle double-blink)
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    let isMounted = true;

    const performBlink = () => {
      if (!isMounted) return;

      // 1. Close eyelids
      setIsBlinking(true);

      // 2. Open eyelids after 160ms (quick natural blink)
      blinkTimeoutRef.current = setTimeout(() => {
        if (!isMounted) return;
        setIsBlinking(false);

        // 20% probability of an occasional playful double-blink!
        const isDoubleBlink = Math.random() < 0.2;
        if (isDoubleBlink) {
          doubleBlinkTimeoutRef.current = setTimeout(() => {
            if (!isMounted) return;
            setIsBlinking(true);
            setTimeout(() => {
              if (isMounted) setIsBlinking(false);
            }, 140);
          }, 110);
        }
      }, 160);

      // Schedule next blink randomly between 3000ms and 6000ms
      const nextInterval = Math.floor(Math.random() * 3000) + 3000;
      blinkTimeoutRef.current = setTimeout(performBlink, nextInterval);
    };

    // Initial blink after 2 seconds
    const initialTimer = setTimeout(performBlink, 2200);

    return () => {
      isMounted = false;
      clearTimeout(initialTimer);
      if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
      if (doubleBlinkTimeoutRef.current) clearTimeout(doubleBlinkTimeoutRef.current);
    };
  }, []);

  // Sizing definitions matching healthcare aesthetics
  const sizeStyles = {
    sm: {
      button: 'px-3.5 py-1.5 text-xs min-h-[38px] gap-2',
      eye: 'w-[17px] h-[17px]',
      pupil: 'w-[6.5px] h-[6.5px]',
      catchlight: 'w-[1.8px] h-[1.8px]'
    },
    md: {
      button: 'px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm min-h-[44px] sm:min-h-[46px] gap-2.5',
      eye: 'w-[19px] h-[19px] sm:w-[21px] sm:h-[21px]',
      pupil: 'w-[7.5px] h-[7.5px] sm:w-[8.5px] sm:h-[8.5px]',
      catchlight: 'w-[2px] h-[2px]'
    },
    lg: {
      button: 'px-6 py-3.5 text-sm sm:text-base min-h-[52px] sm:min-h-[56px] gap-3',
      eye: 'w-[24px] h-[24px]',
      pupil: 'w-[9.5px] h-[9.5px]',
      catchlight: 'w-[2.5px] h-[2.5px]'
    }
  }[size] || sizeStyles.md;

  // Variant styling
  const variantStyles = {
    navy: 'bg-[#102A43] hover:bg-[#16385C] text-white border border-white/10 shadow-md hover:shadow-xl hover:shadow-[#102A43]/30',
    gold: 'bg-[#DFBF64] hover:bg-[#E5C97A] text-[#0A1E3F] border border-[#C59B27]/30 shadow-md hover:shadow-xl hover:shadow-[#DFBF64]/30',
    darkNavy: 'bg-[#0A1E3F] hover:bg-[#122A54] text-white border border-white/15 shadow-md hover:shadow-xl hover:shadow-[#0A1E3F]/35'
  }[variant] || variantStyles.navy;

  const content = (
    <>
      {/* Label Text on Left */}
      <span className="font-bold tracking-tight whitespace-nowrap select-none drop-shadow-2xs">
        {showMobileShortText ? (
          <>
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">Pre-book</span>
          </>
        ) : (
          label
        )}
      </span>

      {/* Two Cartoon-Style Animated White Eyes on Right */}
      <span
        ref={eyesContainerRef}
        aria-hidden="true"
        className="inline-flex items-center gap-1 shrink-0 select-none pointer-events-none"
      >
        {/* Left Eye */}
        <span
          ref={leftEyeRef}
          className={`relative ${sizeStyles.eye} rounded-full bg-white flex items-center justify-center overflow-hidden shadow-2xs transition-transform duration-150 ease-out origin-center`}
          style={{
            transform: isBlinking ? 'scaleY(0.08)' : 'scaleY(1)'
          }}
        >
          {/* Left Pupil (Navy/Black with glossy white catchlight reflection) */}
          <span
            ref={leftPupilRef}
            className={`block ${sizeStyles.pupil} rounded-full bg-[#081B30] relative shadow-inner`}
            style={{
              willChange: 'transform'
            }}
          >
            {/* Catchlight highlight dot */}
            <span
              className={`block ${sizeStyles.catchlight} rounded-full bg-white absolute top-0.5 right-0.5 opacity-90`}
            />
          </span>
        </span>

        {/* Right Eye */}
        <span
          ref={rightEyeRef}
          className={`relative ${sizeStyles.eye} rounded-full bg-white flex items-center justify-center overflow-hidden shadow-2xs transition-transform duration-150 ease-out origin-center`}
          style={{
            transform: isBlinking ? 'scaleY(0.08)' : 'scaleY(1)'
          }}
        >
          {/* Right Pupil (Navy/Black with glossy white catchlight reflection) */}
          <span
            ref={rightPupilRef}
            className={`block ${sizeStyles.pupil} rounded-full bg-[#081B30] relative shadow-inner`}
            style={{
              willChange: 'transform'
            }}
          >
            {/* Catchlight highlight dot */}
            <span
              className={`block ${sizeStyles.catchlight} rounded-full bg-white absolute top-0.5 right-0.5 opacity-90`}
            />
          </span>
        </span>
      </span>
    </>
  );

  const sharedClasses = `inline-flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer active:scale-[0.98] hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DFBF64] focus-visible:ring-offset-2 ${sizeStyles.button} ${variantStyles} ${className}`;

  if (to) {
    return (
      <Link
        ref={buttonRef}
        to={to}
        onClick={onClick}
        className={sharedClasses}
        aria-label={ariaLabel || label}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      className={sharedClasses}
      aria-label={ariaLabel || label}
    >
      {content}
    </button>
  );
}
