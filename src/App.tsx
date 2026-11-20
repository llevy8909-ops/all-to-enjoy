import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Moon,
  Sun,
  Search,
  MapPin,
  Pill,
  Stethoscope,
  Sparkles,
  PhoneCall,
  Clock,
  HeartPulse,
  Leaf,
  ArrowRight,
  BookOpen,
  ArrowRightLeft,
  Hospital,
  AlertTriangle,
  Compass,
  CheckCircle2,
  HelpCircle,
  Menu,
  X,
  Heart
} from 'lucide-react';
import { NearbyCareMap } from './components/NearbyCareMap';
import { SymptomLibrary } from './components/SymptomLibrary';
import { SymptomScout } from './components/SymptomScout';
import { MedicineCabinet } from './components/MedicineCabinet';
import { FirstAidGuide } from './components/FirstAidGuide';
import { HopeCompanion } from './components/HopeCompanion';
import { SYMPTOMS_DATA } from './data/symptoms';
import { GLOBAL_SYMPTOM_ATLAS } from './data/symptoms_atlas';

type TabView = 'home' | 'scout' | 'library' | 'map' | 'cabinet' | 'firstaid' | 'hope';

export default function App() {
  // Theme state persisted in localStorage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('global_pharma_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [activeTab, setActiveTab] = useState<TabView>('home');
  const [mapFacilityFilter, setMapFacilityFilter] = useState<'pharmacy' | 'clinic' | 'urgent_care' | 'hospital' | 'all'>('all');
  const [scoutPrefill, setScoutPrefill] = useState<string>('');
  const [librarySearchQuery, setLibrarySearchQuery] = useState<string>('');
  const [heroQuery, setHeroQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [quotaExceeded, setQuotaExceeded] = useState<boolean>(false);

  // Listen for global Google Maps Platform quota/auth events
  useEffect(() => {
    const onQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', onQuotaExceeded);
  }, []);

  // Sync dark class on documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('global_pharma_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('global_pharma_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const navigateToMap = (facilityType: 'pharmacy' | 'clinic' | 'urgent_care' | 'hospital' | 'all') => {
    setMapFacilityFilter(facilityType);
    setActiveTab('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToScout = (symptomName?: string) => {
    setScoutPrefill(symptomName ?? '');
    setActiveTab('scout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToLibrary = (query?: string) => {
    setLibrarySearchQuery(query ?? '');
    setActiveTab('library');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Emergency Hotline Top Bar */}
      <div className="bg-rose-600 text-white text-xs font-semibold px-4 py-2">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <span>Medical emergency? Do not wait for online guidance.</span>
          <div className="flex items-center gap-4 shrink-0">
            <a
              href="tel:911"
              className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call 911 / 112</span>
            </a>
            <button
              onClick={() => navigateToMap('hospital')}
              className="hidden sm:inline-flex items-center gap-1 underline text-rose-100 hover:text-white whitespace-nowrap"
            >
              Nearest 24/7 ER →
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 cursor-pointer group select-none whitespace-nowrap shrink-0 text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center group-hover:bg-emerald-700 transition-colors">
              <Pill className="w-5 h-5 rotate-45" />
            </div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
              Go<span className="text-emerald-600 dark:text-emerald-400">Pharma</span>
            </span>
          </button>

          {/* Desktop Nav Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg transition whitespace-nowrap shrink-0 ${
                activeTab === 'home'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setActiveTab('scout')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap shrink-0 ${
                activeTab === 'scout'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Symptom Scout</span>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap shrink-0 ${
                activeTab === 'library'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Symptom Library</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap shrink-0 ${
                activeTab === 'map'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-500" />
              <span>Care Near You</span>
            </button>

            <button
              onClick={() => setActiveTab('cabinet')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap shrink-0 ${
                activeTab === 'cabinet'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Natural vs Rx</span>
            </button>

            <button
              onClick={() => setActiveTab('firstaid')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap shrink-0 ${
                activeTab === 'firstaid'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
              <span>First Aid</span>
            </button>

            <button
              onClick={() => setActiveTab('hope')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap shrink-0 ${
                activeTab === 'hope'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Hope &amp; Support</span>
            </button>
          </nav>

          {/* Right Controls: Dark/Light Mode & Mobile Menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pb-4 pt-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 space-y-1">
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              🏠 Home
            </button>
            <button
              onClick={() => {
                setActiveTab('scout');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              ✨ AI Symptom Scout
            </button>
            <button
              onClick={() => {
                setActiveTab('library');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              📚 Symptom & Cure Library
            </button>
            <button
              onClick={() => {
                setActiveTab('map');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              🗺️ Care Near You (Live Map & Hours)
            </button>
            <button
              onClick={() => {
                setActiveTab('cabinet');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              ⚖️ Natural vs Artificial Medicine
            </button>
            <button
              onClick={() => {
                setActiveTab('firstaid');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              🚨 First Aid & 911 Station
            </button>
            <button
              onClick={() => {
                setActiveTab('hope');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              💙 Hope &amp; Recovery Support (Mental Health, Crisis &amp; Addiction)
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-6 sm:py-8 flex-1">
        {/* VIEW 1: HOME PAGE */}
        {activeTab === 'home' && (
          <div className="space-y-10">
            {/* Hero Section with Glow */}
            <div className="relative rounded-3xl bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 p-6 sm:p-12 overflow-hidden shadow-sm">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>GoPharma · Smart Triage, Dual Care &amp; Recovery</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  Natural Remedies, Modern Medicine &amp; Live Nearby Care.
                </h1>

                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-4 font-normal leading-relaxed">
                  Your instant health &amp; care compass—blending smart AI symptom triage, 500+ A–Z natural herbs and modern medicines, live nearby hospitals &amp; pharmacies, and a private sanctuary when life feels heavy.
                </p>

                {/* Hero Search Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    navigateToLibrary(heroQuery.trim());
                  }}
                  className="mt-8 flex flex-col sm:flex-row items-stretch gap-3 max-w-2xl"
                >
                  <div className="relative flex-1">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={heroQuery}
                      onChange={(e) => setHeroQuery(e.target.value)}
                      placeholder="Search any symptom, herb, or medicine (e.g. Ginger, Kidney Stone, Migraine)..."
                      className="w-full pl-12 pr-24 py-3.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold transition"
                    >
                      Search
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateToScout(heroQuery.trim())}
                    className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 active:scale-95 transition flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI Scout</span>
                  </button>
                </form>

                {/* Feature Highlights Row */}
                <div className="mt-8 pt-8 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Common to Emergency Triage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Side-by-Side Natural & OTC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Live Map & Opening Hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Zero Login · Private</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Action Hub Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: AI Symptom Scout */}
              <div
                onClick={() => navigateToScout()}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs hover:shadow-lg hover:border-emerald-500 dark:hover:border-emerald-500 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    AI Symptom Scout
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Multi-turn clinical interview that asks targeted follow-ups, checks drug &amp; allergy safety, and builds a personalized dual-cure triage protocol.
                  </p>
                </div>
                <div className="mt-6 flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span>Start Smart Interview</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 2: Symptom & Cure Library */}
              <div
                onClick={() => navigateToLibrary()}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    A–Z Symptom &amp; Cure Library
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Browse {SYMPTOMS_DATA.length + GLOBAL_SYMPTOM_ATLAS.length}+ conditions across 15 specialties from Common to Emergency, plus live AI monograph synthesis.
                  </p>
                </div>
                <div className="mt-6 flex items-center text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span>Browse A–Z Index</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 3: Care Near You Map */}
              <div
                onClick={() => navigateToMap('all')}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs hover:shadow-lg hover:border-cyan-500 dark:hover:border-cyan-500 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Care Near You: Map & Real Hours
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Interactive map showing clinics, 24/7 pharmacies, urgent cares, and trauma hospitals. Real-time operating hours check (Open Now, Closes Soon, 24/7).
                  </p>
                </div>
                <div className="mt-6 flex items-center text-xs font-bold text-cyan-600 dark:text-cyan-400">
                  <span>Open Live Map</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Hope & Recovery Support Banner */}
            <div
              onClick={() => {
                setActiveTab('hope');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    Hope &amp; Recovery Sanctuary · Saved Log &amp; Companion
                  </p>
                  <h3 className="font-editorial text-xl sm:text-2xl font-medium text-slate-900 dark:text-white mt-1">
                    Walking through dark thoughts, heavy distress, or addiction?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
                    Talk honestly with a human-sounding AI listener that remembers your mood &amp; sobriety streak log, offers 4-7-8 breathing tools, shares uplifting Bible verses, and keeps 988 &amp; SAMHSA support close.
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shrink-0 whitespace-nowrap transition-colors">
                <span>Open Hope Sanctuary</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Popular Right Now: Quick Symptoms Grid */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Quick Reference
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    Common Conditions & Their Dual Cures
                  </h2>
                </div>
                <button
                  onClick={() => navigateToLibrary()}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>
                    Explore {SYMPTOMS_DATA.length + GLOBAL_SYMPTOM_ATLAS.length}+ A–Z Index &amp; AI Pharmacopeia
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {SYMPTOMS_DATA.slice(0, 8).map((symp) => (
                  <div
                    key={symp.id}
                    onClick={() => navigateToLibrary(symp.name)}
                    className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-emerald-50/50 dark:hover:bg-slate-800 transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          symp.triage === 'EMERGENCY'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : symp.triage === 'URGENT'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : symp.triage === 'MODERATE'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {symp.triage}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {symp.name}
                    </h4>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {symp.overview}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span>Handle & Cures</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: AI SYMPTOM SCOUT */}
        {activeTab === 'scout' && (
          <SymptomScout
            onNavigateToMap={navigateToMap}
            prefillSymptom={scoutPrefill}
          />
        )}

        {/* VIEW 3: SYMPTOM & CURE LIBRARY */}
        {activeTab === 'library' && (
          <SymptomLibrary
            onNavigateToMap={navigateToMap}
            onOpenSymptomChecker={navigateToScout}
            searchFilterProp={librarySearchQuery}
          />
        )}

        {/* VIEW 4: NEARBY CARE MAP */}
        {activeTab === 'map' && (
          <NearbyCareMap
            initialFacilityType={mapFacilityFilter}
            isDarkMode={isDarkMode}
          />
        )}

        {/* VIEW 5: MEDICINE CABINET */}
        {activeTab === 'cabinet' && <MedicineCabinet />}

        {/* VIEW 6: FIRST AID */}
        {activeTab === 'firstaid' && (
          <FirstAidGuide onNavigateToMap={navigateToMap} />
        )}

        {/* VIEW 7: HOPE & RECOVERY SUPPORT COMPANION */}
        {activeTab === 'hope' && (
          <HopeCompanion onNavigateToMap={navigateToMap} />
        )}
      </main>

      {/* Quick Floating Hope & Crisis Support Button */}
      {activeTab !== 'hope' && (
        <button
          type="button"
          onClick={() => {
            setActiveTab('hope');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs font-semibold shadow-lg border border-slate-700/60 dark:border-emerald-500/40 transition whitespace-nowrap"
        >
          <Heart className="w-4 h-4 text-rose-400 dark:text-rose-200" />
          <span>Need Someone to Talk To?</span>
        </button>
      )}

      {/* Footer & Medical Disclaimer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-12 py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="container mx-auto px-4 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-emerald-500" />
              <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                GoPharma Healthcare Platform
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <button onClick={() => navigateToMap('all')} className="hover:text-emerald-600">
                Care Facilities Map
              </button>
              <button onClick={() => navigateToLibrary()} className="hover:text-emerald-600">
                Symptom & Cure Library
              </button>
              <button onClick={() => setActiveTab('cabinet')} className="hover:text-emerald-600">
                Herb vs Drug Cabinet
              </button>
              <button onClick={() => setActiveTab('firstaid')} className="hover:text-rose-600">
                Emergency First Aid
              </button>
              <button onClick={() => setActiveTab('hope')} className="hover:text-indigo-500">
                Hope &amp; Support AI
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-[11px] leading-relaxed">
            <strong className="text-slate-700 dark:text-slate-300">Clinical Triage & Pharmaceutical Disclaimer: </strong>
            GoPharma provides evidence-based educational health guidance, over-the-counter medicine specifications, and traditional botanical information. It is designed for triage and information only and does not replace direct diagnosis or treatment by a licensed physician or emergency medical doctor. If you suspect an acute life-threatening emergency, call 911, 112, 999 or your local emergency dispatch immediately.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <span>© 2026 GoPharma. All rights reserved.</span>
            <span>Maps &amp; live operating hours powered by Google Maps Platform.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
