import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import AdminGuard from '../../components/auth/AdminGuard';
import { useListAdmins, useGrantAdminRole, useRevokeAdminRole } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, UserPlus, UserMinus, Shield, AlertCircle, ArrowLeft, Copy, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

function AdminManageAdminsContent() {
  const { identity } = useInternetIdentity();
  const { data: admins, isLoading, isError } = useListAdmins();
  const grantAdmin = useGrantAdminRole();
  const revokeAdmin = useRevokeAdminRole();

  const [newPrincipalText, setNewPrincipalText] = useState('');
  const [revokeConfirmPrincipal, setRevokeConfirmPrincipal] = useState<Principal | null>(null);
  const [copiedPrincipal, setCopiedPrincipal] = useState<string | null>(null);

  const currentUserPrincipal = identity?.getPrincipal().toString();

  const handleGrantAdmin = async () => {
    if (!newPrincipalText.trim()) {
      toast.error('Please enter a Principal ID');
      return;
    }

    try {
      const principal = Principal.fromText(newPrincipalText.trim());
      await grantAdmin.mutateAsync(principal);
      toast.success('Admin access granted', {
        description: `Successfully granted admin permissions to ${newPrincipalText.trim()}`,
      });
      setNewPrincipalText('');
    } catch (error) {
      console.error('Failed to grant admin:', error);
      toast.error('Failed to grant admin access', {
        description: error instanceof Error ? error.message : 'Invalid Principal ID or operation failed.',
      });
    }
  };

  const handleRevokeAdmin = async (principal: Principal) => {
    try {
      await revokeAdmin.mutateAsync(principal);
      toast.success('Admin access revoked', {
        description: `Successfully revoked admin permissions from ${principal.toString()}`,
      });
      setRevokeConfirmPrincipal(null);
    } catch (error) {
      console.error('Failed to revoke admin:', error);
      toast.error('Failed to revoke admin access', {
        description: error instanceof Error ? error.message : 'Operation failed.',
      });
    }
  };

  const handleCopyPrincipal = (principalText: string) => {
    navigator.clipboard.writeText(principalText);
    setCopiedPrincipal(principalText);
    toast.success('Principal copied to clipboard');
    setTimeout(() => setCopiedPrincipal(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading administrators...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load administrators. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4 gap-2">
          <Link to="/admin">
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Inbox
          </Link>
        </Button>
        <h1 className="mb-2 text-4xl font-bold tracking-tight">Manage Administrators</h1>
        <p className="text-lg text-muted-foreground">
          Grant or revoke admin access for Internet Identity principals.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Grant Admin Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Grant Admin Access
            </CardTitle>
            <CardDescription>
              Add a new administrator by entering their Internet Identity Principal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-principal">Principal ID</Label>
              <Input
                id="new-principal"
                value={newPrincipalText}
                onChange={(e) => setNewPrincipalText(e.target.value)}
                placeholder="Enter Principal ID (e.g., xxxxx-xxxxx-xxxxx-xxxxx-xxx)"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                The user must provide you with their Principal ID from the access denied screen.
              </p>
            </div>
            <Button
              onClick={handleGrantAdmin}
              disabled={grantAdmin.isPending || !newPrincipalText.trim()}
              className="w-full gap-2"
            >
              {grantAdmin.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Granting Access...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Grant Admin Access
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Current Administrators */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Current Administrators
            </CardTitle>
            <CardDescription>
              {admins?.length || 0} administrator{admins?.length !== 1 ? 's' : ''} with full access
            </CardDescription>
          </CardHeader>
          <CardContent>
            {admins && admins.length > 0 ? (
              <div className="space-y-3">
                {admins.map((admin) => {
                  const adminText = admin.toString();
                  const isCurrentUser = adminText === currentUserPrincipal;
                  return (
                    <div
                      key={adminText}
                      className="flex items-center justify-between gap-3 rounded-lg border p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <code className="truncate text-xs font-mono">{adminText}</code>
                          {isCurrentUser && (
                            <Badge variant="secondary" className="shrink-0 text-xs">
                              You
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyPrincipal(adminText)}
                        >
                          {copiedPrincipal === adminText ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setRevokeConfirmPrincipal(admin)}
                          disabled={isCurrentUser}
                          title={isCurrentUser ? 'Cannot revoke your own admin access' : 'Revoke admin access'}
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground">No administrators found</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Alert className="mt-8">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Administrators have full access to all admin features including viewing inquiries, 
          editing content, and managing other administrators. Only grant admin access to trusted users.
        </AlertDescription>
      </Alert>

      {/* Revoke Confirmation Dialog */}
      <Dialog open={!!revokeConfirmPrincipal} onOpenChange={() => setRevokeConfirmPrincipal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Admin Access</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke admin permissions from this user? They will immediately lose access to all admin features.
            </DialogDescription>
          </DialogHeader>
          {revokeConfirmPrincipal && (
            <div className="rounded-lg bg-muted p-3">
              <p className="mb-1 text-xs font-medium text-muted-foreground">Principal ID:</p>
              <code className="break-all text-xs font-mono">{revokeConfirmPrincipal.toString()}</code>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeConfirmPrincipal(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => revokeConfirmPrincipal && handleRevokeAdmin(revokeConfirmPrincipal)}
              disabled={revokeAdmin.isPending}
            >
              {revokeAdmin.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Revoke Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminManageAdminsPage() {
  return (
    <AdminGuard>
      <AdminManageAdminsContent />
    </AdminGuard>
  );
}
