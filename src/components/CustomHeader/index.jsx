import React from 'react';
import { Button, Select, Tooltip } from 'antd';
import { ArrowLeftOutlined, EditOutlined, FilterOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './index.css';

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
    <div className="custom-header">
      <div className="header-main">
        <div className="header-left">
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
              className="back-button"
              style={{cursor: "pointer"}}
            />
          )}
          <h1 className="header-title">{title}</h1>
        </div>

        <div className="header-right">
          {showFilterButton && (
            <Select
              defaultValue={filterValue}
              onChange={setFilterValue}
              options={filterOptions}
              className="filter-select"
              suffixIcon={<FilterOutlined style={{ fontSize: '16px', color: '#fff' }} />}
            />
          )}

          {showAttendeeButtons && (
            <>
              <Tooltip title={buttonTooltip}>
                <Button
                  onClick={onViewAttendeesClick}
                  className="attendee-button view-attendees"
                  disabled={buttonDisabled}
                >
                  View attendees
                </Button>
              </Tooltip>
              <Tooltip title={isWorkshopCompleted ? "Check-in is not available for completed workshops" : buttonTooltip}>
                <Button
                  onClick={onCheckInClick}
                  className="attendee-button check-in"
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
              className="edit-button"
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
