import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Building2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import MergerListingForm from './MergerListingForm';

export default function MergerListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    loadListings();
  }, [user]);

  const loadListings = async () => {
    try {
      const { data, error } = await supabase
        .from('merger_listings')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedListing(null);
    loadListings();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-pulse">Loading listings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">M&A Listings</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Listing
        </Button>
      </div>

      <div className="grid gap-4">
        {listings.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Building2 className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No listings yet</p>
              <Button 
                variant="outline" 
                onClick={() => setShowForm(true)}
                className="mt-4"
              >
                Create your first listing
              </Button>
            </CardContent>
          </Card>
        ) : (
          listings.map((listing: any) => (
            <Card key={listing.id} className="group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{listing.title}</CardTitle>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSelectedListing(listing);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{listing.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <span className="ml-2 font-medium">{listing.type}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="ml-2 font-medium">{listing.revenue_range}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <span className="ml-2 font-medium">{listing.location}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <span className="ml-2 font-medium capitalize">{listing.status}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedListing ? 'Edit Listing' : 'Create New Listing'}
            </DialogTitle>
          </DialogHeader>
          <MergerListingForm
            onSuccess={handleSuccess}
            existingListing={selectedListing}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}