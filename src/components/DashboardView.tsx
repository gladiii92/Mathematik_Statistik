import React from 'react';
import {
  GraduationCap,
  BookOpen,
  Trophy,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Sparkles,
  Layers,
  HelpCircle,
  FileCheck2,
  Calculator,
  Coins,
  Grid,
  BarChart3,
  Dices,
  Flame,
  Zap,
  Target,
  Check,
} from 'lucide-react';
import { Phase, Topic } from './TopicNavigation';

export interface DashboardViewProps {
  phases: Phase[];
  allTopics: Array<{ topic: Topic; phase: Phase }>;
  completedTopicIds: string[];
  solvedQuestionIds: Record<string, boolean>;
  totalPossiblePoints: number;
  currentEarnedPoints: number;
  currentGradeInfo: { grade: string; label: string; color: string };
  onStartLearning: (topicId?: string) => void;
  onOpenExam: (phaseId?: string) => void;
  onResetProgress: () => void;
}

export const PHASE_CONFIG: Record<
  string,
  {
    themeColor: string;
    gradient: string;
    badgeBg: string;
    badgeText: string;
    border: string;
    iconBg: string;
    iconText: string;
    Icon: React.ElementType;
  }
> = {
  'phase-0': {
    themeColor: 'sky',
    gradient: 'from-sky-500/10 via-transparent to-transparent',
    badgeBg: 'bg-slate-800/80 border border-slate-700',
    badgeText: 'text-slate-300',
    border: 'border-slate-800 hover:border-slate-700',
    iconBg: 'bg-slate-800 border border-slate-700/80',
    iconText: 'text-sky-400',
    Icon: Calculator,
  },
  'phase-1': {
    themeColor: 'sky',
    gradient: 'from-sky-500/10 via-transparent to-transparent',
    badgeBg: 'bg-slate-800/80 border border-slate-700',
    badgeText: 'text-slate-300',
    border: 'border-slate-800 hover:border-slate-700',
    iconBg: 'bg-slate-800 border border-slate-700/80',
    iconText: 'text-sky-400',
    Icon: TrendingUp,
  },
  'phase-2': {
    themeColor: 'sky',
    gradient: 'from-sky-500/10 via-transparent to-transparent',
    badgeBg: 'bg-slate-800/80 border border-slate-700',
    badgeText: 'text-slate-300',
    border: 'border-slate-800 hover:border-slate-700',
    iconBg: 'bg-slate-800 border border-slate-700/80',
    iconText: 'text-sky-400',
    Icon: Coins,
  },
  'phase-3': {
    themeColor: 'sky',
    gradient: 'from-sky-500/10 via-transparent to-transparent',
    badgeBg: 'bg-slate-800/80 border border-slate-700',
    badgeText: 'text-slate-300',
    border: 'border-slate-800 hover:border-slate-700',
    iconBg: 'bg-slate-800 border border-slate-700/80',
    iconText: 'text-sky-400',
    Icon: Grid,
  },
  'phase-4': {
    themeColor: 'sky',
    gradient: 'from-sky-500/10 via-transparent to-transparent',
    badgeBg: 'bg-slate-800/80 border border-slate-700',
    badgeText: 'text-slate-300',
    border: 'border-slate-800 hover:border-slate-700',
    iconBg: 'bg-slate-800 border border-slate-700/80',
    iconText: 'text-sky-400',
    Icon: BarChart3,
  },
  'phase-5': {
    themeColor: 'sky',
    gradient: 'from-sky-500/10 via-transparent to-transparent',
    badgeBg: 'bg-slate-800/80 border border-slate-700',
    badgeText: 'text-slate-300',
    border: 'border-slate-800 hover:border-slate-700',
    iconBg: 'bg-slate-800 border border-slate-700/80',
    iconText: 'text-sky-400',
    Icon: Dices,
  },
  'phase-6': {
    themeColor: 'sky',
    gradient: 'from-sky-500/10 via-transparent to-transparent',
    badgeBg: 'bg-slate-800/80 border border-slate-700',
    badgeText: 'text-slate-300',
    border: 'border-slate-800 hover:border-slate-700',
    iconBg: 'bg-slate-800 border border-slate-700/80',
    iconText: 'text-sky-400',
    Icon: GraduationCap,
  },
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  phases,
  allTopics,
  completedTopicIds,
  solvedQuestionIds,
  totalPossiblePoints,
  currentEarnedPoints,
  currentGradeInfo,
  onStartLearning,
  onOpenExam,
  onResetProgress,
}) => {
  const totalTopics = allTopics.length;
  const completedTopicsCount = completedTopicIds.length;
  const topicProgressPercentage =
    totalTopics > 0 ? Math.round((completedTopicsCount / totalTopics) * 100) : 0;

  const pointsPercent =
    totalPossiblePoints > 0 ? Math.round((currentEarnedPoints / totalPossiblePoints) * 100) : 0;

  // Nächstes Thema zum Weiterlernen
  const nextOpenItem =
    allTopics.find((item) => !completedTopicIds.includes(item.topic.id)) || allTopics[0];

  const solvedQuestionsCount = Object.values(solvedQuestionIds).filter(Boolean).length;

  return (
    <div className="space-y-8 pb-12">
      {/* ── Hero Banner im einheitlichen Slate & Sky Design ── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-2xl shadow-black/40 sm:p-8">
        {/* Glow Spheres */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="pointer-events-none absolute right-48 -bottom-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-bold text-sky-300 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-sky-400" />
              <span>Zielnote 1,5 – 2,0 · 1. Semester Wirtschaftsmathematik & Statistik</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
              Dein interaktiver Klausur-Lernpfad
            </h1>
            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              Verstehe mathematische Zusammenhänge visuell mit lebendigen Graphen, Alltags-Intuition und erprobten Klausuraufgaben — Schritt für Schritt zur Bestnote.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={() => onStartLearning(nextOpenItem?.topic?.id)}
              className="inline-flex min-h-[50px] items-center gap-2.5 rounded-2xl bg-sky-500 px-6 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              <span>{completedTopicsCount === 0 ? 'Lernreise starten' : 'Jetzt weiterlernen'}</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </button>
            <button
              type="button"
              onClick={() => onOpenExam()}
              className="inline-flex min-h-[50px] items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-700 hover:border-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <FileCheck2 className="h-4 w-4 text-sky-400" />
              <span>Klausursimulator</span>
            </button>
          </div>
        </div>

        {/* Nächstes Thema Quick-Card */}
        {nextOpenItem && completedTopicsCount < totalTopics && (
          <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300 font-bold shadow-sm">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                  Nächste empfohlene Lerneinheit
                </p>
                <p className="truncate text-sm font-bold text-white">
                  {nextOpenItem.phase.title.split(':')[0]}: {nextOpenItem.topic.title}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onStartLearning(nextOpenItem.topic.id)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/15 px-3.5 py-1.5 text-xs font-bold text-sky-200 hover:bg-sky-500/25 transition"
            >
              <span>Lerneinheit öffnen</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ── 4 Stat-Cards (Harmonisiertes Bento Grid) ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Themenfortschritt */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
              Themen-Fortschritt
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{completedTopicsCount}</span>
              <span className="text-sm font-semibold text-slate-400">/ {totalTopics} Themen</span>
            </div>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-sky-500 transition-all duration-700 shadow-sm shadow-sky-500/40"
                style={{ width: `${topicProgressPercentage}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-semibold text-sky-300/80">
              {topicProgressPercentage} % des Curriculums gemeistert
            </p>
          </div>
        </div>

        {/* Card 2: Klausurpunkte */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Klausurpunkte
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              <Trophy className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{currentEarnedPoints}</span>
              <span className="text-sm font-semibold text-slate-400">/ {totalPossiblePoints} Pkt.</span>
            </div>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-700 shadow-sm shadow-emerald-500/40"
                style={{ width: `${pointsPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-semibold text-emerald-300/80">
              {pointsPercent} % aller Klausurpunkte erzielt
            </p>
          </div>
        </div>

        {/* Card 3: Notenprognose */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Notenprognose
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-sky-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black ${currentGradeInfo.color}`}>
                Note {currentGradeInfo.grade}
              </span>
            </div>
            <p className="mt-1 text-xs font-bold text-slate-200">{currentGradeInfo.label}</p>
            <p className="mt-2 text-xs text-slate-400">Zielbereich für Bestnote: 1,5 – 2,0</p>
          </div>
        </div>

        {/* Card 4: Klausuraufgaben */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Klausuraufgaben
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-sky-400">
              <Flame className="h-5 w-5 text-sky-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{solvedQuestionsCount}</span>
              <span className="text-sm font-semibold text-slate-400">Aufgaben gelöst</span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-sky-400 font-semibold">
              <Zap className="h-3.5 w-3.5 fill-sky-400 text-sky-400" />
              <span>Im Klausurtrainer trainieren</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Punkte werden automatisch verrechnet
            </p>
          </div>
        </div>
      </div>

      {/* ── Phasen-Curriculum mit einheitlichen Karten & semantischen Status-Badges ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white sm:text-2xl">
              Das Semester-Curriculum im Überblick
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              7 didaktisch aufeinander aufbauende Phasen mit visuellen Graphen & Formelsammlung
            </p>
          </div>
          <span className="rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-xs font-bold text-slate-300">
            {phases.length} Lernphasen
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {phases.map((phase) => {
            const cfg = PHASE_CONFIG[phase.id] || PHASE_CONFIG['phase-0'];
            const PhaseIcon = cfg.Icon;
            const topics = phase.topics || [];
            const completedCount = topics.filter((t) => completedTopicIds.includes(t.id)).length;
            const pct = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;
            const isFinished = topics.length > 0 && completedCount === topics.length;
            const isStarted = completedCount > 0 && !isFinished;

            return (
              <div
                key={phase.id}
                className={`group relative flex flex-col justify-between rounded-3xl border bg-slate-900/80 p-5 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                  isFinished
                    ? 'border-emerald-500/40 hover:border-emerald-400 shadow-emerald-950/20'
                    : isStarted
                    ? 'border-sky-500/40 hover:border-sky-400 shadow-sky-950/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition ${
                          isFinished
                            ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
                            : isStarted
                            ? 'border-sky-500/30 bg-sky-500/15 text-sky-300'
                            : 'border-slate-700 bg-slate-800 text-sky-400 group-hover:border-slate-600'
                        }`}
                      >
                        <PhaseIcon className="h-5 w-5" />
                      </div>
                      <span
                        className={`rounded-lg border px-2.5 py-0.5 text-xs font-bold transition ${
                          isFinished
                            ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
                            : isStarted
                            ? 'border-sky-500/30 bg-sky-500/15 text-sky-300'
                            : 'border-slate-700/80 bg-slate-800/80 text-slate-300'
                        }`}
                      >
                        {phase.title.split(':')[0]}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-bold ${
                        isFinished
                          ? 'text-emerald-400'
                          : isStarted
                          ? 'text-sky-300'
                          : 'text-slate-400'
                      }`}
                    >
                      {completedCount}/{topics.length} ({pct}%)
                    </span>
                  </div>

                  <h3 className="mt-3.5 text-base font-bold text-white group-hover:text-sky-300 transition">
                    {phase.title.replace(/^Phase\s*\d+:\s*/i, '')}
                  </h3>

                  {phase.description && (
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300 line-clamp-2">
                      {phase.description}
                    </p>
                  )}

                  {/* Topic Liste */}
                  <ul className="mt-4 space-y-2 border-t border-slate-800/80 pt-3">
                    {topics.map((t) => {
                      const done = completedTopicIds.includes(t.id);
                      return (
                        <li key={t.id} className="flex items-center justify-between gap-2 text-xs">
                          <span className="flex items-center gap-2 truncate">
                            <span
                              className={`h-2 w-2 shrink-0 rounded-full ${
                                done ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-slate-600'
                              }`}
                            />
                            <span className={done ? 'text-slate-400 line-through' : 'text-slate-200 font-medium'}>
                              {t.title}
                            </span>
                          </span>
                          {done && (
                            <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-3.5">
                  <button
                    type="button"
                    onClick={() => onStartLearning(topics[0]?.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 transition"
                  >
                    <span>Lerneinheiten starten</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenExam(phase.id)}
                    className="text-xs font-semibold text-slate-400 hover:text-sky-300 transition"
                  >
                    Klausuraufgaben
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4-Schritte-Erfolgsmethode im einheitlichen Slate & Sky Design ── */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
        <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-sky-300">
          <Sparkles className="h-4 w-4 text-sky-400" />
          Die 4-Schritte-Erfolgsmethode zum Klausurerfolg
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800/90 bg-slate-950/60 p-4 hover:border-slate-700 transition">
            <span className="text-xl font-black text-sky-400">1.</span>
            <h4 className="mt-1 text-sm font-bold text-white">Alltags-Intuition</h4>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              Erst die praktische Grundidee ohne Formelballast verstehen.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800/90 bg-slate-950/60 p-4 hover:border-slate-700 transition">
            <span className="text-xl font-black text-sky-400">2.</span>
            <h4 className="mt-1 text-sm font-bold text-white">Theorie & Formeln</h4>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              Formeln mit Merkregeln und Rechenschritten verinnerlichen.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800/90 bg-slate-950/60 p-4 hover:border-slate-700 transition">
            <span className="text-xl font-black text-sky-400">3.</span>
            <h4 className="mt-1 text-sm font-bold text-white">Graphisch sehen</h4>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              Nullstellen, Steigungen & Verläufe im interaktiven Graphen prüfen.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800/90 bg-slate-950/60 p-4 hover:border-slate-700 transition">
            <span className="text-xl font-black text-sky-400">4.</span>
            <h4 className="mt-1 text-sm font-bold text-white">Klausur lösen</h4>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              Aufgaben selbst lösen, gestaffelte Hinweise nutzen & Punkte sammeln.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
          <span className="text-xs text-slate-400">
            Dein Lernfortschritt wird automatisch im Browser gespeichert.
          </span>
          <button
            type="button"
            onClick={onResetProgress}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition"
            title="Setzt alle erledigten Themen und Punkte zurück"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Fortschritt zurücksetzen</span>
          </button>
        </div>
      </div>
    </div>
  );
};
