import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Calendar,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  Activity,
  Layers,
  Sparkles,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { CLINIC_INFO, HERO_STAGES } from '../../data/siteData';
import Button from '../common/Button';

// Register GSAP ScrollTrigger plugin safely
gsap.registerPlugin(ScrollTrigger);

export default function EyeScrollVideo({ onOpenPreBook, currentLang = 'en' }) {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const videoRef = useRef(null);
  const triggerRef = useRef(null);
  const progressBarRef = useRef(null);

  const [activeStage, setActiveStage] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [eyeTransform, setEyeTransform] = useState({ shift: '0%', scale: 0.82 });

  // Handle responsive desktop right alignment and proportional sizing of eye video
  useEffect(() => {
    const updateLayout = () => {
      if (typeof window === 'undefined') return;
      const w = window.innerWidth;
      // Clear right placement: eye is placed firmly towards the right, leaving comfortable space for headline copy
      if (w >= 1536) setEyeTransform({ shift: '22%', scale: 0.76 });
      else if (w >= 1280) setEyeTransform({ shift: '20%', scale: 0.77 });
      else if (w >= 1024) setEyeTransform({ shift: '18%', scale: 0.78 });
      else if (w >= 768) setEyeTransform({ shift: '10%', scale: 0.80 });
      else setEyeTransform({ shift: '0%', scale: 0.82 });
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // Video Scrubbing Setup with GSAP ScrollTrigger
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    if (!video || !container) return;

    let scrubTween = null;
    let st = null;

    const setupScrub = () => {
      // Don't setup long scrub if reduced motion is requested
      if (isReducedMotion) {
        if (video.duration) video.currentTime = 0;
        return;
      }

      const duration = video.duration || 6.0;
      const playhead = { time: 0 };

      // Ensure video stays paused
      video.pause();

      // Create smooth GSAP timeline scrubbed by ScrollTrigger
      scrubTween = gsap.to(playhead, {
        time: duration,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5, // responsive, silky smooth scrubbing
          onUpdate: (self) => {
            const prog = self.progress;

            // Calculate active stage for content choreography (only update when stage actually changes)
            let nextStage = 0;
            if (prog < 0.20) nextStage = 0;
            else if (prog < 0.38) nextStage = 1;
            else if (prog < 0.55) nextStage = 2;
            else if (prog < 0.72) nextStage = 3;
            else if (prog < 0.88) nextStage = 4;
            else nextStage = 5;

            setActiveStage((prev) => (prev !== nextStage ? nextStage : prev));

            // Directly update progress bar width smoothly without triggering React re-renders
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${Math.round(prog * 100)}%`;
            }

            // Update video timestamp safely with threshold to avoid redundant DOM writes
            const targetTime = prog * duration;
            if (
              video &&
              !video.seeking &&
              Math.abs(video.currentTime - targetTime) > 0.015
            ) {
              video.currentTime = targetTime;
            }
          }
        }
      });

      st = scrubTween.scrollTrigger;
      triggerRef.current = st;
    };

    const handleMetadata = () => {
      setIsVideoLoaded(true);
      setupScrub();
    };

    const handleError = (e) => {
      console.warn('Hero video asset encountered an error, activating graceful fallback', e);
      setVideoError(true);
    };

    if (video.readyState >= 1) {
      handleMetadata();
    } else {
      video.addEventListener('loadedmetadata', handleMetadata);
      video.addEventListener('canplay', handleMetadata);
    }

    video.addEventListener('error', handleError);

    // Refresh ScrollTrigger on window resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (video) {
        video.removeEventListener('loadedmetadata', handleMetadata);
        video.removeEventListener('canplay', handleMetadata);
        video.removeEventListener('error', handleError);
      }
      window.removeEventListener('resize', handleResize);
      if (st) st.kill();
      if (scrubTween) scrubTween.kill();
    };
  }, [isReducedMotion]);

  // Stage content data
  const currentContent = HERO_STAGES[activeStage] || HERO_STAGES[0];

  return (
    <section
      ref={containerRef}
      id="hero"
      aria-label="Interactive Eye Hero Experience"
      className={`relative w-full overflow-x-clip ${isReducedMotion ? 'min-h-[85vh]' : 'h-[460vh] sm:h-[500vh]'
        }`}
    >
      {/* Sticky Hero Viewport (stays fixed while user scrolls through the 500vh height) */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-[100svh] min-h-[580px] max-h-[100svh] overflow-hidden bg-[#061226]"
      >
        {/* Ambient Dark Canvas Base (Deep Navy matching video tone) */}
        <div className="absolute inset-0 bg-[#061226] z-0 pointer-events-none" />

        {/* Luminous Medical Halo Backlight behind the eye on the right */}
        <div className="absolute top-1/2 left-1/2 lg:left-[71%] xl:left-[72%] -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] sm:w-[580px] sm:h-[580px] lg:w-[640px] lg:h-[640px] bg-gradient-to-tr from-sky-400/25 via-blue-500/15 to-indigo-400/10 rounded-full blur-3xl pointer-events-none z-0" />

        {/* 16:9 Eye Disassembly Video Layer (Full width canvas, desktop right-shifted with elegant scale & radial feathered mask) */}
        {!videoError ? (
          <div className="absolute inset-0 w-full h-full z-1 overflow-hidden pointer-events-none">
            <video
              ref={videoRef}
              src="/assets/eye-disassembly-16x9.mp4"
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              controls={false}
              tabIndex={-1}
              aria-hidden="true"
              className="w-full h-full object-cover object-center select-none opacity-100 transition-transform duration-300 pointer-events-none"
              style={{
                filter: 'brightness(1.10) contrast(1.22) saturate(1.18)',
                transform: `translateX(${eyeTransform.shift}) scale(${eyeTransform.scale})`,
                transformOrigin: 'center center',
                maskImage: 'radial-gradient(circle at center, black 55%, transparent 84%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 55%, transparent 84%)'
              }}
            />
          </div>
        ) : (
          /* Graceful Fallback if video fails to load */
          <div className="absolute inset-0 w-full h-full flex items-center justify-center lg:justify-end lg:pr-32 z-1 bg-[#061226]">
            <div className="relative w-80 h-80 rounded-full border border-sky-400/30 flex items-center justify-center animate-pulse">
              <div className="w-56 h-56 rounded-full border border-[#DFBF64]/40 flex items-center justify-center">
                <Eye className="w-24 h-24 text-[#DFBF64]/60" />
              </div>
            </div>
          </div>
        )}

        {/* Seamless Unified Gradients System:
            1. Left-to-right wide feathered gradient: ensures clear copy contrast on the left without any vertical boundary.
            2. Right-edge matching vignette: mirrors the cinematic dark tone on the right side.
            3. Top and bottom edge vignettes: anchor header and transition cleanly to the trust strip.
            4. Mobile bottom-up fade: keeps the upper eye illuminated while ensuring text readability below.
        */}
        {/* Desktop Left-to-Right Feathered Gradient (solid dark navy under text, eases out before the right-shifted eye) */}
        <div className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-2 bg-gradient-to-r from-[#061226] via-[#061226] via-[36%] via-[#061226]/85 via-[48%] via-[#061226]/30 via-[58%] to-transparent to-[66%]" />

        {/* Right-edge matching vignette */}
        <div className="hidden lg:block absolute inset-y-0 right-0 w-32 xl:w-44 pointer-events-none z-2 bg-gradient-to-l from-[#061226]/80 via-[#061226]/20 to-transparent" />

        {/* Mobile / Tablet Full Smooth Overlay */}
        <div className="lg:hidden absolute inset-0 pointer-events-none z-2 bg-gradient-to-t from-[#061226] via-[#061226]/75 via-[48%] to-[#061226]/35" />

        {/* Top Vignette (Header Transition) */}
        <div className="absolute inset-x-0 top-0 h-28 pointer-events-none z-2 bg-gradient-to-b from-[#061226]/90 via-[#061226]/40 to-transparent" />

        {/* Bottom Vignette (Trust Strip Transition) */}
        <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none z-2 bg-gradient-to-t from-[#061226] via-[#061226]/70 to-transparent" />

        {/* Foreground Content Container */}
        <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-6 sm:py-8 lg:py-12 pointer-events-none">
          {/* Top Bar inside Hero: Clinical Credential Badge & Progress Indicator */}
          <div className="flex items-center justify-between pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-white text-xs shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold text-slate-200">
                Dr Sandhya Gaur
              </span>
              <span className="text-slate-400 hidden sm:inline">•</span>
              <span className="text-[#DFBF64] hidden sm:inline font-medium">
                MD AIIMS • FVRS • Gold Medalist
              </span>
            </div>

            {/* Scroll Anatomy Progression Indicator */}
            {!isReducedMotion && (
              <div className="hidden md:flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/80 text-xs text-slate-300 shadow-md">
                <Activity className="w-3.5 h-3.5 text-[#DFBF64]" />
                <span className="text-slate-400">Anatomical Stage:</span>
                <span className="font-bold text-white uppercase tracking-wider">
                  {activeStage === 0
                    ? '1 / 6 • Full Eye'
                    : activeStage === 1
                      ? '2 / 6 • Cornea'
                      : activeStage === 2
                        ? '3 / 6 • Crystalline Lens'
                        : activeStage === 3
                          ? '4 / 6 • Vitreous Cavity'
                          : activeStage === 4
                            ? '5 / 6 • Retina & Macula'
                            : '6 / 6 • Posterior Axis'}
                </span>
                <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden ml-1 border border-slate-700">
                  <div
                    ref={progressBarRef}
                    className="h-full bg-gradient-to-r from-[#DFBF64] to-[#C59B27] transition-all duration-150"
                    style={{ width: `${Math.round(((activeStage + 1) / 6) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Main Hero Copy & Overlay Choreography */}
          <div className="my-auto max-w-xl lg:max-w-lg xl:max-w-xl pointer-events-auto transition-all duration-300">
            {/* STAGE 0: Initial Hero Entry (0% - 20% scroll) */}
            {activeStage === 0 && (
              <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#C59B27]/20 text-[#DFBF64] border border-[#C59B27]/40 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{currentLang === 'hi' ? 'भोपाल में विशेषज्ञ नेत्र चिकित्सा' : 'SPECIALIST EYE CARE IN BHOPAL'}</span>
                </div>

                {/* Primary Headline */}
                <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
                  {currentLang === 'hi' ? (
                    <span className="font-hindi">
                      विशेषज्ञ-निर्देशित <span className="text-[#DFBF64]">रेटिना एवं मोतियाबिंद</span> नेत्र देखभाल
                    </span>
                  ) : (
                    <>
                      Specialist-led{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#DFBF64]">
                        Retina & Cataract
                      </span>{' '}
                      Eye Care
                    </>
                  )}
                </h1>

                {/* Supporting Copy */}
                <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-xl font-normal">
                  {currentLang === 'hi'
                    ? 'रेटिना, मोतियाबिंद, डायबिटिक नेत्र रोग, आरओपी और संपूर्ण नेत्र विकारों के लिए सटीक, आधुनिक एवं व्यक्तिगत परामर्श।'
                    : 'Expert evaluation and personalised eye care for retina, cataract, diabetic eye disease, ROP and comprehensive ophthalmology in Bhopal.'}
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                  <Button
                    variant="gold"
                    size="lg"
                    to="/pre-book"
                    icon={Calendar}
                    className="shadow-lg hover:shadow-xl font-bold"
                  >
                    {currentLang === 'hi' ? 'परामर्श स्लॉट प्री-बुक करें' : 'Pre-book a Slot'}
                  </Button>

                  <Button
                    variant="secondary"
                    size="lg"
                    href={`https://wa.me/${CLINIC_INFO.whatsappRaw}?text=${encodeURIComponent(
                      CLINIC_INFO.whatsappDefaultMessage
                    )}`}
                    target="_blank"
                    icon={MessageSquare}
                    className="bg-white/10 hover:bg-white text-white hover:text-[#0A1E3F] border-white/30 backdrop-blur-xs font-semibold"
                  >
                    {currentLang === 'hi' ? 'व्हाट्सएप करें' : 'WhatsApp Us'}
                  </Button>

                  <Link
                    to="/services"
                    className="inline-flex items-center text-xs sm:text-sm text-slate-300 hover:text-[#DFBF64] transition-colors underline decoration-slate-500 hover:decoration-[#DFBF64] underline-offset-4 py-2 font-medium"
                  >
                    {currentLang === 'hi' ? 'हमारी सेवाएं देखें →' : 'Explore Our Services →'}
                  </Link>
                </div>

                {/* Trust Points Badges */}
                <div className="pt-2 sm:pt-4 border-t border-slate-700/60 grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 sm:gap-4 text-xs text-slate-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#DFBF64] shrink-0" />
                    <span>Retina & Vitreoretinal Care</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#DFBF64] shrink-0" />
                    <span>Micro-Incision Cataract</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#DFBF64] shrink-0" />
                    <span>Diabetic Eye Care</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#DFBF64] shrink-0" />
                    <span>Bedside ROP Screening</span>
                  </div>
                </div>
              </div>
            )}

            {/* STAGES 1 TO 5: Scroll Disassembly Choreography Overlays */}
            {activeStage > 0 && (
              <div className="bg-[#061226]/85 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-slate-700/80 shadow-2xl max-w-lg space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#C59B27]/20 text-[#DFBF64] border border-[#C59B27]/40">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{currentContent.eyebrow}</span>
                </div>

                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                  {currentContent.headline}
                </h2>

                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  {currentContent.description}
                </p>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/60 text-xs text-[#DFBF64] font-medium flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[#DFBF64]" />
                  <span>{currentContent.subDetail}</span>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <Button
                    variant="gold"
                    size="sm"
                    to="/pre-book"
                    icon={Calendar}
                    className="font-semibold shadow-xs"
                  >
                    Consult Doctor for this
                  </Button>
                  <Link
                    to="/services"
                    className="text-xs text-slate-300 hover:text-white underline decoration-slate-500 underline-offset-4"
                  >
                    View All Procedures
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Controls / Scroll Cue */}
          <div className="flex items-center justify-between text-xs text-slate-400 pointer-events-auto pt-2">
            {!isReducedMotion ? (
              <div className="inline-flex items-center gap-2 bg-slate-950/70 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-[#DFBF64] animate-ping" />
                <span>
                  {activeStage === 0
                    ? 'Scroll down to explore interactive eye anatomy'
                    : 'Keep scrolling to reveal deeper retinal layers'}
                </span>
                <ChevronDown className="w-4 h-4 text-[#DFBF64] animate-bounce ml-1" />
              </div>
            ) : (
              <div className="text-xs text-slate-400">
                Reduced motion active • Static anatomical view
              </div>
            )}

            <div className="hidden sm:block text-slate-400 text-[11px]">
              Ayodhya Bypass Road, Bhopal • M/s Nirvaya Health
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
