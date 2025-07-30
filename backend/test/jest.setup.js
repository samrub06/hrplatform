global.React = require('react');

// Mock les composants @react-email
jest.mock('@react-email/components', () => ({
  Html: ({ children }) => children,
  Head: ({ children }) => children,
  Body: ({ children }) => children,
  Container: ({ children }) => children,
  Text: ({ children }) => children,
  Link: ({ children }) => children,
  Preview: ({ children }) => children,
  Section: ({ children }) => children,
  Column: ({ children }) => children,
  Row: ({ children }) => children,
  Button: ({ children }) => children,
  Img: ({ src, alt }) => `<img src="${src}" alt="${alt}" />`,
}));

jest.mock('@react-email/render', () => ({
  renderAsync: jest.fn().mockResolvedValue('<div>Mocked Email</div>'),
}));
