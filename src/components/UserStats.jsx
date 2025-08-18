import React from 'react';
import { Card, Typography, Spin } from 'antd';

const { Title, Text } = Typography;

const UserStats = ({ data, onClick, loading }) => {
  if (loading) {
    return (
      <Card className="flex flex-col justify-around items-center text-white w-full h-full min-h-[300px] rounded-[20px] bg-gradient-to-b from-[#2D2F39] to-[#191A20] border border-white/10 relative overflow-hidden">
        <div className="text-center p-5">
          <Spin />
        </div>
      </Card>
    );
  }

  console.log("UserStats -> data", data);


  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
      <div className="flex flex-col justify-around items-center text-white w-full h-full min-h-[300px] rounded-[20px] bg-gradient-to-b from-[#2D2F39] to-[#191A20] border border-white/10 relative overflow-hidden md:gap-0 max-md:gap-[10px]">
        <h1 className="text-2xl text-white font-normal max-[480px]:text-lg">Total users</h1>

        <div>
          <h1 className="text-[40px] font-bold text-white">{data?.total_employees}</h1>
        </div>

        <div className="flex justify-between w-full px-5 max-[480px]:flex-col max-[480px]:gap-[10px] max-[768px]:gap-[70px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#52c41a]"></span>
            <h4 className="text-white/70 text-lg font-normal">Active <span className="text-white font-normal">{data?.active_employees}</span></h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff4d4f]"></span>
            <h4 className="text-white/70 text-lg font-normal">Inactive <span className="text-white font-normal">{data?.inactive_employees}</span></h4>
          </div>
        </div>

        <h1 className="text-white/[0.454] text-sm font-light">
          Last updated on {formatDate(data?.last_employee_joined)}
        </h1>
      </div>
  );
};

export default UserStats;