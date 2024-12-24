import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';
import PodcastSection from '@/components/media/PodcastSection';

const mediaItems = [
  {
    title: "Accountants Daily",
    description: "Latest news and insights for accounting professionals",
    imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800",
    link: "https://www.accountantsdaily.com.au/"
  },
  {
    title: "Malaysian Institute of Accountants",
    description: "Official regulatory body for accountants in Malaysia",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    link: "https://www.mia.org.my/"
  },
  {
    title: "Accounting Today",
    description: "Global accounting news and professional insights",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
    link: "https://www.accountingtoday.com/"
  },
  {
    title: "Journal of Accountancy",
    description: "Professional insights and technical guidance",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
    link: "https://www.journalofaccountancy.com/"
  }
];

export default function Media() {
  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Media & Resources</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Stay updated with the latest accounting news, professional insights, and industry resources.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 px-4 md:px-0">
        {mediaItems.map((item) => (
          <Card key={item.title} className="group overflow-hidden">
            <div className="aspect-video overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">{item.title}</CardTitle>
              <CardDescription className="text-sm">{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <Button
                variant="outline"
                className="w-full text-sm md:text-base"
                onClick={() => window.open(item.link, '_blank')}
              >
                Visit Website
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="px-4 md:px-0">
        <PodcastSection />
      </div>
    </div>
  );
}