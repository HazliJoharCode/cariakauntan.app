import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useVotes } from '@/hooks/useVotes';
import { toast } from '@/hooks/use-toast';
import CommunityHeader from '@/components/community/CommunityHeader';
import { CommunityPolicies } from '@/components/community/CommunityPolicies';
import PostCard from '@/components/community/PostCard';

export default function Community() {
  const { user } = useAuth();
  const { pendingVotes, vote } = useVotes();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          *,
          author:profiles(full_name, is_moderator),
          comments:forum_comments(count),
          votes:forum_votes(vote_type)
        `)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      const processedPosts = data.map(post => ({
        ...post,
        upvotes: post.votes?.filter(v => v.vote_type === 'up').length || 0,
        downvotes: post.votes?.filter(v => v.vote_type === 'down').length || 0,
        comment_count: post.comments[0]?.count || 0
      }));

      setPosts(processedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load posts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
    
    const channel = supabase
      .channel('forum_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'forum_posts' 
      }, () => {
        loadPosts();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    if (!user) return;
    await vote(postId, voteType, user.id);
  };

  const filteredPosts = posts
    .filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map(post => ({
      ...post,
      upvotes: post.upvotes + (pendingVotes[post.id] === 'up' ? 1 : 0),
      downvotes: post.downvotes + (pendingVotes[post.id] === 'down' ? 1 : 0)
    }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CommunityHeader onSearch={setSearchQuery} />
      
      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="grid gap-6">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onVote={handleVote}
              pendingVote={pendingVotes[post.id]}
            />
          ))}

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No discussions found</p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t py-6 mt-8">
        <div className="container mx-auto px-4 flex justify-center">
          <CommunityPolicies />
        </div>
      </footer>
    </div>
  );
}