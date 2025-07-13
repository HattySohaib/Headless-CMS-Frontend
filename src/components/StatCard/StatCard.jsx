import React from "react";
import "./StatCard.css";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { areaElementClasses } from "@mui/x-charts/LineChart";

function AreaGradient({ color, id }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0.05} />
      </linearGradient>
    </defs>
  );
}

function getDaysInMonth(month, year) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString("en-US", {
    month: "short",
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

const colorFills = {
  red: "#E43D11",
  green: "#00B87C",
};

function StatCard({ data, color, header, desc, value }) {
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // getMonth() is zero-based
  const currentYear = today.getFullYear();
  const daysInWeek = getDaysInMonth(currentMonth, currentYear);

  return (
    <div className="stat-card">
      <p className="stat-header">{header}</p>
      <p className="stat-desc">{desc}</p>
      <h1 className="stat-card-value">{value}</h1>
      <SparkLineChart
        height={40}
        colors={[color]}
        data={data} // Use the correct property 'width' for the drawing
        area
        showHighlight
        showTooltip
        xAxis={{
          scaleType: "band",
          data: daysInWeek, // Use the correct property 'data' for xAxis
        }}
        sx={{
          [`& .${areaElementClasses.root}`]: {
            fill: `url(#area-gradient-${color})`,
          },
        }}
      >
        <AreaGradient color={colorFills[color]} id={`area-gradient-${color}`} />
      </SparkLineChart>
    </div>
  );
}

export default StatCard;
