import React, { useState, useEffect } from "react";
import Joyride from "react-joyride";
import WelcomeTourModal from "./WelcomeTourModal";

const DashboardTour = ({ run, onClose }) => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [startTour, setStartTour] = useState(false);

  // Check if we should automatically start the tour
  useEffect(() => {
    // Log the current state for debugging
    console.log('DashboardTour mounted, run:', run, 'showWelcomeModal:', showWelcomeModal);

    // Check if localStorage has a flag indicating the user clicked Start Tour
    const tourStarted = localStorage.getItem('tourStarted');
    if (tourStarted === 'true' && run) {
      console.log('Auto-starting tour from localStorage flag');
      setShowWelcomeModal(false);
      setStartTour(true);
    }

    // Cleanup function
    return () => {
      console.log('DashboardTour unmounted');
    };
  }, [run]);

  // Auto-click the beacon when it appears
  useEffect(() => {
    if (startTour) {
      // Function to auto-click the beacon
      const clickBeacon = () => {
        const beacon = document.querySelector('.react-joyride__beacon');
        if (beacon) {
          console.log('Auto-clicking beacon');
          beacon.click();
        } else {
          // If beacon not found yet, try again in a moment
          setTimeout(clickBeacon, 100);
        }
      };

      // Start looking for the beacon after a short delay
      const timerId = setTimeout(clickBeacon, 500);

      return () => clearTimeout(timerId);
    }
  }, [startTour]);

  const handleStartTour = () => {
    // First hide the welcome modal
    setShowWelcomeModal(false);

    // Start the tour with a slight delay to ensure DOM is ready
    setTimeout(() => {
      console.log('Starting tour...');
      setStartTour(true);
      // Save to localStorage that we've shown the tour
      localStorage.setItem('tourStarted', 'true');
    }, 300); // Increased delay for better reliability
  };

  const handleSkipTour = () => {
    setShowWelcomeModal(false);
    onClose();
  };

  const steps = [
    {
      target: ".main-header",
      content: "Welcome to the Neure Dashboard! This is your central hub for managing your mental well-being.",
      placement: "bottom",
    },
    {
      target: ".main-workshop-banner",
      content: "View for upcoming mental wellness workshops.",
      placement: "right",
    },
    {
      target: ".main-metrics-cards",
      content: "Track your company's stress levels and access resources.",
      placement: "left",
    },
    {
      target: ".main-announcement-card",
      content: "Stay updated with important announcements and notifications.",
      placement: "right",
    },
    {
      target: ".main-support-card",
      content: "Get help and support for your mental well-being.",
      placement: "left",
    },
    {
      target: ".main-rewards-card",
      content: "Earn rewards for maintaining your mental well-being.",
      placement: "left",
    },
    {
      target: ".main-roi-card",
      content: "View your return on investment (ROI) for your mental well-being.",
      placement: "right",
    }
  ];

  return (
    <>
      {showWelcomeModal && run && (
        <WelcomeTourModal
          onStartTour={handleStartTour}
          onSkip={handleSkipTour}
        />
      )}
      <Joyride
        steps={steps}
        run={startTour && run}
        continuous
        showProgress
        showSkipButton
        disableOverlayClose
        spotlightClicks
        hideBackButton={false}
        disableBeacon={false}
        showBeacon={true}
        disableScrolling={false}
        scrollToFirstStep={true}
        scrollOffset={100}
        styles={{
          options: {
            arrowColor: "#1a1a1a",
            backgroundColor: "#1a1a1a",
            overlayColor: "rgba(0, 0, 0, 0.75)",
            primaryColor: "#4361ee",
            textColor: "#ffffff",
            spotlightShadow: "0 0 15px rgba(67, 97, 238, 0.3)",
            width: 360,
            zIndex: 1000,
            beaconSize: 48, // Larger beacon for easier auto-clicking
          },
          tooltip: {
            borderRadius: "12px",
            fontSize: "15px",
            padding: "20px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
            transition: "all 0.3s ease",
          },
          tooltipContainer: {
            textAlign: "left",
          },
          tooltipTitle: {
            fontSize: "18px",
            fontWeight: 600,
            marginBottom: "12px",
            color: "#fff",
          },
          buttonNext: {
            backgroundColor: "#4361ee",
            borderRadius: "8px",
            fontSize: "14px",
            padding: "10px 20px",
            fontWeight: 500,
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "#3651d3",
              transform: "translateY(-1px)",
            },
          },
          buttonBack: {
            color: "#cccccc",
            marginRight: "12px",
            fontSize: "14px",
            padding: "10px 16px",
            transition: "all 0.2s ease",
            "&:hover": {
              color: "#ffffff",
            },
          },
          buttonSkip: {
            color: "#cccccc",
            fontSize: "14px",
            transition: "all 0.2s ease",
            "&:hover": {
              color: "#ffffff",
            },
          },
          spotlight: {
            borderRadius: "8px",
            transition: "all 0.3s ease-in-out",
          },
        }}
        floaterProps={{
          disableAnimation: false,
          styles: {
            floater: {
              transition: "all 0.3s ease-in-out",
            },
          },
        }}
        locale={{
          back: "Previous",
          close: "Close",
          last: "Finish",
          next: "Next",
          skip: "Skip tour",
        }}
        callback={(data) => {
          const { status, type, index } = data;
          console.log('Joyride callback:', { status, type, index });

          // Handle tour completion
          if (["finished", "skipped"].includes(status)) {
            onClose();
            console.log('Tour completed or skipped');
          }

          // Handle step changes
          if (type === 'step:after') {
            console.log(`Completed step ${index + 1}`);
          }

          // Handle errors
          if (type === 'error:target_not_found') {
            console.log(`Target not found for step ${index + 1}`);
          }

          // Handle beacon events
          if (type === 'beacon:before' || type === 'beacon') {
            console.log(`Beacon appeared for step ${index + 1}`);
            // The useEffect will handle clicking the beacon
          }

          // Store tour progress in localStorage to avoid showing it again
          if (status === "finished") {
            localStorage.setItem('hasSeenDashboardTour', 'true');
          }
        }}
      />
    </>
  );
};

export default DashboardTour;
