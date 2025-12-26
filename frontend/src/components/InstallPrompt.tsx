import { motion, AnimatePresence } from "motion/react";
import { Download, X } from "lucide-react";
import { useState, useEffect } from "react";

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install prompt
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`User response to the install prompt: ${outcome}`);

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store dismissal in localStorage to not show again for a while
    localStorage.setItem("installPromptDismissed", Date.now().toString());
  };

  // Check if user previously dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem("installPromptDismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const daysSinceDismissal = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      
      // Show again after 7 days
      if (daysSinceDismissal < 7) {
        setShowPrompt(false);
      }
    }
  }, []);

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-8 md:w-96"
        >
          <motion.div
            className="relative rounded-2xl p-6 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #f4e8d0 0%, #e8dcc0 100%)",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)",
              border: "2px solid #b87333",
            }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Close button */}
            <button
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(139, 90, 43, 0.2)",
                color: "#8b5a2b",
              }}
              onClick={handleDismiss}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="flex items-start gap-4">
              <motion.div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #b87333 0%, #8b5a2b 100%)",
                }}
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span className="text-2xl">👨‍🍳</span>
              </motion.div>

              <div className="flex-1">
                <h4 style={{ color: "#800020" }}>Install Ratatouille AI</h4>
                <p className="mt-1 text-sm" style={{ color: "#8b5a2b" }}>
                  Add to your home screen for quick access to your kitchen assistant!
                </p>

                <motion.button
                  className="mt-4 w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #b87333 0%, #8b5a2b 100%)",
                    color: "#fff",
                    boxShadow: "0 4px 12px rgba(139, 90, 43, 0.3)",
                  }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 6px 16px rgba(139, 90, 43, 0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleInstall}
                >
                  <Download className="w-4 h-4" />
                  <span>Install App</span>
                </motion.button>
              </div>
            </div>

            {/* Decorative elements */}
            <motion.div
              className="absolute -top-10 -right-10 w-32 h-32 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(255, 217, 102, 0.3), transparent)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
