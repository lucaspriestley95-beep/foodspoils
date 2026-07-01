export interface Recipe {
  id: string;
  name: string;
  cookTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  imageEmoji: string;
  ingredients: string[]; // Matches common food names
  instructions: string[];
  link?: string;
}

export const RECIPES: Recipe[] = [
  {
    id: 'scrambled-eggs',
    name: 'Classic Scrambled Eggs',
    cookTime: '5 min',
    difficulty: 'Easy',
    imageEmoji: '🍳',
    ingredients: ['Eggs', 'Butter', 'Milk'],
    instructions: [
      'Whisk eggs, milk, and a pinch of salt in a bowl.',
      'Melt butter in a non-stick skillet over medium-low heat.',
      'Pour in egg mixture and let sit for 20 seconds.',
      'Gently push the eggs across the pan until cooked through but still moist.'
    ]
  },
  {
    id: 'spinach-omelette',
    name: 'Spinach & Cheese Omelette',
    cookTime: '10 min',
    difficulty: 'Easy',
    imageEmoji: '🥚',
    ingredients: ['Eggs', 'Baby Spinach', 'Cheese (Hard)', 'Butter'],
    instructions: [
      'Sauté spinach in butter until wilted, then remove from pan.',
      'Whisk eggs and pour into the same skillet.',
      'When the bottom is set, add spinach and grated cheese to one half.',
      'Fold the omelette and cook for another minute until cheese is melted.'
    ]
  },
  {
    id: 'chicken-stir-fry',
    name: 'Quick Chicken Stir-Fry',
    cookTime: '15 min',
    difficulty: 'Medium',
    imageEmoji: '🥢',
    ingredients: ['Chicken Breast', 'Broccoli', 'Bell Peppers', 'Soy Sauce', 'Garlic'],
    instructions: [
      'Slice chicken into strips and sauté in a hot pan until browned.',
      'Add chopped broccoli and peppers, cook for 5 minutes.',
      'Stir in minced garlic and soy sauce.',
      'Serve hot over rice or on its own.'
    ]
  },
  {
    id: 'greek-yogurt-parfait',
    name: 'Berry Yogurt Parfait',
    cookTime: '5 min',
    difficulty: 'Easy',
    imageEmoji: '🥣',
    ingredients: ['Greek Yogurt', 'Strawberries', 'Blueberries', 'Granola'],
    instructions: [
      'Layer Greek yogurt in a glass or bowl.',
      'Add a layer of sliced strawberries and blueberries.',
      'Top with a handful of granola for crunch.',
      'Repeat layers if desired.'
    ]
  },
  {
    id: 'avocado-toast',
    name: 'Simple Avocado Toast',
    cookTime: '5 min',
    difficulty: 'Easy',
    imageEmoji: '🥑',
    ingredients: ['Avocado', 'Bread', 'Lemon', 'Salt'],
    instructions: [
      'Toast the bread until golden brown.',
      'Mash avocado in a bowl with a squeeze of lemon juice and salt.',
      'Spread the avocado mixture onto the toast.',
      'Top with chili flakes or black pepper if available.'
    ]
  },
  {
    id: 'pasta-marinara',
    name: 'Classic Pasta Marinara',
    cookTime: '15 min',
    difficulty: 'Easy',
    imageEmoji: '🍝',
    ingredients: ['Dry Pasta', 'Marinara Sauce', 'Parmesan', 'Garlic'],
    instructions: [
      'Boil pasta in salted water until al dente.',
      'Warm marinara sauce in a large pan with minced garlic.',
      'Toss drained pasta with the sauce.',
      'Serve with plenty of grated Parmesan cheese.'
    ]
  },
  {
    id: 'pan-seared-salmon',
    name: 'Pan-Seared Salmon',
    cookTime: '12 min',
    difficulty: 'Medium',
    imageEmoji: '🐟',
    ingredients: ['Salmon', 'Lemon', 'Butter', 'Asparagus'],
    instructions: [
      'Season salmon with salt and pepper.',
      'Melt butter in a skillet and sear salmon skin-side down for 5 minutes.',
      'Flip and cook for 3-4 more minutes.',
      'Sauté asparagus in the same pan until tender-crisp.'
    ]
  },
  {
    id: 'banana-smoothie',
    name: 'Creamy Banana Smoothie',
    cookTime: '3 min',
    difficulty: 'Easy',
    imageEmoji: '🥤',
    ingredients: ['Bananas', 'Milk', 'Yogurt', 'Honey'],
    instructions: [
      'Combine banana, milk, yogurt, and honey in a blender.',
      'Blend until smooth and creamy.',
      'Pour into a glass and enjoy immediately.'
    ]
  },
  {
    id: 'beef-tacos',
    name: 'Easy Ground Beef Tacos',
    cookTime: '15 min',
    difficulty: 'Easy',
    imageEmoji: '🌮',
    ingredients: ['Ground Beef', 'Tortillas', 'Lettuce', 'Cheese (Hard)', 'Tomatoes'],
    instructions: [
      'Brown ground beef in a skillet and drain excess fat.',
      'Season with taco spices (or salt/pepper/cumin/garlic).',
      'Warm tortillas in a dry pan.',
      'Assemble tacos with beef, shredded lettuce, cheese, and diced tomatoes.'
    ]
  },
  {
    id: 'potato-salad',
    name: 'Homemade Potato Salad',
    cookTime: '25 min',
    difficulty: 'Medium',
    imageEmoji: '🥗',
    ingredients: ['Potatoes', 'Eggs', 'Mayonnaise', 'Mustard', 'Scallions'],
    instructions: [
      'Boil potatoes until tender, then peel and dice.',
      'Hard-boil eggs, peel, and chop.',
      'Mix mayo, mustard, chopped eggs, and sliced scallions in a large bowl.',
      'Fold in potatoes and chill before serving.'
    ]
  },
  {
    id: 'caprese-salad',
    name: 'Tomato & Mozzarella Salad',
    cookTime: '10 min',
    difficulty: 'Easy',
    imageEmoji: '🥗',
    ingredients: ['Tomatoes', 'Mozzarella', 'Basil', 'Olive Oil'],
    instructions: [
      'Slice tomatoes and mozzarella into thick rounds.',
      'Arrange them on a platter, alternating slices.',
      'Tuck fresh basil leaves between the slices.',
      'Drizzle with olive oil and a pinch of salt.'
    ]
  },
  {
    id: 'french-toast',
    name: 'Classic French Toast',
    cookTime: '10 min',
    difficulty: 'Easy',
    imageEmoji: '🍞',
    ingredients: ['Bread', 'Eggs', 'Milk', 'Butter', 'Honey'],
    instructions: [
      'Whisk eggs and milk in a shallow dish.',
      'Dip bread slices into the mixture until soaked but not falling apart.',
      'Cook in a buttered skillet until golden on both sides.',
      'Serve warm with a drizzle of honey.'
    ]
  },
  {
    id: 'tuna-salad',
    name: 'Quick Tuna Salad',
    cookTime: '5 min',
    difficulty: 'Easy',
    imageEmoji: '🥪',
    ingredients: ['Canned Tuna', 'Mayonnaise', 'Celery', 'Lemon', 'Bread'],
    instructions: [
      'Drain tuna and place in a bowl.',
      'Mix with mayo, finely chopped celery, and a squeeze of lemon.',
      'Serve as a sandwich or on crackers.'
    ]
  },
  {
    id: 'roasted-sweet-potatoes',
    name: 'Roasted Sweet Potato Cubes',
    cookTime: '30 min',
    difficulty: 'Easy',
    imageEmoji: '🍠',
    ingredients: ['Sweet Potatoes', 'Olive Oil', 'Salt', 'Black Pepper'],
    instructions: [
      'Peel and cube sweet potatoes into 1-inch pieces.',
      'Toss with olive oil, salt, and pepper on a baking sheet.',
      'Roast at 400°F (200°C) for 25-30 minutes until tender.',
      'Turn halfway through for even browning.'
    ]
  },
  {
    id: 'zucchini-fritters',
    name: 'Crispy Zucchini Fritters',
    cookTime: '20 min',
    difficulty: 'Medium',
    imageEmoji: '🥞',
    ingredients: ['Zucchini', 'Eggs', 'Flour', 'Cheese (Hard)', 'Garlic'],
    instructions: [
      'Grate zucchini and squeeze out all excess moisture.',
      'Mix with eggs, flour, minced garlic, and grated cheese.',
      'Heat oil in a skillet and drop spoonfuls of the batter.',
      'Fry until golden brown on both sides.'
    ]
  },
  {
    id: 'kale-chips',
    name: 'Crunchy Kale Chips',
    cookTime: '15 min',
    difficulty: 'Easy',
    imageEmoji: '🌿',
    ingredients: ['Kale', 'Olive Oil', 'Salt'],
    instructions: [
      'Remove stems from kale and tear leaves into large pieces.',
      'Wash and dry thoroughly.',
      'Toss with olive oil and salt.',
      'Bake at 350°F (175°C) for 10-15 minutes until crisp.'
    ]
  },
  {
    id: 'pancakes',
    name: 'Fluffy Pancakes',
    cookTime: '15 min',
    difficulty: 'Easy',
    imageEmoji: '🥞',
    ingredients: ['Pancake Mix', 'Eggs', 'Milk', 'Butter'],
    instructions: [
      'Mix pancake mix, eggs, and milk in a bowl (don\'t overmix).',
      'Heat a buttered griddle or pan over medium heat.',
      'Pour batter onto the griddle.',
      'Flip when bubbles form on the surface and cook until golden.'
    ]
  },
  {
    id: 'shrimp-scampi',
    name: 'Garlic Shrimp Scampi',
    cookTime: '12 min',
    difficulty: 'Medium',
    imageEmoji: '🍤',
    ingredients: ['Shrimp', 'Garlic', 'Butter', 'Lemon', 'Dry Pasta'],
    instructions: [
      'Cook pasta according to package directions.',
      'Melt butter in a pan and sauté minced garlic for 1 minute.',
      'Add shrimp and cook until pink (about 3 minutes).',
      'Stir in lemon juice and toss with cooked pasta.'
    ]
  },
  {
    id: 'veggie-omelette',
    name: 'Garden Veggie Omelette',
    cookTime: '10 min',
    difficulty: 'Easy',
    imageEmoji: '🍳',
    ingredients: ['Eggs', 'Bell Peppers', 'Mushrooms', 'Onions', 'Cheese (Soft)'],
    instructions: [
      'Sauté diced peppers, mushrooms, and onions until tender.',
      'Pour whisked eggs over the veggies.',
      'Add small dollops of soft cheese.',
      'Fold and cook until eggs are set.'
    ]
  },
  {
    id: 'bacon-and-eggs',
    name: 'Classic Bacon & Eggs',
    cookTime: '12 min',
    difficulty: 'Easy',
    imageEmoji: '🥓',
    ingredients: ['Bacon', 'Eggs', 'Butter', 'Bread'],
    instructions: [
      'Cook bacon in a skillet until crispy, then drain on paper towels.',
      'Fry eggs in the same pan (or use butter) to your liking.',
      'Toast bread.',
      'Serve eggs and bacon with toast.'
    ]
  },
  {
    id: 'cereal-bowl',
    name: 'Quick Breakfast Cereal',
    cookTime: '2 min',
    difficulty: 'Easy',
    imageEmoji: '🥣',
    ingredients: ['Cereal', 'Milk', 'Bananas'],
    instructions: [
      'Pour your favorite cereal into a bowl.',
      'Add cold milk.',
      'Slice a banana on top for extra energy.',
      'Enjoy immediately.'
    ]
  },
  {
    id: 'fried-rice',
    name: 'Quick Egg Fried Rice',
    cookTime: '15 min',
    difficulty: 'Easy',
    imageEmoji: '🍚',
    ingredients: ['Rice', 'Eggs', 'Soy Sauce', 'Scallions', 'Frozen Peas'],
    instructions: [
      'Cook rice (or use leftover cold rice).',
      'Scramble eggs in a large pan and set aside.',
      'Sauté frozen peas and scallions, then add rice.',
      'Stir in soy sauce and cooked eggs, tossing until hot.'
    ]
  },
  {
    id: 'hummus-wrap',
    name: 'Deli Hummus Wrap',
    cookTime: '5 min',
    difficulty: 'Easy',
    imageEmoji: '🌯',
    ingredients: ['Hummus', 'Tortillas', 'Cucumber', 'Carrots', 'Spinach'],
    instructions: [
      'Spread a thick layer of hummus onto a tortilla.',
      'Add sliced cucumber, shredded carrots, and a handful of spinach.',
      'Roll up tightly.',
      'Cut in half and serve.'
    ]
  },
  {
    id: 'quesadilla',
    name: 'Simple Cheese Quesadilla',
    cookTime: '8 min',
    difficulty: 'Easy',
    imageEmoji: '🧀',
    ingredients: ['Tortillas', 'Cheese (Hard)', 'Butter', 'Bell Peppers'],
    instructions: [
      'Sprinkle grated cheese and diced peppers over half of a tortilla.',
      'Fold the tortilla in half.',
      'Cook in a buttered skillet until golden brown and cheese is melted.',
      'Flip halfway through.'
    ]
  },
  {
    id: 'berry-smoothie-bowl',
    name: 'Antioxidant Smoothie Bowl',
    cookTime: '5 min',
    difficulty: 'Easy',
    imageEmoji: '🍓',
    ingredients: ['Frozen Berries', 'Greek Yogurt', 'Milk (Oat/Almond)', 'Granola'],
    instructions: [
      'Blend frozen berries, yogurt, and a splash of milk until thick.',
      'Pour into a bowl.',
      'Top with granola and fresh berries if available.',
      'Eat with a spoon.'
    ]
  },
  {
    id: 'pepper-steak',
    name: 'Quick Pepper Steak',
    cookTime: '15 min',
    difficulty: 'Medium',
    imageEmoji: '🥩',
    ingredients: ['Steak', 'Bell Peppers', 'Onions', 'Soy Sauce', 'Garlic'],
    instructions: [
      'Slice steak thinly against the grain.',
      'Sear steak in a hot pan, then remove.',
      'Sauté sliced peppers and onions with garlic.',
      'Add steak back to pan, stir in soy sauce, and heat through.'
    ]
  },
  {
    id: 'pasta-carbonara-style',
    name: 'Simple Carbonara-Style Pasta',
    cookTime: '15 min',
    difficulty: 'Medium',
    imageEmoji: '🍝',
    ingredients: ['Dry Pasta', 'Eggs', 'Bacon', 'Parmesan', 'Black Pepper'],
    instructions: [
      'Boil pasta until al dente.',
      'Cook bacon until crispy, then chop into bits.',
      'Whisk eggs and Parmesan in a bowl.',
      'Toss hot pasta with bacon and egg mixture (the heat of the pasta cooks the egg into a sauce).'
    ]
  },
  {
    id: 'roasted-broccoli',
    name: 'Garlic Roasted Broccoli',
    cookTime: '20 min',
    difficulty: 'Easy',
    imageEmoji: '🥦',
    ingredients: ['Broccoli', 'Olive Oil', 'Garlic', 'Parmesan'],
    instructions: [
      'Toss broccoli florets with olive oil, minced garlic, and salt.',
      'Spread on a baking sheet.',
      'Roast at 400°F (200°C) for 15-20 minutes until edges are charred.',
      'Sprinkle with Parmesan cheese before serving.'
    ]
  },
  {
    id: 'baked-chicken-thighs',
    name: 'Crispy Baked Chicken Thighs',
    cookTime: '35 min',
    difficulty: 'Easy',
    imageEmoji: '🍗',
    ingredients: ['Chicken Thighs', 'Olive Oil', 'Salt', 'Black Pepper', 'Garlic'],
    instructions: [
      'Pat chicken thighs dry and rub with olive oil, garlic, salt, and pepper.',
      'Place skin-side up on a baking sheet.',
      'Bake at 425°F (220°C) for 30-35 minutes until skin is crispy.',
      'Ensure internal temperature reaches 165°F (74°C).'
    ]
  },
  {
    id: 'turkey-sandwich',
    name: 'Ultimate Turkey Sandwich',
    cookTime: '5 min',
    difficulty: 'Easy',
    imageEmoji: '🥪',
    ingredients: ['Turkey Breast (Deli)', 'Bread', 'Lettuce', 'Tomatoes', 'Mayonnaise'],
    instructions: [
      'Spread mayonnaise on two slices of bread.',
      'Layer turkey breast, lettuce, and sliced tomatoes.',
      'Close the sandwich and cut diagonally.',
      'Serve with a side of chips if desired.'
    ]
  }
];
