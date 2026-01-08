export interface MemoryEntry {
  id: string;
  content: string;
  timestamp: number;
  tags?: string[];
  embedding?: number[]; // Placeholder for vector embedding
}

export interface MemoryQuery {
  text: string;
  limit?: number;
}

export interface IMemoryStore {
  store(content: string, tags?: string[]): Promise<MemoryEntry>;
  recall(query: MemoryQuery): Promise<MemoryEntry[]>;
}
