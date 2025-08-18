import React from "react";
import { GaugeComponent } from "react-gauge-component";

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
      className="bg-[radial-gradient(108.08%_74.37%_at_50%_0%,#33353F_0%,#0D0D11_99.73%)] rounded-3xl py-4 px-0 w-full h-full border border-white/10 overflow-hidden flex flex-col items-center justify-between relative before:content-[''] before:absolute before:-bottom-[40%] before:left-1/2 before:-translate-x-1/2 before:w-[43.75rem] before:h-48 before:bg-[radial-gradient(circle_at_center,rgba(var(--glow-color),0.3)_0%,rgba(var(--glow-color),0.15)_25%,rgba(var(--glow-color),0.05)_50%,transparent_70%)] before:blur-[1.25rem] before:pointer-events-none before:z-0"
      onClick={onClick}
      style={{
        "--glow-color": glowColor,
      }}
    >
      <h2 className="text-white text-2xl font-normal text-center">{title}</h2>

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
      <div className="text-white text-[1.2rem] font-medium">{status}</div>
    </div>
  );
};

export default CompanyHealthGauge;
