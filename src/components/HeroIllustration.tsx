import { motion } from "framer-motion";

export default function HeroIllustration() {
  return (
    <div className="relative w-full h-full min-h-[300px] lg:min-h-[400px] flex items-center justify-center">
      {/* Background glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-gradient-radial from-accent/20 via-transparent to-transparent rounded-full blur-3xl"
      />

      {/* Main floating elements container */}
      <div className="relative w-full max-w-md">
        {/* Floating book/pen icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-0 right-0 lg:right-10"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-6xl lg:text-7xl"
          >
            ✍️
          </motion.div>
        </motion.div>

        {/* Floating lightbulb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute top-20 left-0 lg:left-5"
        >
          <motion.div
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-5xl lg:text-6xl"
          >
            💡
          </motion.div>
        </motion.div>

        {/* Floating sparkles */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="absolute top-5 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [1, 0.8, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-4xl lg:text-5xl"
          >
            ✨
          </motion.div>
        </motion.div>

        {/* Floating book stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute bottom-10 left-10"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="text-5xl lg:text-6xl"
          >
            📚
          </motion.div>
        </motion.div>

        {/* Floating coffee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-0 right-5"
        >
          <motion.div
            animate={{ 
              y: [0, -5, 0],
              rotate: [0, -3, 3, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="text-5xl lg:text-6xl"
          >
            ☕
          </motion.div>
        </motion.div>

        {/* Center main element - quill and ink */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex items-center justify-center"
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="text-8xl lg:text-9xl drop-shadow-2xl"
          >
            🪶
          </motion.div>
        </motion.div>

        {/* Floating hearts for reader love */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="absolute top-16 right-20"
        >
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-3xl"
          >
            💖
          </motion.div>
        </motion.div>

        {/* Floating star */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="absolute bottom-20 right-24"
        >
          <motion.div
            animate={{ 
              rotate: [0, 180, 360],
              scale: [1, 1.3, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="text-3xl"
          >
            ⭐
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
