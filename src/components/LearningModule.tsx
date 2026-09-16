import React, { useState } from 'react';
import '../styles/a11y-polish.css';
import { MathFormula } from './MathFormula';
import { MathGraph } from './MathGraph';
import { QuizQuestion, QuizQuestionData, FormattedMathText } from './QuizQuestion';
import { getGraphForTopic } from '../data/graphRegistry';
import {
  Compass,
  Target,
  Coffee,
  BookOpen,
  Sigma,
  TrendingUp,
  Star,
  AlertTriangle,
  GraduationCap,
  CheckCircle2,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  PenTool,
  Check,
} from 'lucide-react';

export interface FormulaItem {
  label: string;
  latex: string;
  note?: string;
}

export interface GraphDefinition {
  title?: string;
  fn?: (x: number) => number;
  fnName?: string;
  curves?: Array<{
    name: string;
    fn: (x: number) => number;
    color?: string;
    strokeDasharray?: string;
    strokeWidth?: number;
  }>;
  domain?: [number, number];
  points?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  highlightPoints?: Array<{ x: number; y: number; label?: string; color?: string }>;
  referenceLines?: Array<{ x?: number; y?: number; label?: string; color?: string; strokeDasharray?: string }>;
  description?: string;
}

export interface TopicDetail {
  id: string;
  title: string;
  explanation: string;
  formulas?: FormulaItem[];
  graph?: GraphDefinition;
  graphConfig?: any;
  questions?: QuizQuestionData[];
}

export interface SolutionStep {
  stepNumber: number;
  title: string;
  latex?: string;
  explanation: string;
}

export interface ModelSolution {
  title: string;
  context?: string;
  given: string[];
  wanted: string[];
  steps: SolutionStep[];
  result: string;
  resultLatex?: string;
  verification: string;
  interpretation: string;
}

export interface PhaseInfo {
  id: string;
  title: string;
  description?: string;
  modelSolution?: ModelSolution;
}

export interface LearningModuleProps {
  topic: TopicDetail;
  phase?: PhaseInfo;
  phaseTitle?: string;
  onNextTopic?: () => void;
  onPrevTopic?: () => void;
  hasNextTopic?: boolean;
  hasPrevTopic?: boolean;
  onMarkCompleted?: (topicId: string) => void;
  onToggleCompleted?: () => void;
  isCompleted?: boolean;
}

