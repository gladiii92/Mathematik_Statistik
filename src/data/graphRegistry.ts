export interface CurveConfig {
  name: string;
  fn: (x: number) => number;
  color?: string;
  strokeDasharray?: string;
  strokeWidth?: number;
}

export interface HighlightPoint {
  x: number;
  y: number;
  label?: string;
  color?: string;
}

export interface ReferenceLineConfig {
  x?: number;
  y?: number;
  label?: string;
  color?: string;
  strokeDasharray?: string;
}

export interface TopicGraphConfig {
  title: string;
  description: string;
  domain: [number, number];
  xAxisLabel: string;
  yAxisLabel: string;
  curves: CurveConfig[];
  highlightPoints?: HighlightPoint[];
  referenceLines?: ReferenceLineConfig[];
}

/** Hilfsfunktion für Gauß-Glocke */
function normalDensity(x: number, mean = 0, std = 1): number {
  const factor = 1 / (std * Math.sqrt(2 * Math.PI));
  const exponent = -0.5 * Math.pow((x - mean) / std, 2);
  return factor * Math.exp(exponent);
}

/** Hilfsfunktion Fakultät */
function fact(n: number): number {
  if (n <= 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

/** Hilfsfunktion Binomialkoeffizient */
function binom(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  return fact(n) / (fact(k) * fact(n - k));
}

export const topicGraphRegistry: Record<string, TopicGraphConfig> = {
  // --- Phase 0: Grundlagen ---
  'p0-potenzen-wurzeln': {
    title: 'Potenz- und Wurzelfunktionen im Vergleich',
    description: 'Vergleicht $y=x^2$, $y=x^3$ und $y=\\sqrt{x}$ für $x \\ge 0$. Potenzen wachsen für $x > 1$ rasch überproportional, während die Wurzelfunktion degressiv verläuft.',
    domain: [0, 3],
    xAxisLabel: 'x',
    yAxisLabel: 'y',
    curves: [
      { name: 'y = x²', fn: (x) => Math.pow(x, 2), color: '#38bdf8', strokeWidth: 2.5 },
      { name: 'y = x³', fn: (x) => Math.pow(x, 3), color: '#a78bfa', strokeWidth: 2.5 },
      { name: 'y = √x', fn: (x) => Math.sqrt(Math.max(0, x)), color: '#34d399', strokeWidth: 2.5 },
      { name: 'y = x (Winkelhalbierende)', fn: (x) => x, color: '#64748b', strokeDasharray: '3 3', strokeWidth: 1.5 },
    ],
    highlightPoints: [
      { x: 1, y: 1, label: 'Schnittpunkt (1|1)', color: '#fbbf24' },
      { x: 2, y: 4, label: 'x² = 4', color: '#38bdf8' },
      { x: 2, y: 1.414, label: '√2 ≈ 1,41', color: '#34d399' },
    ],
    referenceLines: [
      { x: 1, color: '#334155', strokeDasharray: '2 2', label: 'x = 1' },
      { y: 1, color: '#334155', strokeDasharray: '2 2', label: 'y = 1' },
    ],
  },

  'p0-quadratische-glg': {
    title: 'Parabel mit Nullstellen und Scheitelpunkt',
    description: 'Graph von $f(x) = x^2 - 4x - 5$. Die Nullstellen liegen bei $x_1 = -1$ und $x_2 = 5$. Der tiefste Punkt (Scheitelpunkt) liegt bei $S(2 | -9)$.',
    domain: [-3, 7],
    xAxisLabel: 'x',
    yAxisLabel: 'f(x)',
    curves: [
      { name: 'f(x) = x² - 4x - 5', fn: (x) => x * x - 4 * x - 5, color: '#38bdf8', strokeWidth: 3 },
    ],
    highlightPoints: [
      { x: -1, y: 0, label: 'Nullstelle x₁ = -1', color: '#34d399' },
      { x: 5, y: 0, label: 'Nullstelle x₂ = 5', color: '#34d399' },
      { x: 2, y: -9, label: 'Scheitelpunkt S(2 | -9)', color: '#fbbf24' },
      { x: 0, y: -5, label: 'y-Achsenabschnitt (0 | -5)', color: '#a78bfa' },
    ],
    referenceLines: [
      { y: 0, color: '#64748b', strokeDasharray: '4 4', label: 'x-Achse (y = 0)' },
      { x: 2, color: '#fbbf24', strokeDasharray: '3 3', label: 'Symmetrieachse x = 2' },
    ],
  },

  // --- Phase 1: Funktionen & Differenzialrechnung ---
  'p1-ableitungsregeln': {
    title: 'Funktion f(x) und Tangente im Punkt P(1 | -1)',
    description: "Graph der gebrochen-rationalen Funktion $f(x) = \\frac{x^2 - 3}{x + 1}$ und ihrer Tangente $t(x) = 1{,}5x - 2{,}5$ mit Steigung $f'(1) = 1{,}5$.",
    domain: [-0.6, 4],
    xAxisLabel: 'x',
    yAxisLabel: 'y',
    curves: [
      {
        name: 'f(x) = (x²-3)/(x+1)',
        fn: (x) => (Math.abs(x + 1) < 0.05 ? 0 : (x * x - 3) / (x + 1)),
        color: '#38bdf8',
        strokeWidth: 2.5,
      },
      {
        name: 'Tangente t(x) = 1,5x - 2,5',
        fn: (x) => 1.5 * x - 2.5,
        color: '#fb7185',
        strokeDasharray: '4 4',
        strokeWidth: 2,
      },
    ],
    highlightPoints: [
      { x: 1, y: -1, label: 'Berührpunkt P(1 | -1)', color: '#fbbf24' },
      { x: 1.732, y: 0, label: 'Nullstelle x = √3', color: '#34d399' },
    ],
    referenceLines: [
      { x: 1, color: '#475569', strokeDasharray: '2 2', label: 'x = 1' },
      { y: 0, color: '#475569', strokeDasharray: '2 2' },
    ],
  },

  'p1-oekonomische-anwendung': {
    title: 'Gewinnmaximierung: Erlös-, Kosten- und Gewinnkurve',
    description: 'Erlös $E(x) = 100x - 2x^2$, Kosten $K(x) = 20x + 300$, Gewinn $G(x) = E(x) - K(x)$. Das Gewinnmaximum liegt bei $x^* = 20$ mit $G_{max} = 500$.',
    domain: [0, 40],
    xAxisLabel: 'Menge x (ME)',
    yAxisLabel: 'GE / Pkt',
    curves: [
      { name: 'Erlös E(x)', fn: (x) => 100 * x - 2 * x * x, color: '#38bdf8', strokeWidth: 2.5 },
      { name: 'Kosten K(x)', fn: (x) => 20 * x + 300, color: '#fb7185', strokeWidth: 2 },
      { name: 'Gewinn G(x)', fn: (x) => -2 * x * x + 80 * x - 300, color: '#34d399', strokeWidth: 3 },
    ],
    highlightPoints: [
      { x: 20, y: 500, label: 'Gewinnmaximum (20 | 500)', color: '#34d399' },
      { x: 4.19, y: 0, label: 'Break-Even x ≈ 4,19', color: '#fbbf24' },
      { x: 35.81, y: 0, label: 'Gewinngrenze x ≈ 35,8', color: '#a78bfa' },
    ],
    referenceLines: [
      { y: 0, color: '#64748b', strokeDasharray: '3 3', label: 'Gewinnschwelle G = 0' },
      { x: 20, color: '#34d399', strokeDasharray: '2 2', label: 'x* = 20' },
    ],
  },

  'p1-integralrechnung': {
    title: 'Konsumenten- und Produzentenrente am Marktgleichgewicht',
    description: 'Nachfragekurve $p_N(x) = 50 - 2x$, Angebotskurve $p_A(x) = 10 + 2x$ und Gleichgewichtspreis $p_0 = 30$ bei $x_0 = 10$. Die Flächen stellen Wohlfahrtsrenten dar.',
    domain: [0, 20],
    xAxisLabel: 'Menge x',
    yAxisLabel: 'Preis p (GE)',
    curves: [
      { name: 'Nachfrage p_N(x) = 50 - 2x', fn: (x) => Math.max(0, 50 - 2 * x), color: '#38bdf8', strokeWidth: 2.5 },
      { name: 'Angebot p_A(x) = 10 + 2x', fn: (x) => 10 + 2 * x, color: '#34d399', strokeWidth: 2.5 },
      { name: 'Marktpreis p₀ = 30', fn: () => 30, color: '#fbbf24', strokeDasharray: '4 4', strokeWidth: 2 },
    ],
    highlightPoints: [
      { x: 10, y: 30, label: 'Gleichgewicht (10 | 30)', color: '#fbbf24' },
      { x: 0, y: 50, label: 'Prohibitivpreis (0 | 50)', color: '#38bdf8' },
      { x: 0, y: 10, label: 'Mindestangebotspreis (0 | 10)', color: '#34d399' },
    ],
    referenceLines: [
      { x: 10, color: '#fbbf24', strokeDasharray: '3 3', label: 'x₀ = 10' },
      { y: 30, color: '#fbbf24', strokeDasharray: '3 3', label: 'p₀ = 30' },
    ],
  },

  // --- Phase 2: Finanzmathematik ---
  'p2-zinseszins': {
    title: 'Zinseszinseffekt: Lineares vs. Exponentielles Wachstum',
    description: 'Vergleich der Kapitalentwicklung bei $K_0 = 1.000$ € und $p = 6$ % über 25 Jahre. Der Zinseszinseffekt lässt das Kapital exponentiell steigen.',
    domain: [0, 25],
    xAxisLabel: 'Laufzeit t (Jahre)',
    yAxisLabel: 'Kapital K(t) in €',
    curves: [
      { name: 'Zinseszins K(t) = 1000·(1,06)^t', fn: (t) => 1000 * Math.pow(1.06, t), color: '#34d399', strokeWidth: 3 },
      { name: 'Linearer Zins K(t) = 1000·(1 + 0,06·t)', fn: (t) => 1000 * (1 + 0.06 * t), color: '#38bdf8', strokeWidth: 2, strokeDasharray: '4 4' },
      { name: 'Ausgangskapital K₀ = 1000 €', fn: () => 1000, color: '#64748b', strokeDasharray: '2 2', strokeWidth: 1.5 },
    ],
    highlightPoints: [
      { x: 10, y: 1790.85, label: 't=10: 1.791 € (Zinseszins)', color: '#34d399' },
      { x: 10, y: 1600, label: 't=10: 1.600 € (Linear)', color: '#38bdf8' },
      { x: 25, y: 4291.87, label: 't=25: 4.292 € (Vervierfachung!)', color: '#34d399' },
    ],
    referenceLines: [
      { x: 10, color: '#475569', strokeDasharray: '3 3', label: '10 Jahre' },
      { x: 20, color: '#475569', strokeDasharray: '3 3', label: '20 Jahre' },
    ],
  },

  'p2-renten-annuitaeten': {
    title: 'Annuitätentilgung: Sinkender Zins- vs. Steigender Tilgungsanteil',
    description: 'Aufteilung der konstanten Annuität (1.200 €) über 10 Perioden: Mit sinkender Restschuld nimmt der Zinsanteil ab, während die Tilgung dynamisch ansteigt.',
    domain: [1, 10],
    xAxisLabel: 'Periode t (Jahre)',
    yAxisLabel: 'Zahlungsstrom in €',
    curves: [
      { name: 'Konstante Annuität A = 1200 €', fn: () => 1200, color: '#38bdf8', strokeWidth: 2.5 },
      { name: 'Zinsanteil Z(t) (sinkend)', fn: (t) => 600 * Math.exp(-0.16 * (t - 1)), color: '#fb7185', strokeWidth: 2.5 },
      { name: 'Tilgungsanteil T(t) (steigend)', fn: (t) => 1200 - 600 * Math.exp(-0.16 * (t - 1)), color: '#34d399', strokeWidth: 2.5 },
    ],
    highlightPoints: [
      { x: 1, y: 600, label: 'Start: 50% Zins, 50% Tilgung', color: '#fbbf24' },
      { x: 10, y: 142, label: 'Jahr 10: Zins nur noch 142 €', color: '#fb7185' },
      { x: 10, y: 1058, label: 'Jahr 10: Tilgung 1.058 €', color: '#34d399' },
    ],
    referenceLines: [
      { y: 1200, color: '#38bdf8', strokeDasharray: '2 2', label: 'Annuität 1.200 €' },
    ],
  },

  // --- Phase 3: Lineare Algebra ---
  'p3-matrizen-vektoren': {
    title: 'Lineare Vektortransformation und Richtungsvektoren',
    description: 'Visualisierung der Vektoren $\\vec{u} = (2 | 1)$, gestreckter Vektor $2\\vec{u} = (4 | 2)$ und transformierter Vektor $A\\vec{u} = (1 | 3)$ im Koordinatensystem.',
    domain: [0, 5],
    xAxisLabel: 'x₁',
    yAxisLabel: 'x₂',
    curves: [
      { name: 'Richtungsgerade v (Steigung 0,5)', fn: (x) => 0.5 * x, color: '#38bdf8', strokeWidth: 2 },
      { name: 'Transformierte Richtung A·v (Steigung 3)', fn: (x) => 3 * x, color: '#a78bfa', strokeWidth: 2 },
      { name: 'Referenz x₂ = x₁', fn: (x) => x, color: '#64748b', strokeDasharray: '3 3', strokeWidth: 1.5 },
    ],
    highlightPoints: [
      { x: 2, y: 1, label: 'Vektor u = (2 | 1)', color: '#38bdf8' },
      { x: 4, y: 2, label: 'Skalierung 2u = (4 | 2)', color: '#34d399' },
      { x: 1, y: 3, label: 'Transformation A·u = (1 | 3)', color: '#a78bfa' },
    ],
    referenceLines: [
      { x: 2, color: '#334155', strokeDasharray: '2 2' },
      { y: 1, color: '#334155', strokeDasharray: '2 2' },
    ],
  },

  'p3-lgs-gauss': {
    title: 'Schnittpunkt zweier Geraden (Lösungsmenge des LGS)',
    description: 'Grafische Lösung des linearen Gleichungssystems: $g_1: y = 2x - 8$ und $g_2: y = -0{,}5x + 7$. Der eindeutige Schnittpunkt liegt bei $(6 | 4)$.',
    domain: [0, 10],
    xAxisLabel: 'x',
    yAxisLabel: 'y',
    curves: [
      { name: 'g₁(x) = 2x - 8', fn: (x) => 2 * x - 8, color: '#38bdf8', strokeWidth: 2.5 },
      { name: 'g₂(x) = -0,5x + 7', fn: (x) => -0.5 * x + 7, color: '#34d399', strokeWidth: 2.5 },
    ],
    highlightPoints: [
      { x: 6, y: 4, label: 'Schnittpunkt S(6 | 4) = Eindeutige Lösung', color: '#fbbf24' },
      { x: 4, y: 0, label: 'Nullstelle g₁: x = 4', color: '#38bdf8' },
      { x: 0, y: 7, label: 'Achsenabschnitt g₂: y = 7', color: '#34d399' },
    ],
    referenceLines: [
      { x: 6, color: '#fbbf24', strokeDasharray: '3 3', label: 'x = 6' },
      { y: 4, color: '#fbbf24', strokeDasharray: '3 3', label: 'y = 4' },
      { y: 0, color: '#64748b', strokeDasharray: '2 2' },
    ],
  },

  // --- Phase 4: Deskriptive Statistik ---
  'p4-lage-streuung': {
    title: 'Dichteverteilung mit Mittelwert, Median und Standardabweichung',
    description: 'Glockenförmige Häufigkeitsverteilung mit Mittelwert $\\bar{x} = 10$ und Standardabweichung $s = 2$. Der Bereich $\\bar{x} \\pm 1s$ umfasst rund 68 % der Werte.',
    domain: [4, 16],
    xAxisLabel: 'Merkmal x',
    yAxisLabel: 'Dichte f(x)',
    curves: [
      { name: 'Verteilungsdichte f(x) (s = 2)', fn: (x) => normalDensity(x, 10, 2), color: '#38bdf8', strokeWidth: 3 },
      { name: 'Vergleich mit höherer Streuung (s = 3)', fn: (x) => normalDensity(x, 10, 3), color: '#a78bfa', strokeDasharray: '4 4', strokeWidth: 2 },
    ],
    highlightPoints: [
      { x: 10, y: normalDensity(10, 10, 2), label: 'Mittelwert & Median x̄ = 10', color: '#fbbf24' },
      { x: 8, y: normalDensity(8, 10, 2), label: 'x̄ - 1s = 8', color: '#34d399' },
      { x: 12, y: normalDensity(12, 10, 2), label: 'x̄ + 1s = 12', color: '#34d399' },
    ],
    referenceLines: [
      { x: 10, color: '#fbbf24', strokeDasharray: '3 3', label: 'Mittelwert x̄ = 10' },
      { x: 8, color: '#34d399', strokeDasharray: '2 2', label: '-1s (8)' },
      { x: 12, color: '#34d399', strokeDasharray: '2 2', label: '+1s (12)' },
    ],
  },

  'p4-korrelation-regression': {
    title: 'Streudiagramm mit kleinster-Quadrate (OLS) Regressionsgerade',
    description: 'Lineare Regression $\\hat{y} = 2{,}5 + 0{,}75x$ mit Beobachtungspunkten. Das Bestimmtheitsmaß $R^2 \\approx 0{,}88$ zeigt einen starken linearen Zusammenhang.',
    domain: [0, 10],
    xAxisLabel: 'x (z. B. Werbeausgaben in Tsd. €)',
    yAxisLabel: 'y (z. B. Umsatz in Tsd. €)',
    curves: [
      { name: 'Regressionsgerade ŷ = 2,5 + 0,75x', fn: (x) => 2.5 + 0.75 * x, color: '#38bdf8', strokeWidth: 3 },
      { name: 'Obere Konfidenzgrenze (+1s)', fn: (x) => 3.5 + 0.75 * x, color: '#64748b', strokeDasharray: '3 3', strokeWidth: 1.5 },
      { name: 'Untere Konfidenzgrenze (-1s)', fn: (x) => 1.5 + 0.75 * x, color: '#64748b', strokeDasharray: '3 3', strokeWidth: 1.5 },
    ],
    highlightPoints: [
      { x: 1, y: 3.2, label: 'Punkt 1 (1 | 3,2)', color: '#fbbf24' },
      { x: 2.5, y: 4.5, label: 'Punkt 2 (2,5 | 4,5)', color: '#fbbf24' },
      { x: 4, y: 5.3, label: 'Punkt 3 (4 | 5,3)', color: '#fbbf24' },
      { x: 6, y: 7.1, label: 'Punkt 4 (6 | 7,1)', color: '#fbbf24' },
      { x: 8, y: 8.4, label: 'Punkt 5 (8 | 8,4)', color: '#fbbf24' },
      { x: 9.5, y: 9.8, label: 'Punkt 6 (9,5 | 9,8)', color: '#fbbf24' },
    ],
    referenceLines: [
      { y: 2.5, color: '#475569', strokeDasharray: '2 2', label: 'Achsenabschnitt a = 2,5' },
    ],
  },

  // --- Phase 5: Wahrscheinlichkeitsrechnung & Kombinatorik ---
  'p5-kombinatorik-grundlagen': {
    title: 'Wahrscheinlichkeitsverteilung: Binomialverteilung B(n=10, p=0,4)',
    description: 'Wahrscheinlichkeitsfunktion $P(X = k) = \\binom{10}{k} \\cdot 0{,}4^k \\cdot 0{,}6^{10-k}$. Der Erwartungswert liegt bei $\\mu = n \\cdot p = 4$ Treffern.',
    domain: [0, 10],
    xAxisLabel: 'Anzahl Treffer k',
    yAxisLabel: 'P(X = k)',
    curves: [
      {
        name: 'Wahrscheinlichkeit P(X=k)',
        fn: (x) => {
          const k = Math.round(x);
          if (k < 0 || k > 10) return 0;
          return binom(10, k) * Math.pow(0.4, k) * Math.pow(0.6, 10 - k);
        },
        color: '#38bdf8',
        strokeWidth: 2.5,
      },
    ],
    highlightPoints: [
      { x: 4, y: binom(10, 4) * Math.pow(0.4, 4) * Math.pow(0.6, 6), label: 'Erwartungswert μ = 4 (P ≈ 25,1 %)', color: '#34d399' },
      { x: 3, y: binom(10, 3) * Math.pow(0.4, 3) * Math.pow(0.6, 7), label: 'k = 3 (P ≈ 21,5 %)', color: '#fbbf24' },
      { x: 5, y: binom(10, 5) * Math.pow(0.4, 5) * Math.pow(0.6, 5), label: 'k = 5 (P ≈ 20,1 %)', color: '#fbbf24' },
    ],
    referenceLines: [
      { x: 4, color: '#34d399', strokeDasharray: '3 3', label: 'Erwartungswert μ = 4' },
    ],
  },

  'p5-diskrete-stetige-verteilungen': {
    title: 'Gaußsche Standardnormalverteilung φ(z) mit Konfidenzintervallen',
    description: 'Dichtefunktion $\\varphi(z) = \\frac{1}{\\sqrt{2\\pi}} e^{-z^2/2}$. In $\\pm 1\\sigma$ liegen 68,3 %, in $\\pm 2\\sigma$ 95,4 % aller Werte.',
    domain: [-3.5, 3.5],
    xAxisLabel: 'Standardisierte Variable z',
    yAxisLabel: 'Dichte φ(z)',
    curves: [
      { name: 'Standardnormalverteilung φ(z)', fn: (z) => normalDensity(z, 0, 1), color: '#38bdf8', strokeWidth: 3 },
    ],
    highlightPoints: [
      { x: 0, y: 0.3989, label: 'Maximum bei z = 0 (φ ≈ 0,399)', color: '#fbbf24' },
      { x: 1, y: normalDensity(1, 0, 1), label: '+1σ (Wendepunkt)', color: '#34d399' },
      { x: -1, y: normalDensity(-1, 0, 1), label: '-1σ (Wendepunkt)', color: '#34d399' },
      { x: 1.96, y: normalDensity(1.96, 0, 1), label: 'z = 1,96 (95 % Schranke)', color: '#a78bfa' },
    ],
    referenceLines: [
      { x: 0, color: '#fbbf24', strokeDasharray: '3 3', label: 'μ = 0' },
      { x: -1, color: '#34d399', strokeDasharray: '2 2', label: '-1σ' },
      { x: 1, color: '#34d399', strokeDasharray: '2 2', label: '+1σ' },
      { x: -1.96, color: '#a78bfa', strokeDasharray: '3 3', label: '-1,96 (2,5%)' },
      { x: 1.96, color: '#a78bfa', strokeDasharray: '3 3', label: '+1,96 (97,5%)' },
    ],
  },

  // --- Phase 6: Induktive Statistik & Hypothesentests ---
  'p6-hypothesentests': {
    title: 'Zweiseitiger Hypothesentest: Annahme- und Ablehnungsbereich (α = 5%)',
    description: 'Standardnormalverteilte Teststatistik $Z$. Der Annahmebereich von $H_0$ reicht von $-1{,}96$ bis $+1{,}96$. Ein Prüfwert $|z| > 1{,}96$ führt zur Verwerfung von $H_0$.',
    domain: [-3.5, 3.5],
    xAxisLabel: 'Prüfwert z',
    yAxisLabel: 'Dichte f(z)',
    curves: [
      { name: 'Prüfverteilung unter H₀: N(0, 1)', fn: (z) => normalDensity(z, 0, 1), color: '#38bdf8', strokeWidth: 3 },
    ],
    highlightPoints: [
      { x: -1.96, y: normalDensity(-1.96, 0, 1), label: 'Kritischer Wert z_unt = -1,96', color: '#fb7185' },
      { x: 1.96, y: normalDensity(1.96, 0, 1), label: 'Kritischer Wert z_ob = +1,96', color: '#fb7185' },
      { x: 2.25, y: normalDensity(2.25, 0, 1), label: 'Beispiel: z_emp = 2,25 (H₀ abgelehnt!)', color: '#f43f5e' },
      { x: 0.85, y: normalDensity(0.85, 0, 1), label: 'Beispiel: z_emp = 0,85 (H₀ beibehalten)', color: '#34d399' },
    ],
    referenceLines: [
      { x: -1.96, color: '#fb7185', strokeDasharray: '4 4', label: 'α/2 = 2,5%' },
      { x: 1.96, color: '#fb7185', strokeDasharray: '4 4', label: 'α/2 = 2,5%' },
      { x: 0, color: '#64748b', strokeDasharray: '2 2', label: 'Erwartungswert H₀' },
    ],
  },
};

/**
 * Holt die vollständige mathematische Graphen-Konfiguration für ein Thema.
 */
export function getGraphForTopic(topicId: string, fallbackMeta?: { title?: string; description?: string }): TopicGraphConfig | null {
  if (topicGraphRegistry[topicId]) {
    const reg = topicGraphRegistry[topicId];
    return {
      ...reg,
      title: fallbackMeta?.title || reg.title,
      description: fallbackMeta?.description || reg.description,
    };
  }
  return null;
}

