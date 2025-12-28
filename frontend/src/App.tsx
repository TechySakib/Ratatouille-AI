import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "./components/Logo";
import { CameraPortal } from "./components/CameraPortal";
import { IngredientBubbles } from "./components/IngredientBubbles";
import { RecipeCard } from "./components/RecipeCard";
import { RecipeModal } from "./components/RecipeModal";
import { ChaosButton } from "./components/ChaosButton";
import { ScanningAnimation } from "./components/ScanningAnimation";
import { InstallPrompt } from "./components/InstallPrompt";
import { AddIngredientModal } from "./components/AddIngredientModal";
import { ToastNotification, ToastType } from "./components/ToastNotification";

// ... existing imports ...

/** =========================
 * Types used by the UI
 * ========================= */

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

/** =========================
 * Types returned by backend
 * ========================= */

type BackendDetectResponse = {
  ingredients: Array<{ name: string; confidence: number }>;
};

type BackendRecipe = {
  id: string;
  title: string;
  matchScore: number; // percent already (e.g., 72.5)
  used: string[];
  missing: string[];
  steps: string[];
};

type BackendRecipesResponse = {
  recipes: BackendRecipe[];
};

/** =========================
 * Config
 * ========================= */

// Set this in your frontend .env:
// VITE_API_BASE=http://127.0.0.1:8000
const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
console.log("API_BASE =", API_BASE);


/**
 * No demo data: we still need a safe image string because your RecipeCard UI
 * likely expects recipe.imageUrl. This is a single generic placeholder image URL.
 * If you already handle empty string in RecipeCard, you can set "".
 */
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80";

