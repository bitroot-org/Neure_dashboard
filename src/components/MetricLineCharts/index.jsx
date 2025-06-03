import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Spin } from 'antd';
import './index.css';

const MetricLineChart = ({ data, loading, period = "monthly", onPeriodChange }) => {
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

  const formatXAxisTick = (dateStr) => {
    const [year, month] = dateStr.split('-');
    const monthNames = {
      '01': 'JAN', '02': 'FEB', '03': 'MAR', '04': 'APR',
      '05': 'MAY', '06': 'JUN', '07': 'JUL', '08': 'AUG',
      '09': 'SEP', '10': 'OCT', '11': 'NOV', '12': 'DEC'
    };
    return `${monthNames[month]} ${year.slice(2)}`;
  };

  const handlePeriodChange = (e) => {
    if (onPeriodChange) {
      onPeriodChange(e.target.value);
    }
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Company Well-being Index</h3>
        <select 
          className="period-selector" 
          value={period}
          onChange={handlePeriodChange}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div className="chart-wrapper">
        {loading ? (
          <div className="chart-loading">
            <Spin size="large" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <XAxis
                dataKey="date"
                axisLine={{ stroke: '#4B5563' }}
                tick={(props) => {
                  const { x, y, payload } = props;
                  return (
                    <g transform={`translate(${x},${y})`}> 
                      <text 
                        x={0} 
                        y={0} 
                        dy={12} 
                        textAnchor="middle" 
                        fill="#9CA3AF"
                        fontSize="11px"
                      >
                        {formatXAxisTick(payload.value)}
                      </text>
                    </g>
                  );
                }}
                interval={0}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={(props) => {
                  const { x, y, payload } = props;
                  if (payload.value === 0) {
                    return null;
                  }
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text 
                        x={0} 
                        y={0} 
                        dx={-10} 
                        textAnchor="end" 
                        fill="#9CA3AF"
                        fontSize="11px"
                      >
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
        )}
      </div>
    </div>
  );
};

export default MetricLineChart;
