import { useState } from 'react';
import { Briefcase, Calendar, Mail, MapPin, Phone, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRatings } from '@/hooks/useRatings';
import { useVacancies } from '@/hooks/useVacancies';
import RatingStars from '../ratings/RatingStars';
import RatingsList from '../ratings/RatingsList';
import VerifiedBadge from '../VerifiedBadge';
import LicenseBadge from '../LicenseBadge';
import VacancyList from '../vacancies/VacancyList';
import type { Accountant } from '@/data/accountants';

interface AccountantCardProps {
  accountant: Accountant;
  onContact: () => void;
  onRate: () => void;
}

export function AccountantCard({ accountant, onContact, onRate }: AccountantCardProps) {
  const { averageRating, totalRatings, ratings } = useRatings(accountant.id);
  const { vacancies } = useVacancies(accountant.id);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showVacancies, setShowVacancies] = useState(false);

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader className="p-4">
        <div className="space-y-2">
          {/* Header section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{accountant.name}</CardTitle>
                {accountant.isVerified && <VerifiedBadge />}
              </div>
              <CardDescription>{accountant.company}</CardDescription>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowVacancies(!showVacancies)}
                className="flex-1 sm:flex-none"
              >
                <Briefcase className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Vacancies</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRate}
                className="flex-1 sm:flex-none"
              >
                <Star className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Rate</span>
              </Button>
              <Button 
                variant="default"
                size="sm" 
                onClick={onContact}
                className="flex-1 sm:flex-none bg-black hover:bg-black/90 text-white"
              >
                <Mail className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Contact</span>
              </Button>
            </div>
          </div>

          {/* Licenses */}
          <div className="flex flex-wrap gap-1.5">
            {accountant.licenses?.map((license) => (
              <LicenseBadge 
                key={license.type} 
                type={license.type} 
                verificationStatus={license.status} 
              />
            ))}
          </div>

          {/* Services */}
          <div className="flex flex-wrap gap-1.5">
            {accountant.services.map((service) => (
              <Badge key={service} variant="secondary" className="text-xs">
                {service}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-4">
        {/* Contact info */}
        <div className="grid gap-2 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
            <span className="text-muted-foreground">{accountant.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">{accountant.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">Available {accountant.availability}</span>
          </div>
        </div>

        {/* Vacancies section */}
        {showVacancies && (
          <div className="border-t pt-4">
            <VacancyList 
              vacancies={vacancies} 
              providerId={accountant.id}
            />
          </div>
        )}

        {/* Ratings section */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <RatingStars rating={averageRating} size="sm" />
              <span className="text-sm text-muted-foreground">
                ({totalRatings} {totalRatings === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm"
            >
              {isExpanded ? 'Show Less' : 'Show Reviews'}
            </Button>
          </div>
          {isExpanded && <RatingsList ratings={ratings} />}
        </div>
      </CardContent>
    </Card>
  );
}