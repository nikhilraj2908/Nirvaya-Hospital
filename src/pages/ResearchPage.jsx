import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/common/Container';
import SectionHeading from '../components/common/SectionHeading';
import { getResearchPapers } from '../services/api';
import {
  BookOpen,
  Search,
  ExternalLink,
  Award,
  Calendar,
  FileText,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Quote,
  Sparkles,
  ArrowRight,
  GraduationCap
} from 'lucide-react';

export default function ResearchPage() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  const [expandedAbstracts, setExpandedAbstracts] = useState({});

  useEffect(() => {
    fetchPapers();
  }, [selectedSpecialty]);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (selectedSpecialty !== 'ALL') {
        params.specialty = selectedSpecialty;
      }
      if (searchQuery.trim()) {
        params.q = searchQuery.trim();
      }
      const data = await getResearchPapers(params);
      setPapers(data.data || []);
    } catch (err) {
      console.error('Failed to fetch research papers:', err);
      setError('Unable to load clinical research publications at this time.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPapers();
  };

  const toggleAbstract = (id) => {
    setExpandedAbstracts((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const specialties = [
    { label: 'All Publications', value: 'ALL' },
    { label: 'Vitreo-Retina', value: 'Vitreo-Retina' },
    { label: 'Diabetic Retinopathy', value: 'Diabetic Retinopathy' },
    { label: 'Pediatric ROP', value: 'Pediatric ROP' },
    { label: 'Cataract & IOL', value: 'Cataract & IOL' },
    { label: 'Uveitis', value: 'Uveitis' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <section className="relative py-16 lg:py-24 bg-[#061226] text-white border-b border-slate-800">
        <div className="absolute inset-0 bg-radial-at-t from-[#DFBF64]/10 via-transparent to-transparent pointer-events-none" />
        <Container className="relative z-10">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
            <Link to="/" className="hover:text-[#DFBF64] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-[#DFBF64] transition-colors">Knowledge Hub</Link>
            <span>/</span>
            <span className="text-[#DFBF64]">Research Publications</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#C59B27]/20 text-[#DFBF64] border border-[#C59B27]/40">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Peer-Reviewed Science</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Clinical Research & Academic Publications
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Authored & co-authored by <strong className="text-[#DFBF64]">Dr Sandhya Gaur</strong> (MD AIIMS New Delhi, FAICO Gold Medalist). Grounded in apex-institute clinical rigour, surgical innovation, and evidence-based vitreoretinal outcomes.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <Award className="w-4 h-4 text-[#DFBF64]" />
                18+ Peer-Reviewed Studies
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <BookOpen className="w-4 h-4 text-[#DFBF64]" />
                AIIMS & International Indexed Journals
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#DFBF64]" />
                Evidence-Led Patient Protocol
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content Area */}
      <section className="py-12 lg:py-16">
        <Container>
          {/* Search & Filter Bar */}
          <div className="mb-10 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              {/* Search Box */}
              <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by title, keyword, author or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-[#0A1E3F] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C59B27] focus:border-transparent transition-all shadow-xs"
                />
              </form>

              {/* Sub-option switch to Articles */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">Also browse:</span>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-[#0A1E3F] hover:border-[#C59B27] hover:text-[#C59B27] transition-all shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Patient Articles & Blogs</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Specialty Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {specialties.map((spec) => (
                <button
                  key={spec.value}
                  type="button"
                  onClick={() => setSelectedSpecialty(spec.value)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedSpecialty === spec.value
                      ? 'bg-[#0A1E3F] text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {spec.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-6 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                  <div className="h-16 bg-slate-100 rounded w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="p-8 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-3">
              <p className="text-sm font-semibold text-amber-900">{error}</p>
              <button
                onClick={fetchPapers}
                className="px-4 py-2 rounded-lg bg-[#0A1E3F] text-white text-xs font-bold hover:bg-[#16325C] transition-all"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && papers.length === 0 && (
            <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center space-y-4">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-heading text-lg font-bold text-[#0A1E3F]">
                No publications found
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                No papers matched your current filter criteria. Try adjusting the search term or switching to "All Publications".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSpecialty('ALL');
                }}
                className="px-4 py-2 rounded-lg bg-[#C59B27] text-white text-xs font-bold hover:bg-[#B38A1F] transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Papers List */}
          {!loading && !error && papers.length > 0 && (
            <div className="space-y-6">
              {papers.map((paper) => {
                const isExpanded = !!expandedAbstracts[paper._id];
                return (
                  <article
                    key={paper._id}
                    className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 hover:border-[#DFBF64]/70 shadow-xs hover:shadow-md transition-all duration-300 relative group"
                  >
                    {/* Header Row: Journal & Specialty & Citations */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#0A1E3F]/5 text-[#0A1E3F] border border-[#0A1E3F]/15">
                          {paper.journal}
                        </span>
                        {paper.year && (
                          <span className="text-xs text-slate-500 font-medium">
                            • {paper.year}
                          </span>
                        )}
                        {paper.volume && (
                          <span className="text-xs text-slate-400">
                            Vol. {paper.volume}
                            {paper.issue ? `(${paper.issue})` : ''}
                            {paper.pages ? `: ${paper.pages}` : ''}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {paper.citationCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            <Quote className="w-3 h-3" />
                            {paper.citationCount} Citations
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                          {paper.specialty}
                        </span>
                      </div>
                    </div>

                    {/* Paper Title */}
                    <h2 className="font-heading text-lg sm:text-xl font-bold text-[#0A1E3F] group-hover:text-[#9A7818] transition-colors leading-snug mb-2">
                      {paper.title}
                    </h2>

                    {/* Authors */}
                    <div className="text-xs text-slate-600 mb-4 flex flex-wrap items-center gap-1">
                      <span className="font-semibold text-slate-700">Authors:</span>
                      <span>
                        {paper.authors?.map((author, idx) => (
                          <span key={idx}>
                            {author.includes('Sandhya Gaur') ? (
                              <strong className="text-[#0A1E3F] font-bold underline decoration-[#DFBF64]">
                                {author}
                              </strong>
                            ) : (
                              author
                            )}
                            {idx < paper.authors.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </span>
                    </div>

                    {/* Abstract Section */}
                    {paper.abstract && (
                      <div className="mb-4">
                        <div
                          className={`text-xs sm:text-sm text-slate-600 leading-relaxed relative ${
                            !isExpanded ? 'line-clamp-2' : ''
                          }`}
                        >
                          <p>{paper.abstract}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleAbstract(paper._id)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#C59B27] hover:text-[#0A1E3F] mt-1.5 transition-colors cursor-pointer"
                        >
                          {isExpanded ? (
                            <>
                              <span>Collapse Abstract</span>
                              <ChevronUp className="w-3.5 h-3.5" />
                            </>
                          ) : (
                            <>
                              <span>Read Full Abstract</span>
                              <ChevronDown className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Keywords */}
                    {paper.keywords && paper.keywords.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mb-5 pt-1">
                        {paper.keywords.map((kw, idx) => (
                          <span
                            key={idx}
                            className="text-[10.5px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium"
                          >
                            #{kw}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer Actions: DOI, PubMed, Links */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {paper.doi && (
                          <span className="text-slate-500 font-mono text-[11px]">
                            DOI: {paper.doi}
                          </span>
                        )}
                        {paper.pmid && (
                          <span className="text-slate-400 font-mono text-[11px]">
                            PMID: {paper.pmid}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {paper.externalUrl && (
                          <a
                            href={paper.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0A1E3F] text-slate-700 hover:text-white text-xs font-semibold transition-all"
                          >
                            <span>Publisher Index</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <Link
                          to="/pre-book"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C59B27] hover:bg-[#B38A1F] text-white text-xs font-bold transition-all shadow-xs"
                        >
                          <span>Consult Author</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Bottom Academic Box */}
          <div className="mt-16 rounded-3xl bg-gradient-to-br from-[#0A1E3F] to-[#122B55] p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#DFBF64]">
                Evidence-Led Clinical Ophthalmology
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                Every Surgery Informed by Peer-Reviewed Scientific Excellence
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                At Nirvaya Eyecare Centre, your treatment is not guided by commercial targets, but by published clinical trials, precise micro-surgical protocols, and international vitreoretinal benchmarks.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/pre-book"
                  className="px-6 py-3 rounded-lg bg-[#C59B27] hover:bg-[#B38A1F] text-white font-bold text-sm shadow-md transition-all"
                >
                  Book Specialist Consultation
                </Link>
                <Link
                  to="/doctors"
                  className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white text-white hover:text-[#0A1E3F] font-semibold text-sm border border-white/20 transition-all"
                >
                  View Dr Sandhya Gaur’s Full Profile
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
