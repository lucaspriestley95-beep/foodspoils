export interface ScannedProduct {
  name: string;
  category: string;
  quantity: number;
  unit: string;
}

export const CATEGORY_MAP: Record<string, string> = {
  'dairy': 'dairy',
  'vegetable': 'vegetables',
  'fruit': 'fruits',
  'meat': 'meat',
  'poultry': 'meat',
  'seafood': 'seafood',
  'fish': 'seafood',
  'beverage': 'beverages',
  'drink': 'beverages',
  'grain': 'grains',
  'cereal': 'grains',
  'pasta': 'grains',
  'bread': 'grains',
  'snack': 'snacks',
  'frozen': 'frozen',
  'baking': 'baking',
  'canned': 'canned-goods',
  'sauce': 'sauces-oils',
  'oil': 'sauces-oils',
  'spice': 'spices-herbs',
  'herb': 'spices-herbs',
  'deli': 'deli',
  'breakfast': 'breakfast',
  'international': 'international',
  'pantry': 'pantry',
};

export async function fetchProductFromBarcode(barcode: string): Promise<ScannedProduct | null> {
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
    const data = await response.json();
    
    if (data.status === 1 && data.product) {
      const product = data.product;
      const name = product.product_name || product.product_name_en || 'Unknown Product';
      
      let category = 'other';
      const offCategories = product.categories_tags || [];
      
      for (const [offKey, appCat] of Object.entries(CATEGORY_MAP)) {
        if (offCategories.some((c: string) => c.includes(offKey))) {
          category = appCat;
          break;
        }
      }

      let quantity = 1;
      let unit = 'piece(s)';
      const offQuantity = product.quantity || '';
      if (offQuantity) {
        const match = offQuantity.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
        if (match) {
          quantity = parseFloat(match[1]);
          const unitMatch = match[2].toLowerCase();
          const validUnits = ['piece(s)', 'oz', 'lb', 'g', 'kg', 'cup', 'tbsp', 'tsp', 'fl oz', 'ml', 'L', 'box', 'can', 'jar', 'bunch', 'bag', 'pack', 'loaf', 'container', 'carton', 'gallon', 'pint'];
          if (validUnits.includes(unitMatch)) {
            unit = unitMatch;
          }
        }
      }

      return { name, category, quantity, unit };
    }
  } catch (err) {
    console.error("Error fetching product data:", err);
  }
  return null;
}
