import React from "react";
import { Card } from "antd";
import MetricLineChart from "../../components/MetricLineCharts";
import CustomHeader from "../../components/CustomHeader";

const dummyMetricsData = [
  { name: "5k", value: 20 },
  { name: "10k", value: 45 },
  { name: "15k", value: 35 },
  { name: "20k", value: 94 },
  { name: "25k", value: 49 },
  { name: "30k", value: 52 },
  { name: "35k", value: 30 },
  { name: "40k", value: 70 },
  { name: "45k", value: 65 },
  { name: "50k", value: 58 },
  { name: "55k", value: 45 },
  { name: "60k", value: 50 },
];

const dummyEmployeeData = [
  { name: "Anjana More", points: 3400 },
  { name: "Siddharth Menon", points: 2950 },
  { name: "Rajkumar S", points: 2700 },
];

const RewardsDashboard = () => {
  return (
    <div className="min-h-screen px-5 sm:px-10 lg:px-20 py-10">
      <CustomHeader title="Rewards & Recognition" />

      <div className="mb-6 grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-6">
        <Card className="border border-white/10 !bg-[#065f46]">
          <div className="flex flex-col items-center">
            <h2 className="m-0 text-5xl font-medium text-white">92%</h2>
            <p className="m-0 text-lg font-normal text-gray-400">Employee happiness</p>
          </div>
          <div className="mt-4 flex justify-center">
            <img src="achievement.png" alt="Achievement Logo" />
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          <Card className="border border-gray-600 !bg-[#191A20] w-full">
            <div className="flex items-center gap-4 p-4">
              <div className="h-16 w-16 flex-shrink-0">
                <img src="handCoins.png" alt="Hand holding coins" />
              </div>
              <div className="flex-1">
                <p className="mb-1 text-lg text-gray-400">Total Points Distributed</p>
                <h3 className="m-0 text-2xl text-white">45,000</h3>
              </div>
            </div>
          </Card>
          <Card className="border border-gray-600 !bg-[#191A20] w-full">
            <div className="flex items-center gap-4 p-4">
              <div className="h-16 w-16 flex-shrink-0">
                <img src="shootingStar.png" alt="Shooting star" />
              </div>
              <div className="flex-1">
                <p className="mb-1 text-lg text-gray-400">Total Points Redeemed</p>
                <h3 className="m-0 text-2xl text-white">38,000</h3>
              </div>
            </div>
          </Card>
          <Card className="border border-gray-600 !bg-[#191A20] w-full">
            <div className="flex items-center gap-4 p-4">
              <div className="h-16 w-16 flex-shrink-0">
                <img src="trophy.png" alt="Trophy" />
              </div>
              <div className="flex-1">
                <p className="mb-1 text-lg text-gray-400">Active Reward Programs</p>
                <h3 className="m-0 text-2xl text-white">05</h3>
              </div>
            </div>
          </Card>
        </div>

        <Card className="border border-white/10">
          <h3 className="m-0 text-2xl font-medium text-white">Top Rewarded Employees:</h3>
          <div className="m-4">
            {dummyEmployeeData.map((employee, index) => (
              <div key={index} className="relative my-7 flex flex-col justify-between pl-3">
                <span className="text-xl font-light text-white">{employee.name}</span>
                <span className="text-base font-light text-white">{employee.points} points</span>
                <span
                  className="absolute left-0 top-0 h-[90%] w-1 rounded"
                  style={{
                    backgroundColor: index === 0 ? "#00FF00" : index === 1 ? "#FFD700" : "#4B0082",
                  }}
                />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <MetricLineChart data={dummyMetricsData} />
    </div>
  );
};

export default RewardsDashboard;

