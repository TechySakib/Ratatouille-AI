import { motion } from "motion/react";
import { Camera, Upload } from "lucide-react";
import { useRef } from "react";

interface CameraPortalProps {
  onImageCapture: (file: File) => void;
  isProcessing: boolean;
}

export function CameraPortal({ onImageCapture, isProcessing }: CameraPortalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageCapture(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Glass dome container */}
      <motion.div
        className="relative aspect-square rounded-full overflow-hidden cursor-pointer"
        style={{
          background: "linear-gradient(135deg, rgba(255, 217, 102, 0.3) 0%, rgba(180, 115, 51, 0.2) 100%)",
          boxShadow: "0 8px 32px rgba(139, 90, 43, 0.2), inset 0 2px 16px rgba(255, 255, 255, 0.5)",
          border: "2px solid rgba(255, 217, 102, 0.4)",
        }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 12px 48px rgba(255, 217, 102, 0.4), inset 0 2px 16px rgba(255, 255, 255, 0.6)",
        }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        animate={isProcessing ? {
          boxShadow: [
            "0 8px 32px rgba(255, 217, 102, 0.4), inset 0 2px 16px rgba(255, 255, 255, 0.5)",
            "0 12px 48px rgba(255, 217, 102, 0.8), inset 0 2px 16px rgba(255, 255, 255, 0.8)",
            "0 8px 32px rgba(255, 217, 102, 0.4), inset 0 2px 16px rgba(255, 255, 255, 0.5)",
          ]
        } : {}}
        transition={isProcessing ? { duration: 1.5, repeat: Infinity } : {}}
      >
        {/* Animated glow rings */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: "3px solid rgba(255, 217, 102, 0.6)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Inner content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-4 p-8">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Camera className="w-20 h-20" style={{ color: "#b87333", strokeWidth: 1.5 }} />
          </motion.div>

          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(244, 232, 208, 0.95)" }}
            >
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div className="w-16 h-16 border-4 rounded-full" style={{ 
                  borderColor: "#b87333",
                  borderTopColor: "transparent",
                }} />
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Reflection effect */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "linear-gradient(145deg, rgba(255, 255, 255, 0.4) 0%, transparent 50%)",
          }}
        />
      </motion.div>

      {/* Button below dome */}
      <motion.button
        className="mt-6 w-full py-4 px-8 rounded-2xl relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #b87333 0%, #8b5a2b 100%)",
          color: "#fff",
          boxShadow: "0 4px 20px rgba(139, 90, 43, 0.3)",
        }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 6px 28px rgba(139, 90, 43, 0.4)",
        }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        disabled={isProcessing}
      >
        <span className="relative z-10 flex items-center justify-center gap-3">
          <Camera className="w-6 h-6" />
          <span className="text-lg">{isProcessing ? "Scanning Fridge..." : "Open Camera"}</span>
        </span>
        
        <motion.div
          className="absolute inset-0"
          style={{ background: "rgba(255, 255, 255, 0.2)" }}
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.button>

      {/* Upload fallback */}
      <motion.button
        className="mt-3 w-full py-3 px-6 rounded-xl"
        style={{
          background: "transparent",
          color: "#8b5a2b",
          border: "2px dashed #b87333",
        }}
        whileHover={{ scale: 1.01, borderColor: "#8b5a2b" }}
        whileTap={{ scale: 0.99 }}
        onClick={handleClick}
        disabled={isProcessing}
      >
        <span className="flex items-center justify-center gap-2">
          <Upload className="w-5 h-5" />
          <span>or Upload from Gallery</span>
        </span>
      </motion.button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
