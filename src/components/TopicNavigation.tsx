import React, { useState, useMemo, useEffect, useRef } from 'react';
import '../styles/a11y-polish.css';
import {
  Search,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Filter,
  X,
  Layers,
  BookOpen,
} from 'lucide-react';

export interface Topic {
  id: string;
  title: string;
  explanation?: string;
  formulas?: Array<{ label: string; latex: string; note?: string }>;
  graphConfig?: any;
  questions?: any[];
}

export interface Phase {
  id: string;
  title: string;
  description?: string;
  topics: Topic[];
}

export interface TopicNavigationProps {
  phases: Phase[];
  selectedTopicId: string;
  onSelectTopic: (topicId: string) => void;
  completedTopicIds?: string[];
  className?: string;
}

type StatusFilter = 'all' | 'open' | 'done';

export const TopicNavigation: React.FC<TopicNavigationProps> = ({
  phases = [],
  selectedTopicId = '',
  onSelectTopic,
  completedTopicIds = [],
  className = '',
}) => {
  const safePhases: Phase[] = Array.isArray(phases) ? phases : [];
  const safeCompletedIds: string[] = Array.isArray(completedTopicIds) ? completedTopicIds : [];
  const safeSelectedId: string = typeof selectedTopicId === 'string' ? selectedTopicId : '';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [collapsedPhases, setCollapsedPhases] = useState<Record<string, boolean>>({});
  const listRef = useRef<HTMLDivElement>(null);

  const q = searchQuery.trim().toLowerCase();
  const isFiltering = q.length > 0 || statusFilter !== 'all';

  // Ausgewählte Phase immer offen halten
  useEffect(() => {
    if (!safeSelectedId) return;
    const owner = safePhases.find((p) =>
      (Array.isArray(p.topics) ? p.topics : []).some((t) => t?.id === safeSelectedId)
    );
    if (owner) {
      setCollapsedPhases((prev) => (prev[owner.id] ? { ...prev, [owner.id]: false } : prev));
    }
  }, [safeSelectedId, safePhases]);

  const togglePhase = (phaseId: string) => {
    setCollapsedPhases((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    safePhases.forEach((p) => {
      next[p.id] = false;
    });
    setCollapsedPhases(next);
  };

  const collapseAll = () => {
    const next: Record<string, boolean> = {};
    safePhases.forEach((p) => {
      next[p.id] = true;
    });
    // Aktive Phase offen lassen für Orientierung
    const owner = safePhases.find((p) =>
      (Array.isArray(p.topics) ? p.topics : []).some((t) => t?.id === safeSelectedId)
    );
    if (owner) next[owner.id] = false;
    setCollapsedPhases(next);
  };

  const allTopicIds = useMemo(() => {
    const ids = new Set<string>();
    safePhases.forEach((p) => {
      const ts = Array.isArray(p.topics) ? p.topics : [];
      ts.forEach((t) => {
        if (t && t.id) ids.add(t.id);
      });
    });
    return ids;
  }, [safePhases]);

  const totalTopics = allTopicIds.size;
  const doneCount = safeCompletedIds.filter((id) => allTopicIds.has(id)).length;
  const totalPct = totalTopics ? Math.round((doneCount / totalTopics) * 100) : 0;

  const filteredPhases = useMemo(() => {
    return safePhases
      .map((phase) => {
        const topics = Array.isArray((phase as any)?.topics) ? ((phase as any).topics as Topic[]) : [];
        const matching = topics.filter((t) => {
          if (!t || !t.id) return false;
          const matchesQ =
            !q ||
            (t.title ?? '').toLowerCase().includes(q) ||
            (t.explanation ?? '').toLowerCase().includes(q);
          if (!matchesQ) return false;
          const isDone = safeCompletedIds.includes(t.id);
          if (statusFilter === 'done') return isDone;
          if (statusFilter === 'open') return !isDone;
          return true;
        });
        return { ...phase, topics: matching };
      })
      .filter((p) => (isFiltering ? p.topics.length > 0 : true));
  }, [safePhases, q, statusFilter, safeCompletedIds, isFiltering]);

  const visibleTopicIds = useMemo(() => {
    const ids: string[] = [];
    filteredPhases.forEach((phase) => {
      const isCollapsed = Boolean(collapsedPhases[phase.id]) && !q;
      if (isCollapsed) return;
      phase.topics.forEach((t) => ids.push(t.id));
    });
    return ids;
  }, [filteredPhases, collapsedPhases, q]);

  // Tastatur-Navigation
  const handleListKeyDown = (e: React.KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const topicBtn = target.closest('[data-topic-btn="true"]') as HTMLButtonElement | null;
    const phaseBtn = target.closest('[data-phase-btn="true"]') as HTMLButtonElement | null;

    if (topicBtn) {
      const buttons = Array.from(
        listRef.current?.querySelectorAll<HTMLButtonElement>('[data-topic-btn="true"]') ?? []
      );
      const idx = buttons.indexOf(topicBtn);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        buttons[idx + 1]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (idx > 0) buttons[idx - 1]?.focus();
        else {
          const section = topicBtn.closest('section');
          section?.querySelector<HTMLButtonElement>('[data-phase-btn="true"]')?.focus();
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        buttons[0]?.focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        buttons[buttons.length - 1]?.focus();
      }
    } else if (phaseBtn && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const section = phaseBtn.closest('section');
        section?.querySelector<HTMLButtonElement>('[data-topic-btn="true"]')?.focus();
      }
    }
  };

  const resetFilter = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  return (
    <nav
      aria-label="Themennavigation – Lernphasen und Themen"
      className={`flex h-full flex-col bg-[#0f172a] text-slate-200 ${className}`}
    >
      {/* Kopf: Titel, Fortschritt, Suche, Filter */}
      <div className="border-b border-slate-800/80 bg-[#0f172a] p-4 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-sky-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Lernpfad-Navigation
            </h2>
          </div>
          <span
            aria-live="polite"
            aria-label={`${doneCount} von ${totalTopics} Themen erledigt`}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/90 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-slate-200"
          >
            <span aria-hidden="true" className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>{doneCount}/{totalTopics}</span>
            <span className="text-slate-400">({totalPct}%)</span>
          </span>
        </div>

        {/* Gesamt-Fortschritt */}
        <div
          className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-800"
          role="progressbar"
          aria-valuenow={doneCount}
          aria-valuemin={0}
          aria-valuemax={Math.max(totalTopics, 1)}
          aria-label="Gesamtfortschritt"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${totalPct}%` }}
          />
        </div>

        {/* Suchfeld */}
        <label htmlFor="topic-search" className="sr-only">
          Thema suchen
        </label>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            id="topic-search"
            type="search"
            placeholder="Thema suchen … z. B. Ableitung"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setSearchQuery('');
            }}
            autoComplete="off"
            className="min-h-[38px] w-full rounded-xl border border-slate-700/80 bg-slate-950/70 py-2 pl-9 pr-8 text-xs text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Suche zurücksetzen"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status-Filter + Auf/Zu */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5" role="group" aria-label="Nach Status filtern">
          {(['all', 'open', 'done'] as StatusFilter[]).map((f) => {
            const active = statusFilter === f;
            const label = f === 'all' ? 'Alle' : f === 'open' ? 'Offen' : 'Erledigt';
            return (
              <button
                key={f}
                type="button"
                onClick={() => setStatusFilter(f)}
                aria-pressed={active}
                className={`min-h-[30px] rounded-lg border px-2.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                  active
                    ? 'border-sky-500/60 bg-sky-500/15 text-sky-200'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            );
          })}
          <span className="mx-1 h-3.5 w-px bg-slate-800" aria-hidden="true" />
          <button
            type="button"
            onClick={expandAll}
            className="text-[11px] font-medium text-slate-400 hover:text-sky-300"
          >
            Alle auf
          </button>
          <span className="text-slate-600">·</span>
          <button
            type="button"
            onClick={collapseAll}
            className="text-[11px] font-medium text-slate-400 hover:text-sky-300"
          >
            Alle zu
          </button>
        </div>

        {isFiltering && (
          <p aria-live="polite" className="mt-2 text-xs text-slate-400">
            {visibleTopicIds.length} Treffer
            {searchQuery ? (
              <>
                {' '}für <q className="text-slate-200">“{searchQuery.trim()}”</q>
              </>
            ) : null}
          </p>
        )}
      </div>

      {/* Accordion-Liste */}
      <div
        ref={listRef}
        onKeyDown={handleListKeyDown}
        className="flex-1 space-y-2.5 overflow-y-auto p-3"
      >
        {filteredPhases.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-6 text-center">
            <p className="text-xs font-medium text-slate-300">Keine Themen gefunden</p>
            <p className="mt-1 text-[11px] text-slate-500">
              {searchQuery
                ? `Nichts für „${searchQuery}“ gefunden.`
                : 'Mit diesem Filter gibt es keine Themen.'}
            </p>
            <button
              type="button"
              onClick={resetFilter}
              className="mt-3 rounded-xl border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-200 hover:bg-sky-500/20"
            >
              Filter zurücksetzen
            </button>
          </div>
        )}

        {filteredPhases.map((phase, pIdx) => {
          const topics = Array.isArray(phase.topics) ? phase.topics : [];
          const isCollapsed = Boolean(collapsedPhases[phase.id]) && !q;
          const phaseDone = topics.filter((t) => safeCompletedIds.includes(t.id)).length;
          const phasePct = topics.length ? Math.round((phaseDone / topics.length) * 100) : 0;
          const isComplete = topics.length > 0 && phaseDone === topics.length;
          const isStarted = phaseDone > 0 && !isComplete;
          const containsActive = topics.some((t) => t.id === safeSelectedId);

          return (
            <section
              key={phase.id}
              aria-labelledby={`phase-title-${phase.id}`}
              className={`overflow-hidden rounded-2xl border transition ${
                containsActive
                  ? 'border-sky-500/50 bg-[#0f172a]'
                  : 'border-slate-800/80 bg-slate-950/40'
              }`}
            >
              <h3 id={`phase-title-${phase.id}`} className="sr-only">
                {phase.title}
              </h3>
              <button
                type="button"
                data-phase-btn="true"
                onClick={() => togglePhase(phase.id)}
                aria-expanded={!isCollapsed}
                aria-controls={`phase-list-${phase.id}`}
                className="group flex min-h-[50px] w-full items-center justify-between gap-3 bg-slate-900/40 px-3.5 py-2.5 text-left transition hover:bg-slate-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-400"
              >
                <span className="flex min-w-0 flex-1 items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-xs font-bold tabular-nums text-sky-300 ring-1 ring-sky-500/30"
                  >
                    {String(pIdx)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="block truncate text-xs font-bold text-white">
                        {phase.title.replace(/^Phase\s*\d+:\s*/i, '')}
                      </span>
                    </span>
                    <span className="mt-1 flex items-center gap-2">
                      <span className="block h-1 w-24 overflow-hidden rounded-full bg-slate-800" aria-hidden="true">
                        <span
                          className="block h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-500"
                          style={{ width: `${phasePct}%` }}
                        />
                      </span>
                      <span className="text-[10px] text-slate-400">{phaseDone}/{topics.length}</span>
                    </span>
                  </span>
                </span>

                <span className="flex shrink-0 items-center gap-1.5">
                  {isComplete ? (
                    <span
                      aria-label="Phase abgeschlossen"
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300"
                    >
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                  ) : null}
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                      isCollapsed ? '-rotate-90' : ''
                    }`}
                  />
                </span>
              </button>

              {!isCollapsed && (
                <ul
                  id={`phase-list-${phase.id}`}
                  aria-label={`Themen in ${phase.title}`}
                  className="space-y-1 p-2"
                >
                  {topics.map((topic, tIdx) => {
                    const isSelected = topic.id === safeSelectedId;
                    const isCompleted = safeCompletedIds.includes(topic.id);
                    const count = Array.isArray(topic.questions) ? topic.questions.length : 0;
                    return (
                      <li key={topic.id}>
                        <button
                          type="button"
                          data-topic-btn="true"
                          onClick={() => onSelectTopic(topic.id)}
                          aria-current={isSelected ? 'true' : undefined}
                          aria-label={`${topic.title}${isCompleted ? ', erledigt' : ''}${
                            isSelected ? ', aktuell ausgewählt' : ''
                          }`}
                          className={`group relative flex min-h-[44px] w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                            isSelected
                              ? 'border-sky-500/60 bg-sky-500/15 shadow-sm'
                              : 'border-transparent bg-transparent hover:border-slate-800 hover:bg-slate-900/60'
                          }`}
                        >
                          {/* Status-Icon */}
                          <span
                            aria-hidden="true"
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ring-1 transition ${
                              isCompleted
                                ? 'bg-emerald-500/20 text-emerald-300 ring-emerald-500/40'
                                : isSelected
                                ? 'bg-sky-500/30 text-sky-200 ring-sky-400/50'
                                : 'bg-slate-800 text-slate-400 ring-slate-700'
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="h-3 w-3 stroke-[3]" />
                            ) : (
                              <span className="tabular-nums">{tIdx + 1}</span>
                            )}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span
                              className={`block truncate text-xs leading-snug ${
                                isSelected
                                  ? 'font-bold text-white'
                                  : isCompleted
                                  ? 'font-medium text-slate-300'
                                  : 'font-normal text-slate-200'
                              }`}
                            >
                              {topic.title}
                            </span>
                            <span className="mt-0.5 flex items-center gap-2 text-[10px] text-slate-500">
                              {count > 0 && <span>{count} Übung{count > 1 ? 'en' : ''}</span>}
                              {isCompleted && (
                                <span className="font-semibold text-emerald-400">✓ Erledigt</span>
                              )}
                            </span>
                          </span>

                          {isSelected && (
                            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-sky-400" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </nav>
  );
};

export default TopicNavigation;
