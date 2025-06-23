import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAllowed, children }) => {
	if (!isAllowed) {
		return <Navigate to="/" />;
	}
	return children;
};

export default ProtectedRoute;
