import { Layout, Menu, Space, Switch } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { logout } from '../services/auth.service';

const { Header, Content } = Layout;

export const DashboardLayout = () => {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { checkPermission } = useAuth();
  const canEditUser = checkPermission('User', 'edit');

  const handleLogout = () => {
    logout();
  };
  const menuItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      onClick: () => navigate(user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'),
    },
    ...(canEditUser ? [{
      key: 'profile',
      label: 'Profile',
      onClick: () => navigate('/profile'),
    }] : []),
    {
      key: 'logout',
      label: 'Logout',
      onClick: handleLogout,
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