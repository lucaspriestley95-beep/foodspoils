import Dexie, { type Table } from 'dexie';

export interface FoodItem {
  id?: number;
  name: string;
  category: string;
  expiryDate: string | null; // YYYY-MM-DD or null for no expiry
  quantity: number;
  unit: string; // 'pcs', 'g', 'ml', 'bags', etc.
  notes?: string; // custom notes
  status: 'active' | 'consumed' | 'wasted';
  createdAt: number; // timestamp
}

export class FoodSpoilsDatabase extends Dexie {
  items!: Table<FoodItem>;

  constructor() {
    super('FoodSpoilsDatabase');
    this.version(1).stores({
      items: '++id, name, category, expiryDate, status, createdAt'
    });
  }
}

export const db = new FoodSpoilsDatabase();
