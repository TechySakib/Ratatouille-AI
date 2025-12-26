import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface ChaosButtonProps {
  onClick: () => void;
}

export function ChaosButton({ onClick }: ChaosButtonProps) {
  return (
    <motion.button
      className="fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #ff0040 0%, #800020 100%)",
        boxShadow: "0 8px 24px rgba(128, 0, 32, 0.4), 0 0 40px rgba(255, 0, 64, 0.3)",
        color: "#fff",
      }}
      whileHover={{
        scale: 1.1,
        boxShadow: "0 12px 32px rgba(128, 0, 32, 0.5), 0 0 60px rgba(255, 0, 64, 0.5)",
      }}
      whileTap={{ scale: 0.95 }}
      animate={{
        y: [0, -10, 0],
        boxShadow: [
          "0 8px 24px rgba(128, 0, 32, 0.4), 0 0 40px rgba(255, 0, 64, 0.3)",
          "0 12px 32px rgba(128, 0, 32, 0.5), 0 0 60px rgba(255, 0, 64, 0.5)",
          "0 8px 24px rgba(128, 0, 32, 0.4), 0 0 40px rgba(255, 0, 64, 0.3)",
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      onClick={onClick}
      title="Chaos Mode - Generate Random Recipe"
    >
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Sparkles className="w-7 h-7" />
      </motion.div>

      {/* Pulsing rings */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          border: "3px solid rgba(255, 0, 64, 0.6)",
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.8, 0, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          border: "3px solid rgba(255, 0, 64, 0.6)",
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.8, 0, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
          delay: 1,
        }}
      />

      {/* Label */}
      <motion.div
        className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg text-sm"
        style={{
          background: "#800020",
          color: "#fff",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Chaos Mode
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full"
          style={{
            width: 0,
            height: 0,
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderTop: "6px solid #800020",
          }}
        />
      </motion.div>
    </motion.button>
  );
}
