import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink } from 'lucide-react';

const podcasts = [
  {
    title: "Accounting Today",
    description: "Weekly discussions on accounting trends and best practices",
    imageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800",
    embedUrl: "https://open.spotify.com/embed/show/2X2qx4Yx2X4Z8Y9Z9Z9Z9Z",
    externalUrl: "https://www.accountingtoday.com/podcast"
  },
  {
    title: "Malaysian Business Radio",
    description: "Local business insights and accounting updates",
    imageUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800",
    embedUrl: "https://open.spotify.com/embed/show/3X3qx4Yx2X4Z8Y9Z9Z9Z9Z",
    externalUrl: "https://www.mbr.com.my/podcast"
  },
  {
    title: "Tax Talk Malaysia",
    description: "Expert discussions on Malaysian taxation",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800",
    embedUrl: "https://open.spotify.com/embed/show/4X4qx4Yx2X4Z8Y9Z9Z9Z9Z",
    externalUrl: "https://www.taxtalk.my/podcast"
  }
];

export default function PodcastSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Featured Podcasts</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {podcasts.map((podcast) => (
          <Card key={podcast.title} className="group overflow-hidden">
            <div className="aspect-video relative overflow-hidden">
              <img
                src={podcast.imageUrl}
                alt={podcast.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30"
                  onClick={() => window.open(podcast.externalUrl, '_blank')}
                >
                  <Play className="h-6 w-6 text-white" />
                </Button>
              </div>
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{podcast.title}</CardTitle>
              <CardDescription className="text-sm">{podcast.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Button
                variant="outline"
                className="w-full text-sm"
                onClick={() => window.open(podcast.externalUrl, '_blank')}
              >
                Listen Now
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}