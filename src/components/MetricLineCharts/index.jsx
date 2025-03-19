import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './index.css';

const MetricLineChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p>{`Value: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Company Well-being Index</h3>
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
              dataKey="date"
              axisLine={{ stroke: '#4B5563' }}
              tick={(props) => {
                const { x, y, payload } = props;
                return (
                  <g transform={`translate(${x + 15},${y})`}> 
                    <text x={0} y={0} dy={16} textAnchor="middle" fill="#9CA3AF">
                      {payload.value}
                    </text>
                  </g>
                );
              }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={(props) => {
                const { x, y, payload } = props;
                // Skip rendering the first tick (0%)
                if (payload.value === 0) {
                  return null;
                }
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text x={0} y={0} dx={-10} textAnchor="end" fill="#9CA3AF">
                      {`${payload.value}%`}
                    </text>
                  </g>
                );
              }}
              tickLine={false}
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