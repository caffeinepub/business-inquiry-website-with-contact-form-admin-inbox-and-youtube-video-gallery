import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import AdminGuard from '../../components/auth/AdminGuard';
import { useGetAllFeatureBoxes, useSaveFeatureBox } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Home, Shield, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { FeatureBox } from '../../backend';

interface BoxFormData {
  title: string;
  description: string;
  buttonLabel: string;
  targetRoute: string;
}

function AdminHomeBoxesContent() {
  const { data: featureBoxes, isLoading } = useGetAllFeatureBoxes();
  const saveFeatureBox = useSaveFeatureBox();

  const [box1, setBox1] = useState<BoxFormData>({
    title: 'Dirtbike Videos',
    description: 'Watch the latest dirtbike videos featuring trail rides, jumps, tricks, and all the two-stroke action.',
    buttonLabel: 'View Videos',
    targetRoute: '/videos',
  });

  const [box2, setBox2] = useState<BoxFormData>({
    title: 'Get in Touch',
    description: 'Got questions about bikes, gear, or riding? Send me a message and I\'ll get back to you.',
    buttonLabel: 'Contact Me',
    targetRoute: '/contact',
  });

  // Load existing data when available
  useEffect(() => {
    if (featureBoxes && featureBoxes.length >= 2) {
      setBox1({
        title: featureBoxes[0].title,
        description: featureBoxes[0].description,
        buttonLabel: featureBoxes[0].buttonLabel,
        targetRoute: featureBoxes[0].targetRoute,
      });
      setBox2({
        title: featureBoxes[1].title,
        description: featureBoxes[1].description,
        buttonLabel: featureBoxes[1].buttonLabel,
        targetRoute: featureBoxes[1].targetRoute,
      });
    }
  }, [featureBoxes]);

  const handleSave = async () => {
    try {
      // Save both boxes
      await saveFeatureBox.mutateAsync({
        id: BigInt(0),
        box: box1,
      });
      await saveFeatureBox.mutateAsync({
        id: BigInt(1),
        box: box2,
      });
      
      toast.success('Home page boxes updated successfully!', {
        description: 'Your changes are now live on the home page.',
      });
    } catch (error) {
      console.error('Failed to save feature boxes:', error);
      toast.error('Failed to save changes', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading feature boxes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <Button asChild variant="ghost" className="gap-2">
            <Link to="/admin">
              <ArrowLeft className="h-4 w-4" />
              Back to Admin Inbox
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link to="/admin/admins">
              <Shield className="h-4 w-4" />
              Manage Admins
            </Link>
          </Button>
        </div>
        <h1 className="mb-2 text-4xl font-bold tracking-tight">Edit Home Page Boxes</h1>
        <p className="text-lg text-muted-foreground">
          Customize the two feature cards displayed on the home page.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Box 1 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Feature Box 1
            </CardTitle>
            <CardDescription>First card on the home page (left side)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="box1-title">Title</Label>
              <Input
                id="box1-title"
                value={box1.title}
                onChange={(e) => setBox1({ ...box1, title: e.target.value })}
                placeholder="Enter title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="box1-description">Description</Label>
              <Textarea
                id="box1-description"
                value={box1.description}
                onChange={(e) => setBox1({ ...box1, description: e.target.value })}
                placeholder="Enter description"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="box1-button">Button Label</Label>
              <Input
                id="box1-button"
                value={box1.buttonLabel}
                onChange={(e) => setBox1({ ...box1, buttonLabel: e.target.value })}
                placeholder="Enter button text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="box1-route">Target Route</Label>
              <Input
                id="box1-route"
                value={box1.targetRoute}
                onChange={(e) => setBox1({ ...box1, targetRoute: e.target.value })}
                placeholder="/videos"
              />
              <p className="text-xs text-muted-foreground">
                The page to navigate to when the button is clicked (e.g., /videos, /contact)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Box 2 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Feature Box 2
            </CardTitle>
            <CardDescription>Second card on the home page (right side)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="box2-title">Title</Label>
              <Input
                id="box2-title"
                value={box2.title}
                onChange={(e) => setBox2({ ...box2, title: e.target.value })}
                placeholder="Enter title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="box2-description">Description</Label>
              <Textarea
                id="box2-description"
                value={box2.description}
                onChange={(e) => setBox2({ ...box2, description: e.target.value })}
                placeholder="Enter description"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="box2-button">Button Label</Label>
              <Input
                id="box2-button"
                value={box2.buttonLabel}
                onChange={(e) => setBox2({ ...box2, buttonLabel: e.target.value })}
                placeholder="Enter button text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="box2-route">Target Route</Label>
              <Input
                id="box2-route"
                value={box2.targetRoute}
                onChange={(e) => setBox2({ ...box2, targetRoute: e.target.value })}
                placeholder="/contact"
              />
              <p className="text-xs text-muted-foreground">
                The page to navigate to when the button is clicked (e.g., /videos, /contact)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saveFeatureBox.isPending}
          size="lg"
          className="gap-2"
        >
          {saveFeatureBox.isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default function AdminHomeBoxesPage() {
  return (
    <AdminGuard>
      <AdminHomeBoxesContent />
    </AdminGuard>
  );
}
