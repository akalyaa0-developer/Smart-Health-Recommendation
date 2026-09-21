# Cloud Firestore Database Schema

The database model is structured to guarantee absolute user isolation, predictable query performance, and straightforward data migration.

---

## 1. Collections & Document Models

### `healthProfiles/{userId}`
Stores user baseline biometric measurements, dietary restrictions, and notification settings.

| Field | Type | Description |
|---|---|---|
| `name` | string | Full preferred name |
| `age` | number | Age in years |
| `gender` | string | 'female' \| 'male' \| 'non_binary' \| 'prefer_not_to_say' |
| `heightCm` | number | Height in centimeters |
| `weightKg` | number | Weight in kilograms |
| `dietaryPreference` | string | 'omnivore' \| 'vegetarian' \| 'vegan' \| 'pescatarian' \| 'mediterranean' \| 'keto' |
| `allergies` | array\<string\> | Array of strict allergens (e.g. `['peanuts', 'dairy']`) |
| `dislikedIngredients` | array\<string\> | Ingredients to penalize in recommendation ranking |
| `wellnessGoals` | array\<string\> | `['energy', 'better_sleep', 'muscle_tone', 'gut_health', 'stress_reduction']` |
| `targetWaterLiters` | number | Target hydration intake (e.g. `2.5`) |
| `sleepTargetHours` | number | Desired nightly sleep duration |
| `notificationPreferences`| map | `{ hydration: boolean, meals: boolean, assessment: boolean, weeklySummary: boolean }` |
| `trustedContacts` | array\<map\> | Configured trusted contacts for assistance alerts |
| `onboardingCompleted` | boolean | Tracks completion of multi-step intake |
| `updatedAt` | timestamp | Last update timestamp |

---

### `dailyAssessments/{assessmentId}`
Daily self-reported vitality measurements used to calibrate recommendations.

| Field | Type | Description |
|---|---|---|
| `userId` | string | Foreign key referencing authenticated user |
| `date` | string (YYYY-MM-DD) | Unique date index per user |
| `energyLevel` | number | Energy rating on a scale of 1 to 10 |
| `mood` | string | 'Energized' \| 'Calm' \| 'Balanced' \| 'Fatigued' \| 'Stressed' |
| `sleepHours` | number | Recorded sleep duration |
| `sleepQuality` | number | Subjective sleep restfulness rating (1 to 5 stars) |
| `waterLiters` | number | Logged water consumption |
| `activityMinutes` | number | Active physical movement minutes |
| `activityIntensity` | string | 'light' \| 'moderate' \| 'vigorous' |
| `mealConsistency` | string | 'balanced' \| 'light' \| 'skipped_meal' \| 'irregular' |
| `stressLevel` | number | Stress rating on a scale of 1 to 5 |
| `wellnessScore` | number | Computed transparent score (0 to 100) |
| `notes` | string | Subjective reflection notes (scanned for red-flag symptoms) |
| `createdAt` | timestamp | Creation timestamp |

---

### `recommendationFeedback/{feedbackId}`
Stores user feedback loop entries to dynamically update category preference weights.

| Field | Type | Description |
|---|---|---|
| `userId` | string | Foreign key referencing user |
| `itemId` | string | ID of the recommendation or meal |
| `itemTitle` | string | Name of the recommendation |
| `category` | string | 'hydration' \| 'sleep_recovery' \| 'nutrition' \| 'activity' \| 'mind_stress' |
| `feedback` | string | 'helpful' \| 'not_helpful' \| 'saved' \| 'skipped' |
| `rejectionReason` | string \| null | 'not_relevant' \| 'too_difficult' \| 'dislike_ingredient' \| 'already_do_this' |
| `ingredient` | string \| null | Specific penalized ingredient if applicable |
| `timestamp` | timestamp | Timestamp of feedback |

---

### `groceryLists/{userId}`
Active shopping items aggregated from recipes and custom entries.

| Field | Type | Description |
|---|---|---|
| `items` | array\<map\> | `[{ id, name, amount, unit, department, checked, sourceMeals }]` |
| `updatedAt` | timestamp | Last modified timestamp |
