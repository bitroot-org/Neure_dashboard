import React, { useState, useEffect } from 'react';
import CustomHeader from '../../components/CustomHeader';
import RewardModal from '../../components/RewardModal';
import AssignRewardModal from '../../components/AssignRewardModal';
import { getAllRewards, getCompanyEmployees } from '../../services/api';
import { Alert } from 'antd';

const RewardCard = ({ icon, title, termsAndConditions, rewardId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [employeesData, setEmployeesData] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [employeesError, setEmployeesError] = useState(null);

  const handleOpenAssignModal = async () => {
    setIsAssignModalOpen(true);
    setEmployeesLoading(true);
    try {
      const companyId = localStorage.getItem('companyId');
      const response = await getCompanyEmployees(companyId, { page: 1, limit: 10 });
      const formattedEmployees = response.data.employees.map((employee, index) => ({
        key: employee.user_id.toString(),
        srNo: index + 1,
        fullName: `${employee.first_name} ${employee.last_name}`,
        email: employee.email,
        contact: employee.phone || 'N/A',
        department: employee.department || 'N/A',
      }));
      setEmployeesData(formattedEmployees);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setEmployeesError('Failed to load employees');
    } finally {
      setEmployeesLoading(false);
    }
  };

  return (
    <>
      <div className="flex h-[280px] flex-col items-center gap-4 rounded-[18px] border border-[#2D2F39] bg-[#191A20] p-5 transition-transform hover:-translate-y-1">
        <div className="mb-2 h-16 w-16 rounded-full bg-[radial-gradient(circle,_#5F616C,_#2D2F39)] p-2">
          <img className="h-full w-full object-contain" src={icon || '/default-reward-icon.png'} alt={title} />
        </div>
        <div className="text-center">
          <h3 className="m-0 text-2xl font-medium text-white">{title}</h3>
        </div>
        <div className="mt-auto flex w-full gap-2 px-5">
          <button className="h-12 flex-1 rounded-[70px] border border-[#666] bg-transparent text-base font-semibold text-white" onClick={() => setIsModalOpen(true)}>
            Details
          </button>
          <button className="h-12 flex-1 rounded-[70px] bg-gradient-to-b from-white to-[#797B87] text-base font-semibold text-black hover:shadow-[0_0_50px_rgba(255,255,255,0.5)]" onClick={handleOpenAssignModal}>
            Send
          </button>
        </div>
      </div>

      <RewardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} rewardTitle={title} termsAndConditions={termsAndConditions} rewardId={rewardId} />
      <AssignRewardModal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} rewardTitle={title} rewardId={rewardId} employeesData={employeesData} isLoading={employeesLoading} error={employeesError} />
    </>
  );
};

const RewardShimmer = () => (
  <div className="relative overflow-hidden rounded-[18px] border border-[#2D2F39] bg-[#191A20]">
    <div className="absolute inset-0 animate-shimmer bg-[length:200%_100%]" style={{ backgroundImage: 'linear-gradient(90deg,#191A20 0%,#2D2F39 50%,#191A20 100%)' }} />
    <div className="relative flex h-[280px] flex-col items-center gap-4 p-5">
      <div className="mt-5 h-16 w-16 rounded-full bg-[#2D2F39]" />
      <div className="h-6 w-2/3 rounded bg-[#2D2F39]" />
      <div className="mt-auto flex w-full gap-2 px-5">
        <div className="h-12 flex-1 rounded-[70px] bg-[#2D2F39]" />
        <div className="h-12 flex-1 rounded-[70px] bg-[#2D2F39]" />
      </div>
    </div>
  </div>
);

const RewardsAndRecognition = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const companyId = localStorage.getItem('companyId');
        const response = await getAllRewards(companyId);
        const rewardsData = response.data;
        setRewards(rewardsData);
      } catch (err) {
        console.error('Error fetching rewards:', err);
        setError('Failed to load rewards. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchRewards();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full px-5 sm:px-10 lg:px-20 py-10 bg-[radial-gradient(108.08%_74.37%_at_50%_0%,_#33353F_0%,_#0D0D11_99.73%)]">
        <CustomHeader title="Rewards & Recognition" />
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(320px,_1fr))] gap-[30px] py-5">
          {[...Array(6)].map((_, i) => (
            <RewardShimmer key={`shimmer-${i}`} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full px-5 sm:px-10 lg:px-20 py-10 bg-[radial-gradient(108.08%_74.37%_at_50%_0%,_#33353F_0%,_#0D0D11_99.73%)]">
        <CustomHeader title="Rewards & Recognition" />
        <Alert message={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-5 sm:px-10 lg:px-20 py-10 bg-[radial-gradient(108.08%_74.37%_at_50%_0%,_#33353F_0%,_#0D0D11_99.73%)]">
      <CustomHeader title="Rewards & Recognition" />
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(320px,_1fr))] gap-[30px] py-5">
        {rewards.map((reward) => (
          <RewardCard key={reward.id} icon={reward.icon_url} title={reward.title} termsAndConditions={reward.terms_and_conditions} rewardId={reward.id} />
        ))}
      </div>
    </div>
  );
};

export default RewardsAndRecognition;

