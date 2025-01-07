const getResponsiveSizes = (screenSize: any) => ({
  fontSizeHeading1: screenSize.isMobile ? 24 : screenSize.isTablet ? 32 : 38,
  fontSizeHeading2: screenSize.isMobile ? 20 : screenSize.isTablet ? 26 : 30,
  fontSizeHeading3: screenSize.isMobile ? 16 : screenSize.isTablet ? 20 : 24,
  fontSizeHeading4: screenSize.isMobile ? 14 : screenSize.isTablet ? 18 : 20,
  fontSizeHeading5: screenSize.isMobile ? 12 : screenSize.isTablet ? 14 : 16,
});

const baseTheme = (screenSize: any) => ({
  token: {
    ...getResponsiveSizes(screenSize),
    fontSizeSM: 12,
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeXL: 20,
  },
});

export const getTheme = (isDarkMode: boolean, screenSize: any) => {
  const theme = baseTheme(screenSize);
  
  return {
    ...theme,
    token: {
      ...theme.token,
      colorBgContainer: isDarkMode ? '#141414' : '#ffffff',
      colorTextBase: isDarkMode ? '#ffffff' : '#000000',
    },
  };
};
