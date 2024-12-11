// src/components/emails/VerificationEmail.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface VerificationEmailProps {
  verificationUrl: string;
  userName?: string;
}

export const VerificationEmail = ({
  verificationUrl,
  userName = '',
}: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address for Huubr</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.title}>Welcome to Huubr!</Text>
          <Text style={styles.text}>
            Hi {userName ? userName : 'there'},
          </Text>
          <Text style={styles.text}>
            Thank you for registering your business. Please verify your email address by
            clicking the button below:
          </Text>
          <Section style={styles.buttonContainer}>
            <Button 
              href={verificationUrl}
              style={styles.button}
            >
              Verify Email
            </Button>
          </Section>
          <Text style={styles.text}>
            Or copy and paste this URL into your browser:
          </Text>
          <Text style={styles.link}>
            {verificationUrl}
          </Text>
          <Hr style={styles.hr} />
          <Text style={styles.footer}>
            This link will expire in 24 hours. If you did not create an account,
            you can safely ignore this email.
          </Text>
        </Container>
      </Body> 
    </Html>
  );
};

const styles = {
  body: {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  },
  container: {
    margin: '0 auto',
    padding: '20px 0 48px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  text: {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#333',
  },
  buttonContainer: {
    marginTop: '32px',
    marginBottom: '32px',
  },
  button: {
    backgroundColor: '#A4C639',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '12px 24px',
  },
  link: {
    fontSize: '14px',
    color: '#2563eb',
    wordBreak: 'break-all' as const,
  },
  hr: {
    borderColor: '#e5e7eb',
    margin: '16px 0',
  },
  footer: {
    fontSize: '14px',
    color: '#666666',
    marginTop: '32px',
  },
} as const;

export default VerificationEmail;