import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Salad } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface AddIngredientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (name: string) => void;
}

export function AddIngredientModal({ isOpen, onClose, onAdd }: AddIngredientModalProps) {
    const [value, setValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            onAdd(value.trim());
            setValue("");
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
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
                        className="relative w-full max-w-sm rounded-3xl p-6"
                        style={{
                            background: "linear-gradient(135deg, #f4e8d0 0%, #e8dcc0 100%)",
                            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                            border: "2px solid #d4a574"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            className="absolute top-4 right-4 text-[#8b5a2b] hover:text-[#800020] transition-colors"
                            onClick={onClose}
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col items-center mb-6">
                            <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center" style={{ background: "#4ade80", color: "#fff" }}>
                                <Salad className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold" style={{ color: "#800020" }}>Add Ingredient</h3>
                            <p className="text-sm opacity-80" style={{ color: "#8b5a2b" }}>What else is in your fridge?</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="relative mb-6">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all"
                                    style={{
                                        background: "white",
                                        borderColor: "#d4a574",
                                        color: "#2d2416"
                                    }}
                                    placeholder="e.g. Avocado"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 rounded-xl font-medium transition-colors"
                                    style={{ color: "#8b5a2b", background: "rgba(139, 90, 43, 0.1)" }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!value.trim()}
                                    className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-white transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ background: "#800020" }}
                                >
                                    <Plus className="w-4 h-4" />
                                    Add
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
