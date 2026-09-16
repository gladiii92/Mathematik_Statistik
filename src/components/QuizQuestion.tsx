import React, { useId, useState } from 'react';
import '../styles/a11y-polish.css';
import { MathFormula } from './MathFormula';
import {
  Check,
  CheckCircle2,
  X,
  Lightbulb,
  Sparkles,
  ChevronDown,
  RotateCcw,
  Star,
  Award,
  BookOpen,
} from 'lucide-react';

export interface QuizQuestionData {
  /** Eindeutige ID der Frage */
  id?: string;
  /** Fragetext (unterstützt $...$ und $$...$$ für LaTeX) */
  question: string;
  /** Einzelner Tipp oder Array aus gestaffelten Hinweisen */
  hints?: string | string[];
  /** Detaillierter Lösungsweg / Musterlösung */
  solution: string;
  /** Optional: Explizite mathematische Kernformel der Lösung */
  solutionFormula?: string;
  /** Optional: Fragetitel oder Aufgabennummer (z. B. "Aufgabe 1.2") */
  title?: string;
  /** Optional: Punkte/Gewichtung */
  points?: number;
  /** Optional: Multiple-Choice-Optionen */
  options?: string[];
  /** Optional: Korrekter Index oder Antwortstring */
  correctOptionIndex?: number;
}

export interface QuizQuestionProps {
  /** Fragedaten */
  question: QuizQuestionData | string;
  /** Titel / Label (falls question als String übergeben wird) */
  title?: string;
  /** Tipp-Text (falls separat übergeben) */
  hints?: string | string[];
  /** Lösungstext (falls separat übergeben) */
  solution?: string;
  /** Mathematische Lösungsformel (optional) */
  solutionFormula?: string;
  /** Punkte/Gewichtung */
  points?: number;
  /** Optionale Aufgabennummerierung */
  questionNumber?: number | string;
  /** Zusätzliche CSS-Klassen */
  className?: string;
  /** Callback bei erfolgreicher Beantwortung / Selbstüberprüfung */
  onComplete?: (success: boolean) => void;
  /** Gibt an, ob die Frage gelöst wurde */
  solved?: boolean;
  /** Callback zum Umschalten des Gelöst-Status */
  onToggleSolved?: () => void;
}

/**
 * Rendert Fließtext mit eingebetteten LaTeX-Formeln.
 * Unterstützt:
 * - $$...$$ und \[...\] (Display-Block)
 * - $...$ und \(...\) (Inline)
 * - Automatische Erkennung reiner mathematischer Ausdrücke (z. B. in Optionen)
 * - Erhalt von Zeilenumbrüchen via whitespace-pre-line
 */
