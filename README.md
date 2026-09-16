# 📐 Wirtschaftsmathematik & Statistik — Interaktiver Klausur-Lernpfad

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![KaTeX](https://img.shields.io/badge/KaTeX-0.16-329894?logo=latex&logoColor=white)](https://katex.org/)

Eine moderne, interaktive Web-Applikation zur gezielten Vorbereitung auf die Klausur **Wirtschaftsmathematik & Statistik (1. Semester)** mit dem Zielbereich **Bestnote (1,0 – 1,7)**.

Das Projekt verbindet mathematische Theorie, intuitive Alltagsbeispiele, interaktive Funktionsgraphen und klausurtypische Prüfungsaufgaben in einem konsistenten, barrierefreien Dark-Mode-Design.

---

## 🌟 Kern-Features

### 1. 🧭 Didaktischer 7-Phasen-Lernpfad
Das gesamte Semestercurriculum ist in 7 didaktisch aufeinander aufbauende Phasen unterteilt:
- **Phase 0: Mathematische Grundlagen & Termumformungen** (Potenzgesetze, Wurzeln, Bruchterme, lineare Gleichungssysteme, quadratische Gleichungen & p-q-Formel).
- **Phase 1: Funktionen & Differentialrechnung** (Ökonomische Funktionen, Ableitungsregeln, Kurvendiskussion, Elastizitäten, Gewinn- und Kostenfunktionen).
- **Phase 2: Finanzmathematik & Zinsrechnung** (Einfache Verzinsung, Zinseszins, unterjährige Verzinsung, Rentenrechnung, Annuitäten- & Tilgungspläne).
- **Phase 3: Lineare Algebra & Matrizenrechnung** (Vektoren, Matrixmultiplikation, Inverse Matrizen, Gauss-Jordan-Algorithmus, Input-Output-Analyse / Leontief-Modelle).
- **Phase 4: Deskriptive Statistik & Kennzahlen** (Lagemaße wie Median & arithmetisches Mittel, Streuungsmaße wie Varianz & Standardabweichung, Lorenzkurve & Gini-Koeffizient, Korrelation & lineare Regression).
- **Phase 5: Wahrscheinlichkeitsrechnung & Kombinatorik** (Permutationen, Kombinationen, Bedingte Wahrscheinlichkeiten, Satz von Bayes, Binomial- & Normalverteilung).
- **Phase 6: Induktive Statistik & Hypothesentests** (Konfidenzintervalle für Mittelwerte und Anteilswerte, ein- und zweiseitige t-Tests, Signifikanzniveau $\alpha$, p-Wert-Entscheidungsregeln).

### 2. 🧠 Die 4-Schritte-Erfolgsmethode
Jede Lerneinheit führt Studierende systematisch durch 4 Stufen:
1. **Alltags-Intuition**: Das Konzept wird zunächst ohne Formelballast anhand realer Wirtschaftsszenarien greifbar erklärt.
2. **Theorie & Formeln**: Exakte mathematische Definitionen mit präzisem KaTeX-Formelsatz, Rechenschritten und goldenen Merkregeln.
3. **Graphisch sehen**: Interaktive 2D-Funktionsgraphen und Verteilungsdiagramme (Recharts) mit Live-Berechnung von Nullstellen, Scheitelpunkten, Tangenten und Integralen.
4. **Klausur lösen**: Direkte Übungsfragen zur Selbstkontrolle mit detailliertem Feedback und Fehlervermeidungstipps.

### 3. 📝 Integrierter Klausurtrainer (22 Prüfungsaufgaben)
- Authentische Prüfungsaufgaben aus dem Klausurarchiv für Wirtschaftsmathematik & Statistik.
- **Gestaffelte Hinweise**: 3-stufiges Hilfesystem (Tipp 1: Ansatz $\to$ Tipp 2: Formel $\to$ Tipp 3: Rechenweg), um selbstständiges Lösen zu fördern.
- **Vollständige Musterlösungen**: Detaillierte Schritt-für-Schritt-Rechnungen, exakte Endergebnisse, Plausibilitätsprüfungen und ökonomische Interpretationen.
- **Punktesystem & Notenprognose**: Automatisches Erfassen erreichter Klausurpunkte mit Live-Notenberechnung (1,0 bis 5,0) basierend auf offiziellen Notenskalen.

### 4. 🧮 Vollständige Formelsammlung
- Durchsuchbare Übersicht aller prüfungsrelevanten Formeln geordnet nach Phasen und Anwendungsgebieten.
- Direkte Notizen zu Klausurfallen, Definitionen und Randbedingungen.

### 5. 🎨 Harmonisches Slate & Sky Design-System
- Einheitliche, ruhige Farbpalette (Deep Slate `#020617` / `#0f172a` mit eleganten `Sky`-Akzenten).
- Semantische Farbkodierung (Smaragd für Erfolge/abgeschlossene Module, Bernstein für Merkregeln, Rose für Klausurfallen).
- Vollständig tastaturnavigierbar (`Tab`, Pfeiltasten, `Escape`, `Home`/`End`), Screenreader-optimierte ARIA-Labels und flüssiges Responsive Design (Desktop, Tablet & Mobile).
- Speicherung des Lernstands (abgeschlossene Lerneinheiten, gelöste Aufgaben, Punkte) im Browser via `localStorage`.

---

## 🛠️ Tech Stack

| Technologie | Verwendung |
| :--- | :--- |
| **React 18** | Deklarative Benutzeroberfläche und Komponentenarchitektur |
| **TypeScript 5.5** | Vollständige Typisierung aller Datenmodelle, mathematischer Schnittstellen und Events |
| **Vite 5.4** | Ultraschnelles Build-Tooling und HMR Entwicklungs-Server |
| **Tailwind CSS v4** | Modernes Styling mit Utilities, Responsive Breakpoints und Dark-Mode |
| **KaTeX 0.16** | Performantes und fehlerfreies Rendern mathematischer LaTeX-Formeln (Inline & Display) |
| **Recharts** | Interaktive Visualisierung von Graphen, Verteilungen und ökonomischen Funktionen |
| **Lucide React** | Konsistentes, barrierefreies Icon-Set |

---

## 📂 Projektstruktur

```plaintext
Mathemathik_Statistik/
├── src/
│   ├── components/              # Wiederverwendbare UI- & Fachkomponenten
│   │   ├── DashboardView.tsx    # Dashboard mit Fortschritt, Notenprognose & Phasen
│   │   ├── FormulaSheetView.tsx # Durchsuchbare Formelsammlung
│   │   ├── InteractiveGraph.tsx # Interaktive mathematische Funktionsgraphen
│   │   ├── LearningModule.tsx   # Didaktische Lerneinheit (Intuition, Theorie, Graphen)
│   │   ├── MathFormula.tsx      # KaTeX-Formelkomponente (Inline & Block)
│   │   ├── QuizQuestion.tsx     # Übungsaufgaben mit LaTeX-Parsing & Punktestand
│   │   └── TopicNavigation.tsx  # Linke Sidebar-Navigation mit Filter & Akkordeon
│   ├── data/
│   │   ├── examQuestions.json   # 22 Klausuraufgaben mit Musterlösungen & Hinweisen
│   │   ├── graphRegistry.ts     # Konfigurationen für Funktionsgraphen & Kurven
│   │   └── learningPlan.json    # Komplettes Curriculum aller 7 Phasen
│   ├── styles/
│   │   └── a11y-polish.css      # Barrierefreiheits- & Fokus-Styling
│   ├── utils/
│   │   └── storage.ts           # Persistierung in localStorage (Fortschritt & Noten)
│   ├── App.tsx                  # Hauptanwendung mit Navigation & Tab-Routing
│   ├── index.css                # Globale Styles & Tailwind Imports
│   └── main.tsx                 # App Mount Point
├── index.html                   # HTML-Template
├── package.json                 # Projektabhängigkeiten & Scripte
├── tsconfig.json                # TypeScript-Konfiguration
└── vite.config.ts               # Vite-Konfiguration
```

---

## 🚀 Schnellstart & Installation

### Voraussetzungen
- **Node.js** (Version 18 oder höher empfohlen)
- **npm** (oder yarn / pnpm)

### 1. Repository klonen
```bash
git clone https://github.com/gladiii92/Mathematik_Statistik.git
cd Mathematik_Statistik
```

### 2. Abhängigkeiten installieren
```bash
npm install
```

### 3. Entwicklungsserver starten
```bash
npm run dev
```
Die Anwendung ist nun unter `http://localhost:5173` im Browser erreichbar.

### 4. Produktions-Build erstellen & prüfen
```bash
npm run build
npm run preview
```

---

## 💡 Didaktisches Konzept

Mathematik und Statistik im Wirtschaftsstudium scheitern selten am guten Willen, sondern an der intuitiven Verknüpfung von Formeln mit realen Sachverhalten:
- Warum ist die erste Ableitung ökonomisch die **Grenzfunktion** (Grenzkosten, Grenzerlös)?
- Warum minimiert die **Methode der kleinsten Quadrate** die Summe der quadrierten Abweichungen?
- Was bedeutet ein **p-Wert $< 0{,}05$** für die Ablehnung der Nullhypothese im Marktforschungskontext?

Diese App schließt die Lücke zwischen abstrakter Hochschulmathematik und praxisorientierter Klausurvorbereitung.

---

## 📄 Lizenz

Dieses Projekt ist für Studien- und Lehrzwecke konzipiert. Frei nutzbar zur Klausurvorbereitung.
Erstellt von [@gladiii92](https://github.com/gladiii92).

