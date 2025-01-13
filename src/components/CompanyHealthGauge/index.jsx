import React, { useEffect, useRef, useState } from 'react';
import './index.css';

const CompanyHealthGauge = ({ 
  value = 160, 
  maxValue = 1000,
  title = "Company health",
  status = "Good",
  lastCheckDate = "21 Apr",
  width = "100%",
  height = "100%",
  onClick,
  style
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 250 });

  // Handle container resize
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
      
      // Update canvas size
      if (canvasRef.current) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw segments
    const segments = [
      { color: '#FF4B4B', start: -0.99, end: -0.450 },  // Red
      { color: '#FFB800', start: -0.440, end: -0.250 },      // Yellow
      { color: '#00B884', start: -0.240, end: -0.1 },       // Green
      { color: '#0066FF', start: -0.09, end: 0.00 }     // Blue
    ];

    segments.forEach(segment => {
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        radius,
        segment.start * Math.PI,
        segment.end * Math.PI
      );
      ctx.lineWidth = 20;
      ctx.strokeStyle = segment.color;
      ctx.stroke();
    });

    // Draw dots
    const totalDots = 30;
    const arcLength = 1.5 * Math.PI/1.52; // -0.75π to 0.75π = 1.5π
    const dotSpacing = arcLength / totalDots;

    for (let i = 0; i <= totalDots; i++) {
      const angle = -0.99 * Math.PI + (dotSpacing * i);
      const dotX = centerX + (radius + 15) * Math.cos(angle);
      const dotY = centerY + (radius + 15) * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(dotX, dotY, 2, 0, 2 * Math.PI);
      ctx.fillStyle = '#444';
      ctx.fill();
    }

    // Draw pointer with colored border
    // Map percentage to segment range
    const percentage = value / maxValue;
    const mappedPercentage = -0.99 + percentage * 0.99; // Maps 0-1 to -0.99-0
  
    
    // Fix segment detection
    const currentSegment = segments.find(segment => {
      return mappedPercentage >= segment.start && 
             mappedPercentage <= segment.end;
    });
    
    
    // Rest of pointer drawing code
    const pointerAngle = -Math.PI + (percentage * Math.PI);
    const pointerLength = radius;
    const pointerRadius = 10; // Base pointer radius to match bar width
    const borderWidth = 6;  // Border width
    
    // Draw outer colored border first
    ctx.beginPath();
    ctx.arc(
      centerX + pointerLength * Math.cos(pointerAngle),
      centerY + pointerLength * Math.sin(pointerAngle),
      pointerRadius + borderWidth, // Larger radius for border
      0,
      2 * Math.PI
    );
    ctx.fillStyle = currentSegment?.color || '#fff';
    ctx.fill();
    
    // Draw inner white pointer
    ctx.beginPath();
    ctx.arc(
      centerX + pointerLength * Math.cos(pointerAngle),
      centerY + pointerLength * Math.sin(pointerAngle),
      pointerRadius, // Base pointer radius
      0,
      2 * Math.PI
    );
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    
    // Draw center text
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    
    // Value
    ctx.font = 'bold 48px Arial';
    ctx.fillText(value.toString(), centerX, centerY -10);
    
    // Label
    ctx.font = '24px Arial';
    ctx.fillText(status, centerX, centerY + 45);
    
    // Date
    ctx.font = '16px Arial';
    ctx.fillStyle = '#888';
    ctx.fillText(`Last Check on ${lastCheckDate}`, centerX, centerY + 70);

  }, [value, maxValue, dimensions, status, lastCheckDate]);

  return (
    <div 
      ref={containerRef} 
      className="gauge-container"
      style={{ width, height, cursor: onClick ? 'pointer' : 'default'}}
      onClick={onClick}
    >
      <h2>{title}</h2>
      <canvas 
        ref={canvasRef}
        className="gauge-canvas"
      />
    </div>
  );
};

export default CompanyHealthGauge;