export const FormattedMathText: React.FC<{
  text: string;
  className?: string;
  as?: 'div' | 'span';
}> = ({ text, className = '', as = 'div' }) => {
  if (typeof text !== 'string' || !text || !text.trim()) return null;

  try {
    const trimmed = text.trim();

    // Reine mathematische Strings ohne Delimiter direkt als Formel rendern
    if (
      !trimmed.includes('$') &&
      !trimmed.includes('\\(') &&
      !trimmed.includes('\\[') &&
      (/^(?:\\|\w+\^|\w+_)/.test(trimmed) ||
        /\\(?:frac|sqrt|pmatrix|begin|binom|times|pm|sum|int|cdot|hat|bar|tilde|partial)/.test(trimmed))
    ) {
      return <MathFormula formula={trimmed} inline className={className} />;
    }

    const parts: React.ReactNode[] = [];
    const regex = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[^\$]+?\$|\\\([\s\S]*?\\\))/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let hasDisplayMath = false;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>{text.substring(lastIndex, match.index)}</span>
        );
      }
      const token = match[0];
      if (token.startsWith('$$') && token.endsWith('$$')) {
        const formula = token.slice(2, -2).trim();
        if (!formula) {
          parts.push(<span key={`raw-${match.index}`}>{token}</span>);
        } else {
          hasDisplayMath = true;
          parts.push(
            <MathFormula key={`display-${match.index}`} formula={formula} block />
          );
        }
      } else if (token.startsWith('\\[') && token.endsWith('\\]')) {
        const formula = token.slice(2, -2).trim();
        if (!formula) {
          parts.push(<span key={`raw-${match.index}`}>{token}</span>);
        } else {
          hasDisplayMath = true;
          parts.push(
            <MathFormula key={`display-${match.index}`} formula={formula} block />
          );
        }
      } else if (token.startsWith('$') && token.endsWith('$')) {
        const formula = token.slice(1, -1).trim();
        if (!formula) {
          parts.push(<span key={`raw-${match.index}`}>{token}</span>);
        } else {
          parts.push(
            <MathFormula key={`inline-${match.index}`} formula={formula} inline />
          );
        }
      } else if (token.startsWith('\\(') && token.endsWith('\\)')) {
        const formula = token.slice(2, -2).trim();
        if (!formula) {
          parts.push(<span key={`raw-${match.index}`}>{token}</span>);
        } else {
          parts.push(
            <MathFormula key={`inline-${match.index}`} formula={formula} inline />
          );
        }
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex)}</span>);
    }

    if (parts.length === 0) return null;

    if (as === 'span' && !hasDisplayMath) {
      return <span className={`formatted-math-text inline ${className}`}>{parts}</span>;
    }

    return (
      <div className={`formatted-math-text whitespace-pre-line leading-relaxed ${className}`}>
        {parts}
      </div>
    );
  } catch {
    return <div className={`formatted-math-text leading-relaxed ${className}`}>{String(text)}</div>;
  }
};

