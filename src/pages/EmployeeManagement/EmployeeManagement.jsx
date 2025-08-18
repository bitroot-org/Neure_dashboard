import React, { useState, useEffect, useContext, useCallback } from "react";
import { debounce } from "lodash";
import { Table, Empty, message } from "antd";
import { CompanyDataContext } from "../../context/CompanyContext";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CustomHeader from "../../components/CustomHeader";
import CustomPagination from "../../components/CustomPagination";
import CountUp from "react-countup";
import { getTopPerformingEmployee } from "../../services/api";

const MetricCardShimmer = () => (
  <div className="flex flex-col rounded-[18px] border border-white/15 bg-[#191A20] p-3 shadow-[0_4px_4px_rgba(0,0,0,0.5)] overflow-hidden">
    <div className="mb-2 h-[18px] w-[70%] rounded bg-[length:200%_100%] animate-shimmer" style={{ backgroundImage: 'linear-gradient(90deg,#2D2F39 0%,#363845 50%,#2D2F39 100%)' }} />
    <div className="mb-2 h-9 w-[40%] rounded bg-[length:200%_100%] animate-shimmer" style={{ backgroundImage: 'linear-gradient(90deg,#2D2F39 0%,#363845 50%,#2D2F39 100%)' }} />
    <div className="h-4 w-[30%] rounded bg-[length:200%_100%] animate-shimmer" style={{ backgroundImage: 'linear-gradient(90deg,#2D2F39 0%,#363845 50%,#2D2F39 100%)' }} />
  </div>
);

