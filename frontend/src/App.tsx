import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "./components/Logo";
import { CameraPortal } from "./components/CameraPortal";
import { IngredientBubbles } from "./components/IngredientBubbles";
import { RecipeCard } from "./components/RecipeCard";
import { RecipeModal } from "./components/RecipeModal";
import { ChaosButton } from "./components/ChaosButton";
import { ScanningAnimation } from "./components/ScanningAnimation";
import { InstallPrompt } from "./components/InstallPrompt";
import { ToastNotification, ToastType } from "./components/ToastNotification";

interface Ingredient {
  name: string;
  confidence: number;
}

interface RecipeIngredient {
  name: string;
  amount: string;
  owned: boolean;
}

interface RecipeStep {
  number: number;
  instruction: string;
}

interface Recipe {
  id: string;
  name: string;
  matchScore: number;
  cookTime: string;
  servings: number;
  difficulty: string;
  imageUrl: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}

// Mock data
const MOCK_RECIPES: Recipe[] = [
  {
    id: "1",
    name: "Classic Margherita Pizza",
    matchScore: 92,
    cookTime: "25 min",
    servings: 4,
    difficulty: "Easy",
    imageUrl: "https://images.unsplash.com/photo-1734774421809-48eac182a5cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lbWFkZSUyMHBpenphfGVufDF8fHx8MTc2NjY3MjA5Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    ingredients: [
      { name: "Pizza dough", amount: "1 ball", owned: true },
      { name: "Tomato sauce", amount: "1 cup", owned: true },
      { name: "Fresh mozzarella", amount: "8 oz", owned: true },
      { name: "Fresh basil", amount: "1/4 cup", owned: true },
      { name: "Olive oil", amount: "2 tbsp", owned: false },
    ],
    steps: [
      { number: 1, instruction: "Preheat your oven to 475°F (245°C) with a pizza stone inside." },
      { number: 2, instruction: "Roll out the pizza dough on a floured surface to your desired thickness." },
      { number: 3, instruction: "Spread tomato sauce evenly over the dough, leaving a 1-inch border." },
      { number: 4, instruction: "Tear mozzarella into pieces and distribute over the sauce." },
      { number: 5, instruction: "Bake for 12-15 minutes until the crust is golden and cheese is bubbling." },
      { number: 6, instruction: "Remove from oven, top with fresh basil leaves and drizzle with olive oil." },
    ],
  },
  {
    id: "2",
    name: "Creamy Garlic Pasta",
    matchScore: 85,
    cookTime: "20 min",
    servings: 2,
    difficulty: "Easy",
    imageUrl: "https://images.unsplash.com/photo-1676300184847-4ee4030409c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwcGFzdGElMjBkaXNofGVufDF8fHx8MTc2NjY0MDY2MXww&ixlib=rb-4.1.0&q=80&w=1080",
    ingredients: [
      { name: "Pasta", amount: "8 oz", owned: true },
      { name: "Garlic", amount: "4 cloves", owned: true },
      { name: "Heavy cream", amount: "1 cup", owned: false },
      { name: "Parmesan cheese", amount: "1/2 cup", owned: true },
      { name: "Butter", amount: "2 tbsp", owned: true },
    ],
    steps: [
      { number: 1, instruction: "Cook pasta according to package directions. Reserve 1 cup pasta water." },
      { number: 2, instruction: "In a large pan, melt butter and sauté minced garlic for 1-2 minutes." },
      { number: 3, instruction: "Add heavy cream and bring to a gentle simmer." },
      { number: 4, instruction: "Stir in grated Parmesan cheese until melted and smooth." },
      { number: 5, instruction: "Toss cooked pasta in the sauce, adding pasta water if needed." },
    ],
  },
  {
    id: "3",
    name: "Mediterranean Salad Bowl",
    matchScore: 78,
    cookTime: "15 min",
    servings: 2,
    difficulty: "Easy",
    imageUrl: "https://images.unsplash.com/photo-1603093323984-fc69ff01a02c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwc2FsYWQlMjBib3dsfGVufDF8fHx8MTc2NjcwNzgwOXww&ixlib=rb-4.1.0&q=80&w=1080",
    ingredients: [
      { name: "Mixed greens", amount: "4 cups", owned: true },
      { name: "Cherry tomatoes", amount: "1 cup", owned: true },
      { name: "Cucumber", amount: "1 large", owned: true },
      { name: "Feta cheese", amount: "1/2 cup", owned: false },
      { name: "Olives", amount: "1/4 cup", owned: false },
      { name: "Olive oil", amount: "3 tbsp", owned: true },
    ],
    steps: [
      { number: 1, instruction: "Wash and dry all vegetables thoroughly." },
      { number: 2, instruction: "Chop cucumber into bite-sized pieces and halve the cherry tomatoes." },
      { number: 3, instruction: "In a large bowl, combine greens, tomatoes, cucumber, and olives." },
      { number: 4, instruction: "Crumble feta cheese over the salad." },
      { number: 5, instruction: "Drizzle with olive oil and toss gently to combine." },
    ],
  },
  {
    id: "4",
    name: "Decadent Chocolate Mousse",
    matchScore: 65,
    cookTime: "30 min",
    servings: 4,
    difficulty: "Medium",
    imageUrl: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBkZXNzZXJ0fGVufDF8fHx8MTc2NjU5MDk1NXww&ixlib=rb-4.1.0&q=80&w=1080",
    ingredients: [
      { name: "Dark chocolate", amount: "8 oz", owned: false },
      { name: "Eggs", amount: "4 large", owned: true },
      { name: "Sugar", amount: "1/4 cup", owned: true },
      { name: "Heavy cream", amount: "1 cup", owned: false },
      { name: "Vanilla extract", amount: "1 tsp", owned: false },
    ],
    steps: [
      { number: 1, instruction: "Melt chocolate in a double boiler and let it cool slightly." },
      { number: 2, instruction: "Separate egg whites and yolks. Beat whites until stiff peaks form." },
      { number: 3, instruction: "Whisk egg yolks with sugar until pale and creamy." },
      { number: 4, instruction: "Fold melted chocolate into egg yolk mixture." },
      { number: 5, instruction: "Gently fold in beaten egg whites in three additions." },
      { number: 6, instruction: "Whip cream and fold into chocolate mixture." },
      { number: 7, instruction: "Refrigerate for at least 2 hours before serving." },
    ],
  },
];

