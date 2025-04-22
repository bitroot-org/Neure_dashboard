import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import './AssessmentCard.css';

const AssessmentCard = ({ id, title, description, status, time, questions }) => {
  const navigate = useNavigate();

  const handleAssessmentClick = () => {
    if (status !== 'completed') {
      // Pass assessment data as state when navigating
      navigate('/assessmentQuestions', { 
        state: { 
          assessmentId: id,
          title: title,
          description: description,
          questions: questions || [],
        } 
      });
    }
  };

  return (
    <div className="neure-assessment-card">
      <div className="neure-assessment-icon">
        <img src="/brain.svg" alt="Assessment" />
      </div>
      <div className="neure-assessment-content">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        
        <div className="neure-assessment-footer">
          <div className="neure-assessment-timer-content">
            <img src='/timer.svg' alt='timer' />
            <span>Takes {time}</span>
          </div>
          <Button
            className="neure-start-assessment"
            variant="outline"
            onClick={handleAssessmentClick}
          >
            {status === 'completed' ? 'View Result' : 'Start Assessment'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentCard;