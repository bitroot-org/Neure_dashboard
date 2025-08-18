import React from 'react';
import { Button, Select, Tooltip } from 'antd';
import { ArrowLeftOutlined, EditOutlined, FilterOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const CustomHeader = ({
  title,
  showBackButton = true,
  showEditButton = false,
  showFilterButton = false,
  showAttendeeButtons = false,
  onEditClick,
  onViewAttendeesClick,
  onCheckInClick,
  defaultFilterValue = 'Monthly',
  buttonText = 'Edit',
  buttonDisabled = false,
  buttonLoading = false,
  buttonTooltip = '',
  workshopStatus = '',
  onBack
}) => {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = React.useState(defaultFilterValue);
  const [backIconLoaded, setBackIconLoaded] = React.useState(true);

  // Check if workshop is completed
  const isWorkshopCompleted = workshopStatus === 'completed';

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const filterOptions = [
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Quarterly', label: 'Quarterly' },
    { value: 'Yearly', label: 'Yearly' }
  ];

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Button
              type="text"
              icon={
                backIconLoaded ? (
                  <img
                    src="ArrowLeft.png"
                    alt="Arrow left"
                    onError={() => setBackIconLoaded(false)}
                  />
                ) : (
                  <ArrowLeftOutlined style={{ fontSize: '24px', color: '#fff', fontWeight: "400" }} />
                )
              }
              onClick={handleBack}
              className="p-0 flex items-center justify-center hover:bg-transparent"
              style={{cursor: "pointer"}}
            />
          )}
          <h1 className="m-0 text-2xl font-medium text-white">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          {showFilterButton && (
            <Select
              defaultValue={filterValue}
              onChange={setFilterValue}
              options={filterOptions}
              className="w-[120px] [&_.ant-select-selector]:bg-transparent [&_.ant-select-selection-item]:text-white [&_.ant-select-arrow]:text-white/65"
              suffixIcon={<FilterOutlined style={{ fontSize: '16px', color: '#fff' }} />}
            />
          )}

          {showAttendeeButtons && (
            <>
              <Tooltip title={buttonTooltip}>
                <Button
                  onClick={onViewAttendeesClick}
                  className="h-12 px-6 rounded-[70px] text-base font-medium flex items-center justify-center min-w-[140px] bg-transparent border border-white/10 text-white mr-3 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-80"
                  disabled={buttonDisabled}
                >
                  View attendees
                </Button>
              </Tooltip>
              <Tooltip title={isWorkshopCompleted ? "Check-in is not available for completed workshops" : buttonTooltip}>
                <Button
                  onClick={onCheckInClick}
                  className="h-12 px-6 rounded-[70px] text-base font-medium flex items-center justify-center min-w-[140px] bg-gradient-to-b from-white to-[#797B87] border-none text-black disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={buttonDisabled || isWorkshopCompleted}
                >
                  Check-in
                </Button>
              </Tooltip>
            </>
          )}

          {showEditButton && (
            <Button
              onClick={onEditClick}
              disabled={buttonDisabled}
              loading={buttonLoading}
              className="flex items-center bg-gradient-to-b from-white to-[#797B87] text-black py-1 px-10 rounded-[20px] text-base font-medium h-10 w-[120px] border-none hover:bg-[#f0f0f0] hover:shadow-[0_0_0_2px_rgba(255,255,255,0.2)] focus:bg-[#f0f0f0] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.2)] active:bg-[#e0e0e0] active:shadow-[0_0_0_2px_rgba(255,255,255,0.3)]"
            >
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomHeader;
