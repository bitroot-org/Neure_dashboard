import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './index.css';

const MetricLineChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p>{`Value: ${payload[0].value}`}</p>
          <p>{`Position: ${label}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Metric 2</h3>
        <select className="period-selector">
          <option>Monthly</option>
          <option>Weekly</option>
          <option>Daily</option>
        </select>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="position" 
              axisLine={{ stroke: '#4B5563' }}
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis 
              axisLine={{ stroke: '#4B5563' }}
              tick={{ fill: '#9CA3AF' }}
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone"
              dataKey="value"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ stroke: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ stroke: '#10B981', strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricLineChart;