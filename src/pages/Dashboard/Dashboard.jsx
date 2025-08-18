import React, { useEffect, useState, useContext } from "react";
import { Table, message } from "antd";
import CustomHeader from "../../components/CustomHeader";
import UserStats from "../../components/UserStats";
import { CompanyDataContext } from "../../context/CompanyContext";
import { getTopPerformingEmployee, getCompanyMetrics } from "../../services/api";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [metricsData, setMetricsData] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const { companyData } = useContext(CompanyDataContext);

  const fetchEmployees = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const companyId = localStorage.getItem("companyId");
      if (!companyId) {
        message.error("Company ID not found");
        return;
      }
      const response = await getTopPerformingEmployee({ companyId, page, limit: pageSize });
      if (response.status) {
        setEmployees(response.data);
        setPagination((prev) => ({ ...prev, total: response.data.total || 0 }));
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      message.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const companyId = localStorage.getItem("companyId");
      if (!companyId) {
        message.error("Company ID not found");
        return;
      }
      const response = await getCompanyMetrics(companyId);
      if (response.status) setMetricsData(response.data.metrics);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      message.error("Failed to fetch company metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchEmployees(pagination.current, pagination.pageSize), fetchMetrics()]);
      } catch (e) {
        console.error("Error fetching initial data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statsData = [
    { title: "Stress Levels", value: `${Math.round(companyData.stress_level)}%`, trend: companyData.stress_trend },
    { title: "Psychological Safety Index", value: `${Math.round(companyData.psychological_safety_index)}%`, trend: companyData.psi_trend },
    { title: "Employee Retention", value: `${Math.round(companyData.retention_rate)}%`, trend: companyData.retention_trend },
    { title: "Employee Engagement", value: `${Math.round(companyData.engagement_score)}%`, trend: companyData.engagement_trend },
  ];

  const columns = [
    { title: "Rank", key: "rank", width: 80, render: (_, __, index) => index + 1 },
    { title: "Employee Name", key: "name", render: (_, r) => `${r.first_name} ${r.last_name}` },
    { title: "Department", dataIndex: "department_name", key: "department_name" },
    { title: "Workshops Attended", dataIndex: "Workshop_attended", key: "Workshop_attended", sorter: (a, b) => a.Workshop_attended - b.Workshop_attended },
    { title: "Tasks Completed", dataIndex: "Task_completed", key: "Task_completed", sorter: (a, b) => a.Task_completed - b.Task_completed },
    { title: "Engagement Score", dataIndex: "EngagementScore", key: "EngagementScore", render: (s) => `${s}%`, align: "center" },
  ];

  return (
    <div className="min-h-screen px-5 sm:px-10 lg:px-20 py-10 text-gray-200">
      <CustomHeader title="Dashboard" />

      <div className="mb-6 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
        <div className="h-full">
          <UserStats data={metricsData} style={{ cursor: "pointer" }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-[#33353F] to-[#191A20] p-5"
            >
              <h3 className="m-0 text-[18px] font-normal text-white/80">{stat.title}</h3>
              <div className="mt-3 flex items-center gap-4">
                <div className="text-4xl font-medium">{stat.value}</div>
                <div className="flex items-center gap-1 text-sm">
                  <img src={stat.trend === "no_change" ? "Upward.png" : stat.trend === "up" ? "CaretUp.png" : "CaretDown.png"} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#191A20] p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="m-0 text-2xl font-medium text-gray-200">Top performing employees</h2>
          <select className="cursor-pointer rounded border border-white px-3 py-1.5 bg-transparent text-gray-200">
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Daily</option>
          </select>
        </div>
        <Table
          columns={columns}
          dataSource={employees}
          loading={loading}
          rowKey="user_id"
          className="[&_.ant-table-thead_tr_th]:!bg-transparent [&_.ant-table-thead_tr_th]:!border-b-0 [&_.ant-table-thead_tr_th]:!px-6 [&_.ant-table-thead_tr_th]:!py-4 [&_.ant-table-thead_tr_th]:!text-left [&_.ant-table-thead_tr_th]:!text-white [&_.ant-table-tbody_tr_td]:!bg-transparent [&_.ant-table-tbody_tr_td]:!border-b border-b-white/10 [&_.ant-table-tbody_tr_td]:!px-6 [&_.ant-table-tbody_tr_td]:!py-4 [&_.ant-table-tbody_tr_td]:!text-white"
          pagination={false}
        />
      </div>
    </div>
  );
};

export default Dashboard;

