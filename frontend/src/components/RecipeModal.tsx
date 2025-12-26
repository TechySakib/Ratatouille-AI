import { motion, AnimatePresence } from "motion/react";
import { X, Check, Circle } from "lucide-react";
import { useState } from "react";

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

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (stepNumber: number) => {
    setCheckedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stepNumber)) {
        newSet.delete(stepNumber);
      } else {
        newSet.add(stepNumber);
      }
      return newSet;
    });
  };

  return (
    <AnimatePresence>
      {recipe && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(45, 36, 22, 0.7)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl"
            style={{
              background: "linear-gradient(135deg, #f4e8d0 0%, #e8dcc0 100%)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <motion.button
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: "#800020",
                color: "#fff",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Scrollable content */}
            <div className="overflow-y-auto max-h-[90vh] p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.h2
                  className="mb-2"
                  style={{ color: "#800020" }}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {recipe.name}
                </motion.h2>
                <motion.div
                  className="inline-block px-4 py-2 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #ffd966 0%, #ffe699 100%)",
                    color: "#800020",
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  {recipe.matchScore}% Match • {recipe.cookTime} • {recipe.servings} servings
                </motion.div>
              </div>

              {/* Two-column layout */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left: Ingredients */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div
                    className="rounded-2xl p-6"
                    style={{
                      background: "#fff",
                      boxShadow: "0 4px 16px rgba(139, 90, 43, 0.1)",
                    }}
                  >
                    <h3 className="mb-4 flex items-center gap-2" style={{ color: "#800020" }}>
                      <span>🥕</span>
                      Ingredients
                    </h3>
                    <div className="space-y-3">
                      {recipe.ingredients.map((ingredient, index) => (
                        <motion.div
                          key={index}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                          className="flex items-center gap-3 p-3 rounded-xl"
                          style={{
                            background: ingredient.owned ? "#f0fdf4" : "#fef2f2",
                            border: `2px solid ${ingredient.owned ? "#4ade80" : "#fca5a5"}`,
                          }}
                        >
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                              background: ingredient.owned ? "#4ade80" : "#fca5a5",
                              color: "#fff",
                            }}
                          >
                            {ingredient.owned ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div style={{ color: "#2d2416" }}>{ingredient.amount}</div>
                            <div style={{ color: "#8b5a2b" }}>{ingredient.name}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Right: Steps */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div
                    className="rounded-2xl p-6"
                    style={{
                      background: "#fff",
                      boxShadow: "0 4px 16px rgba(139, 90, 43, 0.1)",
                    }}
                  >
                    <h3 className="mb-4 flex items-center gap-2" style={{ color: "#800020" }}>
                      <span>👨‍🍳</span>
                      Cooking Steps
                    </h3>
                    <div className="space-y-4">
                      {recipe.steps.map((step, index) => (
                        <motion.div
                          key={step.number}
                          initial={{ x: 10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                          className="flex gap-4 cursor-pointer"
                          onClick={() => toggleStep(step.number)}
                        >
                          <div className="flex-shrink-0">
                            <motion.div
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{
                                background: checkedSteps.has(step.number)
                                  ? "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)"
                                  : "linear-gradient(135deg, #b87333 0%, #8b5a2b 100%)",
                                color: "#fff",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                              }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {checkedSteps.has(step.number) ? (
                                <Check className="w-5 h-5" />
                              ) : (
                                <span>{step.number}</span>
                              )}
                            </motion.div>
                          </div>
                          <div className="flex-1 pt-2">
                            <p
                              style={{
                                color: checkedSteps.has(step.number) ? "#8b5a2b" : "#2d2416",
                                textDecoration: checkedSteps.has(step.number)
                                  ? "line-through"
                                  : "none",
                                opacity: checkedSteps.has(step.number) ? 0.6 : 1,
                              }}
                            >
                              {step.instruction}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Decorative footer */}
              <motion.div
                className="mt-8 text-center text-sm italic"
                style={{ color: "#8b5a2b" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <span>✨ Bon appétit! ✨</span>
              </motion.div>
            </div>

            {/* Parchment texture overlay */}
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(139, 90, 43, 0.03) 3px, rgba(139, 90, 43, 0.03) 6px)",
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
