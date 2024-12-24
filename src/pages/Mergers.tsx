import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ArrowRight, ExternalLink } from 'lucide-react';

const mergerListings = [
  {
    title: "Established Accounting Firm in KL",
    description: "30-year-old firm specializing in audit and tax services. Strong client base in manufacturing sector.",
    revenue: "RM 2-5M",
    location: "Kuala Lumpur",
    type: "Full Practice Sale"
  },
  {
    title: "Tax Practice Division",
    description: "Growing tax consulting division with focus on international taxation. Established client relationships.",
    revenue: "RM 1-2M",
    location: "Penang",
    type: "Partial Sale"
  },
  {
    title: "Boutique Advisory Firm",
    description: "Specialized in SME advisory and corporate finance. High growth potential in fintech sector.",
    revenue: "RM 3-4M",
    location: "Johor",
    type: "Partnership Opportunity"
  }
];

export default function Mergers() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Firm M&A Opportunities</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Connect with accounting firms looking to buy, sell, or merge practices. All listings are confidential and verified.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {mergerListings.map((listing) => (
          <Card key={listing.title} className="group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{listing.title}</CardTitle>
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>{listing.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{listing.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Annual Revenue:</span>
                    <span className="font-medium">{listing.revenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{listing.location}</span>
                  </div>
                </div>
                <Button className="w-full group-hover:translate-x-1 transition-transform">
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" onClick={() => window.open('#', '_blank')}>
          List Your Practice
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}