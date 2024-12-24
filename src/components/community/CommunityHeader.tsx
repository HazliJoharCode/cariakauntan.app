import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import CreatePostDialog from './CreatePostDialog';
import { useState } from 'react';

export default function CommunityHeader({ onSearch }: { onSearch: (query: string) => void }) {
  const { user, openAuthDialog } = useAuth();
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Search discussions..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => user ? setShowCreatePost(true) : openAuthDialog('sign-in')}
          className="w-full sm:w-auto"
        >
          Start a Discussion
        </Button>
      </div>

      {showCreatePost && (
        <CreatePostDialog
          isOpen={showCreatePost}
          onClose={() => setShowCreatePost(false)}
        />
      )}
    </div>
  );
}