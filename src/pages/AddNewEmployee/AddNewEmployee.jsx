import React, { useState, useEffect, useRef } from "react";
import CustomHeader from "../../components/CustomHeader";
import { UploadOutlined, FileOutlined, CloseOutlined } from "@ant-design/icons";
import { message, Modal } from "antd";
import { createEmployee, getDepartments, bulkCreateEmployees } from "../../services/api";

const Shimmer = () => (
  <div className="rounded-[12px] border border-white/10 bg-[#191A20] p-6">
    <div className="mb-6 flex gap-4">
      <div className="h-10 w-32 animate-shimmer rounded bg-[length:200%_100%]" style={{ backgroundImage: 'linear-gradient(90deg,#2D2F39 0%,#363845 50%,#2D2F39 100%)' }} />
      <div className="h-10 w-36 animate-shimmer rounded bg-[length:200%_100%]" style={{ backgroundImage: 'linear-gradient(90deg,#2D2F39 0%,#363845 50%,#2D2F39 100%)' }} />
    </div>
    {[...Array(3)].map((_, row) => (
      <div key={row} className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2">
        {[...Array(2)].map((__, i) => (
          <div key={i}>
            <div className="mb-2 h-4 w-24 animate-shimmer rounded bg-[length:200%_100%]" style={{ backgroundImage: 'linear-gradient(90deg,#2D2F39 0%,#363845 50%,#2D2F39 100%)' }} />
            <div className="h-12 w-full animate-shimmer rounded bg-[length:200%_100%]" style={{ backgroundImage: 'linear-gradient(90deg,#2D2F39 0%,#363845 50%,#2D2F39 100%)' }} />
          </div>
        ))}
      </div>
    ))}
  </div>
);

