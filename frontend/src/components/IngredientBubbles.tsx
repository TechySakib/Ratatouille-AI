import { motion } from "motion/react";
import { Apple, Beef, Carrot, Egg, Fish, Milk, Wheat, Leaf, Droplets, Flame, Plus, X } from "lucide-react";

interface Ingredient {
  name: string;
  confidence: number;
}

interface IngredientBubblesProps {
  ingredients: Ingredient[];
  onAdd: () => void;
  onRemove: (name: string) => void;
}

const iconMap: { [key: string]: any } = {
  tomato: Apple,
  apple: Apple,
  carrot: Carrot,
  potato: Carrot,
  onion: Carrot,
  beef: Beef,
  chicken: Beef,
  meat: Beef,
  egg: Egg,
  fish: Fish,
  salmon: Fish,
  milk: Milk,
  cheese: Milk,
  butter: Milk,
  bread: Wheat,
  flour: Wheat,
  pasta: Wheat,
  lettuce: Leaf,
  spinach: Leaf,
  basil: Leaf,
  oil: Droplets,
  water: Droplets,
  garlic: Flame,
};

function getIconForIngredient(name: string) {
  const lowerName = name.toLowerCase();
  for (const [key, Icon] of Object.entries(iconMap)) {
    if (lowerName.includes(key)) {
      return Icon;
    }
  }
  return Apple; // default icon
}

export function IngredientBubbles({ ingredients, onAdd, onRemove }: IngredientBubblesProps) {
  if (ingredients.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <h3 className="text-center mb-4" style={{ color: "#800020" }}>
        Detected Ingredients
      </h3>

      <div className="flex flex-wrap gap-3 justify-center">
        {ingredients.map((ingredient, index) => {
          const Icon = getIconForIngredient(ingredient.name);

          return (
            <motion.div
              key={ingredient.name}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: index * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 10,
              }}
            >
              <motion.div
                className="relative px-4 py-3 rounded-full flex items-center gap-2 cursor-default group"
                style={{
                  background: "linear-gradient(135deg, #f4e8d0 0%, #e8dcc0 100%)",
                  boxShadow: "0 4px 12px rgba(139, 90, 43, 0.2)",
                  border: "2px solid #d4a574",
                }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 6px 20px rgba(139, 90, 43, 0.3)",
                }}
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  y: {
                    duration: 2 + index * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "#ffd966" }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#800020" }} />
                </div>
                <span style={{ color: "#2d2416" }}>{ingredient.name}</span>

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(ingredient.name);
                  }}
                  className="ml-1 p-1 rounded-full hover:bg-black/10 transition-colors"
                  aria-label={`Remove ${ingredient.name}`}
                >
                  <X className="w-3 h-3 text-[#8b5a2b]" />
                </button>

                {/* Confidence badge */}
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{
                    background: ingredient.confidence > 0.8 ? "#4ade80" : "#fbbf24",
                    color: "#fff",
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {Math.round(ingredient.confidence * 100)}
                </motion.div>

                {/* Sparkle effect */}
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3,
                  }}
                >
                  <div className="w-3 h-3" style={{ color: "#ffd966" }}>✨</div>
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Add Button */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: ingredients.length * 0.1 }}
          className="px-4 py-3 rounded-full flex items-center gap-2 cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #fff 0%, #f0fdf4 100%)",
            boxShadow: "0 4px 12px rgba(74, 222, 128, 0.2)",
            border: "2px dashed #4ade80",
            color: "#15803d"
          }}
          whileHover={{ scale: 1.1, boxShadow: "0 6px 20px rgba(74, 222, 128, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onAdd}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#dcfce7" }}>
            <Plus className="w-5 h-5" />
          </div>
          <span>Add</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
