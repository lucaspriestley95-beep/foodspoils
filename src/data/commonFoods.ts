export interface CommonFood {
  name: string;
  category: string;
  shelfLifeDays: number;
  defaultQuantity?: number;
  defaultUnit?: string;
  quantityOptions?: string[];
}

export const COMMON_FOODS: CommonFood[] = [
  // Vegetables
  { name: 'Baby Spinach', category: 'vegetables', shelfLifeDays: 5, defaultQuantity: 1, defaultUnit: 'bag', quantityOptions: ['5 oz bag', '10 oz bag', '1 lb container'] },
  { name: 'Spinach', category: 'vegetables', shelfLifeDays: 5, defaultQuantity: 1, defaultUnit: 'bunch', quantityOptions: ['1 bunch', '2 bunches'] },
  { name: 'Broccoli', category: 'vegetables', shelfLifeDays: 7, defaultQuantity: 1, defaultUnit: 'head', quantityOptions: ['1 head', '2 heads', '1 lb bag'] },
  { name: 'Carrots', category: 'vegetables', shelfLifeDays: 21, defaultQuantity: 1, defaultUnit: 'lb', quantityOptions: ['1 lb bag', '2 lb bag', '5 lb bag'] },
  { name: 'Lettuce', category: 'vegetables', shelfLifeDays: 5, defaultQuantity: 1, defaultUnit: 'head', quantityOptions: ['1 head', '3-pack hearts'] },
  { name: 'Tomatoes', category: 'vegetables', shelfLifeDays: 7, defaultQuantity: 1, defaultUnit: 'lb', quantityOptions: ['1 lb', '2 lbs', 'Carton'] },
  { name: 'Potatoes', category: 'vegetables', shelfLifeDays: 60, defaultQuantity: 5, defaultUnit: 'lb', quantityOptions: ['3 lb bag', '5 lb bag', '10 lb bag'] },
  { name: 'Onions', category: 'vegetables', shelfLifeDays: 60, defaultQuantity: 3, defaultUnit: 'lb', quantityOptions: ['1 lb', '3 lb bag', '5 lb bag'] },
  { name: 'Cucumber', category: 'vegetables', shelfLifeDays: 7, defaultQuantity: 1, defaultUnit: 'piece(s)', quantityOptions: ['1 piece', '3-pack'] },
  { name: 'Bell Peppers', category: 'vegetables', shelfLifeDays: 7, defaultQuantity: 3, defaultUnit: 'piece(s)', quantityOptions: ['1 piece', '3-pack'] },
  { name: 'Mushrooms', category: 'vegetables', shelfLifeDays: 5, defaultQuantity: 8, defaultUnit: 'oz', quantityOptions: ['8 oz carton', '16 oz carton'] },
  { name: 'Kale', category: 'vegetables', shelfLifeDays: 7, defaultQuantity: 1, defaultUnit: 'bunch', quantityOptions: ['1 bunch', '1 bag'] },
  { name: 'Garlic', category: 'vegetables', shelfLifeDays: 120, defaultQuantity: 3, defaultUnit: 'piece(s)', quantityOptions: ['1 head', '3-pack'] },
  { name: 'Zucchini', category: 'vegetables', shelfLifeDays: 7, defaultQuantity: 2, defaultUnit: 'piece(s)', quantityOptions: ['1 piece', '2 pieces', '3 pieces'] },
  { name: 'Asparagus', category: 'vegetables', shelfLifeDays: 4, defaultQuantity: 1, defaultUnit: 'bunch', quantityOptions: ['1 bunch'] },
  { name: 'Sweet Potatoes', category: 'vegetables', shelfLifeDays: 30, defaultQuantity: 3, defaultUnit: 'lb', quantityOptions: ['1 lb', '3 lb bag'] },
  { name: 'Cabbage', category: 'vegetables', shelfLifeDays: 21, defaultQuantity: 1, defaultUnit: 'head', quantityOptions: ['1 head'] },
  { name: 'Cauliflower', category: 'vegetables', shelfLifeDays: 7, defaultQuantity: 1, defaultUnit: 'head', quantityOptions: ['1 head'] },
  { name: 'Celery', category: 'vegetables', shelfLifeDays: 14, defaultQuantity: 1, defaultUnit: 'bunch', quantityOptions: ['1 bunch'] },
  { name: 'Eggplant', category: 'vegetables', shelfLifeDays: 5, defaultQuantity: 1, defaultUnit: 'piece(s)', quantityOptions: ['1 piece'] },
  { name: 'Green Beans', category: 'vegetables', shelfLifeDays: 7, defaultQuantity: 1, defaultUnit: 'lb', quantityOptions: ['1 lb', '1 bag'] },
  { name: 'Radishes', category: 'vegetables', shelfLifeDays: 14, defaultQuantity: 1, defaultUnit: 'bunch', quantityOptions: ['1 bunch'] },
  { name: 'Scallions', category: 'vegetables', shelfLifeDays: 7, defaultQuantity: 1, defaultUnit: 'bunch', quantityOptions: ['1 bunch'] },
  { name: 'Bok Choy', category: 'vegetables', shelfLifeDays: 5, defaultQuantity: 1, defaultUnit: 'lb', quantityOptions: ['1 bunch', '1 lb'] },
  { name: 'Corn', category: 'vegetables', shelfLifeDays: 2, defaultQuantity: 4, defaultUnit: 'piece(s)', quantityOptions: ['1 piece', '4-pack', '8-pack'] },
  { name: 'Jalapenos', category: 'vegetables', shelfLifeDays: 7, defaultQuantity: 5, defaultUnit: 'piece(s)', quantityOptions: ['1 piece', '5 pieces'] },
  { name: 'Squash (Butternut)', category: 'vegetables', shelfLifeDays: 30, defaultQuantity: 1, defaultUnit: 'piece(s)', quantityOptions: ['1 piece'] },

  // Fruits
  { name: 'Bananas', category: 'fruits', shelfLifeDays: 4, defaultQuantity: 1, defaultUnit: 'bunch', quantityOptions: ['1 bunch', '5 pieces'] },
  { name: 'Apples', category: 'fruits', shelfLifeDays: 30, defaultQuantity: 3, defaultUnit: 'lb', quantityOptions: ['1 lb', '3 lb bag', '5 lb bag'] },
  { name: 'Strawberries', category: 'fruits', shelfLifeDays: 3, defaultQuantity: 1, defaultUnit: 'lb', quantityOptions: ['1 lb container', '2 lb container'] },
  { name: 'Avocado', category: 'fruits', shelfLifeDays: 4, defaultQuantity: 3, defaultUnit: 'piece(s)', quantityOptions: ['1 piece', '3 pieces', 'Bag of 5'] },
  { name: 'Grapes', category: 'fruits', shelfLifeDays: 10, defaultQuantity: 1, defaultUnit: 'lb', quantityOptions: ['1 lb', '2 lb bag'] },
  { name: 'Blueberries', category: 'fruits', shelfLifeDays: 7, defaultQuantity: 11, defaultUnit: 'oz', quantityOptions: ['6 oz container', '11 oz container', '18 oz container'] },
  { name: 'Lemon', category: 'fruits', shelfLifeDays: 14, defaultQuantity: 3, defaultUnit: 'piece(s)', quantityOptions: ['1 piece', '3-pack', '2 lb bag'] },
  { name: 'Limes', category: 'fruits', shelfLifeDays: 14, defaultQuantity: 5, defaultUnit: 'piece(s)', quantityOptions: ['1 piece', '1 lb bag'] },
  { name: 'Pears', category: 'fruits', shelfLifeDays: 7, defaultQuantity: 4, defaultUnit: 'piece(s)', quantityOptions: ['1 piece', '4 pieces'] },
  { name: 'Peaches', category: 'fruits', shelfLifeDays: 4, defaultQuantity: 4, defaultUnit: 'piece(s)', quantityOptions: ['1 piece', '4 pieces'] },
  { name: 'Plums', category: 'fruits', shelfLifeDays: 4, defaultQuantity: 4, defaultUnit: 'piece(s)', quantityOptions: ['1 piece', '4 pieces'] },
  { name: 'Raspberries', category: 'fruits', shelfLifeDays: 2, defaultQuantity: 6, defaultUnit: 'oz', quantityOptions: ['6 oz container'] },
  { name: 'Blackberries', category: 'fruits', shelfLifeDays: 2, defaultQuantity: 6, defaultUnit: 'oz', quantityOptions: ['6 oz container'] },
  { name: 'Watermelon', category: 'fruits', shelfLifeDays: 7, defaultQuantity: 1, defaultUnit: 'piece(s)', quantityOptions: ['1 whole', 'Half', 'Quarter'] },
  { name: 'Pineapple', category: 'fruits', shelfLifeDays: 5, defaultQuantity: 1, defaultUnit: 'piece(s)', quantityOptions: ['1 whole'] },
  { name: 'Mango', category: 'fruits', shelfLifeDays: 5, defaultQuantity: 2, defaultUnit: 'piece(s)', quantityOptions: ['1 piece', '2 pieces'] },
  { name: 'Kiwi', category: 'fruits', shelfLifeDays: 7, defaultQuantity: 1, defaultUnit: 'lb', quantityOptions: ['1 piece', '1 lb bag'] },
  { name: 'Oranges', category: 'fruits', shelfLifeDays: 21, defaultQuantity: 4, defaultUnit: 'lb', quantityOptions: ['1 piece', '4 lb bag'] },
  { name: 'Grapefruit', category: 'fruits', shelfLifeDays: 14, defaultQuantity: 2, defaultUnit: 'piece(s)', quantityOptions: ['1 piece', '2 pieces'] },

  // Dairy
  { name: 'Milk', category: 'dairy', shelfLifeDays: 7, defaultQuantity: 1, defaultUnit: 'gallon', quantityOptions: ['1/2 gallon', '1 gallon', '1 quart'] },
  { name: 'Eggs', category: 'dairy', shelfLifeDays: 21, defaultQuantity: 12, defaultUnit: 'piece(s)', quantityOptions: ['6 (half dozen)', '12 (dozen)', '18 pack'] },
  { name: 'Yogurt', category: 'dairy', shelfLifeDays: 14, defaultQuantity: 1, defaultUnit: 'container', quantityOptions: ['Single cup', '32 oz tub'] },
  { name: 'Greek Yogurt', category: 'dairy', shelfLifeDays: 14, defaultQuantity: 1, defaultUnit: 'container', quantityOptions: ['Single cup', '32 oz tub'] },
  { name: 'Cheese (Hard)', category: 'dairy', shelfLifeDays: 30, defaultQuantity: 8, defaultUnit: 'oz', quantityOptions: ['8 oz block', '1 lb block'] },
  { name: 'Cheese (Soft)', category: 'dairy', shelfLifeDays: 7, defaultQuantity: 8, defaultUnit: 'oz', quantityOptions: ['8 oz container'] },
  { name: 'Butter', category: 'dairy', shelfLifeDays: 60, defaultQuantity: 4, defaultUnit: 'piece(s)', quantityOptions: ['1 stick', '4 sticks (1 lb)'] },
  { name: 'Cream Cheese', category: 'dairy', shelfLifeDays: 21, defaultQuantity: 1, defaultUnit: 'oz', quantityOptions: ['8 oz brick', '8 oz tub'] },
  { name: 'Heavy Cream', category: 'dairy', shelfLifeDays: 15, defaultQuantity: 1, defaultUnit: 'pint', quantityOptions: ['1/2 pint', '1 pint', '1 quart'] },
  { name: 'Parmesan', category: 'dairy', shelfLifeDays: 90, defaultQuantity: 5, defaultUnit: 'oz', quantityOptions: ['5 oz container', '8 oz block'] },
  { name: 'Feta', category: 'dairy', shelfLifeDays: 7, defaultQuantity: 1, defaultUnit: 'container', quantityOptions: ['6 oz container', '12 oz container'] },
  { name: 'Mozzarella', category: 'dairy', shelfLifeDays: 10, defaultQuantity: 1, defaultUnit: 'oz', quantityOptions: ['8 oz ball', '1 lb log'] },

  // Meat
  { name: 'Chicken Breast', category: 'meat', shelfLifeDays: 3, defaultQuantity: 1, defaultUnit: 'lb', quantityOptions: ['1 lb', '2 lb pack', '5 lb family pack'] },
  { name: 'Chicken Thighs', category: 'meat', shelfLifeDays: 3, defaultQuantity: 1, defaultUnit: 'lb', quantityOptions: ['1 lb', '2 lb pack'] },
  { name: 'Ground Beef', category: 'meat', shelfLifeDays: 2, defaultQuantity: 1, defaultUnit: 'lb', quantityOptions: ['1 lb', '2 lb pack'] },
  { name: 'Ground Turkey', category: 'meat', shelfLifeDays: 2, defaultQuantity: 1, defaultUnit: 'lb', quantityOptions: ['1 lb', '1.25 lb pack'] },
  { name: 'Steak', category: 'meat', shelfLifeDays: 4, defaultQuantity: 1, defaultUnit: 'lb', quantityOptions: ['1 lb', '2 steaks'] },
  { name: 'Pork Chops', category: 'meat', shelfLifeDays: 3, defaultQuantity: 1, defaultUnit: 'lb', quantityOptions: ['1 lb', '4 chops'] },
  { name: 'Bacon', category: 'meat', shelfLifeDays: 7, defaultQuantity: 1, defaultUnit: 'lb', quantityOptions: ['12 oz pack', '1 lb pack'] },
  { name: 'Sausages', category: 'meat', shelfLifeDays: 3, defaultQuantity: 1, defaultUnit: 'lb', quantityOptions: ['1 lb pack', '5-link pack'] },

  // Seafood
  { name: 'Salmon', category: 'seafood', shelfLifeDays: 2, defaultQuantity: 1, defaultUnit: 'lb', quantityOptions: ['1 lb', '2 fillets'] },
  { name: 'Shrimp', category: 'seafood', shelfLifeDays: 2, defaultQuantity: 1, defaultUnit: 'lb', quantityOptions: ['1 lb bag', '2 lb bag'] },
  { name: 'White Fish', category: 'seafood', shelfLifeDays: 2, defaultQuantity: 1, defaultUnit: 'lb', quantityOptions: ['1 lb', '2 fillets'] },
  { name: 'Smoked Salmon', category: 'seafood', shelfLifeDays: 14, defaultQuantity: 4, defaultUnit: 'oz', quantityOptions: ['4 oz pack', '8 oz pack'] },

  // Deli
  { name: 'Turkey Breast (Deli)', category: 'deli', shelfLifeDays: 5, defaultQuantity: 0.5, defaultUnit: 'lb', quantityOptions: ['1/4 lb', '1/2 lb', '1 lb'] },
  { name: 'Ham (Deli)', category: 'deli', shelfLifeDays: 5, defaultQuantity: 0.5, defaultUnit: 'lb', quantityOptions: ['1/4 lb', '1/2 lb', '1 lb'] },
  { name: 'Salami', category: 'deli', shelfLifeDays: 14, defaultQuantity: 0.5, defaultUnit: 'lb', quantityOptions: ['1/4 lb', '1/2 lb', '8 oz pack'] },
  { name: 'Hummus', category: 'deli', shelfLifeDays: 7, defaultQuantity: 8, defaultUnit: 'oz', quantityOptions: ['8 oz tub', '16 oz tub'] },
  { name: 'Potato Salad', category: 'deli', shelfLifeDays: 4, defaultQuantity: 1, defaultUnit: 'lb', quantityOptions: ['1/2 lb', '1 lb'] },

  // Grains & Bakery
  { name: 'Bread', category: 'grains', shelfLifeDays: 5, defaultQuantity: 1, defaultUnit: 'loaf', quantityOptions: ['1 loaf', '1/2 loaf'] },
  { name: 'Tortillas', category: 'grains', shelfLifeDays: 14, defaultQuantity: 1, defaultUnit: 'pack', quantityOptions: ['8-pack', '12-pack', '20-pack'] },
  { name: 'Bagels', category: 'grains', shelfLifeDays: 5, defaultQuantity: 6, defaultUnit: 'piece(s)', quantityOptions: ['1 bagel', '6-pack (dozen)'] },
  { name: 'English Muffins', category: 'grains', shelfLifeDays: 7, defaultQuantity: 6, defaultUnit: 'piece(s)', quantityOptions: ['6-pack'] },
  { name: 'Baguette', category: 'grains', shelfLifeDays: 2, defaultQuantity: 1, defaultUnit: 'piece(s)', quantityOptions: ['1 loaf'] },

  // Breakfast
  { name: 'Cereal', category: 'breakfast', shelfLifeDays: 180, defaultQuantity: 1, defaultUnit: 'box', quantityOptions: ['Small box', 'Large box', 'Family size'] },
  { name: 'Oatmeal', category: 'breakfast', shelfLifeDays: 365, defaultQuantity: 1, defaultUnit: 'container', quantityOptions: ['18 oz canister', '42 oz canister'] },
  { name: 'Granola', category: 'breakfast', shelfLifeDays: 90, defaultQuantity: 1, defaultUnit: 'bag', quantityOptions: ['12 oz bag', '1 lb bag'] },
  { name: 'Pancake Mix', category: 'breakfast', shelfLifeDays: 270, defaultQuantity: 1, defaultUnit: 'box', quantityOptions: ['1 lb box', '2 lb box'] },

  // Canned Goods
  { name: 'Canned Soup', category: 'canned-goods', shelfLifeDays: 365, defaultQuantity: 1, defaultUnit: 'can', quantityOptions: ['1 can', '4-pack', '12-pack'] },
  { name: 'Canned Black Beans', category: 'canned-goods', shelfLifeDays: 365, defaultQuantity: 1, defaultUnit: 'can', quantityOptions: ['1 can'] },
  { name: 'Canned Tuna', category: 'canned-goods', shelfLifeDays: 730, defaultQuantity: 1, defaultUnit: 'can', quantityOptions: ['1 can', '4-pack'] },
  { name: 'Marinara Sauce', category: 'canned-goods', shelfLifeDays: 730, defaultQuantity: 24, defaultUnit: 'oz', quantityOptions: ['24 oz jar', 'Family size jar'] },

  // Sauces & Oils
  { name: 'Olive Oil', category: 'sauces-oils', shelfLifeDays: 540, defaultQuantity: 1, defaultUnit: 'bottle', quantityOptions: ['500ml bottle', '750ml bottle', '1 liter'] },
  { name: 'Soy Sauce', category: 'sauces-oils', shelfLifeDays: 365, defaultQuantity: 1, defaultUnit: 'bottle', quantityOptions: ['10 oz bottle', '15 oz bottle'] },
  { name: 'Ketchup', category: 'sauces-oils', shelfLifeDays: 180, defaultQuantity: 1, defaultUnit: 'bottle', quantityOptions: ['20 oz bottle', '32 oz bottle'] },
  { name: 'Mustard', category: 'sauces-oils', shelfLifeDays: 365, defaultQuantity: 1, defaultUnit: 'bottle', quantityOptions: ['8 oz bottle', '12 oz bottle'] },
  { name: 'Mayonnaise', category: 'sauces-oils', shelfLifeDays: 60, defaultQuantity: 1, defaultUnit: 'jar', quantityOptions: ['15 oz jar', '30 oz jar'] },

  // Spices & Herbs
  { name: 'Ginger', category: 'spices-herbs', shelfLifeDays: 21, defaultQuantity: 1, defaultUnit: 'piece(s)', quantityOptions: ['1 piece'] },
  { name: 'Cilantro', category: 'spices-herbs', shelfLifeDays: 7, defaultQuantity: 1, defaultUnit: 'bunch', quantityOptions: ['1 bunch'] },
  { name: 'Parsley', category: 'spices-herbs', shelfLifeDays: 7, defaultQuantity: 1, defaultUnit: 'bunch', quantityOptions: ['1 bunch'] },
  { name: 'Basil', category: 'spices-herbs', shelfLifeDays: 5, defaultQuantity: 1, defaultUnit: 'bunch', quantityOptions: ['1 bunch', '0.75 oz pack'] },
  { name: 'Mint', category: 'spices-herbs', shelfLifeDays: 7, defaultQuantity: 1, defaultUnit: 'bunch', quantityOptions: ['1 bunch'] },
  { name: 'Salt', category: 'spices-herbs', shelfLifeDays: 1000, defaultQuantity: 1, defaultUnit: 'container', quantityOptions: ['1 lb box', 'Sea salt grinder'] },
  { name: 'Black Pepper', category: 'spices-herbs', shelfLifeDays: 730, defaultQuantity: 1, defaultUnit: 'container', quantityOptions: ['Small tin', 'Pepper mill'] },

  // Baking
  { name: 'Flour', category: 'baking', shelfLifeDays: 365, defaultQuantity: 5, defaultUnit: 'lb', quantityOptions: ['2 lb bag', '5 lb bag'] },
  { name: 'Sugar', category: 'baking', shelfLifeDays: 730, defaultQuantity: 4, defaultUnit: 'lb', quantityOptions: ['2 lb bag', '4 lb bag'] },
  { name: 'Baking Soda', category: 'baking', shelfLifeDays: 730, defaultQuantity: 1, defaultUnit: 'box', quantityOptions: ['1 lb box'] },
  { name: 'Chocolate Chips', category: 'baking', shelfLifeDays: 365, defaultQuantity: 12, defaultUnit: 'oz', quantityOptions: ['12 oz bag'] },

  // International
  { name: 'Sriracha', category: 'international', shelfLifeDays: 365, defaultQuantity: 1, defaultUnit: 'bottle', quantityOptions: ['17 oz bottle', '28 oz bottle'] },
  { name: 'Soy Sauce', category: 'international', shelfLifeDays: 365, defaultQuantity: 1, defaultUnit: 'bottle', quantityOptions: ['10 oz bottle', '15 oz bottle'] },
  { name: 'Rice Vinegar', category: 'international', shelfLifeDays: 365, defaultQuantity: 1, defaultUnit: 'bottle', quantityOptions: ['12 oz bottle'] },
  { name: 'Coconut Milk (Canned)', category: 'international', shelfLifeDays: 365, defaultQuantity: 1, defaultUnit: 'can', quantityOptions: ['1 can'] },

  // Beverages
  { name: 'Orange Juice', category: 'beverages', shelfLifeDays: 7, defaultQuantity: 1, defaultUnit: 'carton', quantityOptions: ['52 oz carton', '89 oz jug'] },
  { name: 'Milk (Oat/Almond)', category: 'beverages', shelfLifeDays: 10, defaultQuantity: 1, defaultUnit: 'carton', quantityOptions: ['1/2 gallon', '1 quart'] },
  { name: 'Soda (Can)', category: 'beverages', shelfLifeDays: 270, defaultQuantity: 12, defaultUnit: 'piece(s)', quantityOptions: ['1 can', '6-pack', '12-pack'] },
  { name: 'Sparkling Water', category: 'beverages', shelfLifeDays: 365, defaultQuantity: 8, defaultUnit: 'piece(s)', quantityOptions: ['1 can', '8-pack', '12-pack'] },
  { name: 'Ground Coffee', category: 'beverages', shelfLifeDays: 90, defaultQuantity: 12, defaultUnit: 'oz', quantityOptions: ['12 oz bag', '1 lb bag'] },

  // Snacks
  { name: 'Chips', category: 'snacks', shelfLifeDays: 14, defaultQuantity: 1, defaultUnit: 'bag', quantityOptions: ['8 oz bag', 'Party size'] },
  { name: 'Granola Bars', category: 'snacks', shelfLifeDays: 180, defaultQuantity: 6, defaultUnit: 'piece(s)', quantityOptions: ['6-pack', '12-pack'] },
  { name: 'Popcorn', category: 'snacks', shelfLifeDays: 365, defaultQuantity: 1, defaultUnit: 'box', quantityOptions: ['3-pack', '6-pack'] },

  // Frozen
  { name: 'Frozen Peas', category: 'frozen', shelfLifeDays: 180, defaultQuantity: 1, defaultUnit: 'bag', quantityOptions: ['12 oz bag', '1 lb bag'] },
  { name: 'Frozen Pizza', category: 'frozen', shelfLifeDays: 60, defaultQuantity: 1, defaultUnit: 'piece(s)', quantityOptions: ['1 pizza', '3-pack'] },
  { name: 'Ice Cream', category: 'frozen', shelfLifeDays: 90, defaultQuantity: 1, defaultUnit: 'pint', quantityOptions: ['1 pint', '1.5 quart tub'] },
  { name: 'Frozen Berries', category: 'frozen', shelfLifeDays: 270, defaultQuantity: 1, defaultUnit: 'bag', quantityOptions: ['10 oz bag', '1 lb bag'] },

  // Pantry
  { name: 'Rice', category: 'pantry', shelfLifeDays: 730, defaultQuantity: 2, defaultUnit: 'lb', quantityOptions: ['1 lb bag', '2 lb bag', '5 lb bag'] },
  { name: 'Dry Pasta', category: 'pantry', shelfLifeDays: 730, defaultQuantity: 1, defaultUnit: 'lb', quantityOptions: ['1 lb box', '1 lb bag'] },
  { name: 'Honey', category: 'pantry', shelfLifeDays: 1000, defaultQuantity: 1, defaultUnit: 'bottle', quantityOptions: ['12 oz bear', '1 lb bottle'] },
  { name: 'Peanut Butter', category: 'pantry', shelfLifeDays: 90, defaultQuantity: 1, defaultUnit: 'jar', quantityOptions: ['16 oz jar', '28 oz jar', '40 oz jar'] },
];
