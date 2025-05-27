import React from "react";
import { GaugeComponent } from "react-gauge-component";
import "./index.css";

const CompanyHealthGauge = ({
  value = 35,
  title = "Stress level",
  status = "Optimum",
  onClick,
}) => {
  // Get the glow color based on value
  const getGlowColor = (value) => {
    if (value <= 35) return "255, 59, 48"; // Red
    if (value <= 70) return "255, 184, 0"; // Yellow
    return "76, 217, 100"; // Green
  };

  const glowColor = getGlowColor(value);

  return (
    <div
      className="gauge-container"
      onClick={onClick}
      style={{
        "--glow-color": glowColor,
      }}
    >
      <h2 className="gauge-title">{title}</h2>

      <GaugeComponent
        value={value}
        type="radial"
        style={{ width: '100%', alignItems: 'center', marginTop:'-15px' }}

        arc={{
          width: 0.2,
          padding: 0,
          cornerRadius: 1,
          colorArray: ["#FF3B30", "#FFB800", "#4CD964"],
          gradient: true,
          subArcs: [{ limit: 35 }, { limit: 70 }, { limit: 100 }],
        }}
        pointer={{
          elastic: true,
          animationDelay: 0,
        }}
        labels={{
          valueLabel: {
            formatTextValue: (value) => value + "%",
            style: {
              fontSize: "48px",
              fill: "#ffffff",
              textAnchor: "middle",
              fontWeight: "700",
            },
            matchColorWithArc: false,
          },
          tickLabels: {
            type: "outer",
            ticks: [{ value: 0 }, { value: 100 }],
            style: {
              fontSize: "1rem",
              fill: "#ffffff",
              textAnchor: "middle",
              opacity: "0.8",
            },
          },
        }}
      />
      <div className="gauge-status">{status}</div>
    </div>
  );
};

export default CompanyHealthGauge;
