import type { AnalysisResult } from './detectService';

const STORAGE_KEY = 'fakeguard_history';
const MAX_ITEMS = 50;

export interface HistoryEntry {
  id: string;
  url: string;
  platform: string;
  platformIcon: string;
  username: string;
  trustScore: number;
  riskLevel: string;
  analyzedAt: string;
  result: AnalysisResult;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(url: string, result: AnalysisResult): HistoryEntry {
  const entry: HistoryEntry = {
    id: generateId(),
    url,
    platform: result.platform.name,
    platformIcon: result.platform.icon,
    username: result.username,
    trustScore: result.trustScore,
    riskLevel: result.riskLevel,
    analyzedAt: result.analyzedAt.toISOString(),
    result,
  };

  const history = getHistory();
  history.unshift(entry);
  if (history.length > MAX_ITEMS) history.length = MAX_ITEMS;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

  return entry;
}

export function deleteFromHistory(id: string): void {
  const history = getHistory().filter((h) => h.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getHistoryById(id: string): HistoryEntry | undefined {
  return getHistory().find((h) => h.id === id);
}
