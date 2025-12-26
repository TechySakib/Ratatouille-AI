import { motion } from "motion/react";
import { Clock, Users, ChefHat } from "lucide-react";

interface Recipe {
  id: string;
  name: string;
  matchScore: number;
  cookTime: string;
  servings: number;
  difficulty: string;
  imageUrl: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <motion.div
      className="relative flex-shrink-0 w-72 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      {/* Polaroid-style card */}
      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "#fff",
          boxShadow: "0 8px 24px rgba(139, 90, 43, 0.15)",
          transform: "rotate(-1deg)",
        }}
        whileHover={{
          boxShadow: "0 12px 36px rgba(139, 90, 43, 0.25)",
          transform: "rotate(0deg)",
        }}
      >
        {/* Image section */}
        <div className="relative w-full h-48 overflow-hidden bg-gray-200">
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
          
          {/* Match score badge */}
          <motion.div
            className="absolute top-3 right-3 px-3 py-1.5 rounded-full"
            style={{
              background: recipe.matchScore >= 80 
                ? "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)"
                : recipe.matchScore >= 60
                ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
                : "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
              color: "#fff",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
            }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="flex items-center gap-1">
              <span className="text-xs">🎯</span>
              <span>{recipe.matchScore}% Match</span>
            </span>
          </motion.div>
        </div>

        {/* Content section - Polaroid bottom */}
        <div className="p-5 bg-white">
          <h3 
            className="mb-3 text-center"
            style={{ 
              color: "#800020",
              fontFamily: "Playfair Display, serif",
            }}
          >
            {recipe.name}
          </h3>

          {/* Recipe details */}
          <div className="flex items-center justify-around text-sm" style={{ color: "#8b5a2b" }}>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{recipe.cookTime}</span>
            </div>
            <div className="w-px h-4" style={{ background: "#d4a574" }} />
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{recipe.servings}</span>
            </div>
            <div className="w-px h-4" style={{ background: "#d4a574" }} />
            <div className="flex items-center gap-1.5">
              <ChefHat className="w-4 h-4" />
              <span>{recipe.difficulty}</span>
            </div>
          </div>

          {/* Handwritten-style note */}
          <motion.div
            className="mt-3 pt-3 text-center text-sm italic"
            style={{
              borderTop: "1px dashed #d4a574",
              color: "#8b5a2b",
              fontFamily: "Georgia, serif",
            }}
          >
            Tap to view recipe
          </motion.div>
        </div>

        {/* Tape decoration */}
        <div
          className="absolute top-2 left-1/2 w-16 h-6 -translate-x-1/2"
          style={{
            background: "rgba(255, 217, 102, 0.6)",
            boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.1)",
            transform: "translateX(-50%) rotate(-2deg)",
          }}
        />
      </motion.div>

      {/* Shadow paper underneath */}
      <div
        className="absolute inset-0 rounded-2xl -z-10"
        style={{
          background: "#e8dcc0",
          transform: "translate(4px, 6px) rotate(-2deg)",
        }}
      />
    </motion.div>
  );
}
