# Ratatouille AI - API Documentation

## Overview

This document describes the API endpoints that need to be implemented on the backend to connect with the Ratatouille AI frontend.

Currently, the frontend uses **mock data** for demonstration purposes. Replace the mock functions in `/App.tsx` with actual API calls to these endpoints.

---

## API Endpoints

### 1. Detect Ingredients

**Endpoint:** `POST /api/detect`

**Description:** Analyzes an image of food items (fridge, pantry, etc.) and returns detected ingredients with confidence scores.

**Request:**
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `image` (file): The uploaded image file (JPEG, PNG, etc.)

**Example Request:**
```javascript
const formData = new FormData();
formData.append('image', imageFile);

const response = await fetch('/api/detect', {
  method: 'POST',
  body: formData,
});
```

**Response:**
- **Content-Type:** `application/json`
- **Status:** 200 OK

**Response Body:**
```json
{
  "ingredients": [
    {
      "name": "Tomatoes",
      "confidence": 0.95
    },
    {
      "name": "Basil",
      "confidence": 0.88
    },
    {
      "name": "Mozzarella",
      "confidence": 0.92
    }
  ]
}
```

**Fields:**
- `ingredients` (array): List of detected ingredients
  - `name` (string): Ingredient name
  - `confidence` (number): Detection confidence score (0.0 - 1.0)

---

### 2. Get Matching Recipes

**Endpoint:** `POST /api/recipes`

**Description:** Returns recipes that match the provided ingredients, sorted by match score.

**Request:**
- **Content-Type:** `application/json`
- **Body:**

```json
{
  "ingredients": [
    {
      "name": "Tomatoes",
      "confidence": 0.95
    },
    {
      "name": "Basil",
      "confidence": 0.88
    }
  ]
}
```

**Example Request:**
```javascript
const response = await fetch('/api/recipes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ ingredients }),
});
```

**Response:**
- **Content-Type:** `application/json`
- **Status:** 200 OK

**Response Body:**
```json
{
  "recipes": [
    {
      "id": "recipe-123",
      "name": "Classic Margherita Pizza",
      "matchScore": 92,
      "cookTime": "25 min",
      "servings": 4,
      "difficulty": "Easy",
      "imageUrl": "https://example.com/pizza.jpg",
      "ingredients": [
        {
          "name": "Pizza dough",
          "amount": "1 ball",
          "owned": true
        },
        {
          "name": "Tomato sauce",
          "amount": "1 cup",
          "owned": true
        }
      ],
      "steps": [
        {
          "number": 1,
          "instruction": "Preheat your oven to 475°F (245°C)."
        },
        {
          "number": 2,
          "instruction": "Roll out the pizza dough."
        }
      ]
    }
  ]
}
```

**Fields:**
- `recipes` (array): List of matching recipes
  - `id` (string): Unique recipe identifier
  - `name` (string): Recipe name
  - `matchScore` (number): Match percentage (0-100)
  - `cookTime` (string): Estimated cooking time
  - `servings` (number): Number of servings
  - `difficulty` (string): Difficulty level ("Easy", "Medium", "Hard")
  - `imageUrl` (string): URL to recipe image
  - `ingredients` (array): Required ingredients
    - `name` (string): Ingredient name
    - `amount` (string): Required amount
    - `owned` (boolean): Whether user has this ingredient
  - `steps` (array): Cooking instructions
    - `number` (number): Step number
    - `instruction` (string): Step description

---

## Integration Guide

### Replacing Mock Data

In `/App.tsx`, replace these functions:

```typescript
// Current mock function
const detectIngredients = async (file: File): Promise<Ingredient[]> => {
  await new Promise((resolve) => setTimeout(resolve, 2500));
  return [/* mock data */];
};

// Replace with actual API call
const detectIngredients = async (file: File): Promise<Ingredient[]> => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch('/api/detect', {
    method: 'POST',
    body: formData,
  });
  
  const data = await response.json();
  return data.ingredients;
};
```

```typescript
// Current mock function
const getMatchingRecipes = async (ingredients: Ingredient[]): Promise<Recipe[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_RECIPES;
};

// Replace with actual API call
const getMatchingRecipes = async (ingredients: Ingredient[]): Promise<Recipe[]> => {
  const response = await fetch('/api/recipes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients }),
  });
  
  const data = await response.json();
  return data.recipes;
};
```

---

## Error Handling

Both endpoints should return appropriate error responses:

**4xx Client Errors:**
```json
{
  "error": "Invalid image format",
  "message": "Please upload a valid image file (JPEG, PNG, etc.)"
}
```

**5xx Server Errors:**
```json
{
  "error": "Internal server error",
  "message": "Unable to process request at this time"
}
```

---

## Notes

- **Image Processing:** Consider using AI/ML services like Google Vision API, AWS Rekognition, or custom models for ingredient detection
- **Recipe Matching:** Implement fuzzy matching algorithms to find recipes that work with available ingredients
- **Performance:** Optimize image processing to return results within 2-3 seconds for best UX
- **Caching:** Consider caching common ingredient detections and popular recipes
