const STORAGE_KEY = 'bettermix:history';

export interface HistoryEntry {
  id: string;
  ts: number;
  filename: string;
  size: number;
  service: "mastering_preview" | "enhance_preview" | "analysis";
  estimatedCredits: number;
  resultUrl?: string;
  analysisSummary?: any;
}

export function addHistory(entry: HistoryEntry): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = listHistory();
    const updated = [entry, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save history entry:', error);
  }
}

export function listHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}

export function getHistoryEntry(id: string): HistoryEntry | null {
  const history = listHistory();
  return history.find(entry => entry.id === id) || null;
}