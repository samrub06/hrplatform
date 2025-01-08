import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Row,
  Section,
  Text,
} from '@react-email/components';
import React from 'react';

interface BaseLayoutProps {
  children: React.ReactNode;
  previewText: string;
  language?: 'fr' | 'en';
}

export const BaseLayout = ({
  children,
  previewText,
  language = 'fr',
}: BaseLayoutProps) => {
  const translations = {
    fr: {
      rights: 'Tous droits réservés',
      follow: 'Suivez-nous sur',
      help: "Besoin d'aide ?",
    },
    en: {
      rights: 'All rights reserved',
      follow: 'Follow us on',
      help: 'Need help?',
    },
  };

  const t = translations[language];

  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header with Logo */}
          <Section style={styles.headerSection}>
            <Img
              src="https://www.notion.so/images/page-cover/gradients_11.jpg"
              width="100%"
              height="80px"
              alt="HR Platform"
            />
          </Section>

          {/* Main Content */}
          <Section style={styles.mainSection}>{children}</Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Row>
              <Column>
                <Text style={styles.footerText}>
                  © {new Date().getFullYear()} HR Platform. {t.rights}
                </Text>
                <Text style={styles.footerText}>
                  {t.follow}{' '}
                  <Link href="https://linkedin.com/hrplatform">LinkedIn</Link> /{' '}
                  <Link href="https://twitter.com/hrplatform">Twitter</Link>
                </Text>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const styles = {
  body: {
    backgroundColor: '#f6f9fc',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  container: {
    margin: '0 auto',
    padding: '20px 0',
    width: '100%',
    maxWidth: '600px',
  },
  headerSection: {
    padding: '20px',
    textAlign: 'center' as const,
    backgroundColor: '#ffffff',
    borderRadius: '8px 8px 0 0',
  },
  mainSection: {
    backgroundColor: '#ffffff',
    padding: '40px 20px',
  },
  footer: {
    backgroundColor: '#f8f9fa',
    borderRadius: '0 0 8px 8px',
    padding: '20px',
    textAlign: 'center' as const,
  },
  footerText: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '5px 0',
  },
};
