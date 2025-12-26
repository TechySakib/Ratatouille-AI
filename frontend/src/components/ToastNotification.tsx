import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastNotificationProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function ToastNotification({
  message,
  type,
  isVisible,
  onClose,
  duration = 3000,
}: ToastNotificationProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <AlertCircle className="w-5 h-5" />;
      case "info":
        return <Info className="w-5 h-5" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return {
          bg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
          border: "#22c55e",
          icon: "#22c55e",
          text: "#166534",
        };
      case "error":
        return {
          bg: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
          border: "#ef4444",
          icon: "#ef4444",
          text: "#991b1b",
        };
      case "info":
        return {
          bg: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
          border: "#3b82f6",
          icon: "#3b82f6",
          text: "#1e40af",
        };
    }
  };

  const colors = getColors();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
        >
          <motion.div
            className="rounded-2xl p-4 shadow-lg"
            style={{
              background: colors.bg,
              border: `2px solid ${colors.border}`,
            }}
            layout
          >
            <div className="flex items-start gap-3">
              <div style={{ color: colors.icon }} className="flex-shrink-0 pt-0.5">
                {getIcon()}
              </div>
              
              <p className="flex-1" style={{ color: colors.text }}>
                {message}
              </p>

              <button
                onClick={onClose}
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
                style={{ color: colors.text }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress bar */}
            {duration > 0 && (
              <motion.div
                className="mt-3 h-1 rounded-full"
                style={{ background: colors.border, opacity: 0.3 }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: colors.border }}
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: duration / 1000, ease: "linear" }}
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
