import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export interface MathFormulaProps {
  /** LaTeX-Formelstring */
  formula?: string;
  /** Alias für formula */
  latex?: string;
  /** Alias für formula */
  math?: string;
  /** LaTeX-String als Child */
  children?: string;
  /** Block-/Display-Modus (zentriert, abgesetzt) */
  block?: boolean;
  /** Inline-Modus (standardmäßig true, wenn block=false) */
  inline?: boolean;
  /** Optionale zusätzliche CSS-Klassen */
  className?: string;
  /** Optionale Inline-Styles */
  style?: React.CSSProperties;
}

export const MathFormula: React.FC<MathFormulaProps> = ({
  formula,
  latex,
  math,
  children,
  block = false,
  inline = false,
  className = '',
  style,
}) => {
  const rawExpression = String(formula ?? latex ?? math ?? (typeof children === 'string' ? children : '') ?? '');
  const isDisplayMode = block && !inline;

  const { html, error } = useMemo(() => {
    if (!rawExpression.trim()) {
      return { html: '', error: null as string | null };
    }
    try {
      const rendered = katex.renderToString(rawExpression, {
        displayMode: isDisplayMode,
        throwOnError: false,
        strict: false,
        trust: false,
        output: 'htmlAndMathml',
      });
      return { html: rendered, error: null as string | null };
    } catch (err: any) {
      return {
        html: '',
        error: err?.message || 'Ungültige LaTeX-Formel',
      };
    }
  }, [rawExpression, isDisplayMode]);

  if (error) {
    return (
      <span
        role="alert"
        aria-live="polite"
        aria-label={`LaTeX-Fehler, Original angezeigt: ${rawExpression}`}
        tabIndex={0}
        className={`math-formula-error inline-flex max-w-full items-center gap-1.5 overflow-x-auto whitespace-nowrap rounded-lg border border-red-600/60 bg-red-950/70 px-2.5 py-1.5 align-baseline text-xs font-mono text-red-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${className}`}
        title={`LaTeX-Syntaxfehler: ${error}`}
        style={style}
      >
        <span aria-hidden="true" className="shrink-0">⚠️</span>
        <code className="min-w-0 break-all">{rawExpression}</code>
        <span className="sr-only">Formel konnte nicht gerendert werden. Originaltext wird angezeigt.</span>
      </span>
    );
  }

  if (!rawExpression.trim() || !html) {
    return null;
  }

  if (isDisplayMode) {
    return (
      <div
        role="math"
        aria-label={rawExpression}
        aria-roledescription="mathematische Formel"
        tabIndex={0}
        className={`math-formula-block my-3 rounded-2xl border border-slate-800/90 bg-slate-950/80 px-4 py-3.5 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${className}`}
        style={style}
      >
        <div className="overflow-x-auto">
          <div
            className="mx-auto flex w-fit min-w-full items-center justify-center px-2 text-center leading-8 text-slate-100 [&_.katex]:text-slate-100 [&_.katex-display]:m-0"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    );
  }

  return (
    <span
      role="math"
      aria-label={rawExpression}
      className={`math-formula-inline inline-block max-w-full align-baseline px-0.5 text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 [&_.katex]:text-[1.02em] [&_.katex]:text-sky-200 ${className}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MathFormula;
