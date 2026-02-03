import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';

export default function InquirySuccessPanel() {
  return (
    <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
      <AlertTitle className="text-green-900 dark:text-green-100">Message Sent Successfully!</AlertTitle>
      <AlertDescription className="text-green-800 dark:text-green-200">
        Thank you for reaching out. We've received your inquiry and will get back to you as soon as possible.
      </AlertDescription>
    </Alert>
  );
}