/** Kleine Stufen-Badge-Komponente für das Akkordeon */
const StepBadge: React.FC<{ step: string; label: string; tone: string }> = ({
  step,
  label,
  tone,
}) => (
  <span className="inline-flex items-center gap-2">
    <span
      aria-hidden="true"
      className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-bold ${tone}`}
    >
      {step}
    </span>
    <span className="font-semibold">{label}</span>
  </span>
);

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  title,
  hints,
  solution,
  solutionFormula,
  points,
  questionNumber,
  className = '',
  onComplete,
  solved = false,
  onToggleSolved,
}) => {
  const qData: QuizQuestionData =
    typeof question === 'string'
      ? { question, title, hints, solution: solution || '', solutionFormula, points }
      : {
          ...question,
          title: title || question.title,
          hints: hints || question.hints,
          solution: solution || question.solution,
          solutionFormula: solutionFormula || question.solutionFormula,
          points: points ?? question.points,
        };

  const hintList: string[] = Array.isArray(qData.hints)
    ? qData.hints
    : qData.hints
      ? [qData.hints]
      : [];

  const hasHints = hintList.length > 0;
  const hasSolution = Boolean(qData.solution?.trim() || qData.solutionFormula?.trim());
  const options: string[] = Array.isArray((qData as QuizQuestionData).options)
    ? ((qData as QuizQuestionData).options as string[])
    : [];
  const hasOptions = options.length > 0;
  const correctIndex =
    typeof (qData as QuizQuestionData).correctOptionIndex === 'number'
      ? ((qData as QuizQuestionData).correctOptionIndex as number)
      : undefined;
  const hasCheckableAnswer =
    hasOptions && typeof correctIndex === 'number' && correctIndex >= 0 && correctIndex < options.length;

  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const headingId = `quiz-q-${uid}`;
  const hintRegionId = `quiz-hints-${uid}`;
  const solutionRegionId = `quiz-solution-${uid}`;
  const optionsLabelId = `quiz-options-${uid}`;
  const feedbackId = `quiz-feedback-${uid}`;

  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [selfStatus, setSelfStatus] = useState<'idle' | 'understood' | 'practice'>('idle');

  const displayTitle = qData.title || title || 'Übungsaufgabe';
  const numberLabel =
    questionNumber !== undefined && questionNumber !== null && String(questionNumber).trim() !== ''
      ? String(questionNumber)
      : undefined;
  const pointsValue = points ?? qData.points ?? 5;

  const isCorrect = checked && hasCheckableAnswer && selected === correctIndex;
  const isWrong = checked && hasCheckableAnswer && selected !== null && selected !== correctIndex;

  const handleSelect = (idx: number) => {
    setSelected(idx);
    setChecked(false);
  };

  const handleOptionsKeyDown = (e: React.KeyboardEvent) => {
    if (!hasOptions) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const next = selected === null ? 0 : (selected + 1) % options.length;
      setSelected(next);
      setChecked(false);
      document.getElementById(`quiz-opt-${uid}-${next}`)?.focus();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = selected === null ? options.length - 1 : (selected - 1 + options.length) % options.length;
      setSelected(prev);
      setChecked(false);
      document.getElementById(`quiz-opt-${uid}-${prev}`)?.focus();
    }
  };

  const handleCheck = () => {
    if (selected === null) return;
    setChecked(true);
    if (hasCheckableAnswer && selected === correctIndex) {
      if (onToggleSolved && !solved) {
        onToggleSolved();
      }
      onComplete?.(true);
    }
  };

  const handleReset = () => {
    setSelected(null);
    setChecked(false);
  };

  const handleSelfCheck = (success: boolean) => {
    setSelfStatus(success ? 'understood' : 'practice');
    if (success) {
      setShowSolution(false);
      if (onToggleSolved && !solved) {
        onToggleSolved();
      }
    }
    onComplete?.(success);
  };

  const optionStateClass = (idx: number): string => {
    const isSel = selected === idx;
    const isCorr = hasCheckableAnswer && checked && idx === correctIndex;
    const isWrongSel = hasCheckableAnswer && checked && isSel && idx !== correctIndex;
    if (isCorr)
      return 'border-emerald-400 bg-emerald-400/15 shadow-[0_0_0_1px_#34d399]';
    if (isWrongSel) return 'border-rose-400 bg-rose-400/10 shadow-[0_0_0_1px_#fb7185]';
    if (isSel && !checked) return 'border-sky-400 bg-sky-400/15 shadow-[0_0_0_1px_#38bdf8]';
    return 'border-slate-700 bg-slate-800/70 hover:border-slate-500 hover:bg-slate-800';
  };

  return (
    <article
      aria-label={`Aufgabe: ${displayTitle}`}
      aria-labelledby={headingId}
      className={`overflow-hidden rounded-2xl border transition ${
        solved
          ? 'border-emerald-500/40 bg-slate-900 shadow-[0_8px_32px_rgba(16,185,129,0.08)]'
          : 'border-slate-800 bg-slate-900 shadow-[0_8px_32px_rgba(0,0,0,0.35)]'
      } ${className}`}
    >
      {/* ── Card-Header: Nummer + Punkte + Gelöst-Toggle ── */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/90 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="inline-flex h-9 min-w-9 items-center justify-center rounded-xl bg-sky-400 px-2.5 text-base font-extrabold text-slate-950"
          >
            {numberLabel ? `#${numberLabel}` : '?'}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-300/90">
              {numberLabel ? `Aufgabe ${numberLabel}` : 'Klausuraufgabe'}
            </p>
            <h3 id={headingId} className="truncate text-base font-bold text-slate-50 sm:text-lg">
              {displayTitle}
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {typeof pointsValue === 'number' && (
            <span
              aria-label={`${pointsValue} ${pointsValue === 1 ? 'Punkt' : 'Punkte'}`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1.5 text-xs font-bold text-sky-200"
            >
              <Star className="h-3.5 w-3.5 fill-sky-300 text-sky-300" />
              <span>{pointsValue} {pointsValue === 1 ? 'Punkt' : 'Punkte'}</span>
            </span>
          )}

          {/* Gelöst-Schalter */}
          {onToggleSolved && (
            <button
              type="button"
              onClick={onToggleSolved}
              aria-pressed={solved}
              className={`inline-flex min-h-[38px] items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                solved
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'border border-slate-700 bg-slate-800 text-slate-300 hover:border-emerald-400 hover:text-emerald-300'
              }`}
              title={solved ? 'Klausuraufgabe ist als gelöst markiert' : 'Als gelöst markieren und Punkte gutschreiben'}
            >
              <CheckCircle2 className={`h-4 w-4 ${solved ? 'text-slate-950' : 'text-slate-400'}`} />
              <span>{solved ? 'Gelöst (+ Punkte)' : 'Als gelöst markieren'}</span>
            </button>
          )}
        </div>
      </header>

      <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
        {/* ── Fragetext ── */}
        <section aria-label="Fragestellung">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-[1.02rem] leading-[1.7] text-slate-100 sm:p-5">
            <FormattedMathText text={qData.question} />
          </div>
        </section>

        {/* ── Multiple Choice Optionen ── */}
        {hasOptions && (
          <section aria-labelledby={optionsLabelId}>
            <p id={optionsLabelId} className="mb-2.5 text-sm font-semibold text-slate-300">
              Wähle eine Antwort <span className="font-normal text-slate-500">(Tastatur: Pfeiltasten + Enter)</span>
            </p>
            <div
              role="radiogroup"
              aria-labelledby={optionsLabelId}
              aria-required="true"
              onKeyDown={handleOptionsKeyDown}
              className="grid gap-2.5"
            >
              {options.map((opt, idx) => {
                const isSel = selected === idx;
                const isCorr = hasCheckableAnswer && checked && idx === correctIndex;
                const isWrongSel = hasCheckableAnswer && checked && isSel && idx !== correctIndex;
                const letter = OPTION_LETTERS[idx] ?? String(idx + 1);
                return (
                  <button
                    key={`opt-${idx}`}
                    id={`quiz-opt-${uid}-${idx}`}
                    type="button"
                    role="radio"
                    aria-checked={isSel}
                    aria-label={`Antwort ${letter}: ${opt.replace(/\$+/g, '').slice(0, 80)}`}
                    onClick={() => handleSelect(idx)}
                    className={`flex min-h-[56px] w-full items-start gap-3 rounded-xl border-2 p-4 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${optionStateClass(idx)}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold transition-colors ${
                        isCorr
                          ? 'bg-emerald-400 text-emerald-950'
                          : isWrongSel
                          ? 'bg-rose-400 text-rose-950'
                          : isSel
                          ? 'bg-sky-400 text-slate-950'
                          : 'bg-slate-700 text-slate-200'
                      }`}
                    >
                      {isCorr ? <Check className="h-5 w-5 stroke-[3]" /> : isWrongSel ? <X className="h-5 w-5 stroke-[3]" /> : letter}
                    </span>
                    <span className="min-w-0 flex-1 text-[1rem] leading-relaxed text-slate-100">
                      <FormattedMathText text={opt} as="span" />
                    </span>
                    {isSel && !checked && (
                      <span aria-hidden="true" className="mt-1 h-3 w-3 shrink-0 rounded-full bg-sky-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Prüfen / Reset */}
            <div className="mt-3 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={handleCheck}
                disabled={selected === null}
                aria-describedby={checked ? feedbackId : undefined}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-sky-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Check className="h-4 w-4 stroke-[2.5]" />
                <span>Antwort prüfen</span>
              </button>
              {(selected !== null || checked) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-400 hover:text-slate-100"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Zurücksetzen</span>
                </button>
              )}
            </div>

            {/* Feedback nach Prüfung */}
            <div id={feedbackId} aria-live="polite" className="mt-3">
              {isCorrect && (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200">
                  <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                  <div>
                    <p className="font-bold text-emerald-100">Richtig gelöst! 🎉</p>
                    <p className="text-xs text-emerald-300/90 mt-0.5">
                      Punkte wurden angerechnet. Schau dir bei Bedarf den detaillierten Lösungsweg unten an.
                    </p>
                  </div>
                </div>
              )}
              {isWrong && (
                <div className="flex items-start gap-3 rounded-xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-200">
                  <X className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" />
                  <div>
                    <p className="font-bold text-rose-100">Noch nicht ganz richtig</p>
                    <p className="text-xs text-rose-300/90 mt-0.5">
                      Lies die gestaffelten Hinweise oder klappe die Musterlösung auf. Die richtige Option ist grün markiert.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Hinweis & Lösung Buttons ── */}
        <div className="flex flex-wrap gap-2.5">
          {hasHints && (
            <button
              type="button"
              aria-expanded={showHints}
              aria-controls={hintRegionId}
              onClick={() => setShowHints((v) => !v)}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                showHints
                  ? 'border-amber-300 bg-amber-300 text-amber-950'
                  : 'border-amber-400/50 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20'
              }`}
            >
              <Lightbulb className="h-4 w-4" />
              <span>{showHints ? 'Hinweise ausblenden' : `Hinweis${hintList.length > 1 ? `e (${hintList.length})` : ''} anzeigen`}</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showHints ? 'rotate-180' : ''}`} />
            </button>
          )}

          {hasSolution && (
            <button
              type="button"
              aria-expanded={showSolution}
              aria-controls={solutionRegionId}
              onClick={() => setShowSolution((v) => !v)}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                showSolution
                  ? 'border-emerald-300 bg-emerald-300 text-emerald-950'
                  : 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20'
              }`}
            >
              <Award className="h-4 w-4" />
              <span>{showSolution ? 'Musterlösung ausblenden' : 'Musterlösung anzeigen'}</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showSolution ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        {/* ── Gestaffelte Hinweise Box ── */}
        {hasHints && showHints && (
          <section
            id={hintRegionId}
            aria-label="Hinweise"
            className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-4 sm:p-5"
          >
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Lightbulb className="h-4 w-4" />
              <span>Hinweise · {hintList.length} Stufe{hintList.length > 1 ? 'n' : ''}</span>
            </p>
            <ol className="space-y-3">
              {hintList.map((h, i) => (
                <li key={`hint-${i}`} className="flex gap-3 rounded-lg bg-slate-950/60 p-3">
                  <StepBadge step={String(i + 1)} label="" tone="bg-amber-300 text-amber-950" />
                  <div className="min-w-0 flex-1 text-[0.96rem] leading-relaxed text-amber-100/95">
                    <FormattedMathText text={h} />
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* ── Grüne Musterlösung Box ── */}
        {hasSolution && showSolution && (
          <section
            id={solutionRegionId}
            aria-label="Musterlösung"
            className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 p-4 sm:p-5"
          >
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              <span>Ausführliche Musterlösung</span>
            </p>
            <div className="rounded-lg bg-slate-950/60 p-4 text-[0.98rem] leading-[1.7] text-emerald-50">
              <FormattedMathText text={qData.solution} />
            </div>
            {qData.solutionFormula?.trim() && (
              <div className="mt-3 rounded-lg border border-emerald-300/30 bg-slate-950/80 p-4 text-center">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-300/80">Klausur-Kernformel</p>
                <MathFormula formula={qData.solutionFormula.trim()} block />
              </div>
            )}
          </section>
        )}

        {/* ── Selbst-Check ── */}
        <section
          aria-label="Selbst-Check"
          className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-slate-200">Selbst-Einschätzung & Fortschritt</p>
              <p className="text-xs text-slate-400">
                Hast du den Rechenweg nachvollzogen und verstanden?
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                aria-pressed={selfStatus === 'understood'}
                onClick={() => handleSelfCheck(true)}
                className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                  selfStatus === 'understood' || solved
                    ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/20'
                    : 'border border-slate-700 bg-slate-800 text-emerald-300 hover:bg-emerald-500/20'
                }`}
              >
                <Check className="h-4 w-4" />
                <span>Verstanden (+ Punkte)</span>
              </button>
              <button
                type="button"
                aria-pressed={selfStatus === 'practice'}
                onClick={() => handleSelfCheck(false)}
                className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
                  selfStatus === 'practice'
                    ? 'border-sky-400 bg-sky-400/20 text-sky-200'
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                }`}
              >
                <RotateCcw className="h-4 w-4" />
                <span>Noch üben</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
};

export default QuizQuestion;
