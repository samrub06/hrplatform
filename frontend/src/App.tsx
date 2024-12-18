import { ConfigProvider, theme } from 'antd';
import { lazy, Suspense } from 'react';
import { Navigate, Route, RouteObject, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import { AuthenticationLayout } from './layout/AuthenticationLayout';
import { DashboardLayout } from './layout/DashboardLayout';
import CompleteProfile from './pages/CompleteProfile';
import GoogleCallback from './pages/GoogleCallback';
import Login from './pages/Login';
import PublicProfile from './pages/PublicProfile';
import SignUp from './pages/SignUp';
import { darkTheme, lightTheme } from './theme/theme.config';

const Loadable = (Component: React.LazyExoticComponent<any>) => (props: any) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );
};

// Pages publiques
//const Login = Loadable(lazy(() => import('./pages/Login')));
//const SignUp = Loadable(lazy(() => import('./pages/SignUp')));

// Pages privées
const Dashboard = Loadable(lazy(() => import('./pages/Dashboard')));
const Profile = Loadable(lazy(() => import('./pages/Profile')));
const AdminDashboard = Loadable(lazy(() => import('./pages/AdminDashboard')));

export const publicRoutes: RouteObject[] = [
  {
    path: 'auth',
    element: <AuthenticationLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <SignUp /> },
      { path: '*', element: <Navigate to="/auth/login" /> },
    ],
  },
  {
    path: 'user/profile/public/:token',
    element: <PublicProfile />
  },
  {
    path: '/auth/google/callback',
    element: <GoogleCallback />
  }
];

export const privateRoutes: RouteObject[] = [
  {
    path: '/',
    element:
      <ProtectedRoute requiredRole="">
        <DashboardLayout />
      </ProtectedRoute>,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'profile', element: <Profile /> },
      {
        path: '/complete-profile',
        element: <CompleteProfile />,

      },
      { path: '*', element: <Navigate to="/dashboard" /> },
    ],
  },
];

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: <ProtectedRoute requiredRole="admin">
      <DashboardLayout />
    </ProtectedRoute>,
    children: [
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: '*', element: <Navigate to="/admin/dashboard" /> },
    ],
  },
];

const App = () => {
  return (
    <ThemeProvider>
      {({ isDarkMode }) => (
        <ConfigProvider
          theme={{
            ...isDarkMode ? darkTheme : lightTheme,
            algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          }}
        >
          <Routes>
            {publicRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element}>
                {route.children?.map((child) => (
                  <Route key={child.path} path={child.path} element={child.element} />
                ))}
              </Route>
            ))}
            {privateRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element}>
                {route.children?.map((child) => (
                  <Route key={child.path} path={child.path} element={child.element} />
                ))}
              </Route>
            ))}
            {adminRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element}>
                {route.children?.map((child) => (
                  <Route key={child.path} path={child.path} element={child.element} />
                ))}
              </Route>
            ))}
          </Routes>
        </ConfigProvider>
      )}
    </ThemeProvider>
  );
};

export default App;
