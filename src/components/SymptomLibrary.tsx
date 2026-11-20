import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  AlertOctagon,
  Sparkles,
  Leaf,
  Pill,
  ChevronRight,
  X,
  RefreshCw,
  BookOpen,
  Globe2,
} from 'lucide-react';
import { SYMPTOMS_DATA, CATEGORIES_CONFIG } from '../data/symptoms';
import { GLOBAL_SYMPTOM_ATLAS, AtlasEntry } from '../data/symptoms_atlas';
import { SymptomEntry, BodyCategory } from '../types/medical';
import { SymptomDetailModal } from './SymptomDetailModal';

interface SymptomLibraryProps {
  onNavigateToMap: (facilityType: 'pharmacy' | 'clinic' | 'urgent_care' | 'hospital') => void;
  onOpenSymptomChecker: (symptomName: string) => void;
  searchFilterProp?: string;
}

const AI_CACHE_STORAGE_KEY = 'global_pharma_ai_library_v1';
const SECTION_PAGE_SIZE = 12;
const ATLAS_PAGE_SIZE = 36;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function loadSavedAiEntries(): SymptomEntry[] {
  try {
    const raw = localStorage.getItem(AI_CACHE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const SymptomLibrary: React.FC<SymptomLibraryProps> = ({
  onNavigateToMap,
  onOpenSymptomChecker,
  searchFilterProp = '',
}) => {
  const [searchTerm, setSearchTerm] = useState<string>(searchFilterProp);
  const [selectedTriage, setSelectedTriage] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<BodyCategory>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [selectedSymptom, setSelectedSymptom] = useState<SymptomEntry | null>(null);
  const [aiEntries, setAiEntries] = useState<SymptomEntry[]>(() => loadSavedAiEntries());

  const [lookupLoadingId, setLookupLoadingId] = useState<string | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [atlasVisibleCount, setAtlasVisibleCount] = useState<number>(ATLAS_PAGE_SIZE);

  useEffect(() => {
    setSearchTerm(searchFilterProp || '');
  }, [searchFilterProp]);

  useEffect(() => {
    setAtlasVisibleCount(ATLAS_PAGE_SIZE);
  }, [searchTerm, selectedTriage, selectedCategory, selectedLetter]);

  useEffect(() => {
    try {
      localStorage.setItem(AI_CACHE_STORAGE_KEY, JSON.stringify(aiEntries.slice(0, 80)));
    } catch {
      // Ignore storage quota issues
    }
  }, [aiEntries]);

  // Combine curated catalog + user's AI-researched monographs
  const combinedMonographs = useMemo(() => {
    const seen = new Set<string>();
    const merged: SymptomEntry[] = [];

    for (const item of [...aiEntries, ...SYMPTOMS_DATA]) {
      const key = item.name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(item);
      }
    }
    return merged;
  }, [aiEntries]);

  // Pre-compute normalized lowercase search index
  const indexedMonographs = useMemo(() => {
    return combinedMonographs.map((item) => {
      const naturalText = item.naturalRemedies.map((r) => `${r.name} ${r.type}`).join(' ');
      const pharmaText = item.pharmaceuticalMedicines
        .map((p) => `${p.activeIngredient} ${p.brandNames} ${p.drugClass}`)
        .join(' ');
      const searchBlob = `${item.name} ${(item.aliases || []).join(' ')} ${item.icdCode || ''} ${
        item.overview
      } ${item.commonCauses.join(' ')} ${naturalText} ${pharmaText}`.toLowerCase();
      const firstLetter = item.name.trim().charAt(0).toUpperCase();
      return { item, searchBlob, firstLetter };
    });
  }, [combinedMonographs]);

  // Deduplicated Global Atlas items (preserving curated upgrades)
  const sortedAtlasItems = useMemo(() => {
    const existingNames = new Set(combinedMonographs.map((m) => m.name.toLowerCase()));
    return GLOBAL_SYMPTOM_ATLAS.filter((entry) => !existingNames.has(entry.name.toLowerCase())).sort(
      (a, b) => a.name.localeCompare(b.name)
    );
  }, [combinedMonographs]);

  // Precompute A-Z letter counts across BOTH full monographs and Atlas index
  const letterCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const ch of ALPHABET) map[ch] = 0;

    for (const m of indexedMonographs) {
      if (selectedTriage !== 'all' && m.item.triage !== selectedTriage) continue;
      if (selectedCategory !== 'all' && m.item.category !== selectedCategory) continue;
      if (map[m.firstLetter] !== undefined) map[m.firstLetter]++;
    }
    for (const a of sortedAtlasItems) {
      if (selectedTriage !== 'all' && a.triage !== selectedTriage) continue;
      if (selectedCategory !== 'all' && a.category !== selectedCategory) continue;
      const ch = a.name.trim().charAt(0).toUpperCase();
      if (map[ch] !== undefined) map[ch]++;
    }
    return map;
  }, [indexedMonographs, sortedAtlasItems, selectedTriage, selectedCategory]);

  // Filtered full monographs
  const filteredSymptoms = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const tokens = q ? q.split(/\s+/).filter(Boolean) : [];

    return indexedMonographs
      .filter(({ item, searchBlob, firstLetter }) => {
        if (selectedTriage !== 'all' && item.triage !== selectedTriage) return false;
        if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
        if (selectedLetter !== 'ALL' && firstLetter !== selectedLetter) return false;
        if (tokens.length > 0 && !tokens.every((t) => searchBlob.includes(t))) return false;
        return true;
      })
      .map(({ item }) => item);
  }, [indexedMonographs, searchTerm, selectedTriage, selectedCategory, selectedLetter]);

  // Filtered Global Clinical Atlas
  const filteredAtlasItems = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const tokens = q ? q.split(/\s+/).filter(Boolean) : [];

    return sortedAtlasItems.filter((entry) => {
      if (selectedTriage !== 'all' && entry.triage !== selectedTriage) return false;
      if (selectedCategory !== 'all' && entry.category !== selectedCategory) return false;
      if (
        selectedLetter !== 'ALL' &&
        entry.name.trim().charAt(0).toUpperCase() !== selectedLetter
      ) {
        return false;
      }
      if (tokens.length > 0) {
        const hay = `${entry.name} ${entry.aliases} ${entry.icdCode}`.toLowerCase();
        return tokens.every((t) => hay.includes(t));
      }
      return true;
    });
  }, [sortedAtlasItems, searchTerm, selectedTriage, selectedCategory, selectedLetter]);

  // Total indexed count across curated + atlas
  const counts = useMemo(() => {
    let e = 0;
    let u = 0;
    let m = 0;
    let c = 0;
    for (const s of combinedMonographs) {
      if (s.triage === 'EMERGENCY') e++;
      else if (s.triage === 'URGENT') u++;
      else if (s.triage === 'MODERATE') m++;
      else c++;
    }
    for (const a of sortedAtlasItems) {
      if (a.triage === 'EMERGENCY') e++;
      else if (a.triage === 'URGENT') u++;
      else if (a.triage === 'MODERATE') m++;
      else c++;
    }
    return {
      monographs: combinedMonographs.length,
      atlasTotal: sortedAtlasItems.length,
      totalCombined: combinedMonographs.length + sortedAtlasItems.length,
      emergency: e,
      urgent: u,
      moderate: m,
      common: c,
    };
  }, [combinedMonographs, sortedAtlasItems]);

  const emergencyList = useMemo(
    () => filteredSymptoms.filter((s) => s.triage === 'EMERGENCY'),
    [filteredSymptoms]
  );
  const urgentList = useMemo(
    () => filteredSymptoms.filter((s) => s.triage === 'URGENT'),
    [filteredSymptoms]
  );
  const moderateList = useMemo(
    () => filteredSymptoms.filter((s) => s.triage === 'MODERATE'),
    [filteredSymptoms]
  );
  const commonList = useMemo(
    () => filteredSymptoms.filter((s) => s.triage === 'COMMON'),
    [filteredSymptoms]
  );

  // On-demand Universal Clinical Lookup
  const handleUniversalLookup = async (queryText: string, categoryHint?: BodyCategory) => {
    const clean = queryText.trim();
    if (!clean || clean.length < 2) return;

    const existing = combinedMonographs.find(
      (s) => s.name.toLowerCase() === clean.toLowerCase()
    );
    if (existing) {
      setSelectedSymptom(existing);
      return;
    }

    setLookupLoadingId(clean);
    setLookupError(null);

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 20000);

      const res = await fetch('/api/symptom-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          query: clean,
          category: categoryHint || selectedCategory,
        }),
      });
      window.clearTimeout(timeoutId);

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.entry) {
        throw new Error(data?.error || 'Could not retrieve clinical monograph.');
      }

      const generated = data.entry as SymptomEntry;
      setAiEntries((prev) => {
        const filtered = prev.filter(
          (p) => p.name.toLowerCase() !== generated.name.toLowerCase()
        );
        return [generated, ...filtered];
      });
      setSelectedSymptom(generated);
    } catch (err: any) {
      setLookupError(
        err?.name === 'AbortError'
          ? 'Clinical lookup timed out. Try again or launch AI Symptom Scout.'
          : err?.message || 'Unable to fetch AI clinical monograph right now.'
      );
    } finally {
      setLookupLoadingId(null);
    }
  };

  const toggleSectionExpand = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const renderSection = (
    sectionKey: string,
    title: string,
    subtitle: string,
    items: SymptomEntry[],
    dotColor: string,
    badgeClasses: string,
    warningNote?: string
  ) => {
    if (items.length === 0) return null;
    const isExpanded =
      expandedSections[sectionKey] ||
      selectedTriage !== 'all' ||
      selectedLetter !== 'ALL' ||
      searchTerm.trim().length > 0;
    const visibleItems = isExpanded ? items : items.slice(0, SECTION_PAGE_SIZE);
    const hasMore = items.length > visibleItems.length;

    return (
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <div className={`w-3 h-3 rounded-full ${dotColor}`} />
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
            <span>{title}</span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${badgeClasses}`}>
              {items.length} {sectionKey === 'emergency' ? 'Critical Protocols' : 'Full Protocols'}
            </span>
          </h3>
        </div>
        <p
          className={`text-xs mb-3 ${
            warningNote
              ? 'text-rose-600 dark:text-rose-400 font-medium'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {warningNote || subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visibleItems.map((item) => (
            <SymptomCard key={item.id} item={item} onSelect={() => setSelectedSymptom(item)} />
          ))}
        </div>

        {(hasMore || (expandedSections[sectionKey] && items.length > SECTION_PAGE_SIZE)) && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => toggleSectionExpand(sectionKey)}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-emerald-500 transition shadow-xs"
            >
              {isExpanded
                ? `Collapse (${items.length})`
                : `Show All ${items.length} ${title.split('(')[0].trim()} Protocols`}
            </button>
          </div>
        )}
      </div>
    );
  };

  const visibleAtlasItems =
    selectedLetter !== 'ALL' || searchTerm.trim().length > 0
      ? filteredAtlasItems
      : filteredAtlasItems.slice(0, atlasVisibleCount);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header, Search Bar, Triage Tabs & A-Z Index */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
              <Globe2 className="w-3.5 h-3.5" />
              <span className="font-mono tabular-nums">
                {counts.totalCombined} A–Z Indexed Conditions · 15 Specialties · On-Demand AI Pharmacopeia
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              A–Z Symptoms, Natural &amp; Pharmaceutical Cures
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Browse all{' '}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {counts.totalCombined}+ conditions
              </span>{' '}
              by A–Z letter, specialty, or triage tier—or look up any rare condition or medication worldwide on demand.
            </p>
          </div>

          {/* Search input with clear button */}
          <div className="w-full md:w-96 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search A–Z symptom, ICD-10 code, herb, or drug..."
              className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Triage Level Filter Tabs */}
        <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedTriage('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              selectedTriage === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Tiers ({counts.totalCombined})
          </button>

          <button
            onClick={() => setSelectedTriage('COMMON')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              selectedTriage === 'COMMON'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-950'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Common / Home Care ({counts.common})</span>
          </button>

          <button
            onClick={() => setSelectedTriage('MODERATE')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              selectedTriage === 'MODERATE'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-950'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>See a Doctor ({counts.moderate})</span>
          </button>

          <button
            onClick={() => setSelectedTriage('URGENT')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              selectedTriage === 'URGENT'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-950'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Urgent Care ({counts.urgent})</span>
          </button>

          <button
            onClick={() => setSelectedTriage('EMERGENCY')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              selectedTriage === 'EMERGENCY'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-950'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
            <span>Emergency ({counts.emergency})</span>
          </button>
        </div>

        {/* Body Category Filter Bar */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
          {CATEGORIES_CONFIG.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as BodyCategory)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* A–Z Alphabet Jump Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              A–Z Clinical Index Jump
            </span>
            {selectedLetter !== 'ALL' && (
              <button
                type="button"
                onClick={() => setSelectedLetter('ALL')}
                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Show All Letters
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => setSelectedLetter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                selectedLetter === 'ALL'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              ALL
            </button>
            {ALPHABET.map((letter) => {
              const count = letterCounts[letter] || 0;
              const active = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  type="button"
                  disabled={count === 0}
                  title={`${letter}: ${count} condition${count === 1 ? '' : 's'}`}
                  onClick={() => setSelectedLetter(active ? 'ALL' : letter)}
                  className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center ${
                    active
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : count > 0
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-slate-700'
                      : 'bg-slate-50 dark:bg-slate-900/40 text-slate-300 dark:text-slate-700 cursor-not-allowed'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        {lookupError && (
          <div className="mt-3 px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between gap-2">
            <span>{lookupError}</span>
            <button
              type="button"
              onClick={() => setLookupError(null)}
              className="font-bold underline"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Live AI Universal Query Banner when searching anything custom */}
      {searchTerm.trim().length >= 3 && (
        <div className="bg-emerald-950/5 dark:bg-emerald-950/25 border border-emerald-300/80 dark:border-emerald-800/70 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Need a full clinical protocol for &ldquo;{searchTerm.trim()}&rdquo;?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Instantly synthesize any rare condition, tropical illness, herb, or prescription medicine with full dosages and red flags.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              disabled={lookupLoadingId !== null}
              onClick={() => handleUniversalLookup(searchTerm)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition disabled:opacity-60"
            >
              {lookupLoadingId === searchTerm.trim() ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Monograph...</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  <span>Generate Full Monograph</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => onOpenSymptomChecker(searchTerm.trim())}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-emerald-500 transition"
            >
              Check via AI Scout
            </button>
          </div>
        </div>
      )}

      {/* Render Categorized Full Monographs + Global A-Z Directory */}
      {filteredSymptoms.length === 0 && filteredAtlasItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center">
          <Search className="w-11 h-11 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No indexed entries matched {searchTerm ? `"${searchTerm}"` : 'those filters'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Generate a complete clinical triage &amp; dual-cure monograph on demand, or clear filters to browse all {counts.totalCombined}+ conditions.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {searchTerm.trim().length >= 2 && (
              <button
                type="button"
                disabled={lookupLoadingId !== null}
                onClick={() => handleUniversalLookup(searchTerm)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-60"
              >
                {lookupLoadingId ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Researching &ldquo;{searchTerm}&rdquo;...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Look Up &ldquo;{searchTerm}&rdquo; via AI Pharmacopeia</span>
                  </>
                )}
              </button>
            )}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedTriage('all');
                setSelectedCategory('all');
                setSelectedLetter('ALL');
              }}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {(selectedTriage === 'all' || selectedTriage === 'COMMON') &&
            renderSection(
              'common',
              'Common / Mild (Natural Cures & Over-the-Counter Medicine)',
              'Self-limiting conditions responsive to herbal infusions, targeted hydration, and pharmacy OTC drugs.',
              commonList,
              'bg-emerald-500',
              'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900'
            )}

          {(selectedTriage === 'all' || selectedTriage === 'MODERATE') &&
            renderSection(
              'moderate',
              'Moderate (Schedule Doctor or Walk-in Clinic)',
              'Targeted prescription therapies, clinical lab workups, and supportive natural remedies.',
              moderateList,
              'bg-blue-500',
              'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-900'
            )}

          {(selectedTriage === 'all' || selectedTriage === 'URGENT') &&
            renderSection(
              'urgent',
              'Urgent Care / Same-Day Evaluation',
              'Needs same-day clinical diagnostics (imaging, labs, IV relief, or urgent prescriptions) to prevent escalation.',
              urgentList,
              'bg-amber-500',
              'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900'
            )}

          {(selectedTriage === 'all' || selectedTriage === 'EMERGENCY') &&
            renderSection(
              'emergency',
              'Critical Emergency (Call 911 / 112 / 999 Immediately)',
              '',
              emergencyList,
              'bg-rose-600',
              'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-900',
              'Strict Medical Protocol: Home remedies are skipped. Immediate first aid and emergency room dispatch required.'
            )}

          {/* Global Clinical Atlas A–Z Directory */}
          {filteredAtlasItems.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                      A–Z Global Specialty Index ({filteredAtlasItems.length}{' '}
                      {selectedLetter !== 'ALL' ? `Starting with "${selectedLetter}"` : 'More Conditions'})
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Click any condition below to instantly generate its complete Action Plan, Natural Cures, and Pharmaceutical dosing via AI Pharmacopeia (auto-saved to your library).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {visibleAtlasItems.map((entry: AtlasEntry) => {
                  const isBusy = lookupLoadingId === entry.name;
                  return (
                    <button
                      key={`${entry.icdCode}-${entry.name}`}
                      type="button"
                      disabled={lookupLoadingId !== null}
                      onClick={() => handleUniversalLookup(entry.name, entry.category)}
                      className="text-left p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-slate-800 transition flex items-start justify-between gap-2 disabled:opacity-60"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                              entry.triage === 'EMERGENCY'
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                : entry.triage === 'URGENT'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                : entry.triage === 'MODERATE'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}
                          >
                            {entry.triage}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {entry.icdCode}
                          </span>
                        </div>
                        <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                          {entry.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {entry.aliases}
                        </div>
                      </div>

                      <div className="shrink-0 mt-1 text-emerald-600 dark:text-emerald-400">
                        {isBusy ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedLetter === 'ALL' &&
                searchTerm.trim().length === 0 &&
                atlasVisibleCount < filteredAtlasItems.length && (
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAtlasVisibleCount((prev) => prev + 60)}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold hover:opacity-90 transition"
                    >
                      Load 60 More ({filteredAtlasItems.length - atlasVisibleCount} remaining)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAtlasVisibleCount(filteredAtlasItems.length)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
                    >
                      Show All {filteredAtlasItems.length}
                    </button>
                  </div>
                )}
            </div>
          )}
        </div>
      )}

      {/* Symptom Detail Modal */}
      {selectedSymptom && (
        <SymptomDetailModal
          symptom={selectedSymptom}
          onClose={() => setSelectedSymptom(null)}
          onNavigateToMap={onNavigateToMap}
          onOpenSymptomChecker={onOpenSymptomChecker}
        />
      )}
    </div>
  );
};

// Sub-component: Individual Symptom Card in Library
interface SymptomCardProps {
  item: SymptomEntry;
  onSelect: () => void;
}

const SymptomCard: React.FC<SymptomCardProps> = React.memo(({ item, onSelect }) => {
  const isEmergency = item.triage === 'EMERGENCY';
  const isUrgent = item.triage === 'URGENT';
  const isModerate = item.triage === 'MODERATE';

  const badgeColor = isEmergency
    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
    : isUrgent
    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
    : isModerate
    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-900'
    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900';

  return (
    <div
      onClick={onSelect}
      className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
        isEmergency
          ? 'border-rose-200 dark:border-rose-900/60 hover:border-rose-400'
          : isUrgent
          ? 'border-amber-200 dark:border-amber-900/60 hover:border-amber-400'
          : 'border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${badgeColor}`}
            >
              {item.triage}
            </span>
            {item.icdCode && (
              <span className="text-[10px] font-mono text-slate-400">{item.icdCode}</span>
            )}
            {item.isAiGenerated && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                AI
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold text-slate-400 capitalize truncate">
            {item.category.replace(/_/g, ' ')}
          </span>
        </div>

        <h4 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {item.name}
        </h4>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {item.overview}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-1.5">
          {item.skipHomeRemedies ? (
            <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
              <span>Immediate 911 / Hospital ER Action</span>
            </div>
          ) : (
            <>
              {item.naturalRemedies[0] && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 truncate">
                  <Leaf className="w-3 h-3 shrink-0" />
                  <span className="truncate">Natural: {item.naturalRemedies[0].name}</span>
                </div>
              )}
              {item.pharmaceuticalMedicines[0] && (
                <div className="flex items-center gap-1.5 text-[11px] text-blue-700 dark:text-blue-400 truncate">
                  <Pill className="w-3 h-3 shrink-0" />
                  <span className="truncate">
                    OTC/Rx: {item.pharmaceuticalMedicines[0].activeIngredient}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
        <span>View How to Handle It</span>
        <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
});
