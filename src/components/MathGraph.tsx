import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceDot,
  Legend,
} from 'recharts';

export interface CurveConfig {
  /** Eindeutiger Name oder Bezeichner der Kurve (z.B. "f(x) = x²") */
  name: string;
  /** Mathematische Funktion f(x) */
  fn: (x: number) => number;
  /** Linienfarbe (Standard: Palette) */
  color?: string;
  /** Gestrichelte Linie (z.B. "5 5") */
  strokeDasharray?: string;
  /** Strichstärke */
  strokeWidth?: number;
}

export interface HighlightPoint {
  x: number;
  y: number;
  label?: string;
  color?: string;
}

export interface MathGraphProps {
  /** Einzelfunktion (Kurzform für 1 Kurve) */
  fn?: (x: number) => number;
  /** Titel / Name der Einzelfunktion */
  fnName?: string;
  /** Mehrere Kurven gleichzeitig darstellen */
  curves?: CurveConfig[];
  /** Alternativer Definitionsbereich [xMin, xMax] */
  domain?: [number, number];
  /** Minimaler x-Wert (Standard: -5) */
  xMin?: number;
  /** Maximaler x-Wert (Standard: 5) */
  xMax?: number;
  /** Schrittweite oder Abtastpunkte */
  step?: number;
  /** Anzahl der Stützstellen (Standard: 100) */
  pointsCount?: number;
  /** Beschriftung der X-Achse (Standard: "x") */
  xAxisLabel?: string;
  /** Beschriftung der Y-Achse (Standard: "f(x)") */
  yAxisLabel?: string;
  /** Optionaler Grafiktitel */
  title?: string;
  /** Optionale Untertitel / Erklärung */
  subtitle?: string;
  /** Höhe des Diagramms in Pixeln (Standard: 320) */
  height?: number;
  /** Horizontale Referenzlinien (z. B. y = 0) */
  refLinesY?: Array<{ y: number; label?: string; color?: string; strokeDasharray?: string }>;
  /** Vertikale Referenzlinien (z. B. x = 0 oder Polstellen) */
  refLinesX?: Array<{ x: number; label?: string; color?: string; strokeDasharray?: string }>;
  /** Allgemeine Referenzlinien (automatisch x oder y zugeordnet) */
  referenceLines?: Array<{ x?: number; y?: number; label?: string; color?: string; strokeDasharray?: string }>;
  /** Hervorgehobene Punkte (z. B. Hochpunkte, Nullstellen, Break-Even) */
  highlightPoints?: HighlightPoint[];
  /** Optionale CSS-Klasse für Container */
  className?: string;
}

const FALLBACK_PALETTE = ['#38bdf8', '#a78bfa', '#34d399', '#fbbf24', '#fb7185', '#22d3ee'];