function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  // Mock API: Detect ingredients from image
  const detectIngredients = async (file: File): Promise<Ingredient[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Mock detected ingredients
    return [
      { name: "Tomatoes", confidence: 0.95 },
      { name: "Basil", confidence: 0.88 },
      { name: "Mozzarella", confidence: 0.92 },
      { name: "Garlic", confidence: 0.85 },
      { name: "Pasta", confidence: 0.78 },
      { name: "Eggs", confidence: 0.82 },
    ];
  };

  // Mock API: Get matching recipes
  const getMatchingRecipes = async (ingredients: Ingredient[]): Promise<Recipe[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return mock recipes
    return MOCK_RECIPES;
  };

  const handleImageCapture = async (file: File) => {
    setIsScanning(true);
    setIngredients([]);
    setRecipes([]);

    try {
      // Detect ingredients
      const detectedIngredients = await detectIngredients(file);
      setIngredients(detectedIngredients);

      // Get matching recipes
      const matchedRecipes = await getMatchingRecipes(detectedIngredients);
      setRecipes(matchedRecipes);
    } catch (error) {
      console.error("Error processing image:", error);
      showToast("Error processing image. Please try again.", "error");
    } finally {
      setIsScanning(false);
    }
  };

  const handleChaosMode = async () => {
    setIsScanning(true);
    setIngredients([]);
    setRecipes([]);

    try {
      // Simulate scanning
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate random ingredients
      const randomIngredients: Ingredient[] = [
        { name: "Mystery Spice", confidence: 0.99 },
        { name: "Cosmic Flour", confidence: 0.87 },
        { name: "Rainbow Vegetables", confidence: 0.91 },
        { name: "Enchanted Cheese", confidence: 0.84 },
      ];
      setIngredients(randomIngredients);

      // Get random recipe
      const randomRecipe = MOCK_RECIPES[Math.floor(Math.random() * MOCK_RECIPES.length)];
      setRecipes([randomRecipe]);
    } catch (error) {
      console.error("Chaos mode error:", error);
      showToast("Chaos mode error. Please try again.", "error");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Scanning animation overlay */}
      <AnimatePresence>
        {isScanning && <ScanningAnimation />}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        className="pt-8 pb-6 px-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-center mb-4">
          <Logo size="large" />
        </div>
        <h1 style={{ color: "#800020" }}>Ratatouille AI</h1>
        <p className="mt-2 text-lg" style={{ color: "#8b5a2b" }}>
          The Fridge-Scavenger Chef
        </p>
        <motion.p
          className="mt-2 text-sm italic"
          style={{ color: "#b87333" }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          "Anyone can cook with what they have!"
        </motion.p>
      </motion.header>

      {/* Main content */}
      <main className="px-4 max-w-6xl mx-auto">
        {/* Hero section with camera portal */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CameraPortal onImageCapture={handleImageCapture} isProcessing={isScanning} />
        </motion.section>

        {/* Detected ingredients */}
        {ingredients.length > 0 && (
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <IngredientBubbles ingredients={ingredients} />
          </motion.section>
        )}

        {/* Recipe gallery */}
        {recipes.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.h2
              className="text-center mb-8"
              style={{ color: "#800020" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Matched Recipes
            </motion.h2>

            {/* Horizontal scrolling recipe cards */}
            <div className="overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex gap-6">
                {recipes.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <RecipeCard recipe={recipe} onClick={() => setSelectedRecipe(recipe)} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Scroll hint */}
            {recipes.length > 1 && (
              <motion.p
                className="text-center mt-4 text-sm"
                style={{ color: "#b87333" }}
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ← Swipe to explore more recipes →
              </motion.p>
            )}
          </motion.section>
        )}

        {/* Empty state */}
        {ingredients.length === 0 && !isScanning && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              🔍
            </motion.div>
            <h3 style={{ color: "#800020" }}>Ready to Cook?</h3>
            <p className="mt-2" style={{ color: "#8b5a2b" }}>
              Snap a photo of your fridge or pantry,
              <br />
              and let Chef Remy work his magic!
            </p>
          </motion.div>
        )}
      </main>

      {/* Chaos Mode Button */}
      <ChaosButton onClick={handleChaosMode} />

      {/* Recipe Modal */}
      <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />

      {/* Footer */}
      <motion.footer
        className="fixed bottom-0 left-0 right-0 py-4 text-center text-sm"
        style={{
          background: "linear-gradient(to top, rgba(250, 246, 237, 0.95), transparent)",
          color: "#8b5a2b",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>Made with ❤️ in the kitchen • Bon appétit!</p>
      </motion.footer>

      {/* Install Prompt */}
      <InstallPrompt />

      {/* Toast Notification */}
      <ToastNotification
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}

export default App;