// --- Laien-Helfer: Lernziel / Alltag / Merksatz / Fehler heuristisch ableiten ---
function getLearningGoal(topic: TopicDetail): string {
  const safeTitle: string = (topic as any)?.title ?? 'dieses Thema';
  const id = String((topic as any)?.id ?? '').toLowerCase();
  if (id.includes('kosten') || id.includes('gewinn') || id.includes('oekonom') || id.includes('ertrag'))
    return 'Du verstehst nach diesem Thema, wie Kosten, Erlös und Gewinn zusammenhängen – und wie du die gewinnmaximale Menge Schritt für Schritt berechnest.';
  if (id.includes('quadrat'))
    return 'Du verstehst, was eine Parabel ausmacht – und löst quadratische Gleichungen sicher mit p-q-Formel, Nullstellen und Scheitelpunkt.';
  if (id.includes('potenz') || id.includes('wurzel'))
    return 'Du verstehst Potenz- und Wurzelgesetze an Alltagsbeispielen – und vereinfachst solche Terme fehlerfrei.';
  if (id.includes('ableit') || id.includes('differ'))
    return 'Du verstehst die Ableitung als Steigung – und leitest Funktionen mit Produkt-, Quotienten- und Kettenregel sicher ab.';
  if (id.includes('integral') || id.includes('stamm'))
    return 'Du verstehst das Integral als Fläche unter einer Kurve – und berechnest Konsumenten- und Produzentenrente mit der Stammfunktion.';
  if (id.includes('zins'))
    return 'Du verstehst den Unterschied zwischen einfachem Zins und Zinseszins – und berechnest End- und Barwerte über beliebige Laufzeiten.';
  if (id.includes('renten') || id.includes('annuit'))
    return 'Du verstehst Rentenbarwerte und Annuitätentilgung – und trennst Zins- und Tilgungsanteile fehlerfrei.';
  if (id.includes('matrizen') || id.includes('vektor'))
    return 'Du verstehst Matrizen als lineare Transformationen – und multiplizierst Matrizen und Vektoren nach Falkschem Schema.';
  if (id.includes('lgs') || id.includes('gauss'))
    return 'Du verstehst lineare Gleichungssysteme als Geradenschnittpunkte – und bestimmst Lösungsvektoren sicher mit dem Gauß-Verfahren.';
  if (id.includes('lage') || id.includes('streuung'))
    return 'Du verstehst Mittelwert, Median, Varianz und Standardabweichung – und interpretierst Streuungsbereiche sicher.';
  if (id.includes('regression') || id.includes('korrelation'))
    return 'Du verstehst lineare Zusammenhänge – und berechnest Regressionsgerade und Korrelationskoeffizienten nach Pearson.';
  if (id.includes('statistik') || id.includes('wahrsch') || id.includes('stoch'))
    return 'Du verstehst Zufallsvariablen, Pfadregeln und Wahrscheinlichkeitsverteilungen an konkreten Beispielen.';
  if (id.includes('hypothese'))
    return 'Du verstehst Null- und Alternativhypothese, Signifikanzniveaus sowie Annahme- und Ablehnungsbereiche im Z-Test.';
  return `Du verstehst nach diesem Thema „${safeTitle}“ die Grundidee, die wichtigsten Formeln und den typischen Klausur-Lösungsweg – auch ohne Vorwissen.`;
}

function getEverydayExample(topic: TopicDetail): string {
  if (!topic) return '';
  const id = String((topic as any)?.id ?? '').toLowerCase();
  if (id.includes('kosten') || id.includes('gewinn') || id.includes('oekonom'))
    return 'Stell dir einen Bäcker vor: Mehl und Strom kosten pro Brot (variable Kosten), die Ladenmiete fällt jeden Monat fix an. Verkauft er mehr Brote, steigt der Erlös – aber irgendwann steigen durch Überstunden auch die Kosten stark an. Genau den gewinnstärksten Punkt (Gewinnmaximum) berechnen wir hier mit der Ableitung.';
  if (id.includes('quadrat'))
    return 'Stell dir einen Ballwurf vor: Der Ball steigt hoch und fällt wieder – seine Flugbahn ist eine nach unten geöffnete Parabel. Wann berührt er den Boden? Wo erreicht er die maximale Höhe? Genau diese Fragen beantworten Nullstellen und Scheitelpunkt.';
  if (id.includes('potenz') || id.includes('wurzel'))
    return 'Stell dir ein quadratisches Beet im Garten vor: 3 m × 3 m = 9 m². Die Quadratwurzel kehrt das einfach um – aus 9 m² wird wieder 3 m Seitenlänge. Potenzen sind also wiederholtes Multiplizieren, Wurzeln das exakte Zurückrechnen.';
  if (id.includes('ableit'))
    return 'Stell dir eine Autofahrt mit dem Tacho vor: Deine Position ist die Strecke, die Ableitung ist deine aktuelle Momentangeschwindigkeit (wie steil der Anstieg ist). Steht der Tacho auf Null, rollst du auf einer Kuppe oder im Tal.';
  if (id.includes('integral'))
    return 'Stell dir einen Wasserhahn vor, der mal tröpfelt, mal voll aufgedreht wird. Das Integral zählt kontinuierlich zusammen, wie viele Liter Wasser insgesamt im Eimer landen – also die gesamte Fläche unter der Durchfluss-Kurve.';
  if (id.includes('zins'))
    return 'Stell dir einen Schneeball vor, der einen Hang hinabrollt: Im ersten Jahr bekommst du Zinsen auf dein Startgeld. Im zweiten Jahr bekommen auch diese Zinsen wiederum Zinsen! Der Schneeball wird immer schneller immer größer.';
  if (id.includes('renten') || id.includes('annuit'))
    return 'Stell dir eine Kreditrate für eine Wohnung vor: Jeden Monat zahlst du denselben Betrag (Annuität). Zu Beginn zahlst du fast nur Zinsen an die Bank. Je mehr du abbezahlst, desto kleiner wird der Zinsanteil und desto größer der Tilgungsanteil.';
  if (id.includes('matrizen') || id.includes('lgs'))
    return 'Stell dir ein Rezeptbuch vor: Ein Bäcker braucht für 3 Kuchen Mehl, Eier und Zucker in unterschiedlichen Mengen. Eine Matrix fasst diese Rezept-Tabelle zusammen, und Vektoren rechnen mit einem Klick den Gesamtbedarf aus.';
  if (id.includes('lage') || id.includes('streuung') || id.includes('statistik'))
    return 'Stell dir vor, du erfährst, dass das Monats-Durchschnittseinkommen in einem Dorf 10.000 € beträgt. Klingt reich – aber wenn dort 99 arme Bauern und 1 Milliardär leben, sagt der Mittelwert wenig aus. Der Median und die Streuung zeigen die wahre Realität.';
  return 'Stell dir vor, du erklärst das Thema einer Freundin beim Kaffee – ganz ohne Fachworte, nur mit einem Bild aus dem Alltag. Genau so gehen wir es hier Schritt für Schritt an.';
}

