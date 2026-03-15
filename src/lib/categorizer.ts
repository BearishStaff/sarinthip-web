export function suggestCategory(itemName: string, allCategories: any[]) {
  // Loop through all categories
  for (const category of allCategories) {
    // Check if any keyword of this category is found in the itemName
    const match = category.keywords.some((kw: string) => 
      itemName.toLowerCase().includes(kw.toLowerCase())
    );
    
    if (match) return category.id;
  }
  
  return null; // Return null if no keywords match
}