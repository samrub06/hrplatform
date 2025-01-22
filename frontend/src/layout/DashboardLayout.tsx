import { Grid, Layout, Menu, Space, Switch, theme } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { logout } from '../services/auth.service';

const { Header, Content } = Layout;

export const DashboardLayout = () => {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();

  const handleLogout = () => {
    logout();
  };
  const menuItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      onClick: () => navigate(user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'),
    },
      {key: 'profile',
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SEOHead title="Dashboard | HR Platform" description="Dashboard of HR Platform" />
      <Header 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: '#1677ff',
          padding: screens.xs ? token.paddingSM : token.padding,
          height: screens.xs ? 48 : 64
        }}
      >
        <Menu 
          mode="horizontal" 
          items={menuItems} 
          style={{ 
            flex: 1,
            background: '#1677ff',
            color: 'white',
            borderBottom: 'none',
            fontSize: screens.xs ? '12px' : '14px',
          }}
          theme="dark"
        />
        <Space style={{ marginLeft: screens.xs ? token.marginSM : token.margin }}>
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            checkedChildren="🌙"
            unCheckedChildren="☀️"
            size={screens.xs ? 'small' : 'default'}
          />
        </Space>
      </Header>
      <Layout>
        <Content style={{ 
          margin: screens.xs ? token.marginSM : token.marginLG,
          padding: screens.xs ? token.paddingSM : token.paddingLG 
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};