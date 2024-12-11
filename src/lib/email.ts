// src/lib/email.ts
import { Resend } from 'resend';
import type { ReactElement } from 'react';
import { render } from '@react-email/render';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailProps {
  to: string;
  subject: string;
  react?: ReactElement;
  html?: string;
}

// src/lib/email.ts
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function sendEmailWithRetry({ to, subject, react, html }: SendEmailProps) {
  let lastError: Error | unknown;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await sendEmail({ to, subject, react, html });
      return result;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY * attempt); // Exponential backoff
        continue;
      }
    }
  }

  throw lastError;
}

export async function sendEmail({ to, subject, react, html }: SendEmailProps) {
  if (!react && !html) {
    throw new Error('Either react or html must be provided');
  }

  try {
    let htmlContent: string;
    
    if (react) {
      // Ensure render returns a string
      htmlContent = await render(react);
    } else {
      htmlContent = html as string;
    }

    // console.log('Sending email with HTML content:', htmlContent);

    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html: htmlContent,
    });

    return result;
  } catch (error) {
    // console.error('Failed to send email:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    throw error;
  }
}