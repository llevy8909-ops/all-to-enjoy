import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  BookOpen,
  PhoneCall,
  Send,
  Wind,
  MapPin,
  Trash2,
  LifeBuoy,
  Play,
  Square,
  AlertTriangle,
  ExternalLink,
  ArrowRight,
  Plus,
  MessageSquare,
  CalendarDays,
  Award,
  Download,
  Upload,
  Check,
  Sparkles,
  History,
  RotateCcw,
  Search,
  Pencil,
  X,
  Copy,
} from 'lucide-react';
import {
  HopeBibleVerse,
  HopeChatMessage,
  HopeChatSession,
  HopeFocusArea,
  HopeRecoveryContextPayload,
  RecoveryLogEntry,
  SobrietyProfile,
} from '../types/medical';

interface HopeCompanionProps {
  onNavigateToMap: (facilityType: 'hospital' | 'clinic') => void;
}

type WorkspaceTab = 'chat' | 'log' | 'history';

const SESSIONS_KEY = 'global_pharma_hope_sessions_v1';
const ACTIVE_SESSION_KEY = 'global_pharma_hope_active_session_v1';
const LOGS_KEY = 'global_pharma_hope_logs_v1';
const STREAK_KEY = 'global_pharma_hope_streak_v1';

// Public domain World English Bible (WEB) verses
const CURATED_VERSES: Array<{
  category: string;
  reference: string;
  text: string;
}> = [
  {
    category: 'When You Feel Broken',
    reference: 'Psalm 34:18',
    text: 'Yahweh is near to those who have a broken heart, and saves those who have a crushed spirit.',
  },
  {
    category: 'Strength in Temptation',
    reference: '1 Corinthians 10:13',
    text: 'No temptation has taken you except what is common to man. God is faithful, who will not allow you to be tempted above what you are able.',
  },
  {
    category: 'Walking Through Fear',
    reference: 'Isaiah 41:10',
    text: 'Don’t you be afraid, for I am with you. Don’t be dismayed, for I am your God. I will strengthen you.',
  },
  {
    category: 'Rest for Heavy Minds',
    reference: 'Matthew 11:28',
    text: 'Come to me, all you who labor and are heavily burdened, and I will give you rest.',
  },
  {
    category: 'New Mercy Today',
    reference: 'Lamentations 3:22-23',
    text: 'His compassions don’t fail. They are new every morning. Great is your faithfulness.',
  },
];

const MOOD_LEVELS = [
  { score: 1, label: 'Very Heavy' },
  { score: 2, label: 'Struggling' },
  { score: 3, label: 'Holding On' },
  { score: 4, label: 'Steady' },
  { score: 5, label: 'Peaceful' },
];

const TRIGGER_OPTIONS = [
  'Loneliness',
  'Late Night',
  'Stress / Work',
  'Conflict',
  'Fatigue / Exhaustion',
  'Craving / Social',
  'Grief / Sadness',
  'Physical Pain / Insomnia',
];

const MILESTONE_DAYS = [1, 3, 7, 14, 30, 60, 90, 180, 365];

const LOGS_PAGE_SIZE = 10;

function todayISODate(): string {
  const d = new Date();
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 10);
}

function isValidYMD(val: unknown): val is string {
  if (typeof val !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(val)) return false;
  const parsed = new Date(`${val}T00:00:00`);
  return !Number.isNaN(parsed.getTime());
}

function sanitizeDateYMD(val: unknown): string {
  const today = todayISODate();
  if (!isValidYMD(val)) return today;
  return val > today ? today : val;
}

function calcDaysBetween(startISO: string): number {
  if (!isValidYMD(startISO)) return 0;
  const start = new Date(`${startISO}T00:00:00`);
  const now = new Date(`${todayISODate()}T00:00:00`);
  const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Number.isFinite(diff) ? Math.max(0, diff) : 0;
}

function formatLogTimestamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Saved date';
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function sanitizeLogEntry(raw: any, index = 0): RecoveryLogEntry | null {
  if (!raw || typeof raw !== 'object') return null;
  const scoreNum = Number(raw.moodScore);
  const moodScore = Number.isFinite(scoreNum)
    ? Math.min(5, Math.max(1, Math.round(scoreNum)))
    : 3;
  const moodObj = MOOD_LEVELS.find((m) => m.score === moodScore) || MOOD_LEVELS[2];

  const cravingNum = Number(raw.cravingLevel);
  const cravingLevel = Number.isFinite(cravingNum)
    ? Math.min(10, Math.max(0, Math.round(cravingNum)))
    : 0;

  const parsedDate = raw.dateISO ? new Date(String(raw.dateISO)) : null;
  const dateISO =
    parsedDate && !Number.isNaN(parsedDate.getTime())
      ? parsedDate.toISOString()
      : new Date().toISOString();

  const triggers = Array.isArray(raw.triggers)
    ? raw.triggers
        .map((t: unknown) => String(t ?? '').trim())
        .filter((t: string) => t.length > 0)
    : [];

  const note =
    typeof raw.note === 'string' && raw.note.trim()
      ? raw.note.trim()
      : `Check-in: Feeling ${moodObj.label.toLowerCase()}, craving ${cravingLevel}/10.`;

  const gratitude =
    typeof raw.gratitude === 'string' && raw.gratitude.trim()
      ? raw.gratitude.trim()
      : undefined;

  const verseRef =
    typeof raw.verseRef === 'string' && raw.verseRef.trim()
      ? raw.verseRef.trim()
      : undefined;

  return {
    id:
      typeof raw.id === 'string' && raw.id.trim()
        ? raw.id.trim()
        : `log-${Date.now()}-${index}`,
    dateISO,
    moodScore,
    moodLabel:
      typeof raw.moodLabel === 'string' && raw.moodLabel.trim()
        ? raw.moodLabel.trim()
        : moodObj.label,
    cravingLevel,
    triggers: Array.from(new Set(triggers)),
    note,
    gratitude,
    verseRef,
  };
}

function sanitizeStreakProfile(raw: any): SobrietyProfile {
  const startDateISO = sanitizeDateYMD(raw?.startDateISO);
  const bestRaw = Number(raw?.longestStreakDays);
  const longestStreakDays = Number.isFinite(bestRaw) ? Math.max(0, Math.floor(bestRaw)) : 0;
  return {
    goalLabel:
      typeof raw?.goalLabel === 'string' && raw.goalLabel.trim()
        ? raw.goalLabel.trim().slice(0, 100)
        : 'Clean & Steady Recovery',
    startDateISO,
    longestStreakDays: Math.max(longestStreakDays, calcDaysBetween(startDateISO)),
  };
}

function createWelcomeMessage(): HopeChatMessage {
  return {
    id: `welcome-${Date.now()}`,
    role: 'assistant',
    timestamp: new Date().toISOString(),
    content:
      "Pull up a chair. Whatever is on your mind today—whether you're carrying heavy thoughts, fighting a hard habit, feeling lonely late at night, sorting out life or relationship stress, or simply want someone real to talk through anything with—I'm here with you.\n\nSpeak freely in your own words. Nothing is too small, too messy, or off-limits.",
    crisisDetected: false,
    groundingStep: null,
    bibleVerse: null,
  };
}

