// src/components/ResendVerification.tsx
'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Button from './Button';

export function ResendVerification({ email }: { email: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleResend = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification email');
      }

      toast.success('Verification email sent successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to resend verification email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleResend}
      isLoading={isLoading}
      className="mt-4"
    >
      Resend Verification Email
    </Button>
  );
}