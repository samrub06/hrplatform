import { Button, Section, Text } from '@react-email/components';
import React from 'react';
import { BaseLayout } from '../components/BaseLayout';

interface WelcomeEmailProps {
  firstName: string;
}

export default function WelcomeEmail({ firstName }: WelcomeEmailProps) {
  return (
    <BaseLayout
      previewText={`Welcome to HR Platform, ${firstName}!`}
      language="en"
      children={<Text style={styles.heading}>Welcome {firstName} !</Text>}
    >
      <Text style={styles.heading}>Welcome {firstName} !</Text>
      <Text style={styles.text}>
        We are thrilled to welcome you to HR Platform.
      </Text>
      <Section style={styles.buttonContainer}>
        <Button href="https://hrplatform.com/profile" style={styles.button}>
          Complete my profile
        </Button>
      </Section>
    </BaseLayout>
  );
}

const styles = {
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    margin: '0 0 20px',
  },
  text: {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#4b5563',
  },
  buttonContainer: {
    textAlign: 'center' as const,
    margin: '30px 0',
  },
  button: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '6px',
    textDecoration: 'none',
  },
};
