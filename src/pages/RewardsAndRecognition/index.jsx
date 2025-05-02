import React, { useState, useEffect } from 'react';
import './RewardsAndRecognition.css';
import CustomHeader from '../../components/CustomHeader';
import RewardModal from '../../components/RewardModal';
import AssignRewardModal from '../../components/AssignRewardModal';
import { getAllRewards, getCompanyEmployees } from '../../services/api';
import { Spin, Alert } from 'antd';

// Card component
const RewardCard = ({ icon, title, termsAndConditions, rewardId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [employeesData, setEmployeesData] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [employeesError, setEmployeesError] = useState(null);

  // Fetch employees when assign modal is opened
  const handleOpenAssignModal = async () => {
    setIsAssignModalOpen(true);
    setEmployeesLoading(true);

    try {
      // Assuming you have company ID stored somewhere
      const companyId = localStorage.getItem('companyId');
      const response = await getCompanyEmployees(companyId, { page: 1, limit: 10 });

      // Transform employee data to match table structure
      const formattedEmployees = response.data.employees.map((employee, index) => ({
        key: employee.user_id.toString(),
        srNo: index + 1,
        fullName: `${employee.first_name} ${employee.last_name}`,
        email: employee.email,
        contact: employee.phone || 'N/A',
        department: employee.department || 'N/A'
      }));

      setEmployeesData(formattedEmployees);
      setEmployeesLoading(false);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setEmployeesError("Failed to load employees");
      setEmployeesLoading(false);
    }
  };

  return (
    <>
      <div className="rewardRecognition-card">
        <div className="card-icon">
          <img src={icon || "/default-reward-icon.png"} alt={title} />
        </div>
        <div className="card-title">
          <h3>{title}</h3>
        </div>
        <div className="card-actions">
          <button
            className="btn-details"
            onClick={() => setIsModalOpen(true)}
          >
            Details
          </button>
          <button
            className="btn-send"
            onClick={handleOpenAssignModal}
          >
            Send
          </button>
        </div>
      </div>

      <RewardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        rewardTitle={title}
        termsAndConditions={termsAndConditions}
        rewardId={rewardId}
      />

      <AssignRewardModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        rewardTitle={title}
        rewardId={rewardId}
        employeesData={employeesData}
        isLoading={employeesLoading}
        error={employeesError}
      />
    </>
  );
};

const RewardShimmer = () => (
  <div className="rewardRecognition-card shimmer-card">
    <div className="shimmer-wrapper">
      <div className="shimmer-background" />
      <div className="shimmer-content">
        <div className="shimmer-icon" />
        <div className="shimmer-title" />
        <div className="shimmer-buttons">
          <div className="shimmer-button" />
          <div className="shimmer-button" />
        </div>
      </div>
    </div>
  </div>
);

// Main dashboard component
const RewardsAndRecognition = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch rewards when component mounts
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const companyId = localStorage.getItem("companyId");
        const response = await getAllRewards(companyId);
        // Navigate through the nested data structure
        const rewardsData = response.data;
        setRewards(rewardsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching rewards:", err);
        setError("Failed to load rewards. Please try again later.");
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  if (loading) {
    return (
      <div className="rewardRecognition-dashboard-container">
        <CustomHeader title="Rewards & Recognition" />
        <div className="rewards-grid">
          {[...Array(6)].map((_, index) => (
            <RewardShimmer key={`shimmer-${index}`} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rewardRecognition-dashboard-container">
        <CustomHeader title="Rewards & Recognition" />
        <Alert message={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="rewardRecognition-dashboard-container">
      <CustomHeader title="Rewards & Recognition" />
      <div className="rewards-grid">
        {rewards.map((reward) => (
          <RewardCard
            key={reward.id}
            icon={reward.icon_url}
            title={reward.title}
            termsAndConditions={reward.terms_and_conditions}
            rewardId={reward.id}
          />
        ))}
      </div>
    </div>
  );
};

export default RewardsAndRecognition;