function createNewSession(focus: HopeFocusArea = 'general'): HopeChatSession {
  return {
    id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: 'New Quiet Conversation',
    focusArea: focus,
    updatedAt: new Date().toISOString(),
    messages: [createWelcomeMessage()],
  };
}

function sanitizeSession(raw: any, index = 0): HopeChatSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const messages: HopeChatMessage[] = Array.isArray(raw.messages)
    ? raw.messages
        .filter((m: any) => m && typeof m === 'object' && typeof m.content === 'string')
        .map((m: any, mIdx: number) => ({
          id:
            typeof m.id === 'string' && m.id.trim()
              ? m.id
              : `msg-${Date.now()}-${index}-${mIdx}`,
          role: m.role === 'user' ? ('user' as const) : ('assistant' as const),
          content: String(m.content),
          timestamp:
            m.timestamp && !Number.isNaN(new Date(String(m.timestamp)).getTime())
              ? String(m.timestamp)
              : new Date().toISOString(),
          crisisDetected: Boolean(m.crisisDetected),
          groundingStep: typeof m.groundingStep === 'string' ? m.groundingStep : null,
          bibleVerse:
            m.bibleVerse &&
            typeof m.bibleVerse === 'object' &&
            typeof m.bibleVerse.reference === 'string' &&
            typeof m.bibleVerse.text === 'string'
              ? { reference: m.bibleVerse.reference, text: m.bibleVerse.text }
              : null,
        }))
    : [];

  const validFocus: HopeFocusArea =
    raw.focusArea === 'crisis' ||
    raw.focusArea === 'distress' ||
    raw.focusArea === 'addiction'
      ? raw.focusArea
      : 'general';

  return {
    id:
      typeof raw.id === 'string' && raw.id.trim()
        ? raw.id.trim()
        : `session-${Date.now()}-${index}`,
    title:
      typeof raw.title === 'string' && raw.title.trim()
        ? raw.title.trim()
        : 'Saved Conversation',
    focusArea: validFocus,
    updatedAt:
      raw.updatedAt && !Number.isNaN(new Date(String(raw.updatedAt)).getTime())
        ? String(raw.updatedAt)
        : new Date().toISOString(),
    messages: messages.length > 0 ? messages : [createWelcomeMessage()],
  };
}

function loadSessions(): HopeChatSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [createNewSession()];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const cleaned = parsed
        .map((s, idx) => sanitizeSession(s, idx))
        .filter((s): s is HopeChatSession => s !== null);
      if (cleaned.length > 0) return cleaned;
    }
  } catch {
    // fallback below
  }
  return [createNewSession()];
}

function loadLogs(): RecoveryLogEntry[] {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item, idx) => sanitizeLogEntry(item, idx))
      .filter((item): item is RecoveryLogEntry => item !== null)
      .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime());
  } catch {
    return [];
  }
}

function loadStreak(): SobrietyProfile {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) {
      return sanitizeStreakProfile(JSON.parse(raw));
    }
  } catch {
    // fallback below
  }
  return sanitizeStreakProfile(null);
}

function buildContextAwareFallback(
  userText: string,
  includeVerse: boolean,
  usedVerses: string[]
): Omit<HopeChatMessage, 'id' | 'role' | 'timestamp'> {
  const lower = userText.toLowerCase();
  const isCrisis =
    lower.includes('suicid') ||
    lower.includes('kill myself') ||
    lower.includes('end my life') ||
    lower.includes('want to die') ||
    lower.includes('hurt myself') ||
    lower.includes('self harm') ||
    lower.includes('no reason to live');

  const isAddiction =
    lower.includes('addict') ||
    lower.includes('craving') ||
    lower.includes('relaps') ||
    lower.includes('drink') ||
    lower.includes('alcohol') ||
    lower.includes('drug') ||
    lower.includes('sober') ||
    lower.includes('withdrawal') ||
    lower.includes('urge');

  const pickUnusedVerse = (preferredRef: string): HopeBibleVerse | null => {
    if (!includeVerse) return null;
    const match =
      CURATED_VERSES.find(
        (v) => v.reference === preferredRef && !usedVerses.includes(v.reference)
      ) || CURATED_VERSES.find((v) => !usedVerses.includes(v.reference));
    return match ? { reference: match.reference, text: match.text } : null;
  };

  if (isCrisis) {
    return {
      content:
        "Thank you for being honest about how dark things feel right now. When pain gets this loud, it can convince you that nothing will ever shift—but you don't have to stay alone inside this hour.\n\nPlease talk with a real person right now who can sit with you through tonight. You can call or text 988 (US/Canada), text HOME to 741741, or dial your local emergency line.",
      crisisDetected: true,
      groundingStep:
        'Step near someone you trust or into an open room, set anything harmful aside, and dial or text 988 right now.',
      bibleVerse: pickUnusedVerse('Psalm 34:18'),
    };
  }

  if (isAddiction) {
    const mentionsRelapse =
      lower.includes('relaps') || lower.includes('slip') || lower.includes('failed');
    return {
      content: mentionsRelapse
        ? "Slipping back doesn't erase every sober day behind you, even if guilt is shouting that it does. Be gentle with yourself for the next ten minutes—shame only feeds the cycle.\n\nWhat triggered things right before you reached out?"
        : "That pull you're feeling right now is intense, and it's exhausting fighting your own mind. Most cravings crest hard and begin settling within 15 to 20 minutes if we put a small gap between the urge and acting on it.\n\nHave you eaten, had water, or slept today, or did something specific set this off?",
      crisisDetected: false,
      groundingStep:
        'Pour a cold glass of water, step away from whatever room holds the trigger for 15 minutes, or call SAMHSA at 1-800-662-4357.',
      bibleVerse: pickUnusedVerse('1 Corinthians 10:13'),
    };
  }

  const mentionsSleepOrNight =
    lower.includes('night') ||
    lower.includes('sleep') ||
    lower.includes('3am') ||
    lower.includes('alone') ||
    lower.includes('lonely');
  const mentionsRelationship =
    lower.includes('breakup') ||
    lower.includes('heart') ||
    lower.includes('wife') ||
    lower.includes('husband') ||
    lower.includes('friend') ||
    lower.includes('family') ||
    lower.includes('love');

  return {
    content: mentionsSleepOrNight
      ? "Everything feels louder late at night when the noise dies down and thoughts start looping. You don't have to solve the rest of your life tonight—just talking honestly right here for a few minutes can take some weight off.\n\nWhat's sitting heaviest on your chest right this minute?"
      : mentionsRelationship
      ? "People we care deeply about can leave the deepest ache when things fracture or go quiet. You don't have to hold it together or shrink what happened to make sense of it.\n\nTell me what happened between you—or whatever part hurts the most right now."
      : "I'm listening with you. You don't need to filter yourself or wrap it up neatly—say whatever is actually on your mind today, whether you want someone to comfort you, talk something through, or just sit with you in it.",
    crisisDetected: false,
    groundingStep: null,
    bibleVerse: pickUnusedVerse('Matthew 11:28'),
  };
}

