import React, { useState, useMemo } from 'react';
import { Search, Copy, Check, BookOpen, Filter, Sigma } from 'lucide-react';
import { MathFormula } from './MathFormula';
import { FormattedMathText } from './QuizQuestion';
import { Phase } from './TopicNavigation';

export interface FormulaSheetViewProps {
  phases: Phase[];
  onSelectTopic?: (topicId: string) => void;
}

interface FlattenedFormula {
  id: string;
  label: string;
  latex: string;
  note?: string;
  topicId: string;
  topicTitle: string;
  phaseId: string;
  phaseTitle: string;
}

export const FormulaSheetView: React.FC<FormulaSheetViewProps> = ({ phases, onSelectTopic }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string>('all');
  const [copiedFormulaId, setCopiedFormulaId] = useState<string | null>(null);

  // Alle Formeln sammeln
  const allFormulas: FlattenedFormula[] = useMemo(() => {
    const list: FlattenedFormula[] = [];
    (phases || []).forEach((phase) => {
      (phase.topics || []).forEach((topic) => {
        (topic.formulas || []).forEach((f, fIdx) => {
          list.push({
            id: `${topic.id}-f-${fIdx}`,
            label: f.label || 'Formel',
            latex: f.latex,
            note: f.note,
            topicId: topic.id,
            topicTitle: topic.title,
            phaseId: phase.id,
            phaseTitle: phase.title,
          });
        });
      });
    });
    return list;
  }, [phases]);

  // Filtern nach Suche und Phase
  const filteredFormulas = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allFormulas.filter((f) => {
      if (selectedPhaseFilter !== 'all' && f.phaseId !== selectedPhaseFilter) {
        return false;
      }
      if (!q) return true;
      return (
        f.label.toLowerCase().includes(q) ||
        (f.note && f.note.toLowerCase().includes(q)) ||
        f.topicTitle.toLowerCase().includes(q) ||
        f.phaseTitle.toLowerCase().includes(q) ||
        f.latex.toLowerCase().includes(q)
      );
    });
  }, [allFormulas, searchQuery, selectedPhaseFilter]);

  const handleCopyLatex = (id: string, latex: string) => {
    navigator.clipboard.writeText(latex);
    setCopiedFormulaId(id);
    setTimeout(() => {
      setCopiedFormulaId(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-[#0f172a] to-slate-900 p-6 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30">
              <Sigma className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white sm:text-2xl">Formelsammlung & Spickzettel</h2>
                <span className="rounded-full bg-sky-500/15 px-2.5 py-0.5 text-xs font-semibold text-sky-300">
                  {allFormulas.length} Formeln
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400">
                Alle mathematischen & statistischen Kernformeln aus Phase 0 bis 6 übersichtlich aufbereitet mit LaTeX-Code zum Kopieren.
              </p>
            </div>
          </div>
        </div>

        {/* Suche & Phasenfilter */}
        <div className="mt-6 grid gap-3 sm:grid-cols-12">
          <div className="relative sm:col-span-7">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Formel, Begriff oder Regel suchen … z. B. p-q, Ableitung, Zins"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-slate-200"
              >
                Löschen
              </button>
            )}
          </div>

          <div className="sm:col-span-5">
            <div className="relative">
              <Filter className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={selectedPhaseFilter}
                onChange={(e) => setSelectedPhaseFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-950/80 py-2.5 pl-10 pr-8 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
              >
                <option value="all">Alle Phasen ({allFormulas.length} Formeln)</option>
                {phases.map((p) => {
                  const count = p.topics.reduce((sum, t) => sum + (t.formulas?.length || 0), 0);
                  return (
                    <option key={p.id} value={p.id}>
                      {p.title} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Ergebnisliste */}
      {filteredFormulas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-slate-600" />
          <h3 className="mt-3 text-base font-semibold text-slate-300">Keine Formeln gefunden</h3>
          <p className="mt-1 text-sm text-slate-500">
            Passe deine Suche oder den Phasenfilter an, um Formeln anzuzeigen.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedPhaseFilter('all');
            }}
            className="mt-4 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
            Filter zurücksetzen
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {filteredFormulas.map((formula) => {
            const isCopied = copiedFormulaId === formula.id;
            return (
              <div
                key={formula.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0f172a]/90 p-5 shadow-sm transition hover:border-slate-700 hover:shadow-md hover:shadow-black/30"
              >
                <div>
                  {/* Topic / Phase Meta */}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectTopic?.(formula.topicId)}
                      className="truncate text-left text-xs font-medium text-sky-400 hover:text-sky-300 hover:underline"
                      title="Zum Thema springen"
                    >
                      {formula.topicTitle}
                    </button>
                    <span className="shrink-0 rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-400">
                      {formula.phaseTitle.split(':')[0]}
                    </span>
                  </div>

                  <h3 className="mt-2 text-sm font-semibold text-white">{formula.label}</h3>

                  {/* Math Formula Render */}
                  <div className="my-3 overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/70 p-3 text-center">
                    <MathFormula formula={formula.latex} block />
                  </div>

                  {/* Note / Erklärung */}
                  {formula.note && (
                    <div className="text-xs leading-relaxed text-slate-400">
                      <span className="font-semibold text-slate-300">Merke: </span>
                      <FormattedMathText text={formula.note} as="span" />
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3">
                  <button
                    type="button"
                    onClick={() => handleCopyLatex(formula.id, formula.latex)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition hover:text-sky-300"
                    title="LaTeX-Code in die Zwischenablage kopieren"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Kopiert!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>LaTeX kopieren</span>
                      </>
                    )}
                  </button>

                  {onSelectTopic && (
                    <button
                      type="button"
                      onClick={() => onSelectTopic(formula.topicId)}
                      className="text-xs font-medium text-slate-400 transition hover:text-sky-300 hover:underline"
                    >
                      Im Lernpfad öffnen →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

