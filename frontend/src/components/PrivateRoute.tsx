import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth-hook';
import React from 'react';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { user } = useAuth();
	return user ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
