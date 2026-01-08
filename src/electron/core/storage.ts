import fs from 'fs/promises';
import path from 'path';
import { app } from 'electron';
import { MemoryEntry } from './types';

// Store memories in a dedicated file in the user's data directory
const DATA_DIR = path.join(app.getPath('userData'), 'memory');
const STORAGE_FILE = path.join(DATA_DIR, 'hippocampus.json');

export class LocalStorage {
  private cache: MemoryEntry[] | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
      console.error('Failed to create memory directory:', error);
    }
  }

  private async load(): Promise<MemoryEntry[]> {
    if (this.cache) return this.cache;

    try {
      const data = await fs.readFile(STORAGE_FILE, 'utf-8');
      this.cache = JSON.parse(data);
    } catch (error) {
      // If file doesn't exist or is invalid, return empty array
      this.cache = [];
    }
    return this.cache || [];
  }

  private async save(entries: MemoryEntry[]): Promise<void> {
    this.cache = entries;
    await fs.writeFile(STORAGE_FILE, JSON.stringify(entries, null, 2), 'utf-8');
  }

  async addEntry(entry: MemoryEntry): Promise<void> {
    const entries = await this.load();
    entries.push(entry);
    await this.save(entries);
  }

  async getAll(): Promise<MemoryEntry[]> {
    return this.load();
  }
}
