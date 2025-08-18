import React, { useState, useEffect } from "react";
import { Table, Empty, message, Modal } from "antd";
import { SearchOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import CustomHeader from "../../components/CustomHeader";
import { getTopPerformingEmployee, removeEmployee, searchEmployees } from "../../services/api";

const { confirm } = Modal;

const RemoveEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const timer = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(timer);
    }, [value, delay]);
    return debouncedValue;
  }

  const debouncedSearchText = useDebounce(searchText, 1000);

  useEffect(() => { fetchEmployees(1, 10, debouncedSearchText); }, [debouncedSearchText]);
  useEffect(() => { fetchEmployees(); }, []);

  const handleSearchChange = (e) => setSearchText(e.target.value);

  const fetchEmployees = async (page = 1, pageSize = 10, searchTerm = "") => {
    try {
      setLoading(true);
      const company_id = localStorage.getItem("companyId") || 1;
      let response;
      if (searchTerm && searchTerm.trim() !== "") {
        response = await searchEmployees({ company_id, search_term: searchTerm, page, limit: pageSize });
      } else {
        response = await getTopPerformingEmployee({ companyId: company_id, page, limit: pageSize });
      }
      if (response?.status) {
        setEmployees(response.data);
        setSelectedEmployees([]);
      }
    } catch (error) {
      message.error("Failed to fetch employees");
    } finally { setLoading(false); }
  };

  const handleSelect = (employeeId) => setSelectedEmployees((prev) => (prev.includes(employeeId) ? prev.filter((id) => id !== employeeId) : [...prev, employeeId]));
  const handleSelectAll = (checked) => setSelectedEmployees(checked ? employees.map((emp) => emp.user_id || emp.id) : []);

  const handleRemoveEmployees = () => {
    if (selectedEmployees.length === 0) { message.warning("Please select employees to remove"); return; }
    confirm({
      title: "Are you sure you want to remove these employees?",
      icon: <ExclamationCircleOutlined />,
      content: `You are about to remove ${selectedEmployees.length} employee(s). This action cannot be undone.`,
      okText: "Yes, Remove",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          setLoading(true);
          const company_id = localStorage.getItem("companyId") || 1;
          let response;
          if (selectedEmployees.length === 1) response = await removeEmployee({ company_id, user_id: selectedEmployees[0] });
          else response = await removeEmployee({ company_id, user_ids: selectedEmployees });
          if (response?.status) {
            message.success(`${selectedEmployees.length} employee(s) removed successfully`);
            setSelectedEmployees([]);
            fetchEmployees();
          } else throw new Error("Failed to remove employees");
        } catch (error) {
          message.error("Failed to remove employees. Please try again.");
        } finally { setLoading(false); }
      },
    });
  };

  const columns = [
    { title: <input type="checkbox" className="accent-white h-[18px] w-[18px]" checked={employees.length > 0 && selectedEmployees.length === employees.length} onChange={(e) => handleSelectAll(e.target.checked)} />, key: "select", render: (_, record) => {
      const employeeId = record.user_id || record.id;
      return <input type="checkbox" className="accent-white h-[18px] w-[18px]" checked={selectedEmployees.includes(employeeId)} onChange={() => handleSelect(employeeId)} />;
    }, width: 60 },
    { title: "Sr no.", key: "serialNumber", render: (_, __, index) => index + 1, width: 80 },
    { title: "Full Name", dataIndex: "name", key: "name", render: (_, record) => `${record.first_name} ${record.last_name}` },
    { title: "Official Email ID", dataIndex: "email", key: "email" },
    { title: "Contact Number", dataIndex: "phone", key: "phone" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Department", dataIndex: "department_name", key: "department_name" },
    { title: "City", dataIndex: "city", key: "city" },
    { title: "Date added", dataIndex: "joined_date", key: "joined_date", render: (date) => { const d = new Date(date); return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0]; }, sorter: (a, b) => new Date(a.dateAdded) - new Date(b.dateAdded) },
    { title: "Status", dataIndex: "is_active", key: "is_active", render: (is_active) => (<span className={`${is_active === 1 ? "bg-white text-black" : "bg-[#434343] text-white"} inline-block whitespace-nowrap rounded-[16px] px-3 py-1 text-xs font-medium`}>{is_active === 1 ? "Active" : "InActive"}</span>) },
  ];

  return (
    <div className="min-h-screen px-5 sm:px-10 lg:px-20 py-10">
      <CustomHeader title="Remove Employee" />

      <div className="my-6 flex items-center justify-between">
        <div className="relative mr-4 flex-1 max-w-[400px]">
          <SearchOutlined className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-white" />
          <input type="text" placeholder="Search name, department" className="h-12 w-full rounded-xl border border-[#434343] bg-[#191a20] pl-9 pr-3 text-white placeholder:text-white/70" value={searchText} onChange={handleSearchChange} />
        </div>
        <div className="flex gap-3">
          <button className={`h-12 rounded-[70px] px-6 font-medium ${selectedEmployees.length === 0 ? "cursor-not-allowed bg-[#444] text-black opacity-60" : "bg-gradient-to-b from-white to-[#797B87] text-black hover:shadow-[0_0_50px_rgba(255,255,255,0.5)]"}`} onClick={handleRemoveEmployees} disabled={selectedEmployees.length === 0 || loading} title={selectedEmployees.length === 0 ? "Select employees to remove" : "Remove selected employees"}>
            Remove
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[18px] border border-[#434343]">
        <Table
          className="[&_.ant-table]:!bg-[#191a20] [&_.ant-table-body]:!overflow-x-auto [&_.ant-table-body]:!overflow-y-auto [&_.ant-table-thead_tr_th]:!bg-[#191a20] [&_.ant-table-thead_tr_th]:!text-white [&_.ant-table-thead_tr_th]:!border-b [&_.ant-table-thead_tr_th]:!border-[#434343] [&_.ant-table-thead_tr_th]:!px-4 [&_.ant-table-thead_tr_th]:!py-4 [&_.ant-table-tbody_tr_td]:!bg-[#191a20] [&_.ant-table-tbody_tr_td]:!border-b [&_.ant-table-tbody_tr_td]:!border-[#434343] [&_.ant-table-tbody_tr_td]:!text-white [&_.ant-table-tbody_tr_td]:!px-4 [&_.ant-table-tbody_tr_td]:!py-4 [&_.ant-table-filter-trigger]:!text-white [&_.ant-table-column-sorter]:!text-white"
          columns={columns}
          dataSource={employees}
          pagination={false}
          loading={loading}
          rowKey="id"
          locale={{
            emptyText: (
              <div className="-mx-5 -my-4 flex flex-col items-center bg-black p-8 text-white">
                <div className="mb-2 invert">{Empty.PRESENTED_IMAGE_SIMPLE}</div>
                <span>No Data Available</span>
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default RemoveEmployee;