const AddNewEmployee = () => {
  const [employeeType, setEmployeeType] = useState("single");
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [fetchingDepartments, setFetchingDepartments] = useState(true);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", contact: "", gender: "", dateOfBirth: null, department: "", city: "" });
  const fileInputRef = useRef(null);
  const [bulkUploadFile, setBulkUploadFile] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setFetchingDepartments(true);
        const response = await getDepartments();
        if (response.status) setDepartments(response.data);
        else message.error("Failed to fetch departments");
      } catch (error) {
        message.error("Failed to load departments");
      } finally {
        setFetchingDepartments(false);
      }
    };
    fetchDepartments();
  }, []);

  if (fetchingDepartments) {
    return (
      <div className="min-h-screen px-5 sm:px-10 lg:px-20 py-10">
        <CustomHeader title="Add New Employee" />
        <div className="w-full max-w-[800px]">
          <Shimmer />
        </div>
      </div>
    );
  }

  const onTypeChange = (type) => setEmployeeType(type);
  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleDateChange = (e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value || null }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const companyId = localStorage.getItem("companyId");
      const employeeData = {
        company_id: companyId,
        email: formData.email,
        phone: formData.contact,
        username: `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`,
        first_name: formData.firstName,
        last_name: formData.lastName,
        gender: formData.gender,
        date_of_birth: formData.dateOfBirth,
        job_title: "",
        department_id: parseInt(formData.department),
        city: formData.city,
      };
      const response = await createEmployee(employeeData);
      if (response.status) {
        message.success("Employee added successfully!");
        setFormData({ firstName: "", lastName: "", email: "", contact: "", gender: "", dateOfBirth: null, department: "", city: "" });
      } else {
        if (response.message?.includes("already in use")) message.error(response.message);
        else message.error(response.message || "Failed to add employee. Please try again.");
      }
    } catch (error) {
      if (error.response?.data?.message) message.error(error.response.data.message);
      else message.error(error.message || "Failed to add employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setBulkUploadFile(file);
  };
  const clearUploadedFile = () => { setBulkUploadFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; };

  const handleBulkUploadSubmit = async () => {
    if (!bulkUploadFile) { message.warning("Please upload a CSV file first"); return; }
    setLoading(true);
    try {
      const companyId = localStorage.getItem("companyId");
      const response = await bulkCreateEmployees(bulkUploadFile, companyId);
      if (response.status) {
        message.success(`Successfully added ${response.data.successful.length} employees`);
        clearUploadedFile();
      } else {
        if (response.data?.failed?.length) {
          const duplicateEmails = response.data.failed.filter((i) => i.error?.includes("already exists")).map((i) => i.email);
          const otherErrors = response.data.failed.filter((i) => !i.error || !i.error.includes("already exists"));
          if (duplicateEmails.length) {
            let list = duplicateEmails.join(", ");
            if (list.length > 100) list = `${duplicateEmails.slice(0, 3).join(", ")} and ${duplicateEmails.length - 3} more`;
            message.error(`Duplicate emails found: ${list}`);
          }
          if (otherErrors.length) {
            Modal.error({
              title: "Failed to add some employees",
              content: (
                <div>
                  <p>The following employees could not be added due to other errors:</p>
                  <div style={{ maxHeight: "200px", overflow: "auto", whiteSpace: "pre-line" }}>
                    {otherErrors.map((i) => `${i.email}: ${i.error || "Unknown error"}`).join("\n")}
                  </div>
                </div>
              ),
            });
          }
          if (response.data.successful?.length) message.success(`Successfully added ${response.data.successful.length} employees`);
          else clearUploadedFile();
        } else {
          message.error(response.message || "Failed to add employees");
          clearUploadedFile();
        }
      }
    } catch (error) {
      clearUploadedFile();
      if (error.response?.data?.message) message.error(error.response.data.message);
      else message.error(error.message || "Failed to process bulk upload");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen px-5 sm:px-10 lg:px-20 py-10 text-white">
      <CustomHeader title="Add New Employee" />
      <div className="w-full max-w-[800px] rounded-[12px] border border-white/10 bg-[#191A20] p-8">
        <div className="mb-4">
          <h3 className="mb-2 text-2xl font-normal">Type</h3>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => onTypeChange("single")}
              className={`h-12 flex-1 rounded-[18px] border text-base ${employeeType === "single" ? "border-[#00d885] text-[#00d885] shadow-[inset_0_-4px_6px_0_#00d88538]" : "border-white/10 text-white/50"}`}
            >
              Single Employee
            </button>
            <button
              type="button"
              onClick={() => onTypeChange("bulk")}
              className={`h-12 flex-1 rounded-[18px] border text-base ${employeeType === "bulk" ? "border-[#00d885] text-[#00d885] shadow-[inset_0_-4px_6px_0_#00d88538]" : "border-white/10 text-white/50"}`}
            >
              Bulk Upload (CSV)
            </button>
          </div>
        </div>

        <div className="-mx-8 my-6 h-px bg-[#434343]" />

        {employeeType === "single" ? (
          <form onSubmit={onSubmit}>
            <div className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName" className="text-sm">First Name*</label>
                <input id="firstName" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required className="h-12 rounded-[12px] border border-white/10 bg-transparent px-3 text-white" />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="lastName" className="text-sm">Last Name*</label>
                <input id="lastName" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required className="h-12 rounded-[12px] border border-white/10 bg-transparent px-3 text-white" />
              </div>
            </div>
            <div className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm">Email*</label>
                <input id="email" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="h-12 rounded-[12px] border border-white/10 bg-transparent px-3 text-white" />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="contact" className="text-sm">Contact*</label>
                <input id="contact" name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleChange} required className="h-12 rounded-[12px] border border-white/10 bg-transparent px-3 text-white" />
              </div>
            </div>
            <div className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="gender" className="text-sm">Gender*</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required className="h-12 rounded-[12px] border border-white/10 bg-transparent px-3 text-white">
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="dateOfBirth" className="text-sm">Date of Birth*</label>
                <input id="dateOfBirth" type="date" name="dateOfBirth" value={formData.dateOfBirth || ""} onChange={handleDateChange} required className="h-12 rounded-[12px] border border-white/30 bg-[#191a20] px-3 text-white [filter:invert(1)_brightness(1.2)]" />
              </div>
            </div>
            <div className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="department" className="text-sm">Department*</label>
                <select id="department" name="department" value={formData.department} onChange={handleChange} required className="h-12 rounded-[12px] border border-white/10 bg-transparent px-3 text-white">
                  <option value="" disabled>Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="city" className="text-sm">City*</label>
                <input id="city" name="city" placeholder="City" value={formData.city} onChange={handleChange} required className="h-12 rounded-[12px] border border-white/10 bg-transparent px-3 text-white" />
              </div>
            </div>

            <div className="-mx-8 my-6 h-px bg-[#434343]" />

            <div className="flex justify-end">
              <button type="submit" disabled={loading || fetchingDepartments} className="h-12 rounded-[70px] bg-gradient-to-b from-white to-[#797b87] px-6 text-base font-medium text-black hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="mt-6 w-full rounded-[12px] border-2 border-dashed border-white/10 p-10 text-center">
              <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleFileUpload} style={{ display: "none" }} id="fileInput" ref={fileInputRef} />
              {!bulkUploadFile ? (
                <>
                  <UploadOutlined className="mb-3 cursor-pointer text-[32px] text-[#B1B3C0]" onClick={() => document.getElementById("fileInput").click()} />
                  <p className="text-base text-white/50">
                    Drop your CSV file here, or <span className="cursor-pointer text-[#00d885] underline" onClick={() => document.getElementById("fileInput").click()}>click to browse</span>
                  </p>
                </>
              ) : (
                <div className="mt-2 flex w-full items-center justify-between rounded bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <FileOutlined className="text-[24px] text-[#00d885]" />
                    <div>
                      <p className="m-0 text-base font-medium text-white">{bulkUploadFile.name}</p>
                      <p className="m-0 text-xs text-white/60">{(bulkUploadFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button className="rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white" onClick={clearUploadedFile} type="button">
                    <CloseOutlined />
                  </button>
                </div>
              )}
            </div>
            <div className="-mx-8 my-6 h-px bg-[#434343]" />
            <div className="flex justify-end">
              <button onClick={handleBulkUploadSubmit} disabled={loading || !bulkUploadFile} className="h-12 rounded-[70px] bg-gradient-to-b from-white to-[#797b87] px-6 text-base font-medium text-black hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddNewEmployee;

