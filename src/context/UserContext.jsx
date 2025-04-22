import React, { createContext, useState, useEffect } from 'react';

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Initialize user state from localStorage if available
        const savedUser = localStorage.getItem('userData');
        return savedUser ? JSON.parse(savedUser) : {
            id: '',
            email: '',
            roleId: '',
            userType: '',
            fullName: {
                firstName: '',
                lastName: ''
            },
            profileUrl: '',
        };
    });
    const [isLoading, setIsLoading] = useState(true);

    // Sync user data with localStorage whenever it changes
    useEffect(() => {
        if (user && user.id) {
            localStorage.setItem('userData', JSON.stringify(user));
        }
        setIsLoading(false);
    }, [user]);

    const login = (response) => {
        const { data } = response;
        
        // Store tokens and company data
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('expiresAt', data.expiresAt);
        localStorage.setItem('companyId', data.company.id); // Store company ID

        // Transform user data to match your application structure
        const userData = {
            id: data.user.user_id,
            email: data.user.email,
            roleId: data.user.role_id,
            userType: data.roleType,
            fullName: {
                firstName: data.user.first_name,
                lastName: data.user.last_name,
            },
            profileUrl: data.user.profile_url,
            profile: {
                accepted_terms: data.user.accepted_terms,
                has_seen_dashboard_tour: data.user.has_seen_dashboard_tour
            },
            company: {
                id: data.company.id,
                name: data.company.company_name,
                onboardingStatus: data.company.onboarding_status
            }
        };

        setUser(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
    };

    const logout = () => {
        setUser({
            id: '',
            email: '',
            roleId: '',
            userType: '',
            fullName: {
                firstName: '',
                lastName: ''
            },
            profileUrl: '',
        });
        localStorage.clear(); // Clear all auth related data
    };

    const updateUser = (updates) => {
        setUser(prev => ({
            ...prev,
            ...updates
        }));
    };

    if (isLoading) {
        return null;
    }

    return (
        <UserDataContext.Provider value={{
            user,
            setUser: updateUser,
            login,
            logout,
            isAuthenticated: !!user.id
        }}>
            {children}
        </UserDataContext.Provider>
    );
};

export default UserContext;
