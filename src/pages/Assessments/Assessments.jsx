import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, Alert, Button } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import CustomHeader from '../../components/CustomHeader';
import AssessmentCard from '../../components/AssessmentCard/AssessmentCard';
import './Assessments.css';
import { getAllAssessments } from '../../services/api';

const Assessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setLoading(true);
        const response = await getAllAssessments({ currentPage });
        
        if (response.success) {
          setAssessments(response.data.assessments);
          setTotalPages(response.data.pagination.totalPages);
          setError(null);
        } else {
          setError("Failed to fetch assessments");
        }
      } catch (err) {
        setError("An error occurred while fetching assessments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [currentPage]);

  // Function to navigate to resources page
  const navigateToResources = () => {
    // Replace with your actual navigation logic
    window.location.href = '/resources';
  };

  return (
    <div className="assessments-section">
      <CustomHeader title="Assessments" showBackButton={true} />
      
      <div className="assessments-content">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : error ? (
          <Alert message={error} type="error" showIcon />
        ) : assessments.length === 0 ? (
          <div className="empty-assessments-container">
            <div className="empty-state-card">
              <div className="empty-state-icon">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="60" cy="60" r="58" stroke="#E0E0E0" strokeWidth="4"/>
                  <path d="M40 60H80" stroke="#4A90E2" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M40 45H80" stroke="#4A90E2" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M40 75H80" stroke="#4A90E2" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </div>
              <h2 className="empty-state-title">No Assessments Available</h2>
              <p className="empty-state-message">
                We're preparing assessments for you. They will be available soon.
                In the meantime, you can explore our resources to enhance your skills.
              </p>
              <Button 
                type="primary" 
                icon={<BookOutlined />}
                onClick={navigateToResources}
                className="explore-resources-btn"
              >
                Explore Resources
              </Button>
            </div>
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {assessments.map((assessment) => (
              <Col 
                xs={24}    // Full width on mobile
                sm={24}    // Full width on small tablets
                md={12}    // 2 cards per row on medium screens
                lg={8}     // 3 cards per row on large screens
                xl={8}     // 3 cards per row on extra large screens
                key={assessment.id}
              >
                <AssessmentCard
                  id={assessment.id}
                  title={assessment.title}
                  description={assessment.description}
                  time="5 mins"  // Setting fixed time of 5 mins for all assessments
                  status="pending"  // Default status as pending
                  questions={assessment.questions}  // Pass questions data
                />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default Assessments;