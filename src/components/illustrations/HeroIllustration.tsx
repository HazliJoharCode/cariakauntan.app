import { motion } from 'framer-motion';

export function HeroIllustration() {
  return (
    <div className="relative w-full h-[400px] bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl overflow-hidden">
      {/* Floating shapes with staggered animation */}
      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full"
      />
      
      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, -45, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-primary/30 rounded-lg"
      />

      {/* Main content card with entrance animation */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8,
          type: "spring",
          stiffness: 100 
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="w-48 h-48 bg-white rounded-2xl shadow-lg p-6 transform rotate-12">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-3 bg-primary/20 rounded mb-3"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "75%" }}
            transition={{ duration: 1, delay: 0.7 }}
            className="h-3 bg-primary/20 rounded mb-3"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "50%" }}
            transition={{ duration: 1, delay: 0.9 }}
            className="h-3 bg-primary/20 rounded"
          />
        </div>
      </motion.div>

      {/* Floating elements with continuous animation */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            rotate: [0, 360],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        >
          <div className="w-8 h-8 bg-primary/10 rounded-lg" />
        </motion.div>
      ))}

      {/* Animated connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        <motion.path
          d="M 100 100 Q 200 50 300 200"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary/20"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
    </div>
  );
}