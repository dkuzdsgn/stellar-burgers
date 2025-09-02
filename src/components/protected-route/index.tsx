import { useSelector } from 'react-redux';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../services/store';
import { Preloader } from '../ui/preloader';

interface ProtectedRouteProps {
  children?: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isInit } = useSelector((store: RootState) => store.auth);

  if (!isInit) {
    return <Preloader />;
  }

  if (!user) {
    return <Navigate replace to='/login' />;
  }

  return <>{children}</>;
};
