import { lazy, Suspense } from 'react';
import { Navigate, Route, RouteObject, Routes } from 'react-router-dom';
import { ProtectedRoute } from './component/ProtectedRoute';
import { AuthenticationLayout } from './layout/AuthenticationLayout';
import { DashboardLayout } from './layout/DashboardLayout';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

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
];

export const privateRoutes: RouteObject[] = [
  {
    path: '/',
    element: 
    <ProtectedRoute requiredRole="user">
      <DashboardLayout />
    </ProtectedRoute>,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'profile', element: <Profile /> },
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
  );
};

export default App;
