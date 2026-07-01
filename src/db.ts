import Dexie, { type Table } from 'dexie';

export interface FoodItem {
  id?: number;
  name: string;
  category: string;
  expiryDate: string; // YYYY-MM-DD
  quantity: number;
  unit: string; // 'pcs', 'g', 'ml', 'bags', etc.
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