export const MathGraph: React.FC<MathGraphProps> = ({
  fn,
  fnName = 'f(x)',
  curves,
  domain,
  xMin: propXMin,
  xMax: propXMax,
  step,
  pointsCount = 100,
  xAxisLabel = 'x',
  yAxisLabel = 'f(x)',
  title,
  subtitle,
  height = 320,
  refLinesY = [{ y: 0, color: '#94a3b8', strokeDasharray: '3 3' }],
  refLinesX = [{ x: 0, color: '#94a3b8', strokeDasharray: '3 3' }],
  referenceLines,
  highlightPoints,
  className = '',
}) => {
  const _rawXMin = domain ? domain[0] : (propXMin ?? -5);
  const _rawXMax = domain ? domain[1] : (propXMax ?? 5);
  const xMin = Number.isFinite(_rawXMin) ? (_rawXMin as number) : -5;
  const xMax = Number.isFinite(_rawXMax) ? (_rawXMax as number) : 5;
  const safeHeight = Number.isFinite(height) && (height as number) >= 160 ? (height as number) : 320;
  const safePointsCount = Number.isFinite(pointsCount) && (pointsCount as number) >= 2 ? Math.floor(pointsCount as number) : 100;

  const effectiveRefLinesY = useMemo(() => {
    const list = [...(refLinesY || [])];
    if (referenceLines) {
      referenceLines.forEach((r) => {
        if (r.y !== undefined) {
          list.push({ y: r.y, label: r.label, color: r.color, strokeDasharray: r.strokeDasharray });
        }
      });
    }
    return list;
  }, [refLinesY, referenceLines]);

  const effectiveRefLinesX = useMemo(() => {
    const list = [...(refLinesX || [])];
    if (referenceLines) {
      referenceLines.forEach((r) => {
        if (r.x !== undefined) {
          list.push({ x: r.x, label: r.label, color: r.color, strokeDasharray: r.strokeDasharray });
        }
      });
    }
    if (highlightPoints) {
      highlightPoints.forEach((p) => {
        list.push({
          x: p.x,
          label: p.label || `(${p.x} | ${p.y})`,
          color: p.color || '#eab308',
          strokeDasharray: '2 2',
        });
      });
    }
    return list;
  }, [refLinesX, referenceLines, highlightPoints]);

  // Kurven-Konfigurationen vereinheitlichen
  const activeCurves: CurveConfig[] = useMemo(() => {
    if (curves && curves.length > 0) {
      return curves;
    }
    if (fn) {
      return [
        {
          name: fnName,
          fn,
          color: '#38bdf8',
          strokeWidth: 2,
        },
      ];
    }
    return [];
  }, [curves, fn, fnName]);

  const coloredCurves = useMemo(
    () =>
      activeCurves.map((c, i) => ({
        ...c,
        color: c.color || FALLBACK_PALETTE[i % FALLBACK_PALETTE.length],
        strokeWidth: c.strokeWidth ?? 2,
      })),
    [activeCurves]
  );

  const chartData = useMemo(() => {
    if (coloredCurves.length === 0) return [];
    const span = xMax - xMin;
    const count = step && step > 0 ? Math.min(400, Math.max(2, Math.ceil(span / step))) : safePointsCount;
    const rows: Array<Record<string, number | null>> = [];
    for (let i = 0; i < count; i++) {
      const x = count === 1 ? xMin : xMin + (i * span) / (count - 1);
      const row: Record<string, number | null> = { x };
      coloredCurves.forEach((c) => {
        try {
          const y = c.fn(x);
          row[c.name] = Number.isFinite(y) ? (y as number) : null;
        } catch {
          row[c.name] = null;
        }
      });
      rows.push(row);
    }
    return rows;
  }, [coloredCurves, xMin, xMax, step, safePointsCount]);

  const ariaLabel = title || subtitle || `Graph mit ${coloredCurves.length} Kurven im Bereich ${xMin} bis ${xMax}`;

  return (
    <section
      aria-label={typeof ariaLabel === 'string' ? ariaLabel : 'Funktionsgraph'}
      className={`overflow-hidden rounded-xl border border-slate-700/70 bg-slate-900 shadow-sm ${className}`}
    >
      {(title || subtitle) && (
        <header className="border-b border-slate-800 bg-slate-900/80 px-4 py-3 sm:px-5">
          {title && (
            <h3 className="text-sm font-semibold tracking-tight text-slate-100 sm:text-[15px]">{title}</h3>
          )}
          {subtitle && <p className="mt-0.5 text-[13px] leading-relaxed text-slate-400">{subtitle}</p>}
        </header>
      )}

      {coloredCurves.length === 0 ? (
        <div
          role="status"
          className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center"
        >
          <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-slate-600 bg-slate-800/60 text-xl">
            📈
          </span>
          <p className="text-sm font-medium text-slate-200">Keine Kurven zum Anzeigen</p>
          <p className="max-w-xs text-xs leading-relaxed text-slate-400">
            Übergebe <code className="rounded bg-slate-800 px-1 font-mono text-sky-300">fn</code> oder{' '}
            <code className="rounded bg-slate-800 px-1 font-mono text-sky-300">curves</code>, um den Graphen zu zeichnen.
          </p>
        </div>
      ) : (
        <figure className="m-0 px-2 pb-2 pt-4 sm:px-3">
          <div className="w-full" style={{ height: safeHeight }}>
            <ResponsiveContainer width="100%" height={safeHeight}>
              <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 24, left: 8 }}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="x"
                  type="number"
                  domain={[xMin, xMax]}
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickLine={{ stroke: '#334155' }}
                  axisLine={{ stroke: '#334155' }}
                  tickCount={7}
                  label={
                    xAxisLabel
                      ? { value: xAxisLabel, position: 'insideBottomRight', offset: -12, fill: '#64748b', fontSize: 12 }
                      : undefined
                  }
                />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickLine={{ stroke: '#334155' }}
                  axisLine={{ stroke: '#334155' }}
                  width={48}
                  label={
                    yAxisLabel
                      ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }
                      : undefined
                  }
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: 12,
                    color: '#f8fafc',
                    fontSize: 13,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
                    padding: '10px 12px',
                  }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 600, marginBottom: 4 }}
                  itemStyle={{ color: '#e2e8f0' }}
                  cursor={{ stroke: '#334155', strokeDasharray: '4 4' }}
                  labelFormatter={(v: any) => `x = ${Number(v).toFixed(2)}`}
                  formatter={(value: any, name: any) => [
                    typeof value === 'number' ? value.toFixed(3) : String(value ?? '–'),
                    name,
                  ]}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ paddingTop: 8 }}
                  content={(props: any) => (
                    <div className="flex flex-wrap items-center justify-center gap-2 px-2 pt-2" role="list" aria-label="Legende">
                      {(props?.payload ?? coloredCurves.map((c) => ({ value: c.name, color: c.color }))).map(
                        (entry: any, idx: number) => (
                          <span
                            key={String(entry.value ?? idx)}
                            role="listitem"
                            className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-xs font-medium text-slate-200"
                          >
                            <span
                              aria-hidden="true"
                              className="h-2.5 w-2.5 shrink-0 rounded-full"
                              style={{ backgroundColor: entry.color || entry.payload?.stroke || '#38bdf8' }}
                            />
                            {entry.value}
                          </span>
                        )
                      )}
                    </div>
                  )}
                />
                {effectiveRefLinesY.map((r, i) => (
                  <ReferenceLine
                    key={`ry-${i}`}
                    y={r.y}
                    stroke={r.color || '#475569'}
                    strokeDasharray={r.strokeDasharray || '3 3'}
                    label={r.label ? { value: r.label, fill: '#94a3b8', fontSize: 11, position: 'insideTopRight' } : undefined}
                  />
                ))}
                {effectiveRefLinesX.map((r, i) => (
                  <ReferenceLine
                    key={`rx-${i}`}
                    x={r.x}
                    stroke={r.color || '#475569'}
                    strokeDasharray={r.strokeDasharray || '3 3'}
                    label={r.label ? { value: r.label, fill: '#94a3b8', fontSize: 11, position: 'insideTopRight' } : undefined}
                  />
                ))}
                {coloredCurves.map((c) => (
                  <Line
                    key={c.name}
                    type="monotone"
                    dataKey={c.name}
                    name={c.name}
                    dot={false}
                    connectNulls
                    stroke={c.color}
                    strokeWidth={c.strokeWidth}
                    strokeDasharray={c.strokeDasharray}
                    activeDot={{ r: 4, strokeWidth: 2, stroke: '#020617' }}
                  />
                ))}
                {(highlightPoints || []).map((p, i) => (
                  <ReferenceDot
                    key={`hp-${i}`}
                    x={p.x}
                    y={p.y}
                    r={5}
                    fill={p.color || '#eab308'}
                    stroke="#020617"
                    strokeWidth={2}
                    label={p.label ? { value: p.label, fill: '#e2e8f0', fontSize: 11, position: 'top' } : undefined}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <figcaption className="sr-only">
            {ariaLabel}. X von {xMin} bis {xMax}.
          </figcaption>
        </figure>
      )}
    </section>
  );
};

export default MathGraph;
