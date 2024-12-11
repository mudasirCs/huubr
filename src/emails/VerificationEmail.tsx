// src/emails/VerificationEmail.tsx
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
        <Body style={main}>
          <Container style={container}>
            <Text style={paragraph}>Hi {userName},</Text>
            <Text style={paragraph}>
              Thank you for registering your business with Huubr. Please verify your email address by
              clicking the button below:
            </Text>
            <Section style={buttonContainer}>
              <Button
                pX={20}
                pY={12}
                style={button}
                href={verificationUrl}
              >
                Verify Email
              </Button>
            </Section>
            <Text style={paragraph}>
              Or copy and paste this URL into your browser:
            </Text>
            <Text style={paragraph}>
              <a href={verificationUrl} style={link}>
                {verificationUrl}
              </a>
            </Text>
            <Hr style={hr} />
            <Text style={footer}>
              This link will expire in 24 hours. If you did not create an account,
              you can safely ignore this email.
            </Text>
          </Container>
        </Body>
      </Html>
    );
  };
  
  export default VerificationEmail;
  
  const main = {
    backgroundColor: '#ffffff',
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };
  
  const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '560px',
  };
  
  const paragraph = {
    fontSize: '16px',
    lineHeight: '26px',
  };
  
  const button = {
    backgroundColor: '#A4C639',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '16px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    width: '100%',
  };
  
  const buttonContainer = {
    padding: '27px 0 27px',
  };
  
  const hr = {
    borderColor: '#cccccc',
    margin: '20px 0',
  };
  
  const footer = {
    color: '#8898aa',
    fontSize: '12px',
  };
  
  const link = {
    color: '#A4C639',
    textDecoration: 'underline',
  };