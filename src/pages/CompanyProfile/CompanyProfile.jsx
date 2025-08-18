import React, { useState, useEffect, useContext } from "react";
import { Upload, message } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import CustomHeader from "../../components/CustomHeader";
import { updateCompanyInfo, getCompanyById } from "../../services/api";
import { CompanyDataContext } from "../../context/CompanyContext";

const CompanyHeader = ({ companyInfo, isEditable, onEditClick, onImageUpload, previewLogoUrl }) => (
  <div className="mx-auto mb-5 flex w-full max-w-[1200px] items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="relative inline-block">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#144035]">
          {previewLogoUrl ? (
            <img src={previewLogoUrl} alt="Company Logo Preview" className="h-full w-full object-cover" />
          ) : companyInfo?.company_profile_url ? (
            <img src={companyInfo.company_profile_url} alt="Company Logo" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[44px] font-medium text-[#eee420]">
              {companyInfo?.company_name ? companyInfo.company_name.charAt(0).toUpperCase() : "?"}
            </div>
          )}
        </div>
        {isEditable && (
          <Upload
            name="logo"
            showUploadList={false}
            beforeUpload={(file) => {
              onImageUpload(file);
              return false;
            }}
          >
            <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow transition hover:scale-110">
              <CameraOutlined />
            </button>
          </Upload>
        )}
      </div>
      <span className="m-0 text-[32px] font-medium leading-[1.2] text-white">
        {companyInfo?.company_name || "Company"}
      </span>
    </div>
    <div>
      <button
        onClick={onEditClick}
        className="h-10 rounded-[18px] bg-gradient-to-b from-white to-[#797b87] px-6 text-base font-medium text-[#191a20] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)]"
      >
        {isEditable ? "Save" : "Edit"}
      </button>
    </div>
  </div>
);

const CompanyForm = ({ companyInfo, contactInfo, disabled, onChange }) => {
  const [employeeCount, setEmployeeCount] = useState(companyInfo?.company_size || 0);

  const handleEmployeeCountChange = (e) => {
    if (!disabled) {
      let newValue = parseInt(e.target.value, 10);
      if (isNaN(newValue) || newValue < 0) newValue = 0;
      setEmployeeCount(newValue);
      onChange("company", "company_size", newValue);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1200px] rounded-[18px] border border-white/10 bg-[#191a20]">
      <div className="p-6">
        <h3 className="mb-8 text-2xl font-medium text-white">Company info</h3>
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="mb-2 text-base text-white">Company name*</label>
            <input
              className="h-10 rounded border border-[#333] bg-transparent px-4 text-white disabled:cursor-not-allowed"
              value={companyInfo?.company_name || ""}
              disabled={disabled}
              readOnly={disabled}
              onChange={(e) => !disabled && onChange("company", "company_name", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="mb-2 text-base text-white">Number of employees*</label>
            <input
              type="number"
              min="0"
              className="h-10 rounded border border-[#333] bg-transparent px-4 text-white disabled:cursor-not-allowed"
              value={employeeCount}
              disabled={disabled}
              readOnly={disabled}
              onChange={handleEmployeeCountChange}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") e.preventDefault();
              }}
            />
          </div>
        </div>
        <div className="h-px w-full bg-[#333]" />
      </div>

      <div className="p-6">
        <h3 className="mb-8 text-2xl font-medium text-white">Contact person Info</h3>
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="mb-2 text-base text-white">Full name*</label>
            <input
              className="h-10 rounded border border-[#333] bg-transparent px-4 text-white disabled:cursor-not-allowed"
              value={`${contactInfo?.first_name || ""} ${contactInfo?.last_name || ""}`}
              disabled={disabled}
              readOnly={disabled}
              onChange={(e) => {
                if (!disabled) {
                  const parts = e.target.value.split(" ");
                  const firstName = parts[0] || "";
                  const lastName = parts.slice(1).join(" ") || "";
                  onChange("contact_person", "first_name", firstName);
                  onChange("contact_person", "last_name", lastName);
                }
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="mb-2 text-base text-white">Job title*</label>
            <input
              className="h-10 rounded border border-[#333] bg-transparent px-4 text-white disabled:cursor-not-allowed"
              value={contactInfo?.job_title || ""}
              disabled={disabled}
              readOnly={disabled}
              onChange={(e) => !disabled && onChange("contact_person", "job_title", e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="mb-2 text-base text-white">Email*</label>
            <input
              className="h-10 cursor-not-allowed rounded border border-[#333] bg-transparent px-4 text-white"
              value={contactInfo?.email || ""}
              disabled
              readOnly
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="mb-2 text-base text-white">Phone number*</label>
            <input
              className="h-10 rounded border border-[#333] bg-transparent px-4 text-white disabled:cursor-not-allowed"
              value={contactInfo?.phone || ""}
              disabled={disabled}
              readOnly={disabled}
              onChange={(e) => !disabled && onChange("contact_person", "phone", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Shimmer = () => (
  <>
    <div className="mx-auto mb-5 flex w-full max-w-[1200px] items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="h-24 w-24 animate-shimmer rounded-full bg-[length:200%_100%]" style={{ backgroundImage: 'linear-gradient(90deg,#2D2F39 0%,#363845 50%,#2D2F39 100%)' }} />
        <div className="h-8 w-[200px] animate-shimmer rounded bg-[length:200%_100%]" style={{ backgroundImage: 'linear-gradient(90deg,#2D2F39 0%,#363845 50%,#2D2F39 100%)' }} />
      </div>
      <div className="h-9 w-20 animate-shimmer rounded bg-[length:200%_100%]" style={{ backgroundImage: 'linear-gradient(90deg,#2D2F39 0%,#363845 50%,#2D2F39 100%)' }} />
    </div>
    <div className="mx-auto w-full max-w-[1200px] rounded-[18px] border border-white/10 bg-[#191a20] p-6">
      <div className="mb-8 h-6 w-[150px] animate-shimmer rounded bg-[length:200%_100%]" style={{ backgroundImage: 'linear-gradient(90deg,#2D2F39 0%,#363845 50%,#2D2F39 100%)' }} />
      {[...Array(6)].map((_, i) => (
        <div key={i} className="mb-4 h-10 w-full animate-shimmer rounded bg-[length:200%_100%]" style={{ backgroundImage: 'linear-gradient(90deg,#2D2F39 0%,#363845 50%,#2D2F39 100%)' }} />
      ))}
    </div>
  </>
);

const CompanyProfile = () => {
  const { refreshCompanyData } = useContext(CompanyDataContext);
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({ company: {}, contact_person: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadedLogoFile, setUploadedLogoFile] = useState(null);
  const [previewLogoUrl, setPreviewLogoUrl] = useState(null);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const response = await getCompanyById(companyId);
        if (response.status && response.data) {
          const companyData = response.data.data || response.data;
          setFormData(companyData);
        }
      } catch (err) {
        console.error("Error fetching company data:", err);
        setError("Error fetching company data");
      } finally {
        setLoading(false);
      }
    };
    if (companyId) fetchCompanyData();
    else {
      setError("Company ID not found");
      setLoading(false);
    }
  }, []);

  const handleImageUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG files!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      return false;
    }
    setUploadedLogoFile(file);
    const previewURL = URL.createObjectURL(file);
    setPreviewLogoUrl(previewURL);
    message.success("Logo selected. Click Save to apply changes.");
    return false;
  };

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      const companyId = localStorage.getItem("companyId");
      formDataToSend.append("companyId", companyId);
      formDataToSend.append("companyName", formData.company?.company_name || "");
      formDataToSend.append("companySize", formData.company?.company_size || "");
      formDataToSend.append("contactPerson[id]", formData.contact_person?.id || "");
      formDataToSend.append("contactPerson[firstName]", formData.contact_person?.first_name || "");
      formDataToSend.append("contactPerson[lastName]", formData.contact_person?.last_name || "");
      formDataToSend.append("contactPerson[email]", formData.contact_person?.email || "");
      formDataToSend.append("contactPerson[phone]", formData.contact_person?.phone || "");
      formDataToSend.append("contactPerson[jobTitle]", formData.contact_person?.job_title || "");
      if (uploadedLogoFile) formDataToSend.append("file", uploadedLogoFile);

      const response = await updateCompanyInfo(formDataToSend);
      if (response.status) {
        message.success("Company information updated successfully");
        setUploadedLogoFile(null);
        setPreviewLogoUrl(null);
        await refreshCompanyData();
        const refreshResponse = await getCompanyById(companyId);
        if (refreshResponse.status && refreshResponse.data) {
          const refreshedData = refreshResponse.data.data || refreshResponse.data;
          setFormData(refreshedData);
        }
        setIsEditable(false);
      } else {
        throw new Error(response.message || "Failed to update company information");
      }
    } catch (error) {
      console.error("Error updating company information:", error);
      message.error(error.message || "Failed to update company information");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async () => {
    if (isEditable) await handleSubmit();
    else setIsEditable(true);
  };

  return (
    <div className="min-h-screen w-full user-select-none bg-[radial-gradient(108.08%_74.37%_at_50%_0%,_#33353F_0%,_#0D0D11_99.73%)] px-5 sm:px-10 lg:px-20 py-10">
      <CustomHeader title="Account details" showBackButton />
      {loading ? (
        <Shimmer />)
        : (
        <>
          <CompanyHeader
            companyInfo={formData?.company}
            isEditable={isEditable}
            onEditClick={handleEditSave}
            onImageUpload={handleImageUpload}
            previewLogoUrl={previewLogoUrl}
          />
          <CompanyForm
            companyInfo={formData?.company}
            contactInfo={formData?.contact_person}
            disabled={!isEditable}
            onChange={handleInputChange}
          />
        </>
      )}
    </div>
  );
};

export default CompanyProfile;