const TableShimmer = () => (
  <div className="overflow-hidden rounded-[18px] border border-[#434343] bg-[#191A20]">
    <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_80px] border-b border-[#434343] p-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="p-2">
          <div className="h-4 w-4/5 rounded bg-[length:200%_100%] animate-shimmer" style={{ backgroundImage: 'linear-gradient(90deg,#2D2F39 0%,#363845 50%,#2D2F39 100%)' }} />
        </div>
      ))}
    </div>
    {[...Array(5)].map((_, rowIndex) => (
      <div key={rowIndex} className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_80px] border-b border-[#434343] p-4">
        {[...Array(6)].map((_, cellIndex) => (
          <div key={cellIndex} className="p-2">
            <div className="h-4 w-4/5 rounded bg-[length:200%_100%] animate-shimmer" style={{ backgroundImage: 'linear-gradient(90deg,#2D2F39 0%,#363845 50%,#2D2F39 100%)' }} />
          </div>
        ))}
      </div>
    ))}
  </div>
);

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const { companyData } = useContext(CompanyDataContext);
  const navigate = useNavigate();

  const debouncedSearch = useCallback(
    debounce((value) => {
      fetchEmployees(1, pagination.pageSize, value);
    }, 800),
    []
  );

  const fetchEmployees = async (page = 1, pageSize = 10, search = "", companyIdParam = null) => {
    try {
      setLoading(true);
      const response = await getTopPerformingEmployee({
        companyId: companyIdParam || companyData?.companyId || localStorage.getItem("companyId"),
        page,
        limit: pageSize,
        search,
      });
      if (response.status) {
        setEmployees(response.data);
        setPagination({
          current: response.pagination.current_page,
          pageSize: response.pagination.per_page,
          total: response.pagination.total,
        });
      }
    } catch (error) {
      message.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyData?.companyId) {
      fetchEmployees(pagination.current, pagination.pageSize, searchTerm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyData]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleRemoveEmployee = () => navigate("/removeEmployee");
  const handleAddEmployee = () => navigate("/addNewEmployee");
  const handlePageChange = (page) => fetchEmployees(page, pagination.pageSize, searchTerm);

  const metrics = [
    {
      title: "Total Employees",
      value: companyData?.total_employees || 0,
      change:
        companyData?.total_employees_change > 0
          ? `+${companyData?.total_employees_change}%`
          : companyData?.total_employees_change < 0
          ? `${companyData?.total_employees_change}%`
          : "0%",
    },
    {
      title: "Departments",
      value: companyData?.total_departments || 0,
      change:
        companyData?.total_departments_change > 0
          ? `+${companyData?.total_departments_change}%`
          : companyData?.total_departments_change < 0
          ? `${companyData?.total_departments_change}%`
          : "0%",
    },
    {
      title: "Active Employees",
      value: companyData?.active_employees || 0,
      change:
        companyData?.active_employees_change > 0
          ? `+${companyData?.active_employees_change}%`
          : companyData?.active_employees_change < 0
          ? `${companyData?.active_employees_change}%`
          : "0%",
    },
    {
      title: "Inactive Employees",
      value: companyData?.inactive_employees || 0,
      change:
        companyData?.inactive_employees_change > 0
          ? `+${companyData?.inactive_employees_change}%`
          : companyData?.inactive_employees_change < 0
          ? `${companyData?.inactive_employees_change}%`
          : "0%",
    },
  ];

  const columns = [
    { title: "Sr no.", key: "serialNumber", width: 80, render: (_, __, index) => index + 1 },
    { title: "Full Name", dataIndex: "name", key: "name", render: (_, r) => `${r.first_name} ${r.last_name}` },
    { title: "Official Email ID", dataIndex: "email", key: "email" },
    { title: "Contact Number", dataIndex: "phone", key: "phone" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Department", dataIndex: "department_name", key: "department_name" },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Date added",
      dataIndex: "joined_date",
      key: "joined_date",
      render: (date) => new Date(date).toISOString().split("T")[0],
      sorter: (a, b) => new Date(a.dateAdded) - new Date(b.dateAdded),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active) => (
        <span className={`${is_active === 1 ? "bg-white text-black" : "bg-[#434343] text-white"} inline-block whitespace-nowrap rounded-[16px] px-3 py-1 text-xs font-medium`}>
          {is_active === 1 ? "Active" : "InActive"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: () => (
        <button className="flex flex-col items-center gap-1 rounded p-2 hover:opacity-80">
          <span className="h-1 w-1 rounded-full bg-white"></span>
          <span className="h-1 w-1 rounded-full bg-white"></span>
          <span className="h-1 w-1 rounded-full bg-white"></span>
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(108.08%_74.37%_at_50%_0%,_#33353F_0%,_#0D0D11_99.73%)] px-5 sm:px-10 lg:px-20 py-10">
        <CustomHeader title="Employee Management" />
        <div className="my-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <MetricCardShimmer key={`metric-shimmer-${i}`} />
          ))}
        </div>
        <div className="mb-6 flex items-center justify-between">
          <div className="relative mr-4 flex-1 max-w-[400px]">
            <SearchOutlined className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-white" />
            <input disabled placeholder="Search name, department" className="h-12 w-full rounded-xl border border-[#434343] bg-[#191a20] pl-9 pr-3 text-white placeholder:text-white/70" />
          </div>
          <div className="flex gap-3">
            <button disabled className="h-12 rounded-[70px] bg-gradient-to-b from-white to-[#797b87] px-6 font-medium text-black">Add Employee</button>
            <button disabled className="h-12 rounded-[70px] border border-white/10 px-6 font-medium text-red-500">Remove Employee</button>
          </div>
        </div>
        <TableShimmer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(108.08%_74.37%_at_50%_0%,_#33353F_0%,_#0D0D11_99.73%)] px-5 sm:px-10 lg:px-20 py-10">
      <CustomHeader title="Employee Management" />

      <div className="my-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <div key={index} className="rounded-[18px] border border-white/15 bg-gradient-to-b from-[rgba(90,114,150,0.2)] to-transparent p-3 shadow-[0_12px_8px_-8px_rgba(0,0,0,0.4)]">
            <h3 className="pb-2 text-[18px] font-normal text-[#8c8c8c]">{metric.title}</h3>
            <div className="flex w-full items-baseline justify-between">
              <h1 className="m-0 text-4xl font-bold text-white">
                <CountUp start={0} end={metric.value} duration={2} separator="," useEasing enableScrollSpy scrollSpyOnce />
              </h1>
              <div className={`${metric.change.startsWith("+") ? "text-[#00d885]" : metric.change === "0%" ? "text-[#8c8c8c]" : "text-[#ff4d4f]"} text-[16px] font-medium`}>
                {metric.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="relative mr-4 flex-1 max-w-[400px]">
          <SearchOutlined className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-white" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search name, department"
            className="h-12 w-full rounded-xl border border-[#434343] bg-[#191a20] pl-9 pr-3 text-white placeholder:text-white/70"
          />
        </div>
        <div className="flex gap-3">
          <button onClick={handleAddEmployee} className="h-12 rounded-[70px] bg-gradient-to-b from-white to-[#797b87] px-6 font-medium text-black">
            Add Employee
          </button>
          <button onClick={handleRemoveEmployee} className="h-12 rounded-[70px] border border-white/10 px-6 font-medium text-red-500">
            Remove Employee
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[18px] border border-[#434343]">
        <Table
          columns={columns}
          dataSource={employees}
          pagination={false}
          rowKey="user_id"
          className="[&_.ant-table]:!bg-[#191a20] [&_.ant-table-body]:!overflow-x-auto [&_.ant-table-body]:!overflow-y-auto [&_.ant-table-thead_tr_th]:!bg-[#191a20] [&_.ant-table-thead_tr_th]:!text-white [&_.ant-table-thead_tr_th]:!border-b [&_.ant-table-thead_tr_th]:!border-[#434343] [&_.ant-table-thead_tr_th]:!px-4 [&_.ant-table-thead_tr_th]:!py-4 [&_.ant-table-tbody_tr_td]:!bg-[#191a20] [&_.ant-table-tbody_tr_td]:!border-b [&_.ant-table-tbody_tr_td]:!border-[#434343] [&_.ant-table-tbody_tr_td]:!text-white [&_.ant-table-tbody_tr_td]:!px-4 [&_.ant-table-tbody_tr_td]:!py-4 [&_.ant-table-filter-trigger]:!text-white [&_.ant-table-column-sorter]:!text-white"
          locale={{
            emptyText: (
              <div className="-mx-5 -my-4 flex flex-col items-center bg-black p-8 text-white">
                <div className="mb-2 invert">
                  {Empty.PRESENTED_IMAGE_SIMPLE}
                </div>
                <span>No Data Available</span>
              </div>
            ),
          }}
        />
      </div>

      <div className="mt-5">
        <CustomPagination currentPage={pagination.current} totalPages={Math.ceil(pagination.total / pagination.pageSize)} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;