function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, isVisible: true });
  };

  // Define handleManualAddIngredient here to fix scope issues
  const handleManualAddIngredient = async (name: string) => {
    // Check if exists
    if (ingredients.some(i => i.name.toLowerCase() === name.toLowerCase())) {
      showToast(`${name} is already in the list!`, "info");
      return;
    }

    const newIng = { name, confidence: 1.0 };
    const newIngredients = [...ingredients, newIng];
    setIngredients(newIngredients);

    // Refetch recipes
    try {
      const matched = await getMatchingRecipes(newIngredients);
      const mapped = matched.map(mapBackendRecipeToUI);
      setRecipes(mapped);
      showToast(`Added ${name}!`, "success");
    } catch (e) {
      showToast("Failed to update recipes", "error");
    }
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  /** =========================
   * Backend API calls
   * ========================= */

  const detectIngredients = async (file: File): Promise<Ingredient[]> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/detect`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const msg = await safeReadError(res);
      throw new Error(msg || "Ingredient detection failed");
    }

    const data = (await res.json()) as BackendDetectResponse;
    const list = Array.isArray(data.ingredients) ? data.ingredients : [];

    // Normalize output for UI
    return list.map((x) => ({
      name: String(x.name),
      confidence: Number(x.confidence ?? 0),
    }));
  };

  const getMatchingRecipes = async (ings: Ingredient[]): Promise<BackendRecipe[]> => {
    const payload = {
      ingredients: ings.map((i) => i.name),
    };

    const res = await fetch(`${API_BASE}/recipes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const msg = await safeReadError(res);
      throw new Error(msg || "Recipe matching failed");
    }

    const data = (await res.json()) as BackendRecipesResponse;
    return Array.isArray(data.recipes) ? data.recipes : [];
  };

  /** =========================
   * Mapping backend → UI shape
   * (so your existing components still work)
   * ========================= */

  const mapBackendRecipeToUI = (r: BackendRecipe): Recipe => {
    const used = Array.isArray(r.used) ? r.used : [];
    const missing = Array.isArray(r.missing) ? r.missing : [];
    const steps = Array.isArray(r.steps) ? r.steps : [];

    const uiIngredients: RecipeIngredient[] = [
      ...used.map((name) => ({ name, amount: "", owned: true })),
      ...missing.map((name) => ({ name, amount: "", owned: false })),
    ];

    const uiSteps: RecipeStep[] = steps.map((instruction, idx) => ({
      number: idx + 1,
      instruction,
    }));

    // You can improve these later with real dataset fields:
    // cookTime/servings/difficulty/imageUrl
    return {
      id: r.id,
      name: r.title,
      matchScore: Number(r.matchScore ?? 0),
      cookTime: "—",
      servings: 2,
      difficulty: "—",
      imageUrl: FALLBACK_IMAGE,
      ingredients: uiIngredients,
      steps: uiSteps,
    };
  };

  /** =========================
   * UI Orchestrators
   * ========================= */

  const handleImageCapture = async (file: File) => {
    setIsScanning(true);
    setSelectedRecipe(null);
    setIngredients([]);
    setRecipes([]);

    try {
      // 1) Detect ingredients
      const detectedIngredients = await detectIngredients(file);
      setIngredients(detectedIngredients);

      // 2) Fetch recipes
      const matched = await getMatchingRecipes(detectedIngredients);
      const mapped = matched.map(mapBackendRecipeToUI);
      setRecipes(mapped);

      if (mapped.length === 0) {
        showToast("No matching recipes found. Try adding ingredients manually.", "info");
      }
    } catch (error) {
      console.error("Error processing image:", error);
      showToast("Backend error. Check that FastAPI is running on port 8000.", "error");
    } finally {
      setIsScanning(false);
    }
  };

  const handleChaosMode = async () => {
    setIsScanning(true);
    setSelectedRecipe(null);
    setRecipes([]);

    try {
      // If user already scanned ingredients, we can chaos-pick from their results
      // otherwise call backend with empty list and randomly pick from returned top results.
      const baseIngs = ingredients;

      // Ask backend for recipes (even with empty ingredients it can return something)
      const matched = await getMatchingRecipes(baseIngs);

      if (!matched.length) {
        showToast("Chaos Mode found nothing. Try scanning first.", "info");
        return;
      }

      // Random pick
      const pick = matched[Math.floor(Math.random() * matched.length)];
      const mapped = mapBackendRecipeToUI(pick);
      setRecipes([mapped]);
      setSelectedRecipe(mapped);

      showToast("Chaos Mode activated! Bon appétit 😈", "success");
    } catch (error) {
      console.error("Chaos mode error:", error);
      showToast("Chaos Mode failed. Is the backend running?", "error");
    } finally {
      setIsScanning(false);
    }
  };

  const handleRemoveIngredient = async (name: string) => {
    const newIngredients = ingredients.filter(i => i.name !== name);
    setIngredients(newIngredients);

    // If no ingredients left, clear recipes
    if (newIngredients.length === 0) {
      setRecipes([]);
      return;
    }

    try {
      const matched = await getMatchingRecipes(newIngredients);
      const mapped = matched.map(mapBackendRecipeToUI);
      setRecipes(mapped);
    } catch (e) {
      console.error("Failed to refresh recipes after removal", e);
    }
  };

  const hasResults = useMemo(() => ingredients.length > 0 || recipes.length > 0, [ingredients, recipes]);

  return (
    <div className="min-h-screen pb-24">
      {/* Scanning animation overlay */}
      <AnimatePresence>{isScanning && <ScanningAnimation />}</AnimatePresence>

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
        {/* Detected ingredients */}
        {ingredients.length > 0 && (
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <IngredientBubbles
              ingredients={ingredients}
              onAdd={() => setIsAddModalOpen(true)}
              onRemove={handleRemoveIngredient}
            />
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
        {!hasResults && !isScanning && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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

      {/* Add Ingredient Modal */}
      <AddIngredientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleManualAddIngredient}
      />

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

/** =========================
 * Small helpers
 * ========================= */

async function safeReadError(res: Response) {
  try {
    const data = await res.json();
    if (typeof data?.detail === "string") return data.detail;
    return null;
  } catch {
    return null;
  }
}

