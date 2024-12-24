import { motion } from 'framer-motion';
import { ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { HeroIllustration } from '@/components/illustrations/HeroIllustration';
import { AnimatedTitle } from '@/components/AnimatedTitle';

interface HomeProps {
  onEnterApp: () => void;
}

export default function Home({ onEnterApp }: HomeProps) {
  const { openAuthDialog } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="container mx-auto px-4 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content - centered on mobile */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 text-center lg:text-left order-2 lg:order-1"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-black"
            >
              List your firm to{' '}
              <AnimatedTitle />
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0"
            >
              Join the Premier Platform for Accounting Firms and Future Accountants. 
              Sign up now and shape the future of accounting.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                onClick={() => openAuthDialog()}
                className="bg-black hover:bg-black/90 text-white w-full sm:w-auto"
              >
                Connect Your Firm
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onEnterApp}
                className="w-full sm:w-auto"
              >
                Find Accountants
                <Users className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Illustration - shown at bottom on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative order-1 lg:order-2"
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </section>
    </div>
  );
}