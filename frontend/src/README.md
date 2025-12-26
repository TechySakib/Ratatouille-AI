# 🐀 Ratatouille AI: The Fridge-Scavenger Chef

A premium, highly animated, mobile-first PWA that helps you discover delicious recipes based on the ingredients in your fridge using AI-powered ingredient detection.

![Theme](https://img.shields.io/badge/Theme-Parisian%20Bistro-burgundy)
![Tech](https://img.shields.io/badge/Tech-React%20%2B%20TypeScript-blue)
![Animation](https://img.shields.io/badge/Animation-Framer%20Motion-purple)
![Mobile](https://img.shields.io/badge/Mobile-First%20PWA-green)

## ✨ Features

### 🎨 Premium Design
- **Warm Parisian Bistro Theme**: Copper, aged parchment, burgundy, and candle-yellow glow
- **Elegant Typography**: Playfair Display serif headings with clean sans-serif body text
- **Subtle Textures**: Paper texture overlay and soft shadows for depth
- **Original Mascot**: Remy-inspired chef rat logo with animated spoon

### 🎬 Rich Animations
- **Glass-Domed Camera Portal**: Glows on hover with animated rings
- **Magical Scanning Animation**: X-ray sweep with sparkle particles
- **Floating Ingredient Bubbles**: Bouncy bubbles with confidence badges
- **Polaroid Recipe Cards**: Handwritten-style cards with match scores
- **Smooth Transitions**: Gentle floating, bobbing, and storybook-feel interactions

### 🍳 Core Features
- **Camera Integration**: Capture or upload photos of your fridge/pantry
- **AI Ingredient Detection**: Analyzes images to identify ingredients (mock API ready)
- **Recipe Matching**: Suggests recipes based on available ingredients
- **Interactive Recipe Cards**: Horizontal scrolling gallery with detailed modals
- **Chaos Mode**: Floating red button that generates random creative recipes
- **Ingredient Checklist**: Track owned vs. missing ingredients
- **Step-by-Step Instructions**: Interactive cooking steps with checkboxes

### 📱 PWA Features
- **Installable**: Add to home screen on mobile and desktop
- **Offline Support**: Service worker for offline functionality
- **Responsive**: Fully mobile-first with touch-friendly interactions
- **Accessible**: ARIA labels and keyboard navigation

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern web browser

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
/
├── App.tsx                          # Main application component
├── components/
│   ├── Logo.tsx                     # Animated Remy chef mascot
│   ├── CameraPortal.tsx             # Glass-domed camera interface
│   ├── IngredientBubbles.tsx        # Floating ingredient display
│   ├── RecipeCard.tsx               # Polaroid-style recipe cards
│   ├── RecipeModal.tsx              # Fullscreen parchment modal
│   ├── ChaosButton.tsx              # Floating chaos mode button
│   ├── ScanningAnimation.tsx        # X-ray scanning overlay
│   └── InstallPrompt.tsx            # PWA installation prompt
├── styles/
│   └── globals.css                  # Custom theme and typography
├── public/
│   ├── manifest.json                # PWA manifest
│   ├── sw.js                        # Service worker
│   └── favicon.svg                  # App icon
└── API_DOCUMENTATION.md             # Backend API specifications
```

## 🔌 API Integration

The app currently uses **mock data** for demonstration. To connect to a real backend:

1. See `API_DOCUMENTATION.md` for endpoint specifications
2. Replace mock functions in `App.tsx`:
   - `detectIngredients()` → POST to `/api/detect`
   - `getMatchingRecipes()` → POST to `/api/recipes`

### Example API Calls

```typescript
// Detect ingredients from image
const detectIngredients = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch('/api/detect', {
    method: 'POST',
    body: formData,
  });
  
  const data = await response.json();
  return data.ingredients;
};

// Get matching recipes
const getMatchingRecipes = async (ingredients: Ingredient[]) => {
  const response = await fetch('/api/recipes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients }),
  });
  
  const data = await response.json();
  return data.recipes;
};
```

## 🎨 Design System

### Colors
```css
--color-copper: #b87333;          /* Primary accent */
--color-burgundy: #800020;         /* Headings & emphasis */
--color-parchment: #f4e8d0;        /* Cards & surfaces */
--color-candle: #ffd966;           /* Highlights & glow */
--color-warm-bg: #faf6ed;          /* Background */
```

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: System UI (sans-serif)

### Animations
- **Duration**: 0.3s - 3s depending on interaction
- **Easing**: easeInOut, spring physics for interactive elements
- **Patterns**: Floating (0-8px), bobbing, gentle rotations

## 🌟 Key Interactions

1. **Camera Portal**
   - Hover: Glow intensifies
   - Click: Opens native camera or file picker
   - Processing: Pulsing glow animation

2. **Ingredient Bubbles**
   - Float vertically in infinite loop
   - Hover: Scale up 1.1x
   - Confidence badge: Green (>80%) or yellow

3. **Recipe Cards**
   - Horizontal scroll on mobile
   - Hover: Rotate to 0deg, lift shadow
   - Click: Opens fullscreen modal

4. **Recipe Modal**
   - Parchment paper background
   - Two-column layout (ingredients | steps)
   - Interactive checkboxes for completion

5. **Chaos Mode**
   - Fixed bottom-right floating button
   - Pulsing red glow with rotating sparkles
   - Generates random "magical" recipes

## 📦 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Vite** - Build tool

## 🎯 Roadmap

- [ ] Connect to real AI vision API (Google Vision, AWS Rekognition)
- [ ] Add user accounts and recipe favorites
- [ ] Shopping list generation
- [ ] Dietary restriction filters
- [ ] Social sharing of recipes
- [ ] Recipe ratings and reviews
- [ ] Multi-language support

## 🤝 Contributing

This is a demo/prototype project. Feel free to fork and customize!

## 📄 License

MIT License - Feel free to use for personal or commercial projects.

## 🙏 Acknowledgments

- Inspired by Pixar's "Ratatouille"
- Design influenced by Parisian bistro aesthetics
- Mock recipe images from Unsplash

---

**"Anyone can cook with what they have!"** - Chef Remy 👨‍🍳
