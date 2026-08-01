import { motion } from "framer-motion";
import { FiCompass } from "react-icons/fi";

/** Full-page brand loader shown during route/data loading. */
export default function Loader({ label = "Preparing your journey…" }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-6">
      <motion.div
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-ocean shadow-lift"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-primary/40"
          animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
          className="text-primary-foreground"
        >
          <FiCompass size={34} />
        </motion.span>
      </motion.div>
      <p className="font-heading text-sm tracking-[0.2em] text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  );
}

/** Lightweight skeleton block for list/grid loading states. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-xl ${className}`} />;
}
