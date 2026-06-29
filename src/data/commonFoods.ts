export interface CommonFood {
  name: string;
  category: string;
  shelfLifeDays: number;
}

export const COMMON_FOODS: CommonFood[] = [
  // Dairy
  { name: 'Milk', category: 'dairy', shelfLifeDays: 7 },
  { name: 'Eggs', category: 'dairy', shelfLifeDays: 21 },
  { name: 'Yogurt', category: 'dairy', shelfLifeDays: 14 },
  { name: 'Cheese (Hard)', category: 'dairy', shelfLifeDays: 30 },
  { name: 'Cheese (Soft)', category: 'dairy', shelfLifeDays: 7 },
  { name: 'Butter', category: 'dairy', shelfLifeDays: 60 },
  { name: 'Cottage Cheese', category: 'dairy', shelfLifeDays: 7 },
  { name: 'Sour Cream', category: 'dairy', shelfLifeDays: 14 },

  // Produce
  { name: 'Baby Spinach', category: 'produce', shelfLifeDays: 5 },
  { name: 'Bananas', category: 'produce', shelfLifeDays: 4 },
  { name: 'Apples', category: 'produce', shelfLifeDays: 30 },
  { name: 'Strawberries', category: 'produce', shelfLifeDays: 3 },
  { name: 'Avocado', category: 'produce', shelfLifeDays: 4 },
  { name: 'Broccoli', category: 'produce', shelfLifeDays: 7 },
  { name: 'Carrots', category: 'produce', shelfLifeDays: 21 },
  { name: 'Lettuce', category: 'produce', shelfLifeDays: 5 },
  { name: 'Tomatoes', category: 'produce', shelfLifeDays: 7 },
  { name: 'Potatoes', category: 'produce', shelfLifeDays: 60 },
  { name: 'Onions', category: 'produce', shelfLifeDays: 60 },
  { name: 'Cucumber', category: 'produce', shelfLifeDays: 7 },
  { name: 'Bell Peppers', category: 'produce', shelfLifeDays: 7 },
  { name: 'Mushrooms', category: 'produce', shelfLifeDays: 5 },
  { name: 'Grapes', category: 'produce', shelfLifeDays: 10 },
  { name: 'Blueberries', category: 'produce', shelfLifeDays: 7 },
  { name: 'Spinach', category: 'produce', shelfLifeDays: 5 },
  { name: 'Kale', category: 'produce', shelfLifeDays: 7 },
  { name: 'Garlic', category: 'produce', shelfLifeDays: 120 },
  { name: 'Lemon', category: 'produce', shelfLifeDays: 14 },

  // Meat
  { name: 'Chicken Breast', category: 'meat', shelfLifeDays: 3 },
  { name: 'Ground Beef', category: 'meat', shelfLifeDays: 2 },
  { name: 'Steak', category: 'meat', shelfLifeDays: 4 },
  { name: 'Pork Chops', category: 'meat', shelfLifeDays: 3 },
  { name: 'Bacon', category: 'meat', shelfLifeDays: 7 },
  { name: 'Sausages', category: 'meat', shelfLifeDays: 3 },
  { name: 'Turkey Breast', category: 'meat', shelfLifeDays: 3 },
  { name: 'Ham', category: 'meat', shelfLifeDays: 5 },
  { name: 'Salami', category: 'meat', shelfLifeDays: 14 },

  // Seafood
  { name: 'Salmon', category: 'seafood', shelfLifeDays: 2 },
  { name: 'White Fish', category: 'seafood', shelfLifeDays: 2 },
  { name: 'Shrimp', category: 'seafood', shelfLifeDays: 2 },

  // Grains
  { name: 'Bread', category: 'grains', shelfLifeDays: 5 },
  { name: 'Tortillas', category: 'grains', shelfLifeDays: 14 },
  { name: 'Fresh Pasta', category: 'grains', shelfLifeDays: 3 },

  // Beverages
  { name: 'Orange Juice', category: 'beverages', shelfLifeDays: 7 },
  { name: 'Apple Juice', category: 'beverages', shelfLifeDays: 10 },
  { name: 'Milk (Oat/Almond)', category: 'beverages', shelfLifeDays: 10 },

  // Pantry
  { name: 'Canned Soup', category: 'pantry', shelfLifeDays: 365 },
  { name: 'Rice', category: 'pantry', shelfLifeDays: 730 },
  { name: 'Dry Pasta', category: 'pantry', shelfLifeDays: 730 },
  { name: 'Flour', category: 'pantry', shelfLifeDays: 365 },
  { name: 'Sugar', category: 'pantry', shelfLifeDays: 730 },
  { name: 'Coffee Beans', category: 'pantry', shelfLifeDays: 30 },

  // Snacks
  { name: 'Chips', category: 'snacks', shelfLifeDays: 14 },
  { name: 'Cookies', category: 'snacks', shelfLifeDays: 7 },
  { name: 'Nuts', category: 'snacks', shelfLifeDays: 90 },

  // Frozen
  { name: 'Frozen Peas', category: 'frozen', shelfLifeDays: 180 },
  { name: 'Frozen Pizza', category: 'frozen', shelfLifeDays: 60 },
  { name: 'Ice Cream', category: 'frozen', shelfLifeDays: 90 },
];
