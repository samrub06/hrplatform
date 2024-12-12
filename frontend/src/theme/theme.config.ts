import type { ThemeConfig } from 'antd';

const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1890ff',
    colorBgContainer: '#ffffff',
    colorTextBase: '#000000',
    colorTextSecondary: '#666666',
  },
};

const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1890ff',
    colorBgContainer: '#141414',
    colorTextBase: '#ffffff',
    colorTextSecondary: '#999999',
  },
};

export { darkTheme, lightTheme };
