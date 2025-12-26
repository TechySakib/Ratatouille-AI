import { motion } from "motion/react";

export function Logo({ size = "large" }: { size?: "small" | "large" }) {
  const dimensions = size === "large" ? { width: 80, height: 80 } : { width: 48, height: 48 };
  
  return (
    <motion.div
      className="relative"
      style={dimensions}
      animate={{
        y: [0, -8, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Chef hat */}
        <ellipse cx="50" cy="35" rx="25" ry="8" fill="#fff" stroke="#2d2416" strokeWidth="2" />
        <path
          d="M 30 35 Q 30 25 35 22 Q 40 18 45 20 Q 50 15 55 20 Q 60 18 65 22 Q 70 25 70 35 L 70 42 Q 70 45 50 45 Q 30 45 30 42 Z"
          fill="#fff"
          stroke="#2d2416"
          strokeWidth="2"
        />
        <circle cx="38" cy="28" r="3" fill="#fff" opacity="0.6" />
        
        {/* Rat head */}
        <ellipse cx="50" cy="58" rx="20" ry="18" fill="#8B7355" stroke="#2d2416" strokeWidth="2" />
        
        {/* Ears */}
        <ellipse cx="35" cy="48" rx="8" ry="10" fill="#8B7355" stroke="#2d2416" strokeWidth="2" />
        <ellipse cx="65" cy="48" rx="8" ry="10" fill="#8B7355" stroke="#2d2416" strokeWidth="2" />
        <ellipse cx="35" cy="48" rx="5" ry="7" fill="#d4a574" />
        <ellipse cx="65" cy="48" rx="5" ry="7" fill="#d4a574" />
        
        {/* Eyes */}
        <circle cx="43" cy="56" r="4" fill="#2d2416" />
        <circle cx="57" cy="56" r="4" fill="#2d2416" />
        <circle cx="44" cy="55" r="1.5" fill="#fff" />
        <circle cx="58" cy="55" r="1.5" fill="#fff" />
        
        {/* Nose */}
        <ellipse cx="50" cy="62" rx="3" ry="2" fill="#d4a574" />
        
        {/* Whiskers */}
        <line x1="30" y1="58" x2="38" y2="58" stroke="#2d2416" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="30" y1="62" x2="38" y2="60" stroke="#2d2416" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="70" y1="58" x2="62" y2="58" stroke="#2d2416" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="70" y1="62" x2="62" y2="60" stroke="#2d2416" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Wooden spoon */}
        <motion.g
          animate={{
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "75px 70px" }}
        >
          <ellipse cx="82" cy="68" rx="6" ry="8" fill="#b87333" stroke="#2d2416" strokeWidth="2" />
          <rect x="73" y="72" width="4" height="20" rx="2" fill="#8b5a2b" stroke="#2d2416" strokeWidth="1.5" />
        </motion.g>
      </svg>
    </motion.div>
  );
}
