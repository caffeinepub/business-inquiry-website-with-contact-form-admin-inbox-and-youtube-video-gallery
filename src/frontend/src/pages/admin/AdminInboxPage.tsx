import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import AdminGuard from '../../components/auth/AdminGuard';
import { useGetAllInquiries, useDeleteInquiry } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, Trash2, AlertCircle, Inbox, Home, Shield } from 'lucide-react';
import type { Inquiry } from '../../backend';

function AdminInboxContent() {
  const { data: inquiries, isLoading, isError } = useGetAllInquiries();
  const deleteInquiry = useDeleteInquiry();
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<bigint | null>(null);

  const sortedInquiries = inquiries
    ? [...inquiries].sort((a, b) => Number(b.timestamp - a.timestamp))
    : [];

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteInquiry.mutateAsync(id);
      setDeleteConfirmId(null);
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry(null);
      }
    } catch (error) {
      console.error('Failed to delete inquiry:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading inquiries...</p>
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
            Failed to load inquiries. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight">Admin Inbox</h1>
          <p className="text-lg text-muted-foreground">
            Manage business inquiries and messages from visitors.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/admin/home-boxes">
              <Home className="h-4 w-4" />
              Edit Home Boxes
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link to="/admin/admins">
              <Shield className="h-4 w-4" />
              Manage Admins
            </Link>
          </Button>
        </div>
      </div>

      {sortedInquiries.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[400px] flex-col items-center justify-center py-12">
            <Inbox className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No inquiries yet</h3>
            <p className="text-sm text-muted-foreground">
              When visitors submit the contact form, their messages will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sortedInquiries.map((inquiry) => (
            <Card
              key={inquiry.id.toString()}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => setSelectedInquiry(inquiry)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-lg">{inquiry.subject}</CardTitle>
                    </div>
                    <CardDescription>
                      From: {inquiry.senderName} ({inquiry.senderEmail})
                      {inquiry.company && ` • ${inquiry.company}`}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {formatDate(inquiry.timestamp)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {inquiry.message}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Inquiry Detail Dialog */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="max-w-2xl">
          {selectedInquiry && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedInquiry.subject}</DialogTitle>
                <DialogDescription>
                  Received on {formatDate(selectedInquiry.timestamp)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="mb-1 text-sm font-medium">From</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedInquiry.senderName} ({selectedInquiry.senderEmail})
                  </p>
                </div>
                {selectedInquiry.company && (
                  <div>
                    <h4 className="mb-1 text-sm font-medium">Company</h4>
                    <p className="text-sm text-muted-foreground">{selectedInquiry.company}</p>
                  </div>
                )}
                <div>
                  <h4 className="mb-1 text-sm font-medium">Message</h4>
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                    {selectedInquiry.message}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteConfirmId(selectedInquiry.id)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Inquiry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this inquiry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              disabled={deleteInquiry.isPending}
            >
              {deleteInquiry.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminInboxPage() {
  return (
    <AdminGuard>
      <AdminInboxContent />
    </AdminGuard>
  );
}
