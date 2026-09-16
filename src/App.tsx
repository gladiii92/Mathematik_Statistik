import React, { useState, useMemo, useEffect } from 'react';
import learningPlanData from './data/learningPlan.json';
import examQuestionsData from './data/examQuestions.json';
import { TopicNavigation, Phase, Topic } from './components/TopicNavigation';
import { LearningModule } from './components/LearningModule';
import { QuizQuestion, QuizQuestionData } from './components/QuizQuestion';
import { DashboardView } from './components/DashboardView';
import { FormulaSheetView } from './components/FormulaSheetView';
import {
  loadCompletedTopics,
  saveCompletedTopics,
  loadSolvedQuestions,
  saveSolvedQuestions,
  loadActiveTab,
  saveActiveTab,
  loadSelectedTopicId,
  saveSelectedTopicId,
  resetAllProgress,
} from './utils/storage';
import {
  LayoutDashboard,
  BookOpen,
  FileCheck2,
  Sigma,
  Menu,
  X,
  Trophy,
  Clock,
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Flame,
  Target,
  Calculator,
} from 'lucide-react';
import './styles/a11y-polish.css';

export type MainTab = 'dashboard' | 'learning' | 'exam' | 'formulas';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTab>(() => {
    return (loadActiveTab('dashboard') as MainTab) || 'dashboard';
  });

  const [examPhaseFilter, setExamPhaseFilter] = useState<string>('all');
  const [examStatusFilter, setExamStatusFilter] = useState<'all' | 'unsolved' | 'solved'>('all');
  const [examSearchQuery, setExamSearchQuery] = useState<string>('');

  // Persistenter State
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>(() => loadCompletedTopics());
  const [solvedQuestionIds, setSolvedQuestionIds] = useState<Record<string, boolean>>(() =>
    loadSolvedQuestions()
  );

  // Timer im Prüfungsmodus
  const [examTimerRunning, setExamTimerRunning] = useState<boolean>(false);
  const [examTimerSeconds, setExamTimerSeconds] = useState<number>(60 * 60);

  const meta: any = (learningPlanData as any).meta ?? {};
  const appTitle: string = meta.title ?? 'Wirtschaftsmathematik & Statistik';
  const appSubtitle: string = 'Interaktive Klausurvorbereitung · 1. Semester';

  const rawPhases: Phase[] = Array.isArray((learningPlanData as any)?.phases)
    ? ((learningPlanData as any).phases as Phase[])
    : [];
  const _examRaw: any = examQuestionsData as any;
  const rawQuestions: QuizQuestionData[] = Array.isArray(_examRaw)
    ? (_examRaw as QuizQuestionData[])
    : Array.isArray(_examRaw?.questions)
    ? (_examRaw.questions as QuizQuestionData[])
    : [];

  const phases: Phase[] = useMemo(() => {
    const safePhases: any[] = Array.isArray(rawPhases) ? rawPhases : [];
    const safeQuestions: any[] = Array.isArray(rawQuestions) ? rawQuestions : [];
    return safePhases.map((phase: any) => ({
      ...(phase ?? {}),
      id: (phase as any)?.id ?? '',
      title: (phase as any)?.title ?? '',
      modelSolution: (phase as any)?.modelSolution ?? undefined,
      topics: (((phase as any)?.topics || []) as any[]).map((topic: any) => {
        const tid: string = (topic as any)?.id ?? '';
        const matchingQuestions = safeQuestions.filter((q: any) => (q as any)?.topicId === tid);
        return {
          ...(topic ?? {}),
          id: tid,
          title: (topic as any)?.title ?? 'Thema',
          explanation: (topic as any)?.explanation ?? '',
          formulas: Array.isArray((topic as any)?.formulas) ? (topic as any).formulas : [],
          graph: (topic as any)?.graph ?? (topic as any)?.graphConfig ?? undefined,
          graphConfig: (topic as any)?.graphConfig ?? (topic as any)?.graph ?? undefined,
          questions:
            matchingQuestions.length > 0
              ? matchingQuestions
              : Array.isArray((topic as any)?.questions)
              ? (topic as any).questions
              : [],
        };
      }),
    }));
  }, [rawPhases, rawQuestions]);

  const allTopics = useMemo(() => {
    const list: Array<{ topic: Topic; phase: Phase }> = [];
    (phases || []).forEach((phase: any) => {
      ((phase as any)?.topics || []).forEach((topic: any) => {
        list.push({ topic, phase });
      });
    });
    return list;
  }, [phases]);

  const [selectedTopicId, setSelectedTopicId] = useState<string>(() => {
    const saved = loadSelectedTopicId();
    if (saved && allTopics.some((t) => t.topic.id === saved)) {
      return saved;
    }
    return allTopics.length > 0 ? allTopics[0]?.topic?.id ?? '' : '';
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync mit LocalStorage
  useEffect(() => {
    saveCompletedTopics(completedTopicIds);
  }, [completedTopicIds]);

  useEffect(() => {
    saveSolvedQuestions(solvedQuestionIds);
  }, [solvedQuestionIds]);

  useEffect(() => {
    saveActiveTab(activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (selectedTopicId) {
      saveSelectedTopicId(selectedTopicId);
    }
  }, [selectedTopicId]);

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (examTimerRunning && examTimerSeconds > 0) {
      interval = setInterval(() => {
        setExamTimerSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [examTimerRunning, examTimerSeconds]);

  const currentIndex = allTopics.findIndex((item) => (item?.topic?.id || '') === selectedTopicId);
  const fallbackItem: { topic: Topic; phase: Phase } = {
    topic: { id: '', title: 'Thema', explanation: '', formulas: [], questions: [] } as any,
    phase: { id: '', title: 'Lernphase', topics: [] } as any,
  };
  const currentItem = currentIndex >= 0 ? allTopics[currentIndex] : allTopics[0] || fallbackItem;

  useEffect(() => {
    if ((!selectedTopicId || currentIndex === -1) && allTopics.length > 0) {
      setSelectedTopicId(allTopics[0].topic.id);
    }
  }, [allTopics, selectedTopicId, currentIndex]);

  // ESC schließt Mobile-Drawer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    if (sidebarOpen) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setActiveTab('learning');
    setSidebarOpen(false);
  };

  const handleNextTopic = () => {
    if (allTopics.length === 0) return;
    if (currentIndex === -1) {
      setSelectedTopicId(allTopics[0].topic.id);
    } else if (currentIndex < allTopics.length - 1) {
      setSelectedTopicId(allTopics[currentIndex + 1].topic.id);
    }
  };

  const handlePrevTopic = () => {
    if (allTopics.length === 0) return;
    if (currentIndex === -1) {
      setSelectedTopicId(allTopics[0].topic.id);
    } else if (currentIndex > 0) {
      setSelectedTopicId(allTopics[currentIndex - 1].topic.id);
    }
  };

  const handleToggleCompleted = (topicId: string) => {
    setCompletedTopicIds((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  const handleToggleSolvedQuestion = (qId: string) => {
    setSolvedQuestionIds((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleResetProgress = () => {
    if (window.confirm('Möchtest du deinen gesamten Lernfortschritt wirklich auf 0 zurücksetzen?')) {
      resetAllProgress();
      setCompletedTopicIds([]);
      setSolvedQuestionIds({});
    }
  };

  const totalPossiblePoints = rawQuestions.reduce((sum, q) => sum + (q.points || 5), 0);
  const currentEarnedPoints = rawQuestions.reduce((sum, q) => {
    const id = q.id || '';
    return solvedQuestionIds[id] ? sum + (q.points || 5) : sum;
  }, 0);
  const pointsPercent = totalPossiblePoints > 0 ? (currentEarnedPoints / totalPossiblePoints) * 100 : 0;

  const calculateGrade = (pct: number) => {
    if (pct >= 95) return { grade: '1,0', label: 'Sehr gut', color: 'text-emerald-400' };
    if (pct >= 90) return { grade: '1,3', label: 'Sehr gut', color: 'text-emerald-400' };
    if (pct >= 85) return { grade: '1,7', label: 'Gut (Zielbereich)', color: 'text-emerald-300' };
    if (pct >= 80) return { grade: '2,0', label: 'Gut (Zielbereich)', color: 'text-emerald-300' };
    if (pct >= 75) return { grade: '2,3', label: 'Befriedigend', color: 'text-sky-300' };
    if (pct >= 70) return { grade: '2,7', label: 'Befriedigend', color: 'text-sky-300' };
    if (pct >= 65) return { grade: '3,0', label: 'Befriedigend', color: 'text-amber-300' };
    if (pct >= 60) return { grade: '3,3', label: 'Ausreichend', color: 'text-amber-300' };
    if (pct >= 55) return { grade: '3,7', label: 'Ausreichend', color: 'text-orange-300' };
    if (pct >= 50) return { grade: '4,0', label: 'Ausreichend (Bestanden)', color: 'text-orange-300' };
    return { grade: '5,0', label: 'Nicht bestanden', color: 'text-rose-400' };
  };
  const currentGradeInfo = calculateGrade(pointsPercent);

  const topicProgressPercentage =
    allTopics.length > 0 ? Math.round((completedTopicIds.length / allTopics.length) * 100) : 0;

  // Filterung der Klausurfragen
  const filteredExamQuestions = useMemo(() => {
    return rawQuestions.filter((q) => {
      const tid = (q as any).topicId || '';
      if (examPhaseFilter !== 'all' && !tid.startsWith(examPhaseFilter)) {
        return false;
      }
      const isSolved = Boolean(solvedQuestionIds[q.id || '']);
      if (examStatusFilter === 'solved' && !isSolved) return false;
      if (examStatusFilter === 'unsolved' && isSolved) return false;
      if (examSearchQuery.trim()) {
        const query = examSearchQuery.toLowerCase().trim();
        const text = `${q.title || ''} ${q.question || ''} ${q.solution || ''}`.toLowerCase();
        if (!text.includes(query)) return false;
      }
      return true;
    });
  }, [rawQuestions, examPhaseFilter, examStatusFilter, examSearchQuery, solvedQuestionIds]);

  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= allTopics.length - 1;
  const currentPhaseTitle: string = (currentItem?.phase as any)?.title ?? 'Lernphase';
  const isCompleted = completedTopicIds.includes(currentItem?.topic?.id ?? '');

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#050914] text-slate-100 antialiased selection:bg-sky-500/30">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[70] focus:rounded-xl focus:bg-sky-400 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-slate-950"
      >
        Zum Inhalt springen
      </a>

      {/* ===== Modern Glassmorphism Header ===== */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0a1024]/90 backdrop-blur-xl shadow-lg shadow-black/20">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Logo & Titel */}
          <div className="flex items-center gap-3">
            {activeTab === 'learning' && (
              <button
                type="button"
                onClick={() => setSidebarOpen((v) => !v)}
                aria-expanded={sidebarOpen}
                aria-label="Themenmenü öffnen"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800/80 text-slate-200 transition hover:bg-slate-700 lg:hidden"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-3 text-left focus-visible:outline-none group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 text-lg font-black text-slate-950 shadow-md shadow-sky-500/25 transition group-hover:scale-105">
                ∑
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-black tracking-tight text-white sm:text-base group-hover:text-sky-300 transition">
                  {appTitle}
                </h1>
                <p className="text-[11px] font-medium text-slate-400">{appSubtitle}</p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Tabs mit einheitlichem Primär-Design */}
          <nav className="hidden items-center gap-1.5 md:flex" aria-label="Hauptnavigation">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`inline-flex h-10 items-center gap-2 rounded-2xl px-4 text-xs font-extrabold transition ${
                activeTab === 'dashboard'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="h-4 w-4 stroke-[2.5]" />
              <span>Übersicht</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('learning')}
              className={`inline-flex h-10 items-center gap-2 rounded-2xl px-4 text-xs font-extrabold transition ${
                activeTab === 'learning'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BookOpen className="h-4 w-4 stroke-[2.5]" />
              <span>Lernpfad</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('exam')}
              className={`inline-flex h-10 items-center gap-2 rounded-2xl px-4 text-xs font-extrabold transition ${
                activeTab === 'exam'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileCheck2 className="h-4 w-4 stroke-[2.5]" />
              <span>Klausurtrainer</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('formulas')}
              className={`inline-flex h-10 items-center gap-2 rounded-2xl px-4 text-xs font-extrabold transition ${
                activeTab === 'formulas'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Sigma className="h-4 w-4 stroke-[2.5]" />
              <span>Formelsammlung</span>
            </button>
          </nav>

          {/* Header Stats: Einheitliche Badges */}
          <div className="flex items-center gap-2.5">
            {/* Streak Badge */}
            <div className="hidden items-center gap-1.5 rounded-2xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-bold text-slate-300 lg:flex">
              <Flame className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>Klausur-Fokus</span>
            </div>

            {/* Score Pill */}
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-1.5 text-xs font-bold text-emerald-300 shadow-sm">
              <Trophy className="h-4 w-4 text-amber-400" />
              <span className="tabular-nums">
                {currentEarnedPoints} / {totalPossiblePoints} Pkt.
              </span>
            </div>
          </div>
        </div>

        {/* Globaler animierter Farb-Progress-Bar */}
        <div className="h-1 w-full bg-slate-800/60" role="progressbar" aria-label="Lernfortschritt">
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-sky-400 to-emerald-400 transition-all duration-700 shadow-sm"
            style={{ width: `${topicProgressPercentage}%` }}
          />
        </div>

        {/* Mobile Navigation Bar mit einheitlichem Primär-Design */}
        <div className="grid grid-cols-4 gap-1 border-t border-slate-800/60 bg-[#0a1024] p-1.5 md:hidden">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center rounded-2xl py-2 text-[10px] font-bold transition ${
              activeTab === 'dashboard'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Übersicht</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('learning')}
            className={`flex flex-col items-center justify-center rounded-2xl py-2 text-[10px] font-bold transition ${
              activeTab === 'learning'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Lernen</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('exam')}
            className={`flex flex-col items-center justify-center rounded-2xl py-2 text-[10px] font-bold transition ${
              activeTab === 'exam'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCheck2 className="h-4 w-4" />
            <span>Klausur</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('formulas')}
            className={`flex flex-col items-center justify-center rounded-2xl py-2 text-[10px] font-bold transition ${
              activeTab === 'formulas'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sigma className="h-4 w-4" />
            <span>Formeln</span>
          </button>
        </div>
      </header>

      {/* ===== Main Body Container ===== */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 items-start gap-6 px-4 py-6 sm:px-6">
        {/* Backdrop für Mobile-Drawer */}
        {sidebarOpen && activeTab === 'learning' && (
          <button
            type="button"
            aria-label="Navigation schließen"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md lg:hidden"
          />
        )}

        {/* Sidebar: Nur im Lernmodus */}
        {activeTab === 'learning' && (
          <aside
            id="topic-sidebar"
            data-open={sidebarOpen ? 'true' : 'false'}
            aria-label="Themennavigation"
            className={`fixed inset-y-0 left-0 z-50 flex w-[86vw] max-w-xs flex-col border-r border-slate-800 bg-[#0f172a] transition-transform duration-300 lg:sticky lg:top-[104px] lg:z-10 lg:h-[calc(100vh-130px)] lg:w-80 lg:max-w-none lg:shrink-0 lg:translate-x-0 lg:rounded-3xl lg:border ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 px-4 py-3 lg:hidden">
              <span className="text-xs font-bold text-white">Lernpfad</span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label="Sidebar schließen"
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <TopicNavigation
              phases={phases}
              selectedTopicId={selectedTopicId}
              completedTopicIds={completedTopicIds}
              onSelectTopic={handleSelectTopic}
              className="rounded-3xl"
            />
          </aside>
        )}

        {/* Hauptinhalt */}
        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 focus:outline-none">
          {/* 1. DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <DashboardView
              phases={phases}
              allTopics={allTopics}
              completedTopicIds={completedTopicIds}
              solvedQuestionIds={solvedQuestionIds}
              totalPossiblePoints={totalPossiblePoints}
              currentEarnedPoints={currentEarnedPoints}
              currentGradeInfo={currentGradeInfo}
              onStartLearning={(tId) => {
                if (tId) setSelectedTopicId(tId);
                setActiveTab('learning');
              }}
              onOpenExam={(pId) => {
                if (pId) setExamPhaseFilter(pId);
                setActiveTab('exam');
              }}
              onResetProgress={handleResetProgress}
            />
          )}

          {/* 2. LEARNING VIEW */}
          {activeTab === 'learning' && (
            <div className="mx-auto w-full max-w-3xl">
              <LearningModule
                topic={currentItem.topic as any}
                phase={currentItem.phase as any}
                phaseTitle={currentPhaseTitle}
                isCompleted={isCompleted}
                onToggleCompleted={() => handleToggleCompleted(currentItem?.topic?.id ?? '')}
                onNextTopic={handleNextTopic}
                onPrevTopic={handlePrevTopic}
                hasNextTopic={!isLast}
                hasPrevTopic={!isFirst}
              />
            </div>
          )}

          {/* 3. EXAM VIEW */}
          {activeTab === 'exam' && (
            <section aria-labelledby="exam-heading" className="space-y-6 pb-12">
              {/* Exam Header Card */}
              <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-[#0b1120] to-slate-900 p-6 shadow-xl">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-sky-500/15 border border-sky-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-300">
                        Klausursimulation & Fragentrainer
                      </span>
                    </div>
                    <h2 id="exam-heading" className="text-xl font-black text-white sm:text-2xl">
                      Prüfungsmodus · {rawQuestions.length} Klausuraufgaben
                    </h2>
                    <p className="text-xs text-slate-300">
                      Erreiche mindestens 80 % der Gesamtpunkte für deinen Zielbereich (Note 1,5 – 2,0).
                    </p>
                  </div>

                  {/* Timer & Live Score */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2.5 rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-2 text-xs">
                      <Clock className="h-4 w-4 text-sky-400" />
                      <span className="font-mono font-bold text-white tabular-nums">
                        {formatTimer(examTimerSeconds)}
                      </span>
                      <button
                        type="button"
                        onClick={() => setExamTimerRunning((v) => !v)}
                        className="ml-1 rounded-xl bg-sky-500/20 px-2.5 py-1 font-bold text-sky-300 hover:bg-sky-500/30 transition"
                      >
                        {examTimerRunning ? 'Pause' : 'Start'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setExamTimerRunning(false);
                          setExamTimerSeconds(60 * 60);
                        }}
                        className="rounded text-slate-500 hover:text-slate-300"
                        title="Timer zurücksetzen"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 px-4 py-2 text-xs">
                      <span className="text-slate-300 font-medium">Punkte: </span>
                      <span className="font-extrabold text-white tabular-nums">
                        {currentEarnedPoints}/{totalPossiblePoints}
                      </span>
                      <span className={`ml-2 font-bold ${currentGradeInfo.color}`}>
                        (Note {currentGradeInfo.grade})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Filter & Suche */}
                <div className="mt-6 grid gap-3 sm:grid-cols-12">
                  <div className="relative sm:col-span-6">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Aufgabe suchen … z. B. p-q, Gewinnmaximum, Integral"
                      value={examSearchQuery}
                      onChange={(e) => setExamSearchQuery(e.target.value)}
                      className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/80 py-2.5 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <select
                      value={examPhaseFilter}
                      onChange={(e) => setExamPhaseFilter(e.target.value)}
                      className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/80 py-2.5 px-3 text-xs text-slate-200 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    >
                      <option value="all">Alle Lernphasen</option>
                      {phases.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title.split(':')[0]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <select
                      value={examStatusFilter}
                      onChange={(e) => setExamStatusFilter(e.target.value as any)}
                      className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/80 py-2.5 px-3 text-xs text-slate-200 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    >
                      <option value="all">Alle Aufgaben</option>
                      <option value="unsolved">Nur offene Aufgaben</option>
                      <option value="solved">Nur gelöste Aufgaben</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Frageliste */}
              <div className="space-y-4">
                {filteredExamQuestions.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
                    <FileCheck2 className="mx-auto h-10 w-10 text-slate-600" />
                    <p className="mt-3 text-sm font-semibold text-slate-300">
                      Keine Fragen für diese Filterung gefunden
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setExamPhaseFilter('all');
                        setExamStatusFilter('all');
                        setExamSearchQuery('');
                      }}
                      className="mt-3 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                    >
                      Filter zurücksetzen
                    </button>
                  </div>
                ) : (
                  filteredExamQuestions.map((q) => (
                    <QuizQuestion
                      key={q.id}
                      question={q}
                      solved={!!solvedQuestionIds[q.id || '']}
                      onToggleSolved={() => handleToggleSolvedQuestion(q.id || '')}
                    />
                  ))
                )}
              </div>
            </section>
          )}

          {/* 4. FORMULAS VIEW */}
          {activeTab === 'formulas' && (
            <FormulaSheetView
              phases={phases}
              onSelectTopic={(topicId) => {
                setSelectedTopicId(topicId);
                setActiveTab('learning');
              }}
            />
          )}
        </main>
      </div>

      {/* ===== Footer ===== */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#0a1024] py-5">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 text-xs text-slate-400 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">{appTitle}</span>
            <span>·</span>
            <span>{completedTopicIds.length} von {allTopics.length} Themen gemeistert</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Klausurpunkte: <strong className="text-white">{currentEarnedPoints}</strong> / {totalPossiblePoints}</span>
            <span>·</span>
            <span className={`font-bold ${currentGradeInfo.color}`}>Note {currentGradeInfo.grade}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
