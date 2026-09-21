/**
 * Curated Meal Database with nutritional macros, allergens, and grocery categorization
 */

export const INITIAL_MEALS = [
  // Breakfasts
  {
    id: 'meal-b1',
    title: 'Spiced Golden Chia & Berry Bowl',
    type: 'breakfast',
    prepTimeMinutes: 10,
    calories: 380,
    proteinGrams: 14,
    carbsGrams: 48,
    fatGrams: 16,
    fiberGrams: 12,
    dietaryTags: ['vegan', 'gluten-free', 'dairy-free', 'heart-healthy'],
    allergens: [],
    suitableGoals: ['energy', 'gut_health', 'better_sleep'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    whyRecommendedRationale: 'High in soluble fiber, omega-3 ALA, and antioxidant polyphenols to support stable morning glucose and gut microbiome resilience.',
    ingredients: [
      { name: 'Chia Seeds', amount: 3, unit: 'tbsp', department: 'Pantry' },
      { name: 'Almond Milk (Unsweetened)', amount: 1, unit: 'cup', department: 'Dairy/Alternatives' },
      { name: 'Fresh Blueberries', amount: 0.5, unit: 'cup', department: 'Produce' },
      { name: 'Ground Turmeric & Cinnamon', amount: 0.5, unit: 'tsp', department: 'Seasonings' },
      { name: 'Hemp Hearts', amount: 1, unit: 'tbsp', department: 'Pantry' },
      { name: 'Pure Maple Syrup', amount: 1, unit: 'tsp', department: 'Pantry' }
    ],
    instructions: [
      'Whisk chia seeds, almond milk, turmeric, and cinnamon together in a bowl or jar.',
      'Let rest for 5 minutes, stir again, then chill for 10 minutes until thickened.',
      'Top with fresh blueberries, hemp hearts, and a light drizzle of maple syrup.'
    ]
  },
  {
    id: 'meal-b2',
    title: 'Avocado & Herb Poached Egg Sourdough',
    type: 'breakfast',
    prepTimeMinutes: 15,
    calories: 420,
    proteinGrams: 22,
    carbsGrams: 36,
    fatGrams: 22,
    fiberGrams: 8,
    dietaryTags: ['vegetarian', 'high-protein'],
    allergens: ['eggs', 'gluten'],
    suitableGoals: ['muscle_tone', 'energy'],
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
    whyRecommendedRationale: 'Delivers bioavailable choline, lutein, and monounsaturated healthy fats for cognitive focus and sustained morning satiety.',
    ingredients: [
      { name: 'Pasture-Raised Eggs', amount: 2, unit: 'large', department: 'Protein' },
      { name: 'Artisan Sourdough Bread', amount: 2, unit: 'slices', department: 'Pantry' },
      { name: 'Hass Avocado', amount: 0.5, unit: 'medium', department: 'Produce' },
      { name: 'Baby Arugula', amount: 1, unit: 'cup', department: 'Produce' },
      { name: 'Crushed Red Pepper & Sea Salt', amount: 1, unit: 'pinch', department: 'Seasonings' },
      { name: 'Extra Virgin Olive Oil', amount: 1, unit: 'tsp', department: 'Pantry' }
    ],
    instructions: [
      'Toast sourdough slices until crisp and golden.',
      'Mash avocado with sea salt, lemon juice, and a pinch of chili flakes, then spread over toast.',
      'Poach eggs in simmering water with a splash of vinegar for 3-4 minutes.',
      'Place eggs atop mashed avocado, top with fresh baby arugula, and drizzle with olive oil.'
    ]
  },
  {
    id: 'meal-b3',
    title: 'Matcha Green Protein Power Smoothie',
    type: 'breakfast',
    prepTimeMinutes: 5,
    calories: 340,
    proteinGrams: 28,
    carbsGrams: 38,
    fatGrams: 8,
    fiberGrams: 9,
    dietaryTags: ['vegan', 'gluten-free', 'dairy-free', 'high-protein'],
    allergens: [],
    suitableGoals: ['energy', 'muscle_tone', 'weight_management'],
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80',
    whyRecommendedRationale: 'Ceremonial matcha provides calm, jitter-free alertness via L-theanine, balanced with clean plant protein to prevent energy crashes.',
    ingredients: [
      { name: 'Ceremonial Grade Matcha Powder', amount: 1, unit: 'tsp', department: 'Pantry' },
      { name: 'Plant-Based Protein Powder (Vanilla)', amount: 1, unit: 'scoop', department: 'Pantry' },
      { name: 'Baby Spinach', amount: 2, unit: 'cups', department: 'Produce' },
      { name: 'Frozen Banana', amount: 1, unit: 'medium', department: 'Produce' },
      { name: 'Oat Milk', amount: 1.25, unit: 'cups', department: 'Dairy/Alternatives' },
      { name: 'Flaxseed Meal', amount: 1, unit: 'tbsp', department: 'Pantry' }
    ],
    instructions: [
      'Add oat milk, spinach, matcha, and protein powder into a high-speed blender.',
      'Blend on low for 20 seconds, then add frozen banana and flaxseed.',
      'Blend on high for 45 seconds until silky smooth and vibrant green.'
    ]
  },

  // Lunches
  {
    id: 'meal-l1',
    title: 'Mediterranean Quinoa & Roasted Veggie Bowl',
    type: 'lunch',
    prepTimeMinutes: 25,
    calories: 490,
    proteinGrams: 18,
    carbsGrams: 64,
    fatGrams: 19,
    fiberGrams: 11,
    dietaryTags: ['vegan', 'vegetarian', 'gluten-free', 'heart-healthy'],
    allergens: [],
    suitableGoals: ['energy', 'gut_health', 'weight_management'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
    whyRecommendedRationale: 'Rich in polyphenols, resistant starches, and cold-pressed olive oil, shown to support cardiovascular endurance and gut microbial diversity.',
    ingredients: [
      { name: 'Cooked Tricolor Quinoa', amount: 1, unit: 'cup', department: 'Pantry' },
      { name: 'English Cucumber (diced)', amount: 0.5, unit: 'cup', department: 'Produce' },
      { name: 'Cherry Tomatoes (halved)', amount: 0.75, unit: 'cup', department: 'Produce' },
      { name: 'Kalamata Olives (pitted)', amount: 2, unit: 'tbsp', department: 'Pantry' },
      { name: 'Chickpeas (rinsed)', amount: 0.5, unit: 'can', department: 'Pantry' },
      { name: 'Fresh Parsley & Mint', amount: 3, unit: 'tbsp', department: 'Produce' },
      { name: 'Lemon Tahini Dressing', amount: 2, unit: 'tbsp', department: 'Pantry' }
    ],
    instructions: [
      'Layer warm quinoa in a broad shallow bowl.',
      'Arrange diced cucumber, halved cherry tomatoes, and rinsed chickpeas around the base.',
      'Garnish with Kalamata olives and finely chopped herbs.',
      'Drizzle generously with lemon tahini dressing before serving.'
    ]
  },
  {
    id: 'meal-l2',
    title: 'Wild Citrus-Glazed Salmon with Broccolini',
    type: 'lunch',
    prepTimeMinutes: 20,
    calories: 520,
    proteinGrams: 42,
    carbsGrams: 24,
    fatGrams: 28,
    fiberGrams: 6,
    dietaryTags: ['gluten-free', 'high-protein', 'dairy-free'],
    allergens: ['fish'],
    suitableGoals: ['muscle_tone', 'energy', 'better_sleep'],
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=80',
    whyRecommendedRationale: 'Loaded with EPA/DHA omega-3 fatty acids and bioavailable magnesium, essential for cellular repair, joint ease, and restorative recovery.',
    ingredients: [
      { name: 'Wild Alaskan Salmon Fillet', amount: 6, unit: 'oz', department: 'Protein' },
      { name: 'Fresh Broccolini', amount: 1, unit: 'bunch', department: 'Produce' },
      { name: 'Garlic (minced)', amount: 2, unit: 'cloves', department: 'Produce' },
      { name: 'Organic Lemon (juiced)', amount: 1, unit: 'whole', department: 'Produce' },
      { name: 'Avocado Oil', amount: 1, unit: 'tbsp', department: 'Pantry' },
      { name: 'Brown Jasmine Rice', amount: 0.5, unit: 'cup cooked', department: 'Pantry' }
    ],
    instructions: [
      'Season salmon with sea salt, lemon juice, and freshly cracked black pepper.',
      'Sear skin-side down in a cast-iron skillet with avocado oil for 4 minutes, flip and cook 3 minutes.',
      'Sauté broccolini with minced garlic in the same pan until tender-crisp.',
      'Serve alongside warm jasmine rice with fresh lemon wedges.'
    ]
  },
  {
    id: 'meal-l3',
    title: 'Rainbow Edamame & Sesame Crunch Salad',
    type: 'lunch',
    prepTimeMinutes: 15,
    calories: 410,
    proteinGrams: 24,
    carbsGrams: 32,
    fatGrams: 21,
    fiberGrams: 10,
    dietaryTags: ['vegan', 'gluten-free', 'dairy-free', 'high-protein'],
    allergens: ['soy', 'sesame'],
    suitableGoals: ['weight_management', 'energy', 'gut_health'],
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    whyRecommendedRationale: 'Crisp cruciferous vegetables supply indole-3-carbinol, paired with plant isoflavones from young edamame for metabolic efficiency.',
    ingredients: [
      { name: 'Shelled Edamame (steamed)', amount: 1, unit: 'cup', department: 'Protein' },
      { name: 'Purple Cabbage (shredded)', amount: 1.5, unit: 'cups', department: 'Produce' },
      { name: 'Carrots (julienned)', amount: 0.75, unit: 'cup', department: 'Produce' },
      { name: 'Bell Pepper (sliced)', amount: 1, unit: 'medium', department: 'Produce' },
      { name: 'Toasted Sesame Seeds', amount: 1, unit: 'tbsp', department: 'Pantry' },
      { name: 'Ginger Sesame Vinaigrette', amount: 2, unit: 'tbsp', department: 'Pantry' }
    ],
    instructions: [
      'In a large mixing bowl, toss shredded cabbage, julienned carrots, and bell pepper.',
      'Fold in warm steamed edamame and toasted sesame seeds.',
      'Dress with ginger sesame vinaigrette and toss vigorously to combine.'
    ]
  },

  // Dinners
  {
    id: 'meal-d1',
    title: 'Herb Roasted Free-Range Chicken & Sweet Potato',
    type: 'dinner',
    prepTimeMinutes: 35,
    calories: 560,
    proteinGrams: 46,
    carbsGrams: 48,
    fatGrams: 20,
    fiberGrams: 7,
    dietaryTags: ['gluten-free', 'dairy-free', 'high-protein'],
    allergens: [],
    suitableGoals: ['muscle_tone', 'better_sleep', 'energy'],
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop&q=80',
    whyRecommendedRationale: 'Sweet potatoes supply slow-release complex carbs that promote nocturnal serotonin-to-melatonin synthesis, while lean poultry provides zinc.',
    ingredients: [
      { name: 'Chicken Breast (organic, diced)', amount: 7, unit: 'oz', department: 'Protein' },
      { name: 'Sweet Potato (cubed)', amount: 1, unit: 'large', department: 'Produce' },
      { name: 'Fresh Rosemary & Thyme', amount: 2, unit: 'sprigs', department: 'Produce' },
      { name: 'Zucchini (thick sliced)', amount: 1, unit: 'medium', department: 'Produce' },
      { name: 'Olive Oil', amount: 1, unit: 'tbsp', department: 'Pantry' },
      { name: 'Smoked Paprika & Sea Salt', amount: 1, unit: 'tsp', department: 'Seasonings' }
    ],
    instructions: [
      'Preheat oven to 400°F (200°C). Line a baking sheet with parchment.',
      'Toss chicken cubes, sweet potatoes, and zucchini in olive oil, paprika, salt, and fresh herbs.',
      'Roast for 25-30 minutes until sweet potatoes are caramelized and chicken is cooked through.'
    ]
  },
  {
    id: 'meal-d2',
    title: 'Tuscan White Bean & Kale Braise with Polenta',
    type: 'dinner',
    prepTimeMinutes: 30,
    calories: 460,
    proteinGrams: 19,
    carbsGrams: 68,
    fatGrams: 12,
    fiberGrams: 14,
    dietaryTags: ['vegan', 'vegetarian', 'gluten-free', 'heart-healthy'],
    allergens: [],
    suitableGoals: ['gut_health', 'stress_reduction', 'better_sleep'],
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80',
    whyRecommendedRationale: 'High magnesium density from dark leafy Tuscan kale relaxes somatic muscular tension, complemented by calming prebiotic fiber.',
    ingredients: [
      { name: 'Cannellini White Beans (rinsed)', amount: 1, unit: 'can', department: 'Pantry' },
      { name: 'Lacinato Dinosaur Kale (chopped)', amount: 3, unit: 'cups', department: 'Produce' },
      { name: 'San Marzano Crushed Tomatoes', amount: 1, unit: 'cup', department: 'Pantry' },
      { name: 'Yellow Polenta (Cornmeal)', amount: 0.75, unit: 'cup', department: 'Pantry' },
      { name: 'Shallot & Garlic', amount: 2, unit: 'cloves', department: 'Produce' },
      { name: 'Vegetable Broth', amount: 2, unit: 'cups', department: 'Pantry' }
    ],
    instructions: [
      'Simmer polenta in vegetable broth until creamy and thick, roughly 15 minutes.',
      'Sauté shallots and garlic in olive oil, then add crushed tomatoes and simmer 10 minutes.',
      'Fold in cannellini beans and chopped kale until wilted and rich.',
      'Ladle the warm savory bean stew over creamy polenta.'
    ]
  },
  {
    id: 'meal-d3',
    title: 'Miso-Glazed Black Cod & Steamed Bok Choy',
    type: 'dinner',
    prepTimeMinutes: 25,
    calories: 480,
    proteinGrams: 36,
    carbsGrams: 28,
    fatGrams: 24,
    fiberGrams: 5,
    dietaryTags: ['dairy-free', 'gluten-free', 'high-protein'],
    allergens: ['fish', 'soy'],
    suitableGoals: ['better_sleep', 'energy', 'stress_reduction'],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
    whyRecommendedRationale: 'Fermented white miso delivers bioactive peptides that soothe the nervous system, while black cod provides restorative marine collagen.',
    ingredients: [
      { name: 'Black Cod (Sablefish) Fillet', amount: 6, unit: 'oz', department: 'Protein' },
      { name: 'Organic White Miso Paste', amount: 1.5, unit: 'tbsp', department: 'Pantry' },
      { name: 'Mirin & Tamari (Gluten-Free)', amount: 1, unit: 'tbsp each', department: 'Pantry' },
      { name: 'Baby Bok Choy', amount: 3, unit: 'heads', department: 'Produce' },
      { name: 'Sesame Oil', amount: 1, unit: 'tsp', department: 'Pantry' },
      { name: 'Steamed Brown Rice', amount: 0.5, unit: 'cup', department: 'Pantry' }
    ],
    instructions: [
      'Whisk miso paste, mirin, and tamari into a smooth marinade and coat the cod.',
      'Broil cod under medium-high heat for 8-10 minutes until caramelized and flaky.',
      'Steam bok choy with a drop of sesame oil for 3 minutes.',
      'Plate with warm brown rice and pour over residual pan glaze.'
    ]
  },

  // Snacks
  {
    id: 'meal-s1',
    title: 'Raw Walnuts & Organic Medjool Dates',
    type: 'snack',
    prepTimeMinutes: 3,
    calories: 210,
    proteinGrams: 4,
    carbsGrams: 26,
    fatGrams: 12,
    fiberGrams: 4,
    dietaryTags: ['vegan', 'gluten-free', 'dairy-free'],
    allergens: ['tree-nuts'],
    suitableGoals: ['energy', 'better_sleep'],
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&auto=format&fit=crop&q=80',
    whyRecommendedRationale: 'Walnuts contain natural plant melatonin and ALA omega-3s, mitigating evening cortisol and supporting mental clarity.',
    ingredients: [
      { name: 'Raw California Walnut Halves', amount: 0.25, unit: 'cup', department: 'Pantry' },
      { name: 'Medjool Dates (pitted)', amount: 2, unit: 'whole', department: 'Produce' },
      { name: 'Cinnamon Dusting', amount: 1, unit: 'pinch', department: 'Seasonings' }
    ],
    instructions: [
      'Slice dates lengthwise and stuff each with two walnut halves.',
      'Dust lightly with Ceylon cinnamon and enjoy immediately.'
    ]
  },
  {
    id: 'meal-s2',
    title: 'Crispy Rosemary Sea Salt Roasted Chickpeas',
    type: 'snack',
    prepTimeMinutes: 20,
    calories: 180,
    proteinGrams: 8,
    carbsGrams: 28,
    fatGrams: 5,
    fiberGrams: 7,
    dietaryTags: ['vegan', 'gluten-free', 'dairy-free', 'heart-healthy'],
    allergens: [],
    suitableGoals: ['gut_health', 'weight_management'],
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80',
    whyRecommendedRationale: 'A crunchy, savory whole-food snack offering low glycemic fiber to sustain stable blood sugar during afternoon work sprints.',
    ingredients: [
      { name: 'Cooked Chickpeas (dried thoroughly)', amount: 1, unit: 'cup', department: 'Pantry' },
      { name: 'Extra Virgin Olive Oil', amount: 1, unit: 'tsp', department: 'Pantry' },
      { name: 'Dried Rosemary & Flaky Sea Salt', amount: 0.5, unit: 'tsp', department: 'Seasonings' }
    ],
    instructions: [
      'Pat chickpeas completely dry with paper towels.',
      'Toss with olive oil, crushed rosemary, and sea salt.',
      'Air-fry at 390°F (195°C) for 12 minutes or roast in oven at 400°F for 20 minutes until crisp.'
    ]
  },
  {
    id: 'meal-s3',
    title: 'Coconut Yogurt with Pomegranate Arils',
    type: 'snack',
    prepTimeMinutes: 3,
    calories: 190,
    proteinGrams: 5,
    carbsGrams: 18,
    fatGrams: 11,
    fiberGrams: 4,
    dietaryTags: ['vegan', 'gluten-free', 'dairy-free', 'gut_health'],
    allergens: [],
    suitableGoals: ['gut_health', 'stress_reduction'],
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',
    whyRecommendedRationale: 'Contains live active probiotic cultures that fortify the intestinal barrier, paired with rich punicalagins from fresh pomegranate.',
    ingredients: [
      { name: 'Probiotic Coconut Milk Yogurt (Plain)', amount: 0.75, unit: 'cup', department: 'Dairy/Alternatives' },
      { name: 'Fresh Pomegranate Arils', amount: 3, unit: 'tbsp', department: 'Produce' },
      { name: 'Raw Pumpkin Seeds (Pepitas)', amount: 1, unit: 'tbsp', department: 'Pantry' }
    ],
    instructions: [
      'Spoon chilled coconut yogurt into a small glass cup.',
      'Top with fresh pomegranate arils and raw pumpkin seeds for crunch.'
    ]
  }
];
