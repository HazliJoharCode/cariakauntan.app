import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AccountantCard } from './AccountantCard';
import ContactDialog from '../ContactDialog';
import RatingDialog from '../ratings/RatingDialog';
import { accountants } from '@/data/accountants';
import type { Accountant } from '@/data/accountants';

interface AccountantListProps {
  searchQuery: string;
  selectedServices: string[];
  selectedCountry: string | null;
  selectedRegion: string | null;
}

export function AccountantList({ 
  searchQuery, 
  selectedServices,
  selectedCountry,
  selectedRegion 
}: AccountantListProps) {
  const [selectedAccountant, setSelectedAccountant] = useState<Accountant | null>(null);
  const [showRatingDialog, setShowRatingDialog] = useState(false);

  const filteredAccountants = accountants.filter(accountant => {
    // Search query filter
    const matchesSearch = accountant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      accountant.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Services filter
    const matchesServices = selectedServices.length === 0 || 
      selectedServices.some(service => accountant.services.includes(service));
    
    // Location filter
    let matchesLocation = true;
    if (selectedCountry === 'MY') {
      if (selectedRegion) {
        matchesLocation = accountant.location.toLowerCase().includes(selectedRegion.toLowerCase());
      } else {
        matchesLocation = accountant.location.toLowerCase().includes('malaysia') ||
          ['kuala lumpur', 'selangor', 'penang', 'johor', 'perak'].some(
            region => accountant.location.toLowerCase().includes(region.toLowerCase())
          );
      }
    } else if (selectedCountry) {
      const countryName = {
        'SG': 'singapore',
        'ID': 'indonesia',
        'TH': 'thailand',
        'VN': 'vietnam',
        'PH': 'philippines'
      }[selectedCountry];
      matchesLocation = accountant.location.toLowerCase().includes(countryName || '');
    }
    
    return matchesSearch && matchesServices && matchesLocation;
  });

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Item animation variants
  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    show: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:gap-6"
        >
          {filteredAccountants.map((accountant) => (
            <motion.div
              key={accountant.id}
              variants={itemVariants}
              layout
              layoutId={accountant.id}
            >
              <AccountantCard
                accountant={accountant}
                onContact={() => setSelectedAccountant(accountant)}
                onRate={() => {
                  setSelectedAccountant(accountant);
                  setShowRatingDialog(true);
                }}
              />
            </motion.div>
          ))}

          {filteredAccountants.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-12 bg-muted/50 rounded-lg"
            >
              <p className="text-muted-foreground">
                No accountants found matching your criteria
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {selectedAccountant && !showRatingDialog && (
        <ContactDialog
          isOpen={true}
          onClose={() => setSelectedAccountant(null)}
          accountant={selectedAccountant}
        />
      )}

      {selectedAccountant && showRatingDialog && (
        <RatingDialog
          isOpen={true}
          onClose={() => {
            setSelectedAccountant(null);
            setShowRatingDialog(false);
          }}
          providerId={selectedAccountant.id}
          providerName={selectedAccountant.name}
        />
      )}
    </>
  );
}