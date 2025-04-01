import React from "react";
import { GaugeComponent } from 'react-gauge-component';
import "./index.css";

const CompanyHealthGauge = ({
  value = 35,
  title = "Stress level",
  status = "Optimum",
  onClick,
  style, // Accept style prop
}) => {
  // Get the glow color based on value
  const getGlowColor = (value) => {
    if (value <= 35) return '76, 217, 100'; // Green
    if (value <= 70) return '255, 184, 0'; // Yellow
    return '255, 59, 48'; // Red
  };

  const glowColor = getGlowColor(value);

  return (
    <div
      className="gauge-container"
      onClick={onClick}
      style={{
        '--glow-color': glowColor,
        ...style // Merge any additional styles passed from parent
      }}
    >
      <h2 className="gauge-title">{title}</h2>
      <div className="gauge-wrapper">
        <GaugeComponent
          value={value}
          type="semicircle"
          arc={{
            width: 0.2,
            padding: 0,
            cornerRadius: 1,
            colorArray: ['#4CD964', '#FFB800', '#FF3B30'],
            gradient: true,
            subArcs: [
              { limit: 35 },
              { limit: 70 },
              { limit: 100 }
            ]
          }}
          pointer={{ hide: "true" }}
          labels={{
            valueLabel: {
              formatTextValue: value => value + '%',
              style: {
                fontSize: '40px',
                fill: '#ffffff',
                textAnchor: 'middle',
                fontWeight: '500'
              },
              matchColorWithArc: false
            },
            tickLabels: {
              type: "outer",
              ticks: [
                { value: 0 },
                { value: 100 }
              ],
              style: {
                fontSize: '16px',
                fill: '#ffffff',
                textAnchor: 'middle',
                opacity: '0.8'
              }
            }
          }}
        />
      </div>
      <div className="gauge-status">{status}</div>
    </div>
  );
};

export default CompanyHealthGauge;
