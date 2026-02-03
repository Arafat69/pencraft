import { motion } from "framer-motion";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-background/95 backdrop-blur-sm">
      {/* Colorful background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 20 + 10,
              height: Math.random() * 20 + 10,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: [
                'hsl(var(--accent))',
                'hsl(var(--primary))',
                '#FF6B6B',
                '#4ECDC4',
                '#FFE66D',
                '#95E1D3',
                '#F38181',
                '#AA96DA',
              ][i % 8],
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Running cat animation */}
        <div className="relative w-32 h-24">
          {/* Ground/path */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-muted-foreground/30 to-transparent rounded-full"
            animate={{ scaleX: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* Cat body */}
          <motion.div
            className="absolute bottom-2 left-1/2"
            animate={{
              x: [-20, 20, -20],
              y: [0, -8, 0, -8, 0],
            }}
            transition={{
              x: { duration: 2, repeat: Infinity, ease: "linear" },
              y: { duration: 0.4, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <svg
              width="60"
              height="50"
              viewBox="0 0 60 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="-translate-x-1/2"
            >
              {/* Body */}
              <motion.ellipse
                cx="30"
                cy="30"
                rx="18"
                ry="12"
                className="fill-accent"
                animate={{ scaleY: [1, 0.9, 1] }}
                transition={{ duration: 0.2, repeat: Infinity }}
              />
              
              {/* Head */}
              <motion.circle
                cx="48"
                cy="22"
                r="10"
                className="fill-accent"
              />
              
              {/* Ears */}
              <motion.path
                d="M42 14 L45 6 L48 14"
                className="fill-accent"
              />
              <motion.path
                d="M48 14 L51 6 L54 14"
                className="fill-accent"
              />
              
              {/* Inner ears */}
              <path d="M43 13 L45 8 L47 13" className="fill-pink-300" />
              <path d="M49 13 L51 8 L53 13" className="fill-pink-300" />
              
              {/* Eyes */}
              <motion.circle
                cx="45"
                cy="21"
                r="2"
                className="fill-background"
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
              />
              <motion.circle
                cx="51"
                cy="21"
                r="2"
                className="fill-background"
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
              />
              
              {/* Nose */}
              <circle cx="48" cy="25" r="1.5" className="fill-pink-400" />
              
              {/* Tail */}
              <motion.path
                d="M12 28 Q2 20 8 10"
                stroke="hsl(var(--accent))"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                animate={{ d: ["M12 28 Q2 20 8 10", "M12 28 Q2 28 8 18", "M12 28 Q2 20 8 10"] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              
              {/* Front legs */}
              <motion.path
                d="M38 38 L40 46"
                stroke="hsl(var(--accent))"
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ d: ["M38 38 L40 46", "M38 38 L34 46", "M38 38 L40 46"] }}
                transition={{ duration: 0.2, repeat: Infinity }}
              />
              <motion.path
                d="M42 38 L44 46"
                stroke="hsl(var(--accent))"
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ d: ["M42 38 L44 46", "M42 38 L48 46", "M42 38 L44 46"] }}
                transition={{ duration: 0.2, repeat: Infinity, delay: 0.1 }}
              />
              
              {/* Back legs */}
              <motion.path
                d="M22 38 L20 46"
                stroke="hsl(var(--accent))"
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ d: ["M22 38 L20 46", "M22 38 L26 46", "M22 38 L20 46"] }}
                transition={{ duration: 0.2, repeat: Infinity, delay: 0.1 }}
              />
              <motion.path
                d="M26 38 L24 46"
                stroke="hsl(var(--accent))"
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ d: ["M26 38 L24 46", "M26 38 L18 46", "M26 38 L24 46"] }}
                transition={{ duration: 0.2, repeat: Infinity }}
              />
            </svg>
          </motion.div>

          {/* Dust particles */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-2 left-1/4 w-2 h-2 rounded-full bg-muted-foreground/40"
              animate={{
                x: [-10 - i * 5, -30 - i * 10],
                y: [0, -5, 0],
                opacity: [0.6, 0],
                scale: [0.8, 0.3],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        {/* Loading text with rainbow effect */}
        <motion.div
          className="flex items-center gap-1"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {["L", "o", "a", "d", "i", "n", "g"].map((letter, i) => (
            <motion.span
              key={i}
              className="text-lg font-medium"
              style={{
                color: [
                  '#FF6B6B',
                  '#FF8E53',
                  '#FFE66D',
                  '#4ECDC4',
                  '#45B7D1',
                  '#96CEB4',
                  '#AA96DA',
                ][i],
              }}
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            >
              {letter}
            </motion.span>
          ))}
          <motion.span
            className="text-lg font-medium text-primary"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ...
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
}
