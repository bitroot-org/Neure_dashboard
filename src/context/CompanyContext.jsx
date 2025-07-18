import React, { createContext, useState, useEffect } from 'react';
import { getCompanyMetrics } from '../services/api';

export const CompanyDataContext = createContext();

const CompanyContext = ({ children }) => {
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
    wellbeing_score:0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyMetrics = async () => {
      try {
        const companyId = localStorage.getItem('companyId');
        if (!companyId) {
          console.warn('Company ID not found');
          setIsLoading(false);
          return;
        }
        
        const response = await getCompanyMetrics(companyId);
        console.log('API Response:', response);
        
        if (response.status) {
          // Handle nested data structure
          let metricsData;
          
          if (response.data && response.data.data && response.data.data.metrics) {
            // Deeply nested structure
            metricsData = response.data.data.metrics;
          } else if (response.data && response.data.metrics) {
            // Single level nesting
            metricsData = response.data.metrics;
          } else {
            // Fallback
            metricsData = response.data || {};
          }
          
          console.log('Processed metrics data:', metricsData);
          setCompanyData(metricsData);
        }
      } catch (error) {
        console.error('Error fetching company metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyMetrics();
  }, []);

  // Add a function to refresh company data
  const refreshCompanyData = async () => {
    try {
      setIsLoading(true);
      const companyId = localStorage.getItem('companyId');
      if (!companyId) {
        console.warn('Company ID not found');
        setIsLoading(false);
        return;
      }
      
      const response = await getCompanyMetrics(companyId);
      console.log('Refreshed API Response:', response);
      
      if (response.status) {
        // Handle nested data structure
        let metricsData;
        
        if (response.data && response.data.data && response.data.data.metrics) {
          metricsData = response.data.data.metrics;
        } else if (response.data && response.data.metrics) {
          metricsData = response.data.metrics;
        } else {
          metricsData = response.data || {};
        }
        
        console.log('Refreshed metrics data:', metricsData);
        setCompanyData(metricsData);
      }
    } catch (error) {
      console.error('Error refreshing company metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Provide the refreshCompanyData function in the context value
  return (
    <CompanyDataContext.Provider value={{ companyData, isLoading, refreshCompanyData }}>
      {children}
    </CompanyDataContext.Provider>
  );
};

export default CompanyContext;
