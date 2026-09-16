const STORAGE_KEYS = {
  COMPLETED_TOPICS: 'wima_completed_topics_v1',
  SOLVED_QUESTIONS: 'wima_solved_questions_v1',
  ACTIVE_TAB: 'wima_active_tab_v1',
  SELECTED_TOPIC: 'wima_selected_topic_v1',
  EXAM_TIMER_MINUTES: 'wima_exam_timer_v1',
};

export function loadCompletedTopics(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED_TOPICS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Fehler beim Laden der erledigten Themen aus localStorage:', err);
    return [];
  }
}

export function saveCompletedTopics(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_TOPICS, JSON.stringify(ids));
  } catch (err) {
    console.warn('Fehler beim Speichern der erledigten Themen:', err);
  }
}

export function loadSolvedQuestions(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SOLVED_QUESTIONS);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (err) {
    console.warn('Fehler beim Laden gelöster Prüfungsfragen:', err);
    return {};
  }
}

export function saveSolvedQuestions(solved: Record<string, boolean>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SOLVED_QUESTIONS, JSON.stringify(solved));
  } catch (err) {
    console.warn('Fehler beim Speichern gelöster Prüfungsfragen:', err);
  }
}

export function loadActiveTab(defaultTab: string = 'dashboard'): string {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB);
    return raw || defaultTab;
  } catch {
    return defaultTab;
  }
}

export function saveActiveTab(tab: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, tab);
  } catch {}
}

export function loadSelectedTopicId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_TOPIC);
  } catch {
    return null;
  }
}

export function saveSelectedTopicId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_TOPIC, id);
  } catch {}
}

export function resetAllProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_TOPICS);
    localStorage.removeItem(STORAGE_KEYS.SOLVED_QUESTIONS);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_TOPIC);
  } catch (err) {
    console.warn('Fehler beim Zurücksetzen des Fortschritts:', err);
  }
}

