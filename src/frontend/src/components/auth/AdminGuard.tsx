import { ReactNode } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../../hooks/useQueries';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, Loader2, LogIn, Copy, CheckCircle2 } from 'lucide-react';
import ProfileSetupDialog from './ProfileSetupDialog';
import { useState } from 'react';
import { toast } from 'sonner';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { identity, login, isInitializing: authInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: adminLoading, isFetched: adminFetched } = useIsCallerAdmin();
  const [copied, setCopied] = useState(false);

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  const currentPrincipal = identity?.getPrincipal().toString();

  const handleCopyPrincipal = () => {
    if (currentPrincipal) {
      navigator.clipboard.writeText(currentPrincipal);
      setCopied(true);
      toast.success('Principal copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Show loading state while checking authentication
  if (authInitializing || (isAuthenticated && (profileLoading || adminLoading))) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show profile setup dialog if needed
  if (showProfileSetup) {
    return <ProfileSetupDialog open={true} />;
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <Alert className="max-w-md">
          <LogIn className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription className="mt-2 space-y-4">
            <p>Please log in to access the admin area.</p>
            <Button onClick={login} className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show access denied if not admin
  if (adminFetched && !isAdmin) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <Card className="max-w-2xl border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" />
              <CardTitle>Access Denied</CardTitle>
            </div>
            <CardDescription>
              You do not have administrator permissions to access this area.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h4 className="mb-2 text-sm font-semibold">How Admin Access Works</h4>
              <p className="mb-3 text-sm text-muted-foreground">
                Admin permissions are based on your <strong>Internet Identity Principal</strong>, not your email address. 
                Only accounts that have been explicitly granted admin access can view this page.
              </p>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Your Current Principal:</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded bg-background px-3 py-2 text-xs font-mono break-all">
                    {currentPrincipal}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyPrincipal}
                    className="shrink-0"
                  >
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <Alert>
              <AlertDescription className="text-sm">
                <strong>Need admin access?</strong> Contact an existing administrator and provide them with your Principal ID above. 
                They can grant you admin permissions through the admin management page.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render children if authenticated and admin
  return <>{children}</>;
}

function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
