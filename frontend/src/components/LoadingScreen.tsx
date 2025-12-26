import { motion } from "motion/react";
import { Logo } from "./Logo";

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #faf6ed 0%, #f4e8d0 100%)",
      }}
    >
      <Logo size="large" />
      
      <motion.h2
        className="mt-6"
        style={{ color: "#800020" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Ratatouille AI
      </motion.h2>
      
      <motion.p
        className="mt-2 text-lg"
        style={{ color: "#8b5a2b" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Preparing your kitchen...
      </motion.p>

      {/* Loading dots */}
      <div className="flex gap-2 mt-8">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-3 h-3 rounded-full"
            style={{ background: "#b87333" }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>

      {/* Decorative sparkles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            color: "#ffd966",
          }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        >
          ✨
        </motion.div>
      ))}
    </motion.div>
  );
}
