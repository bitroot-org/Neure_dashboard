import React, { useState } from 'react';
import './RewardsAndRecognition.css';
import CustomHeader from '../../components/CustomHeader';
import RewardModal from '../../components/RewardModal';
import AssignRewardModal from '../../components/AssignRewardModal';

// Card component
const RewardCard = ({ icon, title }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);


  return (
    <>
      <div className="rewardRecognition-card">
        <div className="card-icon">
          <img src={icon} alt={title} />
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
            onClick={() => setIsAssignModalOpen(true)}
          >
            Send
          </button>        </div>
      </div>

      <RewardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        rewardTitle={title}
      />

      <AssignRewardModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        rewardTitle={title}
      />

    </>
  );
};

// Main dashboard component
const RewardsAndRecognition = () => {

  const rewards = [
    {
      icon: "/path-to-home-icon.png",
      title: "One-Day Work From Home"
    },
    {
      icon: "/path-to-clock-icon.png",
      title: "Flexible Working Hours for a Day"
    },
    {
      icon: "/path-to-leave-icon.png",
      title: "Early Leave Pass"
    },
    {
      icon: "/path-to-late-icon.png",
      title: "Late Start Pass"
    },
    {
      icon: "/path-to-calendar-icon.png",
      title: "One Day Leave Pass"
    },
    {
      icon: "/path-to-meeting-icon.png",
      title: "Meeting Free Day"
    },
    {
      icon: "/path-to-surprise-icon.png",
      title: "Surprise Half Day"
    },
    {
      icon: "/path-to-mentorship-icon.png",
      title: "1-on-1 mentorship session with a Senior Executive"
    }
  ];

  return (
    <div className="rewardRecognition-dashboard-container">
      <CustomHeader title="Rewards & Recognition" />
      <div className="rewards-grid">
        {rewards.map((reward, index) => (
          <RewardCard
            key={index}
            icon={reward.icon}
            title={reward.title}
          />
        ))}
      </div>


    </div>


  );
};

export default RewardsAndRecognition;