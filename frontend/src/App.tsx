import React, { useState } from 'react';
import { FloatingWidget } from './components/widget/FloatingWidget';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { 
  LayoutDashboard, BookOpen, ExternalLink, Shield, GraduationCap, 
  Search, Sparkles, Phone, Award, Globe, Database, Video, 
  FileText, Clock, ChevronRight, CheckCircle2, Building2
} from 'lucide-react';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'portal' | 'admin'>('portal');
  const [heroSearch, setHeroSearch] = useState('');
  const [suggestedQuery, setSuggestedQuery] = useState<string | null>(null);

  React.useEffect(() => {
    const visitsKey = 'pu_gyanoday_today_visitors';
    const totalVisitsKey = 'pu_gyanoday_total_visitors';
    const sessionVisited = sessionStorage.getItem('pu_session_tracked');

    if (!sessionVisited) {
      sessionStorage.setItem('pu_session_tracked', 'true');
      const currentToday = parseInt(localStorage.getItem(visitsKey) || '0', 10) + 1;
      const currentTotal = parseInt(localStorage.getItem(totalVisitsKey) || '0', 10) + 1;

      localStorage.setItem(visitsKey, currentToday.toString());
      localStorage.setItem(totalVisitsKey, currentTotal.toString());
    }
  }, []);

  const handleChipClick = (query: string) => {
    setSuggestedQuery(query);
    // Dispatch custom event to trigger floating widget without page refresh
    window.dispatchEvent(new CustomEvent('gyanai-open-with-query', { detail: { query } }));
  };

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (heroSearch.trim()) {
      handleChipClick(heroSearch.trim());
      setHeroSearch('');
    }
  };

  return (
    <div className="min-h-screen bg-[#070B19] text-slate-100 font-sans relative flex flex-col selection:bg-amber-500 selection:text-slate-950">


      {/* 2. Top Parul University Main Navigation Bar */}
      <header className="bg-[#0D152D]/90 border-b border-slate-800/80 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4 max-w-6xl mx-auto w-full justify-between">
          {/* Logo & Institution Branding */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('portal')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#070B19] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-lg text-white tracking-tight">Library मित्र</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Parul University
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium block">Digital Library Intelligence Platform</span>
            </div>
          </div>

          {/* Quick Navigation Links & Admin Switcher */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-300 mr-2">
              <a href="https://www.paruluniversity.ac.in/academics/pu-libraries/" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> PU Libraries Portal
              </a>
              <a href="https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/home" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> Gyanoday Bhavan
              </a>
            </div>

            <button
              type="button"
              onClick={() => setCurrentView(currentView === 'portal' ? 'admin' : 'portal')}
              className="pu-gold-btn px-4 py-2 rounded-xl text-xs flex items-center gap-2 font-bold tracking-wide cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{currentView === 'portal' ? 'Open Admin Intelligence Hub' : 'Back to Library Portal'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Main View */}
      {currentView === 'admin' ? (
        <AdminDashboard />
      ) : (
        <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto w-full">
          {/* Parul University Hero Banner */}
          <div className="glass-card p-6 sm:p-10 rounded-3xl border border-slate-800/80 bg-gradient-to-b from-[#0D152D] via-[#0D152D]/80 to-[#070B19] mb-8 relative overflow-hidden shadow-2xl">
            {/* Ambient Background Glow Effects */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-3xl relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Official Digital Library Assistant
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight font-heading">
                Library <span className="gradient-gold-text">मित्र</span>
              </h1>

              {/* Vision Statement Card */}
              <div className="p-5 rounded-2xl bg-amber-500/10 border-l-4 border-amber-500 text-slate-200 text-xs sm:text-sm leading-relaxed mb-6 italic shadow-inner">
                "Library मित्र is not merely a chatbot but your dedicated AI Digital Library Assistant for Parul University. The platform establishes a centralized intelligence layer serving students, faculty, researchers, and administrators across all campus libraries."
              </div>

              {/* Interactive Search Input Box in Hero */}
              <form onSubmit={handleHeroSearchSubmit} className="relative mb-6">
                <div className="flex items-center bg-[#070B19] border border-slate-700/80 rounded-2xl p-2 focus-within:border-amber-400 transition-all shadow-xl">
                  <Search className="w-5 h-5 text-amber-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Search OPAC books, IEEE papers, Knimbus login, library timings..."
                    className="w-full bg-transparent px-3 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="pu-gold-btn px-5 py-2.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Ask Library मित्र</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 border border-slate-700/80 text-xs font-bold transition-all shadow-md"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Gyanoday Bhavan Google Site</span>
                </a>

                <a
                  href="https://www.paruluniversity.ac.in/academics/pu-libraries/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 text-xs font-bold transition-all shadow-md"
                >
                  <Globe className="w-4 h-4 text-amber-400" />
                  <span>Parul University Main Libraries</span>
                </a>
              </div>
            </div>
          </div>

          {/* Institutional Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="glass-card p-4 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-heading block">63,000+</span>
              <span className="text-xs text-slate-400 font-medium">Students & Faculty Served</span>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-heading block">10+</span>
              <span className="text-xs text-slate-400 font-medium">Campus Specialized Libraries</span>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-heading block">200,000+</span>
              <span className="text-xs text-slate-400 font-medium">Print Books & Volumes</span>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-heading block">5 Million+</span>
              <span className="text-xs text-slate-400 font-medium">IEEE & SCOPUS Papers</span>
            </div>
          </div>

          {/* Quick Query Suggestion Chips */}
          <div className="mb-8">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Frequently Asked Questions to Library मित्र (Click to Ask)
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                'How many libraries are on this campus?',
                'How do I access IEEE Xplore off-campus?',
                'How to login to Knimbus remote portal?',
                'What are the Gyanoday Bhavan reading hall timings?',
                'Where can I find past examination question papers?',
                'What is the Turnitin plagiarism submission email?'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleChipClick(chip);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#0D152D] hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 text-xs font-medium transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{chip}</span>
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                </button>
              ))}
            </div>
          </div>

          {/* 6 Key Library Service Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {/* Card 1 */}
            <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 w-fit mb-4 border border-amber-500/20">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base mb-2 font-heading">E-Journals & Research Databases</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Campus-wide IP access and 24/7 Knimbus remote login to IEEE Xplore, SCOPUS, Web of Science, EBSCO, BMJ, Manupatra & Micromedex.
                </p>
              </div>
              <a 
                href="https://paruluniversity.knimbus.com/portal/v2/default/home?loggedInUsing=gsuite"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-2 cursor-pointer"
              >
                <span>Access In-Campus & Remote Databases (Knimbus)</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Card 2 */}
            <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit mb-4 border border-cyan-500/20">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base mb-2 font-heading">OPAC Catalog & Book Bank</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Real-time catalog search across 200,000+ print volumes in 10+ campus libraries. Book Bank Scheme textbook distribution for students.
                </p>
              </div>
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleChipClick('How to search OPAC catalog?');
                }}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 pt-2 cursor-pointer"
              >
                <span>Search OPAC Catalog</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>



            {/* Card 4 */}
            <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 w-fit mb-4 border border-purple-500/20">
                  <Video className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base mb-2 font-heading">Video Library & NPTEL</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  High-speed campus network caching for thousands of NPTEL, SWAYAM, and National Digital Library of India (NDLI) video courseware.
                </p>
              </div>
              <a 
                href="https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/video-library"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 pt-2 cursor-pointer"
              >
                <span>Browse Video Library</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Card 5 */}
            <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 w-fit mb-4 border border-blue-500/20">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base mb-2 font-heading">Past Question Paper Archive</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Digital repository of mid-term and semester exam papers (2018–2025) across B.Tech, MBA, Pharmacy, Medical, and Law faculties.
                </p>
              </div>
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleChipClick('Where can I find past examination question papers?');
                }}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 pt-2 cursor-pointer"
              >
                <span>Access Question Papers</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>


          </div>
        </main>
      )}

      {/* Parul University Footer */}
      <footer className="bg-[#070B19] border-t border-slate-800/80 py-8 px-4 sm:px-8 text-slate-400 text-xs mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-200">Library मित्र — Parul University Digital Library Assistant</p>
              <p className="text-[11px] text-slate-400">© 2026 Parul University. All rights reserved.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px] font-semibold text-slate-300">
            <a href="https://www.paruluniversity.ac.in/academics/pu-libraries/" target="_blank" rel="noreferrer" className="hover:text-amber-400">PU Libraries Portal</a>
            <a href="https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/home" target="_blank" rel="noreferrer" className="hover:text-amber-400">Gyanoday Bhavan Portal</a>
            <a href="mailto:library@paruluniversity.ac.in" className="hover:text-amber-400">library@paruluniversity.ac.in</a>
          </div>
        </div>
      </footer>

      {/* Floating Chat Assistant Widget */}
      <FloatingWidget externalSuggestedQuery={suggestedQuery} />
    </div>
  );
};