function stripStreamingDirectives(raw: string): string {
  let clean = raw
    .replace(/\[CRISIS\]/gi, '')
    .replace(/\[STEP:\s*[^\]]*\]/gi, '')
    .replace(/\[VERSE:\s*[^\]]*\]/gi, '');
  // Trim trailing incomplete directive like "[VER..." mid-stream
  clean = clean.replace(/\s*\[(?:CRISIS|STEP|VERSE)[^\]]*$/i, '');
  return clean.trimStart();
}

export const HopeCompanion: React.FC<HopeCompanionProps> = ({ onNavigateToMap }) => {
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>('chat');

  // Persistent Chat Sessions State
  const [sessions, setSessions] = useState<HopeChatSession[]>(() => loadSessions());
  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    const saved = localStorage.getItem(ACTIVE_SESSION_KEY);
    return saved || '';
  });

  // Persistent Recovery Log & Sobriety Streak State
  const [logs, setLogs] = useState<RecoveryLogEntry[]>(() => loadLogs());
  const [streakProfile, setStreakProfile] = useState<SobrietyProfile>(() => loadStreak());

  // Chat composer & controls
  const [inputText, setInputText] = useState<string>('');
  const [includeVerse, setIncludeVerse] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);

  // Daily Check-in Form State
  const [logMoodScore, setLogMoodScore] = useState<number>(3);
  const [logCravingLevel, setLogCravingLevel] = useState<number>(2);
  const [logTriggers, setLogTriggers] = useState<string[]>([]);
  const [customTriggerInput, setCustomTriggerInput] = useState<string>('');
  const [logNote, setLogNote] = useState<string>('');
  const [logGratitude, setLogGratitude] = useState<string>('');
  const [logVerseRef, setLogVerseRef] = useState<string>('');
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [logToastMsg, setLogToastMsg] = useState<string | null>(null);

  // Log filtering & pagination state
  const [logSearchQuery, setLogSearchQuery] = useState<string>('');
  const [logMoodFilter, setLogMoodFilter] = useState<'all' | 'heavy' | 'neutral' | 'steady'>('all');
  const [visibleLogsLimit, setVisibleLogsLimit] = useState<number>(LOGS_PAGE_SIZE);
  const [confirmClearLogs, setConfirmClearLogs] = useState<boolean>(false);

  // Streak editor state
  const [editingGoal, setEditingGoal] = useState<boolean>(false);
  const [draftGoalLabel, setDraftGoalLabel] = useState<string>(streakProfile.goalLabel);
  const [draftStartDate, setDraftStartDate] = useState<string>(streakProfile.startDateISO);
  const [streakNotice, setStreakNotice] = useState<string | null>(null);

  // Chat upstream notice & UI helpers
  const [chatNotice, setChatNotice] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  // Backup import status
  const [backupNotice, setBackupNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Breathing exercise state (4-7-8)
  const [breathingActive, setBreathingActive] = useState<boolean>(false);
  const [breathSeconds, setBreathSeconds] = useState<number>(0);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const logFormRef = useRef<HTMLFormElement | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const streakTimerRef = useRef<number | null>(null);
  const streamAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      if (streakTimerRef.current) window.clearTimeout(streakTimerRef.current);
      streamAbortRef.current?.abort();
    };
  }, []);

  // Ensure activeSessionId always points to an existing session
  const activeSession = useMemo(() => {
    return sessions.find((s) => s.id === activeSessionId) || sessions[0];
  }, [sessions, activeSessionId]);

  useEffect(() => {
    if (activeSession && activeSession.id !== activeSessionId) {
      setActiveSessionId(activeSession.id);
    }
  }, [activeSession, activeSessionId]);

  // Persist to localStorage automatically
  useEffect(() => {
    try {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions.slice(0, 30)));
      if (activeSession?.id) {
        localStorage.setItem(ACTIVE_SESSION_KEY, activeSession.id);
      }
    } catch {
      // Ignore quota errors
    }
  }, [sessions, activeSession]);

  useEffect(() => {
    try {
      localStorage.setItem(LOGS_KEY, JSON.stringify(logs.slice(0, 365)));
    } catch {
      // Ignore quota errors
    }
  }, [logs]);

  useEffect(() => {
    try {
      localStorage.setItem(STREAK_KEY, JSON.stringify(streakProfile));
    } catch {
      // Ignore quota errors
    }
  }, [streakProfile]);

  useEffect(() => {
    if (workspaceTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSession?.messages.length, isSending, workspaceTab]);

  useEffect(() => {
    if (!breathingActive) {
      setBreathSeconds(0);
      return;
    }
    const interval = setInterval(() => {
      setBreathSeconds((prev) => (prev + 1) % 19);
    }, 1000);
    return () => clearInterval(interval);
  }, [breathingActive]);

  const currentStreakDays = calcDaysBetween(streakProfile.startDateISO);
  const bestStreakDays = Math.max(streakProfile.longestStreakDays || 0, currentStreakDays);

  // Summary analytics & filtered logs (shows ALL matching check-ins cleanly)
  const logStats = useMemo(() => {
    if (logs.length === 0) {
      return { total: 0, avgMood: '0.0', avgCraving: '0.0', topTrigger: 'None yet' };
    }
    let moodSum = 0;
    let cravingSum = 0;
    const triggerCounts = new Map<string, number>();

    for (const item of logs) {
      moodSum += item.moodScore;
      cravingSum += item.cravingLevel;
      for (const t of item.triggers) {
        triggerCounts.set(t, (triggerCounts.get(t) || 0) + 1);
      }
    }

    let topTrigger = 'None logged';
    let topCount = 0;
    for (const [name, count] of triggerCounts.entries()) {
      if (count > topCount) {
        topCount = count;
        topTrigger = name;
      }
    }

    return {
      total: logs.length,
      avgMood: (moodSum / logs.length).toFixed(1),
      avgCraving: (cravingSum / logs.length).toFixed(1),
      topTrigger: topCount > 0 ? `${topTrigger} (${topCount})` : 'None logged',
    };
  }, [logs]);

  const filteredLogs = useMemo(() => {
    const q = logSearchQuery.trim().toLowerCase();
    return logs.filter((entry) => {
      if (logMoodFilter === 'heavy' && entry.moodScore > 2) return false;
      if (logMoodFilter === 'neutral' && entry.moodScore !== 3) return false;
      if (logMoodFilter === 'steady' && entry.moodScore < 4) return false;
      if (q) {
        const hay = `${entry.note} ${entry.gratitude || ''} ${entry.verseRef || ''} ${entry.moodLabel} ${entry.triggers.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [logs, logSearchQuery, logMoodFilter]);

  const visibleLogs = useMemo(() => {
    return filteredLogs.slice(0, visibleLogsLimit);
  }, [filteredLogs, visibleLogsLimit]);

  const showToastMessage = (msg: string) => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    setLogToastMsg(msg);
    toastTimerRef.current = window.setTimeout(() => setLogToastMsg(null), 3000);
  };

  const showStreakMessage = (msg: string) => {
    if (streakTimerRef.current) window.clearTimeout(streakTimerRef.current);
    setStreakNotice(msg);
    streakTimerRef.current = window.setTimeout(() => setStreakNotice(null), 3000);
  };

  const breathPhase =
    breathSeconds < 4
      ? { label: 'Inhale gently', count: 4 - breathSeconds, scale: 'scale-105' }
      : breathSeconds < 11
      ? { label: 'Hold quietly', count: 11 - breathSeconds, scale: 'scale-105' }
      : { label: 'Exhale slowly', count: 19 - breathSeconds, scale: 'scale-95' };

  // Build subtle recoveryContext for Gemini Companion
  const buildRecoveryContext = (): HopeRecoveryContextPayload => {
    const latest = logs[0];
    return {
      streakDays: currentStreakDays,
      goalLabel: streakProfile.goalLabel,
      recentMoodLabel: latest?.moodLabel,
      recentCraving: latest?.cravingLevel,
      recentTriggers: latest?.triggers,
      latestNote: latest?.note,
    };
  };

  const handleCreateNewSession = () => {
    const fresh = createNewSession('general');
    setSessions((prev) => [fresh, ...prev]);
    setActiveSessionId(fresh.id);
    setWorkspaceTab('chat');
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => {
      const remaining = prev.filter((s) => s.id !== id);
      if (remaining.length === 0) {
        const fresh = createNewSession();
        setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (id === activeSession?.id) {
        setActiveSessionId(remaining[0].id);
      }
      return remaining;
    });
  };

  const handleCopyMessage = async (msgId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMsgId(msgId);
      window.setTimeout(() => {
        setCopiedMsgId((prev) => (prev === msgId ? null : prev));
      }, 2000);
    } catch {
      // Ignore clipboard permission errors
    }
  };

  const handleStopGenerating = () => {
    streamAbortRef.current?.abort();
    setIsSending(false);
  };

  const sendMessage = async (textToSend: string, overrideFocus?: HopeFocusArea) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isSending || !activeSession) return;

    const targetSessionId = activeSession.id;
    const focus = overrideFocus || activeSession.focusArea || 'general';
    const userMessage: HopeChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    const aiMsgId = `ai-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    const placeholderAiMsg: HopeChatMessage = {
      id: aiMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      crisisDetected: false,
      groundingStep: null,
      bibleVerse: null,
    };

    const nextMessages = [...activeSession.messages, userMessage];
    const usedVerses = activeSession.messages
      .map((m) => m.bibleVerse?.reference)
      .filter((r): r is string => Boolean(r));

    const derivedTitle =
      activeSession.title === 'New Quiet Conversation'
        ? trimmed.slice(0, 38) + (trimmed.length > 38 ? '...' : '')
        : activeSession.title;

    setSessions((prev) =>
      prev.map((s) =>
        s.id === targetSessionId
          ? {
              ...s,
              title: derivedTitle,
              focusArea: focus,
              updatedAt: new Date().toISOString(),
              messages: [...nextMessages, placeholderAiMsg],
            }
          : s
      )
    );
    setInputText('');
    setIsSending(true);
    setChatNotice(null);
    setWorkspaceTab('chat');

    const updateAiMessage = (patch: Partial<HopeChatMessage>) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === targetSessionId
            ? {
                ...s,
                updatedAt: new Date().toISOString(),
                messages: s.messages.map((m) =>
                  m.id === aiMsgId ? { ...m, ...patch } : m
                ),
              }
            : s
        )
      );
    };

    const payloadBody = JSON.stringify({
      focusArea: focus,
      includeVerse,
      usedVerses,
      recoveryContext: buildRecoveryContext(),
      messages: nextMessages.slice(-40).map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const controller = new AbortController();
    streamAbortRef.current = controller;
    const timeoutId = window.setTimeout(() => controller.abort(), 30000);
    let rawStreamText = '';
    let completed = false;

    try {
      const res = await fetch('/api/hope-companion/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: payloadBody,
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('text/event-stream') && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const events = buffer.split('\n\n');
          buffer = events.pop() || '';

          for (const evt of events) {
            const dataLines = evt
              .split('\n')
              .filter((line) => line.startsWith('data:'))
              .map((line) => line.slice(5).trim());
            if (dataLines.length === 0) continue;

            try {
              const parsed = JSON.parse(dataLines.join('\n'));
              if (parsed.type === 'delta' && typeof parsed.delta === 'string') {
                rawStreamText += parsed.delta;
                const clean = stripStreamingDirectives(rawStreamText);
                if (clean) {
                  updateAiMessage({ content: clean });
                }
              } else if (parsed.type === 'done') {
                completed = true;
                updateAiMessage({
                  content: parsed.reply || stripStreamingDirectives(rawStreamText),
                  crisisDetected: Boolean(parsed.crisisDetected),
                  groundingStep: parsed.groundingStep || null,
                  bibleVerse: parsed.bibleVerse || null,
                });
              } else if (parsed.type === 'fallback') {
                throw new Error('SSE_FALLBACK');
              }
            } catch (parseErr: any) {
              if (parseErr?.message === 'SSE_FALLBACK') throw parseErr;
            }
          }
        }
      }

      if (!completed) {
        if (rawStreamText.trim().length > 0) {
          updateAiMessage({ content: stripStreamingDirectives(rawStreamText) });
          completed = true;
        } else {
          // Compatibility fallback to structured JSON route before local offline mode
          const jsonRes = await fetch('/api/hope-companion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: payloadBody,
          });
          const data = await jsonRes.json().catch(() => null);
          if (jsonRes.ok && data && !data.fallback && data.reply) {
            updateAiMessage({
              content: data.reply,
              crisisDetected: Boolean(data.crisisDetected),
              groundingStep: data.groundingStep || null,
              bibleVerse: data.bibleVerse || null,
            });
            completed = true;
          }
        }
      }

      if (!completed) {
        setChatNotice('Using offline compassionate support while live connection stabilizes.');
        updateAiMessage({
          ...buildContextAwareFallback(trimmed, includeVerse, usedVerses),
        });
      }
    } catch (err: any) {
      if (err?.name === 'AbortError' && rawStreamText.trim().length > 0) {
        updateAiMessage({ content: stripStreamingDirectives(rawStreamText) });
      } else {
        if (err?.name === 'AbortError') {
          setChatNotice('Generation stopped—switched to offline compassionate support.');
        } else {
          setChatNotice('Using offline compassionate support while live connection stabilizes.');
        }
        updateAiMessage({
          ...buildContextAwareFallback(trimmed, includeVerse, usedVerses),
        });
      }
    } finally {
      window.clearTimeout(timeoutId);
      if (streamAbortRef.current === controller) {
        streamAbortRef.current = null;
      }
      setIsSending(false);
    }
  };

  const handleAddCustomTrigger = () => {
    const clean = customTriggerInput.trim();
    if (!clean) return;
    setLogTriggers((prev) => (prev.includes(clean) ? prev : [...prev, clean]));
    setCustomTriggerInput('');
  };

  const resetLogForm = () => {
    setEditingLogId(null);
    setLogMoodScore(3);
    setLogCravingLevel(2);
    setLogTriggers([]);
    setCustomTriggerInput('');
    setLogNote('');
    setLogGratitude('');
    setLogVerseRef('');
  };

  const handleStartEditLog = (entry: RecoveryLogEntry) => {
    setEditingLogId(entry.id);
    setLogMoodScore(entry.moodScore);
    setLogCravingLevel(entry.cravingLevel);
    setLogTriggers([...entry.triggers]);
    setCustomTriggerInput('');
    setLogNote(entry.note);
    setLogGratitude(entry.gratitude || '');
    setLogVerseRef(entry.verseRef || '');
    logFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSaveCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    const moodObj = MOOD_LEVELS.find((m) => m.score === logMoodScore) || MOOD_LEVELS[2];
    const cleanNote =
      logNote.trim() || `Check-in: Feeling ${moodObj.label.toLowerCase()}, craving ${logCravingLevel}/10.`;
    const cleanGratitude = logGratitude.trim() || undefined;
    const cleanVerse = logVerseRef.trim() || undefined;
    const cleanTriggers = Array.from(new Set(logTriggers.map((t) => t.trim()).filter(Boolean)));

    if (editingLogId) {
      setLogs((prev) =>
        prev.map((item) =>
          item.id === editingLogId
            ? {
                ...item,
                moodScore: logMoodScore,
                moodLabel: moodObj.label,
                cravingLevel: logCravingLevel,
                triggers: cleanTriggers,
                note: cleanNote,
                gratitude: cleanGratitude,
                verseRef: cleanVerse,
              }
            : item
        )
      );
      resetLogForm();
      showToastMessage('Check-in updated cleanly');
      return;
    }

    const entry: RecoveryLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      dateISO: new Date().toISOString(),
      moodScore: logMoodScore,
      moodLabel: moodObj.label,
      cravingLevel: logCravingLevel,
      triggers: cleanTriggers,
      note: cleanNote,
      gratitude: cleanGratitude,
      verseRef: cleanVerse,
    };

    setLogs((prev) => [entry, ...prev]);
    resetLogForm();
    showToastMessage('Saved to Private Log');
  };

  const handleDeleteLog = (id: string) => {
    if (editingLogId === id) {
      resetLogForm();
    }
    setLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const handleClearAllLogs = () => {
    resetLogForm();
    setLogs([]);
    setConfirmClearLogs(false);
    showToastMessage('All log entries cleared');
  };

  const handleResetStreakWithGrace = () => {
    const newBest = Math.max(streakProfile.longestStreakDays || 0, currentStreakDays);
    const today = todayISODate();
    setStreakProfile((prev) => ({
      ...prev,
      startDateISO: today,
      longestStreakDays: newBest,
    }));
    setDraftStartDate(today);
    showStreakMessage('Restarted today with your personal best preserved.');
  };

  const handleSaveStreakSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const safeStart = sanitizeDateYMD(draftStartDate);
    const safeDays = calcDaysBetween(safeStart);
    setStreakProfile((prev) => ({
      ...prev,
      goalLabel: draftGoalLabel.trim() || 'Clean & Steady Recovery',
      startDateISO: safeStart,
      longestStreakDays: Math.max(prev.longestStreakDays || 0, safeDays),
    }));
    setDraftStartDate(safeStart);
    setEditingGoal(false);
    showStreakMessage('Recovery goal and streak updated.');
  };

  const handleExportVault = () => {
    const bundle = {
      exportedAt: new Date().toISOString(),
      app: 'GoPharma-HopeSanctuary',
      version: 2,
      streakProfile,
      logs,
      sessions,
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gopharma-hope-backup-${todayISODate()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupNotice({
      type: 'ok',
      text: `Exported ${logs.length} check-in(s) and ${sessions.length} conversation(s) to .json.`,
    });
  };

  const handleImportVault = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid JSON structure');
      }

      const validApp =
        !parsed.app ||
        parsed.app === 'GoPharma-HopeSanctuary' ||
        parsed.app === 'GlobalPharma-HopeSanctuary';
      if (!validApp) {
        throw new Error('Unrecognized backup format');
      }

      let restoredLogsCount = 0;
      let restoredSessionsCount = 0;

      if (parsed.streakProfile && typeof parsed.streakProfile === 'object') {
        const cleanStreak = sanitizeStreakProfile(parsed.streakProfile);
        setStreakProfile(cleanStreak);
        setDraftGoalLabel(cleanStreak.goalLabel);
        setDraftStartDate(cleanStreak.startDateISO);
      }

      if (Array.isArray(parsed.logs)) {
        const cleanedLogs = parsed.logs
          .map((item: any, idx: number) => sanitizeLogEntry(item, idx))
          .filter((item: RecoveryLogEntry | null): item is RecoveryLogEntry => item !== null)
          .sort(
            (a: RecoveryLogEntry, b: RecoveryLogEntry) =>
              new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
          );
        setLogs(cleanedLogs);
        restoredLogsCount = cleanedLogs.length;
      }

      if (Array.isArray(parsed.sessions) && parsed.sessions.length > 0) {
        const cleanedSessions = parsed.sessions
          .map((s: any, idx: number) => sanitizeSession(s, idx))
          .filter((s: HopeChatSession | null): s is HopeChatSession => s !== null);
        if (cleanedSessions.length > 0) {
          setSessions(cleanedSessions);
          setActiveSessionId(cleanedSessions[0].id);
          restoredSessionsCount = cleanedSessions.length;
        }
      }

      setBackupNotice({
        type: 'ok',
        text: `Backup restored: ${restoredLogsCount} check-in(s) and ${restoredSessionsCount} thread(s) loaded cleanly.`,
      });
    } catch {
      setBackupNotice({
        type: 'err',
        text: 'Could not read backup file. Choose a valid GoPharma Hope Sanctuary .json export.',
      });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  const conversationStarters: Array<{ label: string; focus: HopeFocusArea; prompt: string }> = [
    {
      label: 'Just need to talk',
      focus: 'general',
      prompt: "Hey, I just need someone real to talk to right now about what's going on in my life.",
    },
    {
      label: 'Heartbreak or loneliness',
      focus: 'distress',
      prompt: "I'm feeling really alone and hurt inside lately, and I don't know who to talk to.",
    },
    {
      label: 'Life direction & stress',
      focus: 'distress',
      prompt: 'My mind has been racing about work, family, and where my life is heading.',
    },
    {
      label: 'Dark or suicidal thoughts',
      focus: 'crisis',
      prompt: "I'm having suicidal thoughts right now and I don't know how to get through tonight.",
    },
    {
      label: 'Fighting an addiction urge',
      focus: 'addiction',
      prompt: "I'm dealing with a really strong craving right now and I'm afraid of relapsing.",
    },
    {
      label: 'Comfort & Bible verse',
      focus: 'general',
      prompt: 'Could you share a comforting Bible verse and talk with me for a few minutes?',
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      {/* Serene Sanctuary Header */}
      <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-7 sm:px-9 sm:py-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-emerald-700 dark:text-emerald-400 tracking-wide">
              <span>Hope &amp; Support AI Companion · Device Vault Auto-Saved</span>
              <span className="font-mono tabular-nums px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60">
                Streak: {currentStreakDays}d
              </span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-4xl font-medium text-slate-900 dark:text-white mt-2 leading-snug text-balance">
              An open, human-centered AI here to listen, console, and talk through anything.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed max-w-xl">
              Talk freely about anything on your heart—loneliness, grief, dark moments, addiction cravings, faith, life decisions, or everyday stress—in any language, with private recovery logging and Scripture whenever you want it.
            </p>
          </div>

          {/* Direct 24/7 Human Support Links */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0">
            <a
              href="tel:988"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call or Text 988 (24/7 Crisis)</span>
            </a>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
              <a
                href="tel:18006624357"
                className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <LifeBuoy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>SAMHSA 1-800-662-4357</span>
              </a>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => onNavigateToMap('hospital')}
                className="inline-flex items-center gap-1 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Nearest Care</span>
              </button>
              <span aria-hidden="true">·</span>
              <a
                href="https://findahelpline.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <span>Global Lines</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Workspace View Switcher */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setWorkspaceTab('chat')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition ${
                workspaceTab === 'chat'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Companion Chat ({sessions.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setWorkspaceTab('log')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition ${
                workspaceTab === 'log'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Mood &amp; Sobriety Log ({logs.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setWorkspaceTab('history')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition ${
                workspaceTab === 'history'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Saved Threads &amp; Backup</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Stored locally in your browser · Export .json anytime to switch devices
          </span>
        </div>
      </section>

      {/* Main Two-Column Sanctuary Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (8 cols): Active Tab Content */}
        <section className="lg:col-span-8 space-y-6">
          {/* TAB 1: COMPANION CHAT */}
          {workspaceTab === 'chat' && activeSession && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col overflow-hidden">
              {/* Conversation Toolbar & Saved Session Selector */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <select
                    aria-label="Switch saved conversation"
                    value={activeSession.id}
                    onChange={(e) => setActiveSessionId(e.target.value)}
                    className="max-w-[230px] sm:max-w-xs truncate px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    {sessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} ({Math.max(0, s.messages.length - 1)} msgs)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={includeVerse}
                      onChange={(e) => setIncludeVerse(e.target.checked)}
                      className="w-4 h-4 rounded accent-emerald-600"
                    />
                    <span>Include Bible verses</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleCreateNewSession}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New thread</span>
                  </button>
                </div>
              </div>

              {/* Conversation Starters */}
              <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">
                  Start with:
                </span>
                {conversationStarters.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    disabled={isSending}
                    onClick={() => sendMessage(item.prompt, item.focus)}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Message Stream */}
              <div className="px-6 py-6 space-y-6 max-h-[560px] min-h-[400px] overflow-y-auto">
                {activeSession.messages.map((msg, msgIdx) => {
                  const isLastStreaming =
                    isSending &&
                    msg.role === 'assistant' &&
                    msgIdx === activeSession.messages.length - 1;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.role === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <div className="max-w-[85%] sm:max-w-[78%] rounded-2xl rounded-br-sm bg-emerald-700 dark:bg-emerald-600 text-white px-4 py-3 text-sm leading-relaxed whitespace-pre-line">
                          {msg.content}
                        </div>
                      ) : (
                        <div className="max-w-[92%] sm:max-w-[86%] space-y-3 group">
                          <div className="rounded-2xl rounded-bl-sm bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/70 px-5 py-4 text-[15px] text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line">
                            {msg.content ? (
                              <>
                                {msg.content}
                                {isLastStreaming && (
                                  <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-emerald-500 animate-pulse rounded-xs" />
                                )}
                              </>
                            ) : (
                              <span className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:150ms]" />
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:300ms]" />
                                <span>Thinking &amp; listening with you...</span>
                              </span>
                            )}
                          </div>

                          {msg.content && !isLastStreaming && (
                            <div className="flex items-center gap-2 px-1 opacity-70 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleCopyMessage(msg.id, msg.content)}
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                              >
                                {copiedMsgId === msg.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-500" />
                                    <span>Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}

                          {msg.crisisDetected && (
                            <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-start gap-2.5 text-xs text-rose-900 dark:text-rose-200 leading-relaxed">
                                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                <span>
                                  Please reach out to a live counselor right now—you don&apos;t need to handle tonight alone.
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <a
                                  href="tel:988"
                                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold whitespace-nowrap transition-colors"
                                >
                                  Call 988
                                </a>
                                <button
                                  type="button"
                                  onClick={() => onNavigateToMap('hospital')}
                                  className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold whitespace-nowrap transition-colors"
                                >
                                  Find ER
                                </button>
                              </div>
                            </div>
                          )}

                          {msg.groundingStep && (
                            <div className="rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 px-4 py-3 text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed">
                              <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                                Try right now:{' '}
                              </span>
                              {msg.groundingStep}
                            </div>
                          )}

                          {msg.bibleVerse && msg.bibleVerse.text && (
                            <div className="rounded-2xl bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 px-5 py-4">
                              <p className="font-editorial italic text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                                &ldquo;{msg.bibleVerse.text}&rdquo;
                              </p>
                              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">
                                — {msg.bibleVerse.reference}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {chatNotice && (
                  <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-4 py-2.5 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between gap-2">
                    <span>{chatNotice}</span>
                    <button
                      type="button"
                      onClick={() => setChatNotice(null)}
                      className="text-amber-700 dark:text-amber-300 font-semibold hover:underline shrink-0"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Conversational Composer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(inputText);
                }}
                className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex items-end gap-3"
              >
                <textarea
                  rows={2}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask or share anything on your mind—any topic, any language... (Enter to send)"
                  className="flex-1 resize-none px-4 py-3 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                {isSending ? (
                  <button
                    type="button"
                    onClick={handleStopGenerating}
                    className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold text-sm inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-45 text-white font-semibold text-sm inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                )}
              </form>
            </div>
          )}

          {/* TAB 2: MOOD, TRIGGER & SOBRIETY TRACKER */}
          {workspaceTab === 'log' && (
            <div className="space-y-6">
              {/* Sobriety & Recovery Streak Counter */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex flex-col items-center justify-center shrink-0">
                      <span className="font-mono tabular-nums text-2xl font-bold text-emerald-700 dark:text-emerald-300 leading-none">
                        {currentStreakDays}
                      </span>
                      <span className="text-[10px] font-semibold uppercase text-emerald-600 dark:text-emerald-400 mt-0.5">
                        Days
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Active Recovery Streak · Personal Best:{' '}
                        <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200">
                          {bestStreakDays}d
                        </span>
                      </p>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                        {streakProfile.goalLabel}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Started {streakProfile.startDateISO}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setDraftGoalLabel(streakProfile.goalLabel);
                        setDraftStartDate(streakProfile.startDateISO);
                        setEditingGoal((prev) => !prev);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      {editingGoal ? 'Cancel' : 'Edit Goal'}
                    </button>
                    <button
                      type="button"
                      onClick={handleResetStreakWithGrace}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-amber-500"
                      title="Resets today as Day 0 without erasing your personal best"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restart Today</span>
                    </button>
                  </div>
                </div>

                {editingGoal && (
                  <form
                    onSubmit={handleSaveStreakSettings}
                    className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end"
                  >
                    <div className="sm:col-span-1">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Recovery Goal Name
                      </label>
                      <input
                        type="text"
                        value={draftGoalLabel}
                        onChange={(e) => setDraftGoalLabel(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        max={todayISODate()}
                        value={draftStartDate}
                        onChange={(e) => setDraftStartDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800"
                    >
                      Save Goal
                    </button>
                  </form>
                )}

                {streakNotice && (
                  <p className="mt-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    {streakNotice}
                  </p>
                )}

                {/* Milestones */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                    <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Steady Milestones</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {MILESTONE_DAYS.map((d) => {
                      const earned = currentStreakDays >= d;
                      return (
                        <span
                          key={d}
                          className={`font-mono tabular-nums text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${
                            earned
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-400'
                          }`}
                        >
                          {earned ? '✓ ' : ''}
                          {d}d
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Daily Check-In Logger (Supports Create & Inline Edit) */}
              <form
                ref={logFormRef}
                onSubmit={handleSaveCheckIn}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {editingLogId
                        ? 'Edit Saved Check-In'
                        : 'Daily Mood, Trigger & Craving Check-In'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Helps the AI companion notice patterns and support you without needing to repeat your backstory.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {editingLogId && (
                      <button
                        type="button"
                        onClick={resetLogForm}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Cancel Edit</span>
                      </button>
                    )}
                    {logToastMsg && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-lg">
                        <Check className="w-3.5 h-3.5" />
                        <span>{logToastMsg}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Mood Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    1. How is your spirit &amp; mood right now?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {MOOD_LEVELS.map((m) => (
                      <button
                        key={m.score}
                        type="button"
                        onClick={() => setLogMoodScore(m.score)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                          logMoodScore === m.score
                            ? 'bg-emerald-700 border-emerald-700 text-white'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500'
                        }`}
                      >
                        <span className="font-mono tabular-nums mr-1">{m.score}.</span>
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Craving Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      2. Urge / Craving Intensity
                    </label>
                    <span className="font-mono tabular-nums text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      {logCravingLevel} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={logCravingLevel}
                    onChange={(e) => setLogCravingLevel(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                  />
                </div>

                {/* Triggers + Custom Trigger Entry */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    3. Triggers Present Today
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(new Set([...TRIGGER_OPTIONS, ...logTriggers])).map((t) => {
                      const active = logTriggers.includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() =>
                            setLogTriggers((prev) =>
                              prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                            )
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                            active
                              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {active ? '✓ ' : '+ '}
                          {t}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2 max-w-md">
                    <input
                      type="text"
                      value={customTriggerInput}
                      onChange={(e) => setCustomTriggerInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomTrigger();
                        }
                      }}
                      placeholder="Add another trigger (e.g. Boredom, Payday, Bad news)..."
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomTrigger}
                      disabled={!customTriggerInput.trim()}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 whitespace-nowrap"
                    >
                      + Add Trigger
                    </button>
                  </div>
                </div>

                {/* Note + Gratitude + Verse Ref */}
                <div className="space-y-3">
                  <textarea
                    rows={3}
                    value={logNote}
                    onChange={(e) => setLogNote(e.target.value)}
                    placeholder="What happened today, what hurt, or what helped you stay standing?"
                    className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={logGratitude}
                      onChange={(e) => setLogGratitude(e.target.value)}
                      placeholder="One quiet thing to thank God for today (optional)"
                      className="px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400"
                    />
                    <input
                      type="text"
                      value={logVerseRef}
                      onChange={(e) => setLogVerseRef(e.target.value)}
                      placeholder="Verse you held onto (e.g. Psalm 34:18)"
                      className="px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition"
                  >
                    {editingLogId ? 'Update Check-In' : 'Save Private Check-In'}
                  </button>
                </div>
              </form>

              {/* Complete Searchable Check-In Log History */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Recovery Log History (<span className="font-mono tabular-nums">{logs.length}</span>)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Every check-in saved privately on your device—searchable, editable, and exportable.
                    </p>
                  </div>

                  {logs.length > 0 && (
                    <div className="flex items-center gap-2">
                      {!confirmClearLogs ? (
                        <button
                          type="button"
                          onClick={() => setConfirmClearLogs(true)}
                          className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
                        >
                          Clear all
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-rose-600 font-semibold">Delete all {logs.length}?</span>
                          <button
                            type="button"
                            onClick={handleClearAllLogs}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmClearLogs(false)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {logs.length === 0 ? (
                  <div className="py-10 text-center border-t border-slate-100 dark:border-slate-800">
                    <CalendarDays className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2.5" />
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      No check-ins logged yet
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                      Save your first daily mood, craving level, or reflection above—it helps spot patterns and guides the AI companion.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Summary Metrics Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <div className="py-2">
                        <span className="text-slate-500 dark:text-slate-400 block">Total Check-Ins</span>
                        <span className="font-mono tabular-nums text-lg font-bold text-slate-900 dark:text-white">
                          {logStats.total}
                        </span>
                      </div>
                      <div className="py-2">
                        <span className="text-slate-500 dark:text-slate-400 block">Average Mood</span>
                        <span className="font-mono tabular-nums text-lg font-bold text-emerald-700 dark:text-emerald-400">
                          {logStats.avgMood} / 5
                        </span>
                      </div>
                      <div className="py-2">
                        <span className="text-slate-500 dark:text-slate-400 block">Average Craving</span>
                        <span className="font-mono tabular-nums text-lg font-bold text-slate-900 dark:text-white">
                          {logStats.avgCraving} / 10
                        </span>
                      </div>
                      <div className="py-2">
                        <span className="text-slate-500 dark:text-slate-400 block">Top Trigger</span>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate block mt-0.5">
                          {logStats.topTrigger}
                        </span>
                      </div>
                    </div>

                    {/* Search & Mood Filter */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={logSearchQuery}
                          onChange={(e) => {
                            setLogSearchQuery(e.target.value);
                            setVisibleLogsLimit(LOGS_PAGE_SIZE);
                          }}
                          placeholder="Search notes, triggers, gratitude, or verses..."
                          className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400"
                        />
                        {logSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setLogSearchQuery('')}
                            aria-label="Clear log search"
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-medium overflow-x-auto">
                        {(
                          [
                            { id: 'all', label: 'All' },
                            { id: 'heavy', label: 'Heavy (1-2)' },
                            { id: 'neutral', label: 'Holding On (3)' },
                            { id: 'steady', label: 'Steady (4-5)' },
                          ] as const
                        ).map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => {
                              setLogMoodFilter(f.id);
                              setVisibleLogsLimit(LOGS_PAGE_SIZE);
                            }}
                            className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition ${
                              logMoodFilter === f.id
                                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Log Entries List */}
                    {filteredLogs.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                        No check-ins match your current search or mood filter.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {visibleLogs.map((entry) => (
                          <div key={entry.id} className="py-4 first:pt-0 last:pb-0 space-y-2.5">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                              <div className="flex flex-wrap items-center gap-2 text-slate-500 dark:text-slate-400">
                                <span className="font-mono tabular-nums">
                                  {formatLogTimestamp(entry.dateISO)}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                                  Mood: {entry.moodLabel} ({entry.moodScore}/5)
                                </span>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
                                  Craving: {entry.cravingLevel}/10
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    sendMessage(
                                      `I logged a check-in: I'm feeling ${entry.moodLabel} (craving ${entry.cravingLevel}/10). ${entry.note}`,
                                      entry.cravingLevel >= 5 ? 'addiction' : 'distress'
                                    )
                                  }
                                  className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  <span>Talk about this</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleStartEditLog(entry)}
                                  className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                                  aria-label="Edit check-in"
                                  title="Edit check-in"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteLog(entry.id)}
                                  className="text-slate-400 hover:text-rose-600"
                                  aria-label="Delete check-in"
                                  title="Delete check-in"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line">
                              {entry.note}
                            </p>

                            {(entry.gratitude || entry.verseRef) && (
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                                {entry.gratitude && (
                                  <span>
                                    <strong className="font-semibold text-slate-700 dark:text-slate-200">
                                      Grateful for:{' '}
                                    </strong>
                                    {entry.gratitude}
                                  </span>
                                )}
                                {entry.verseRef && (
                                  <span className="font-editorial italic text-emerald-800 dark:text-emerald-300">
                                    Verse: {entry.verseRef}
                                  </span>
                                )}
                              </div>
                            )}

                            {entry.triggers.length > 0 && (
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                <span className="font-semibold text-slate-600 dark:text-slate-300">
                                  Triggers:{' '}
                                </span>
                                {entry.triggers.join(' · ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Pagination Controls */}
                    {filteredLogs.length > visibleLogs.length && (
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => setVisibleLogsLimit((prev) => prev + LOGS_PAGE_SIZE)}
                          className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold hover:opacity-90 transition"
                        >
                          Show 10 More ({filteredLogs.length - visibleLogs.length} remaining)
                        </button>
                        <button
                          type="button"
                          onClick={() => setVisibleLogsLimit(filteredLogs.length)}
                          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        >
                          Show All ({filteredLogs.length})
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SAVED CONVERSATIONS & PORTABLE BACKUP */}
          {workspaceTab === 'history' && (
            <div className="space-y-6">
              {/* Cross-Device JSON Export / Import */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Private Device Vault &amp; Cross-Device Backup
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Every conversation thread, mood check-in, and sobriety milestone auto-saves privately inside this browser. Export a portable backup file anytime to restore your history onto another phone or laptop.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleExportVault}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold hover:opacity-90 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Backup (.json)</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/json,.json"
                    onChange={handleImportVault}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Import Backup (.json)</span>
                  </button>
                </div>

                {backupNotice && (
                  <p
                    className={`text-xs font-medium ${
                      backupNotice.type === 'err'
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {backupNotice.text}
                  </p>
                )}
              </div>

              {/* Saved Conversation Threads Manager */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Saved Conversations ({sessions.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleCreateNewSession}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Conversation</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {sessions.map((s) => (
                    <div
                      key={s.id}
                      className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSessionId(s.id);
                          setWorkspaceTab('chat');
                        }}
                        className="text-left min-w-0 flex-1 group"
                      >
                        <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate">
                          {s.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <span className="font-mono">{s.messages.length}</span> messages · Updated{' '}
                          {new Date(s.updatedAt).toLocaleDateString()}
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteSession(s.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                        title="Delete conversation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* RIGHT COLUMN (4 cols): Breathing Tool & Scripture Anchors */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Calm 4-7-8 Breathing Tool */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                  Steady Your Breathing (4-7-8)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setBreathingActive((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  breathingActive
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                {breathingActive ? (
                  <>
                    <Square className="w-3 h-3" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    <span>Begin</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Slows panic spirals and helps ride out sudden addiction urges in under a minute.
            </p>

            <div className="mt-5 py-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center">
              <div
                className={`w-24 h-24 rounded-full border-2 border-emerald-600/70 dark:border-emerald-400/70 bg-emerald-500/10 flex items-center justify-center transition-transform duration-700 ${
                  breathingActive ? breathPhase.scale : 'scale-100'
                }`}
              >
                <span className="font-mono tabular-nums text-xl font-semibold text-slate-900 dark:text-white">
                  {breathingActive ? `${breathPhase.count}s` : '4·7·8'}
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-3">
                {breathingActive ? breathPhase.label : 'Tap Begin when you feel overwhelmed'}
              </span>
            </div>
          </div>

          {/* Scripture Reflections */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                Scripture Anchors
              </h2>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {CURATED_VERSES.map((v) => (
                <div key={v.reference} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                    <span>{v.category}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {v.reference}
                    </span>
                  </div>
                  <p className="font-editorial italic text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
                    &ldquo;{v.text}&rdquo;
                  </p>
                  <button
                    type="button"
                    disabled={isSending}
                    onClick={() =>
                      sendMessage(
                        `Can we talk about ${v.reference} and what it means for what I'm going through?`,
                        'general'
                      )
                    }
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline disabled:opacity-50"
                  >
                    <span>Reflect on this together</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Clear Support Boundary */}
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-1">
        Support notice: This space offers human-centered AI conversation, grounding tools, private local recovery logging, and Scripture encouragement—not licensed therapy, medical detox, or emergency dispatch. In immediate danger or severe withdrawal, please call <strong>988</strong>, <strong>911 / 112</strong>, or go to your nearest hospital.
      </p>
    </div>
  );
};