function getMerksatz(topic: TopicDetail): string {
  if (!topic) return '';
  const id = String((topic as any)?.id ?? '').toLowerCase();
  if (id.includes('kosten') || id.includes('gewinn'))
    return 'Gewinn = Erlös minus Kosten. Maximum liegt bei G\'(x) = 0 und G\'\'(x) < 0. Am Gewinnmaximum gilt Grenzkosten = Grenzerlös (K\' = E\').';
  if (id.includes('quadrat'))
    return 'Erst immer Normalform herstellen (Leitkoeffizient = 1), dann p und q mit Vorzeichen ablesen, dann p-q-Formel einsetzen und stets die Probe machen.';
  if (id.includes('potenz') || id.includes('wurzel'))
    return 'Gleiche Basis beim Multiplizieren: Exponenten addieren. Bruch im Exponenten bedeutet Wurzel (Zähler = Potenz, Nenner = Wurzelexponent).';
  if (id.includes('ableit'))
    return 'Ableitung = Steigung. Produktregel: u\'v + uv\'. Quotientenregel: (u\'v - uv\') / v². Kettenregel: Äußere Ableitung mal innere Ableitung.';
  if (id.includes('integral'))
    return 'Hauptsatz: Bestimmtes Integral von a bis b ist F(b) - F(a). Integrieren ist die Umkehrung des Ableitens.';
  if (id.includes('zins'))
    return 'Zinseszinsformel: Kn = K0 · (1 + i)^n. Bei unterjähriger Verzinsung mit m Perioden: Kn = K0 · (1 + i/m)^(m·n).';
  return 'In Ruhe lesen, das Beispiel nachrechnen, dann die Übungsaufgabe lösen und jeden Zwischenschritt notieren.';
}

function getCommonMistake(topic: TopicDetail): string {
  if (!topic) return '';
  const id = String((topic as any)?.id ?? '').toLowerCase();
  if (id.includes('kosten') || id.includes('gewinn'))
    return 'Häufiger Klausurfehler: Erlös E(x) = p(x) · x mit dem reinen Preis p(x) verwechseln oder beim Abziehen der Kosten die Klammer vergessen (G = E - (K)).';
  if (id.includes('quadrat'))
    return 'Häufiger Klausurfehler: Die p-q-Formel anwenden, bevor durch die Zahl vor x² geteilt wurde, oder Vorzeichen unter der Wurzel vertauschen (-(-q) wird +q).';
  if (id.includes('potenz') || id.includes('wurzel'))
    return 'Häufiger Klausurfehler: (a + b)² als a² + b² schreiben. Richtig ist die binomische Formel: a² + 2ab + b².';
  if (id.includes('ableit'))
    return 'Häufiger Klausurfehler: Beim Ableiten von Brüchen einfach Zähler und Nenner separat ableiten. Unbedingt Quotientenregel anwenden!';
  if (id.includes('zins'))
    return 'Häufiger Klausurfehler: Zinssatz p in Prozent statt als Dezimalzahl (z.B. 0,05 statt 5) in die Formel einsetzen.';
  return 'Häufiger Klausurfehler: Zu schnell kopflos rechnen statt die Aufgabe ruhig in Gegeben, Gesucht und Formel zu zerlegen.';
}

