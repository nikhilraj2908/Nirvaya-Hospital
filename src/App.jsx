import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ScrollToTop from './components/common/ScrollToTop';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import StickyMobileActionBar from './components/home/StickyMobileActionBar';
import { usePageTracking } from './hooks/usePageTracking';

// Pages
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import PreBookPage from './pages/PreBookPage';
import DoctorsPage from './pages/DoctorsPage';
import ServicesPage from './pages/ServicesPage';
import TechnologyPage from './pages/TechnologyPage';
import ContactPage from './pages/ContactPage';
import BlogListPage from './pages/BlogListPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ResearchPage from './pages/ResearchPage';
import AdminPage from './pages/AdminPage';

/**
 * CRP Funnel Page Tracking Listener
 * Captures route changes and logs them to the backend /api/analytics/track
 */
function PageTracker() {
  usePageTracking();
  return null;
}

/**
 * Application Layout Wrapper
 * Conditionally isolates the Admin Portal layout from the public clinical site
 */
function AppContent({ currentLang, handleLangChange, currentFontScale, handleFontScaleChange }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-[#DFBF64] selection:text-[#0A1E3F] overflow-x-clip w-full">
      {/* Show Public Header only on client-facing routes */}
      {!isAdminRoute && (
        <Header
          currentLang={currentLang}
          onLangChange={handleLangChange}
          currentFontScale={currentFontScale}
          onFontScaleChange={handleFontScaleChange}
        />
      )}

      {/* Dynamic Page Routes */}
      <main id="main-content" className="flex-1 w-full overflow-x-clip">
        <Routes>
          <Route path="/" element={<Home currentLang={currentLang} />} />
          <Route path="/about" element={<AboutPage currentLang={currentLang} />} />
          <Route path="/pre-book" element={<PreBookPage currentLang={currentLang} />} />
          <Route path="/book-appointment" element={<PreBookPage currentLang={currentLang} />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/doctor" element={<DoctorsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/technology" element={<TechnologyPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Dynamic Knowledge Hub & Clinical Publications */}
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blogs" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/research-papers" element={<ResearchPage />} />
          <Route path="/publications" element={<ResearchPage />} />

          {/* Clinical Command & Admin Portal */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/*" element={<AdminPage />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Home currentLang={currentLang} />} />
        </Routes>
      </main>

      {/* Show Public Footer and Sticky Bar only on client-facing routes */}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <StickyMobileActionBar />}
    </div>
  );
}

export default function App() {
  const [currentLang, setCurrentLang] = useState('en');
  const [currentFontScale, setCurrentFontScale] = useState('md');

  // Handle accessible font scaling (rem base adjusted across entire app)
  const handleFontScaleChange = (scale) => {
    setCurrentFontScale(scale);
    const root = document.documentElement;
    root.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg');
    root.classList.add(`font-scale-${scale}`);
  };

  // Hindi language switching is deferred until all content is finalised
  const handleLangChange = (lang) => {
    if (lang === 'hi') return;
    setCurrentLang(lang);
  };

  return (
    <BrowserRouter>
      {/* Scroll restoration and CRP telemetry tracking */}
      <ScrollToTop />
      <PageTracker />

      <AppContent
        currentLang={currentLang}
        handleLangChange={handleLangChange}
        currentFontScale={currentFontScale}
        handleFontScaleChange={handleFontScaleChange}
      />
    </BrowserRouter>
  );
}
