import { motion, AnimatePresence } from 'framer-motion';

export default function TrailerModal({ videoKey, onClose }) {
    return (
        <AnimatePresence>
            {videoKey !== undefined && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.85, opacity: 0, y: 30 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl border border-primary/20 bg-surface"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-primary transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        {videoKey ? (
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
                                title="Movie Trailer"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                                <span className="material-symbols-outlined text-6xl text-primary/30">videocam_off</span>
                                <p className="text-lg text-slate-400">Trailer currently unavailable</p>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