// --- Formatierter Fließtext: Absätze + **bold** + mathematische Formeln ---
export function renderFormattedText(text: string): React.ReactNode {
  if (!text || typeof text !== 'string') return null;
  const paragraphs = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  if (paragraphs.length === 0) return null;
  return (
    <>
      {paragraphs.map((para, idx) => {
        const parts = para.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={idx} className="mb-4 last:mb-0 leading-[1.75] text-slate-200">
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
                return (
                  <strong key={j} className="font-semibold text-slate-50">
                    <FormattedMathText text={part.slice(2, -2)} as="span" />
                  </strong>
                );
              }
              return <FormattedMathText key={j} text={part} as="span" />;
            })}
          </p>
        );
      })}
    </>
  );
}

// --- Graph in eigener Card mit echter Kurven-Registry ---
export function renderTopicGraph(topic: TopicDetail): React.ReactNode {
  // Lade didaktisch präzisen Graphen aus der Registry
  const registered = getGraphForTopic(topic.id, (topic as any)?.graph ?? (topic as any)?.graphConfig);
  const g: any = registered ?? (topic as any)?.graph ?? (topic as any)?.graphConfig ?? null;
  if (!g) return null;

  const title: string = g.title ?? 'Interaktiver Funktionsgraph';
  const description: string = g.description ?? '';
  const domain: [number, number] = Array.isArray(g.domain) ? (g.domain as [number, number]) : [-5, 5];
  const hasCurves = Array.isArray(g.curves) && g.curves.length > 0;
  const singleFn: ((x: number) => number) | undefined = typeof g.fn === 'function' ? g.fn : undefined;
  const singleName: string = g.fnName ?? title;

  return (
    <div className="overflow-hidden">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 sm:p-5 shadow-inner">
        <MathGraph
          curves={
            hasCurves
              ? g.curves
              : singleFn
              ? [{ name: singleName, fn: singleFn, color: '#38bdf8', strokeWidth: 2.5 }]
              : []
          }
          domain={domain}
          xAxisLabel={g.xAxisLabel}
          yAxisLabel={g.yAxisLabel}
          highlightPoints={g.highlightPoints}
          referenceLines={g.referenceLines}
        />
      </div>
      {description ? (
        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 text-xs leading-relaxed text-slate-400">
          <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
          <div>
            <FormattedMathText text={description} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
  badge,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10 text-sky-400"
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-bold tracking-tight text-white sm:text-lg">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p> : null}
        </div>
      </div>
      {badge && (
        <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-300">
          {badge}
        </span>
      )}
    </div>
  );
}

export const ModelSolutionCard: React.FC<{ modelSolution: ModelSolution; phaseTitle?: string }> = ({
  modelSolution,
  phaseTitle,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section aria-labelledby="lm-model-solution" className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-500/15 text-sky-300">
            <GraduationCap className="h-6 w-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-sky-400/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-sky-300">
                Geprüfte Klausur-Musterlösung
              </span>
            </div>
            <h3 id="lm-model-solution" className="mt-1 text-base font-bold text-white sm:text-lg">
              {modelSolution.title}
            </h3>
            {phaseTitle ? <p className="text-xs text-slate-400">{phaseTitle}</p> : null}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-xs font-bold text-sky-200 transition hover:bg-sky-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          aria-expanded={isOpen}
        >
          <span>{isOpen ? 'Musterlösung einklappen' : 'Vollständige Musterlösung anzeigen'}</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="mt-5 space-y-4 border-t border-slate-800 pt-5 text-slate-200">
          {modelSolution.context ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-sky-300">Aufgabenstellung</p>
              <div className="mt-2 text-sm leading-relaxed text-slate-200">
                <FormattedMathText text={modelSolution.context} />
              </div>
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            {modelSolution.given && modelSolution.given.length > 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-sky-400">Gegeben</p>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
                  {modelSolution.given.map((g, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-sky-400">•</span>
                      <FormattedMathText text={g} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {modelSolution.wanted && modelSolution.wanted.length > 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Gesucht</p>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
                  {modelSolution.wanted.map((w, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <FormattedMathText text={w} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {modelSolution.steps && modelSolution.steps.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Schritt-für-Schritt Lösungsweg
              </p>
              <div className="space-y-3">
                {modelSolution.steps.map((step) => (
                  <div key={step.stepNumber} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-xs font-bold text-sky-300">
                        {step.stepNumber}
                      </span>
                      <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                    </div>
                    {step.latex ? (
                      <div className="my-2.5 overflow-x-auto rounded-lg bg-slate-900/90 p-3 ring-1 ring-inset ring-slate-800">
                        <MathFormula formula={step.latex} block />
                      </div>
                    ) : null}
                    <div className="mt-1 text-sm leading-relaxed text-slate-300">
                      <FormattedMathText text={step.explanation} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Endergebnis</p>
            {modelSolution.resultLatex ? (
              <div className="my-2 overflow-x-auto">
                <MathFormula formula={modelSolution.resultLatex} block />
              </div>
            ) : null}
            <div className="mt-1 text-sm font-medium text-emerald-200">
              <FormattedMathText text={modelSolution.result} />
            </div>
          </div>

          {modelSolution.verification ? (
            <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-sky-400">Probe & Verifikation</p>
              <div className="mt-1 text-sm leading-relaxed text-slate-300">
                <FormattedMathText text={modelSolution.verification} />
              </div>
            </div>
          ) : null}

          {modelSolution.interpretation ? (
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Ökonomische Interpretation</p>
              <div className="mt-1 text-sm leading-relaxed text-slate-300">
                <FormattedMathText text={modelSolution.interpretation} />
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
};

export const LearningModule: React.FC<LearningModuleProps> = ({
  topic,
  phase,
  phaseTitle,
  onNextTopic,
  onPrevTopic,
  hasNextTopic = false,
  hasPrevTopic = false,
  onMarkCompleted,
  onToggleCompleted,
  isCompleted = false,
}) => {
  const safeTopic: TopicDetail =
    topic ?? {
      id: '',
      title: 'Thema',
      explanation: '',
      formulas: [],
      questions: [],
    };

  const resolvedPhaseTitle: string = phaseTitle ?? phase?.title ?? '';
  const formulas: FormulaItem[] = Array.isArray(safeTopic.formulas) ? safeTopic.formulas : [];
  const questions: QuizQuestionData[] = Array.isArray(safeTopic.questions) ? safeTopic.questions : [];
  const learningGoal = getLearningGoal(safeTopic);
  const everyday = getEverydayExample(safeTopic);
  const merksatz = getMerksatz(safeTopic);
  const mistake = getCommonMistake(safeTopic);

  // Prüfen, ob für dieses Thema ein Graph in der Registry oder im Objekt vorhanden ist
  const hasGraph: boolean = Boolean(
    getGraphForTopic(safeTopic.id) || (safeTopic as any)?.graph || (safeTopic as any)?.graphConfig
  );

  const handleComplete = () => {
    if (onToggleCompleted) {
      onToggleCompleted();
    } else if (onMarkCompleted && safeTopic.id) {
      onMarkCompleted(safeTopic.id);
    }
  };

  return (
    <div aria-labelledby="learning-topic-title" className="mx-auto w-full max-w-4xl space-y-6 pb-28">
      {/* Header-Card: H1 + Status + Lernziel */}
      <header className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-[#0f172a] to-slate-900 p-6 shadow-xl sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {resolvedPhaseTitle ? (
              <span className="inline-flex items-center rounded-full bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-300 ring-1 ring-inset ring-sky-400/20">
                {resolvedPhaseTitle}
              </span>
            ) : null}
            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-400/25">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Thema abgeschlossen</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 ring-1 ring-inset ring-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span>Noch offen</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleComplete}
            aria-pressed={isCompleted}
            className={`inline-flex min-h-[40px] items-center gap-2 rounded-xl px-4 py-1.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
              isCompleted
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20'
                : 'border border-slate-700 bg-slate-800 text-slate-200 hover:border-emerald-400 hover:text-emerald-300'
            }`}
          >
            <Check className="h-4 w-4" />
            <span>{isCompleted ? 'Als erledigt markiert' : 'Thema als erledigt markieren'}</span>
          </button>
        </div>

        <h1 id="learning-topic-title" className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-[2rem]">
          {safeTopic.title}
        </h1>

        <div className="mt-5 flex gap-3.5 rounded-2xl border border-sky-400/20 bg-sky-500/[0.06] p-4 sm:p-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-400/15 text-sky-400">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-sky-300">Dein Lernziel</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-200">{learningGoal}</p>
          </div>
        </div>
      </header>

      {/* ── Alltag-Card: Intuition ohne Fachworte ── */}
      <section aria-labelledby="lm-alltag" className="rounded-2xl border border-slate-800 bg-[#0f172a]/90 p-5 sm:p-6 shadow-sm">
        <SectionHeading
          icon={Coffee}
          title="Erstmal ganz in Ruhe: Alltags-Intuition"
          subtitle="Ein anschauliches Bild vorab – ganz ohne Fachchinesisch"
        />
        <h3 id="lm-alltag" className="sr-only">
          Alltagsbeispiel
        </h3>
        <p className="text-sm leading-relaxed text-slate-300 sm:text-[0.98rem]">{everyday}</p>
      </section>

      {/* ── Erklärung als Fließtext ── */}
      <section aria-labelledby="lm-erklaerung" className="rounded-2xl border border-slate-800 bg-[#0f172a]/90 p-5 sm:p-6 shadow-sm">
        <SectionHeading
          icon={BookOpen}
          title="Erklärung & mathematische Theorie"
          subtitle="Schritt für Schritt und nachvollziehbar formuliert"
        />
        <h3 id="lm-erklaerung" className="sr-only">
          Erklärung
        </h3>
        <div className="text-sm text-slate-200">
          {safeTopic.explanation ? (
            renderFormattedText(safeTopic.explanation)
          ) : (
            <p className="text-slate-400">Für dieses Thema liegt noch keine ausführliche Erklärung vor.</p>
          )}
        </div>
      </section>

      {/* ── Formeln als Highlight-Cards ── */}
      {formulas.length > 0 ? (
        <section aria-labelledby="lm-formeln" className="rounded-2xl border border-slate-800 bg-[#0f172a]/90 p-5 sm:p-6 shadow-sm">
          <SectionHeading
            icon={Sigma}
            title="Wichtige Formeln & Rechenregeln"
            subtitle={`${formulas.length} ${formulas.length === 1 ? 'Formel' : 'Formeln'} für dieses Thema`}
            badge="Klausurrelevant"
          />
          <h3 id="lm-formeln" className="sr-only">
            Wichtige Formeln
          </h3>
          <ul className="grid list-none gap-3 p-0 sm:grid-cols-2">
            {formulas.map((f, i) => (
              <li
                key={`${f.label}-${i}`}
                className="rounded-2xl border border-sky-400/20 bg-gradient-to-b from-sky-400/[0.08] to-slate-950/50 p-4"
              >
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
                  <span aria-hidden="true" className="inline-flex h-5 w-5 items-center justify-center rounded-lg bg-sky-400/15 text-xs font-bold text-sky-200">
                    {i + 1}
                  </span>
                  <span className="truncate">{f.label}</span>
                </p>
                <div className="mt-3 overflow-x-auto rounded-xl bg-slate-950/80 px-3 py-3 ring-1 ring-inset ring-slate-800 text-center">
                  <MathFormula latex={f.latex} />
                </div>
                {f.note ? (
                  <div className="mt-2 text-xs leading-relaxed text-slate-400">
                    <FormattedMathText text={f.note} as="span" />
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ── Interaktiver Graph mit echten Kurven ── */}
      {hasGraph ? (
        <section aria-labelledby="lm-graph" className="rounded-2xl border border-slate-800 bg-[#0f172a]/90 p-5 sm:p-6 shadow-sm">
          <SectionHeading
            icon={TrendingUp}
            title={(safeTopic.graph?.title as string) ?? 'Interaktiver Funktionsgraph'}
            subtitle="Visuell begreifen – Nullstellen, Steigungen & Verläufe im Koordinatensystem"
            badge="Interaktiv"
          />
          <h3 id="lm-graph" className="sr-only">
            Grafik zum Verstehen
          </h3>
          {renderTopicGraph(safeTopic)}
        </section>
      ) : null}

      {/* ── Merksatz + Typischer Klausurfehler ── */}
      <section aria-labelledby="lm-merk" className="grid gap-4 md:grid-cols-2">
        <h3 id="lm-merk" className="sr-only">
          Merksatz und Klausurfehler
        </h3>
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-5">
          <div className="flex items-center gap-2.5 text-amber-300">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
              <Star className="h-4 w-4" />
            </div>
            <p className="text-sm font-bold uppercase tracking-wider">Goldene Merkregel</p>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-amber-100/90 sm:text-sm">{merksatz}</p>
        </div>

        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.06] p-5">
          <div className="flex items-center gap-2.5 text-rose-300">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-400/15 text-rose-300">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <p className="text-sm font-bold uppercase tracking-wider">Typischer Klausurfehler</p>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-rose-100/90 sm:text-sm">{mistake}</p>
        </div>
      </section>

      {/* ── Übungsaufgaben des Themas ── */}
      {questions.length > 0 ? (
        <section aria-labelledby="lm-quiz" className="space-y-4">
          <SectionHeading
            icon={PenTool}
            title="Jetzt übst du: Übungsaufgaben"
            subtitle="Sofort ausprobieren, Hinweise nutzen und Rechenweg vergleichen"
            badge={`${questions.length} Aufgabe${questions.length > 1 ? 'n' : ''}`}
          />
          <h3 id="lm-quiz" className="sr-only">
            Übungsaufgaben
          </h3>
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <QuizQuestion
                key={(q as any)?.id ?? idx}
                question={q}
                questionNumber={idx + 1}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Geprüfte Klausur-Musterlösung der Phase ── */}
      {phase?.modelSolution ? (
        <ModelSolutionCard modelSolution={phase.modelSolution} phaseTitle={resolvedPhaseTitle} />
      ) : null}

      {/* ── Sticky Footer Bar ── */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800 bg-[#020617]/95 backdrop-blur-xl shadow-2xl">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onPrevTopic}
              disabled={!hasPrevTopic}
              aria-label="Vorheriges Thema"
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 text-xs font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-5"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Zurück</span>
            </button>
            <button
              type="button"
              onClick={onNextTopic}
              disabled={!hasNextTopic}
              aria-label="Nächstes Thema"
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border border-sky-400/30 bg-sky-400/10 px-4 text-xs font-bold text-sky-200 transition hover:bg-sky-400/20 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-5"
            >
              <span>Weiter</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleComplete}
            aria-pressed={isCompleted}
            className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
              isCompleted
                ? 'border border-emerald-400/30 bg-emerald-400/15 text-emerald-200'
                : 'bg-emerald-400 px-6 text-slate-950 hover:bg-emerald-300 shadow-md shadow-emerald-400/20'
            }`}
          >
            <Check className="h-4 w-4 stroke-[2.5]" />
            <span>{isCompleted ? 'Thema abgeschlossen ✓' : 'Als erledigt markieren'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
