import React, {createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [ token, setToken] = useState(null);
	const [ username , setUsername] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const login = (jwtToken, user) => {
		setToken(jwtToken);
		setUsername(user);
		setIsAuthenticated(true);
	};

	const logout = () => {
		setToken(null);
		setUsername(null);
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider value = {{
			token,
			username,
			isAuthenticated,
			login,
			logout
		}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
};
