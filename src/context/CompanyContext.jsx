import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCompanyMetrics } from '../services/api';
import { UserDataContext } from './UserContext';

export const CompanyDataContext = createContext();

const CompanyContext = ({ children }) => {
  const { user } = useContext(UserDataContext);
  const [companyData, setCompanyData] = useState({
    companyId: '',
    companyName: '',
    company_profile_url: '',
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    lastEmployeeJoined: '',
    totalDepartments: 0,
    psychological_safety_index: 0,
    retention_rate: 0,
    stress_level: 0,
    engagement_score: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyMetrics = async () => {
      try {
        // Get companyId from user context first, fallback to localStorage
        const companyId = user?.company?.id || localStorage.getItem('companyId');
        
        if (!companyId) {
          setIsLoading(false);
          return; // Exit silently without throwing error
        }

        const response = await getCompanyMetrics(companyId);
        if (response.status) {
          setCompanyData(response.data.metrics);
        }
      } catch (error) {
        console.error('Error fetching company metrics:', error);
        // Don't set error state, just log it
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we have a user
    if (user?.company?.id || localStorage.getItem('companyId')) {
      fetchCompanyMetrics();
    } else {
      setIsLoading(false);
    }
  }, [user]); // Add user as dependency

  return (
    <CompanyDataContext.Provider value={{ companyData, setCompanyData, isLoading }}>
      {children}
    </CompanyDataContext.Provider>
  );
};

export default CompanyContext;
