import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const COLORS = [
  "#1E90FF",
  "#40E0D0",
  "#FF4500",
  "#32CD32",
  "#FF69B4",
  "#DAA520",
  "#6A5ACD",
  "#FF7F50",
  "#2E8B57",
  "#DC143C",
  "#00BFFF",
  "#9932CC",
];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomPieChart = ({ chartData }) => {
  if (chartData.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-2xl font-semibold">No data available</p>
      </div>
    );
  }

  if (chartData.data.length < 13) {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData.data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={140}
            fill="#8884d8"
            dataKey={chartData.field}
          >
            {chartData.data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend
            className="hidden lg:block"
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            payload={chartData.data.map((item, index) => ({
              id: item.label,
              type: "square",
              value: `${item.label} (${item[chartData.field]})`,
              color: COLORS[index % COLORS.length],
            }))}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={chartData.data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={140}
          fill="#8884d8"
          dataKey={chartData.field}
        >
          {chartData.data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
