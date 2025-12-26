import { motion } from "motion/react";

export function ScanningAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(45, 36, 22, 0.8)" }}
    >
      <div className="relative w-full max-w-md aspect-square">
        {/* X-ray scanning effect */}
        <motion.div
          className="absolute inset-0 rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #f4e8d0 0%, #e8dcc0 100%)",
            boxShadow: "0 0 80px rgba(255, 217, 102, 0.6)",
          }}
        >
          {/* Scanning beam */}
          <motion.div
            className="absolute inset-x-0 h-2"
            style={{
              background: "linear-gradient(90deg, transparent, #ffd966, transparent)",
              boxShadow: "0 0 30px rgba(255, 217, 102, 0.8)",
            }}
            animate={{
              y: ["0%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Grid overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(184, 115, 51, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(184, 115, 51, 0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Sparkle particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                color: "#ffd966",
              }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            >
              ✨
            </motion.div>
          ))}
        </motion.div>

        {/* Scanning text */}
        <motion.div
          className="absolute -bottom-20 left-0 right-0 text-center"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        >
          <h3 style={{ color: "#ffd966" }}>Analyzing Ingredients...</h3>
          <p style={{ color: "#d4a574" }}>Using magical AI vision</p>
        </motion.div>

        {/* Corner brackets */}
        {["top-left", "top-right", "bottom-left", "bottom-right"].map((corner) => {
          const positions = {
            "top-left": { top: 0, left: 0 },
            "top-right": { top: 0, right: 0 },
            "bottom-left": { bottom: 0, left: 0 },
            "bottom-right": { bottom: 0, right: 0 },
          };

          return (
            <motion.div
              key={corner}
              className="absolute w-12 h-12"
              style={{
                ...positions[corner as keyof typeof positions],
                borderColor: "#ffd966",
                borderStyle: "solid",
                borderWidth: corner.includes("top")
                  ? corner.includes("left")
                    ? "4px 0 0 4px"
                    : "4px 4px 0 0"
                  : corner.includes("left")
                  ? "0 0 4px 4px"
                  : "0 4px 4px 0",
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
