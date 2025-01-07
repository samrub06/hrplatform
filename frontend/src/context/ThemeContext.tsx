import { Grid } from 'antd';
import { createContext, ReactNode, useContext, useState } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  screenSize: {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: (context: ThemeContextType) => ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const screens = Grid.useBreakpoint();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const screenSize = {
    isMobile: !screens.sm,
    isTablet: Boolean(screens.sm && !screens.lg),
    isDesktop: Boolean(screens.lg)
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, screenSize }}>
      {children({ isDarkMode, toggleTheme, screenSize })}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};