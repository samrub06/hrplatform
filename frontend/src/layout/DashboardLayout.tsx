import { Layout, Menu, Space, Switch } from 'antd';
import { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { UseAuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const { Header, Content } = Layout;

export const DashboardLayout = () => {
  const { user, logout } = useContext(UseAuthContext);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      onClick: () => navigate(user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'),
    },
    ...(user?.role === 'user' ? [{
      key: 'profile',
      label: 'Profile',
      onClick: () => navigate('/profile'),
    }] : []),
    {
      key: 'logout',
      label: 'Logout',
      onClick: logout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Menu 
          theme="dark" 
          mode="horizontal" 
          items={menuItems} 
          style={{ flex: 1 }}
        />
        <Space style={{ marginLeft: 16 }}>
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            checkedChildren="🌙"
            unCheckedChildren="☀️"
          />
        </Space>
      </Header>
      <Layout>
        <Content style={{ margin: '24px 16px', padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};