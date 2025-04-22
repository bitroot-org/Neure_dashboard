import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomHeader from '../../components/CustomHeader';
import Button from '../../components/Button/Button';
import './AssessmentQuestions.css';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import SuccessModal from '../../components/SuccessModal/SuccessModal';
import { submitAssessment } from '../../services/api';

const AssessmentQuestions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { assessmentId, title, questions } = location.state || {};
  
  // Use the passed questions or fallback to an empty array
  const assessmentQuestions = questions || [];
  
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [answers, setAnswers] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add this function to check if an option is selected
  const isOptionSelected = (questionId, optionId) => {
    const answer = answers[questionId];
    if (Array.isArray(answer)) {
      return answer.includes(optionId);
    }
    return answer === optionId;
  };

  const handleOptionSelect = (questionId, optionId) => {
    const question = assessmentQuestions.find(q => q.id === questionId);
    
    if (question && question.question_type === 'multiple_choice') {
      // For multiple choice, toggle the option in an array
      setAnswers(prev => {
        const currentAnswers = [...(prev[questionId] || [])];
        const optionIndex = currentAnswers.indexOf(optionId);
        
        if (optionIndex === -1) {
          currentAnswers.push(optionId);
        } else {
          currentAnswers.splice(optionIndex, 1);
        }
        
        return { ...prev, [questionId]: currentAnswers };
      });
    } else {
      // For single choice, just set the option
      setAnswers(prev => ({
        ...prev,
        [questionId]: optionId
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      // Format the answers into the required structure
      const responses = Object.entries(answers).map(([questionId, selectedOptions]) => ({
        question_id: parseInt(questionId),
        selected_options: Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions]
      }));

      const payload = {
        company_id: 1, // Replace with actual company ID
        assessment_id: assessmentId,
        responses: responses
      };

      const response = await submitAssessment(payload);
      console.log('Assessment submitted successfully:', response);
      
      // If successful, show success modal
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error('Error submitting assessment:', error);
      // Handle error case
    }
  };

  const handleSubmitClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmSubmit = () => {
    setIsModalOpen(false);
    handleSubmit();
  };

  const handleBackToMain = () => {
    setIsSuccessModalOpen(false);
    navigate('/assessments');
  };

  return (
    <div className="assessment-questions-page">
      <CustomHeader title={title || "Psychological Safety Index (PSI)"} showBackButton={true} />

      <div className="assessment-questions-content">
        <p className="assessment-instruction">
          {assessmentQuestions[0]?.question_type === 'multiple_choice' 
            ? "Please select all applicable options that answer the questions correctly."
            : "Please select one option per question that best answers the question."}
        </p>

        <div className='questions-form'>
          <div className="questions-container">
            {assessmentQuestions.map((question) => (
              <div key={question.id} className="question-item">
                <div className="question-text">
                  {question.question_text}
                </div>
                <div className="options-group">
                  {question.options.map((option) => (
                    <button
                      key={option.id}
                      className={`option-btn ${isOptionSelected(question.id, option.id) ? 'active' : ''}`}
                      onClick={() => handleOptionSelect(question.id, option.id)}
                    >
                      {option.option_text}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="assessment-footer">

            <p className="privacy-note">
              <img src='/Info.svg' alt='info symbol' />
              Your answers will be kept anonymous, so please share honest feedback.
            </p>
            <Button
              onClick={handleSubmitClick}
              className="submit-button"
            >
              Submit
            </Button>
            
            <ConfirmationModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={handleConfirmSubmit}
            />
            
            <SuccessModal
              isOpen={isSuccessModalOpen}
              onClose={handleBackToMain}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentQuestions;