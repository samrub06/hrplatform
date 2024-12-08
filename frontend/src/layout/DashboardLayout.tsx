import { Layout, Menu } from 'antd';
import { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { UseAuthContext } from '../context/AuthContext';

const { Header, Sider, Content } = Layout;

export const DashboardLayout = () => {
  const { user, logout } = useContext(UseAuthContext);
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
      <Header>
        <Menu theme="dark" mode="horizontal" items={menuItems} />
      </Header>
      <Layout>
        <Content style={{ margin: '24px 16px', padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};