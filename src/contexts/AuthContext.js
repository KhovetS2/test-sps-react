import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import authService from "../services/AuthService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from cookies
    useEffect(() => {
        const storedUser = authService.getUser();
        if (storedUser && authService.isAuthenticated()) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = useCallback(async (email, password) => {
        const result = await authService.login(email, password);
        setUser(result.user);
        return result;
    }, []);

    const logout = useCallback(async () => {
        await authService.logout();
        setUser(null);
    }, []);

    const isAuthenticated = user !== null && authService.isAuthenticated();

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export default AuthContext;
