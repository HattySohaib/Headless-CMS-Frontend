import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { apiService } from "../../services/apiService";

import { useTheme } from "../../contexts/theme";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { chartsGridClasses } from "@mui/x-charts/ChartsGrid";

import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";

import "./Analytics.css";
import StatCard from "../../components/StatCard/StatCard";
import { useUserContext } from "../../contexts/user";
import { RiAddCircleFill } from "@remixicon/react";
import Loader from "../../components/Loader/Loader";
import { useAuthContext } from "../../contexts/auth";

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];

const getViewsLast7Days = (views) => {
  const today = new Date();
  const last7DaysCounts = Array(7).fill(0);

  views.forEach((view) => {
    const viewDate = new Date(view.timestamp);
    const daysAgo = Math.floor((today - viewDate) / (1000 * 60 * 60 * 24));

    if (daysAgo < 7 && daysAgo >= 0) {
      last7DaysCounts[6 - daysAgo]++; // Populate the array from the most recent day
    }
  });

  return last7DaysCounts;
};

const getTopBlogsWithDailyViews = (views) => {
  const today = new Date();
  const blogViews = {};

  views.forEach((view) => {
    const viewDate = new Date(view.timestamp);
    const daysAgo = Math.floor((today - viewDate) / (1000 * 60 * 60 * 24));

    if (daysAgo < 7 && daysAgo >= 0) {
      const blogId = view.blog;

      if (!blogViews[blogId]) {
        blogViews[blogId] = { total: 0, dailyViews: Array(7).fill(0) };
      }

      // Increment total view count and the specific day's view count
      blogViews[blogId].total++;
      blogViews[blogId].dailyViews[6 - daysAgo]++;
    }
  });

  // Convert blogViews to an array and sort by total views, then get the top 2
  const sortedTopBlogs = Object.entries(blogViews)
    .sort((a, b) => b[1].total - a[1].total)
    .map(([blogId, data]) => ({
      blogId,
      totalViews: data.total,
      dailyViews: data.dailyViews,
    }));

  return sortedTopBlogs;
};

const colors = ["#ffd4c8", "#ffa991", "#ff724b", "#E43D11"];

const getQuarterViewShare = (views) => {
  const quarters = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };

  views.forEach((view) => {
    const month = new Date(view.timestamp).getMonth() + 1; // JavaScript months are 0-based

    // Determine the quarter based on the month
    if (month >= 1 && month <= 3) quarters.Q1++;
    else if (month >= 4 && month <= 6) quarters.Q2++;
    else if (month >= 7 && month <= 9) quarters.Q3++;
    else if (month >= 10 && month <= 12) quarters.Q4++;
  });

  // Format data with labels, values, and colors
  return Object.entries(quarters).map(([label, value], index) => ({
    label: label,
    value: value,
    color: colors[index], // Share in percentage
  }));
};

const mData = Array.from({ length: 30 }, () =>
  Math.floor(Math.random() * 10000)
);

const xLabels = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - i));
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
});

function AreaGradient({ color, id }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0.1} />
      </linearGradient>
    </defs>
  );
}

const StyledText = styled("text")(() => ({
  fill: "#737373",
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 20,
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function Analytics() {
  const { user, loading } = useAuthContext();
  const { theme } = useTheme();
  const { userData } = useUserContext();

  const id = user?.id;

  const [weeklyViews, setWeeklyViews] = useState([]);
  const [topBlogs, setTopBlogs] = useState([]);
  const [quarterViewShare, setQuarterViewShare] = useState([]);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const data = await apiService.get(`/blogs/get-views/${id}`);
        setWeeklyViews(getViewsLast7Days(data));
        setTopBlogs(getTopBlogsWithDailyViews(data));
        setQuarterViewShare(getQuarterViewShare(data));
      } catch (error) {
        console.log(error);
      }
    };
    if (!loading) fetchViews();
  }, []);

  if (!userData) return <Loader />;
  return (
    <div id="analytics" className={`analytics-${theme}`}>
      <div className="new-blog-card">
        <p>Hi, {userData?.full_name} </p>
        <p>Grow your portfolio by uploading new blogs.</p>
        <div className="new-blog-card-btns">
          <Link className="new-blog-btn" to="/editor">
            <RiAddCircleFill />
            New Blog
          </Link>
        </div>
      </div>
      <div className="stat-cards">
        <StatCard
          color={"green"}
          data={weeklyViews}
          header={"Total Views"}
          desc={"Views in the last 7 days"}
          value={weeklyViews.reduce((a, b) => a + b, 0)}
        />
        <StatCard
          color={"red"}
          data={mData}
          header={"Followers"}
          desc={"Current followers count"}
          value={"2000"}
        />
      </div>
      <div className="plots">
        <div className="line-chart" style={{ width: "60%" }}>
          <p className="chart-header">Top Performing Blogs</p>
          <p className="chart-desc">Comparative Analysis of Last 7 Days</p>
          <LineChart
            height={300}
            grid={{ horizontal: true }}
            slotProps={{
              legend: {
                hidden: true,
              },
            }}
            series={[
              {
                id: "first",
                stack: "views",
                data: topBlogs[0]?.dailyViews || [],
                curve: "natural",
                label: topBlogs[0]?.blogId,
                color: "#E43D11",
                area: true,
              },
              {
                id: "second",
                stack: "views",
                data: topBlogs[1]?.dailyViews || [],
                curve: "natural",
                label: topBlogs[1]?.blogId,
                color: "#ffa991",
                area: true,
              },
            ]}
            xAxis={[
              {
                scaleType: "point",
                data: xLabels,
                tickLabelStyle: {
                  fontSize: 12,
                  fill: `${"#727272"}`,
                },
              },
            ]}
            leftAxis={null}
            sx={() => ({
              "& .MuiAreaElement-series-first": {
                fill: "url('#first')",
              },
              "& .MuiAreaElement-series-second": {
                fill: "url('#second')",
              },
              [`.${axisClasses.root}`]: {
                [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                  stroke: "#727272",
                  strokeWidth: 3,
                },
              },
              [`& .${chartsGridClasses.line}`]: {
                strokeDasharray: "5 3",
                strokeWidth: 1,
                stroke: "#72727244",
              },
            })}
          >
            <AreaGradient color="#E43D11" id="first" />
            <AreaGradient color="#ffa991" id="second" />
          </LineChart>
        </div>
        <div className="pie-chart" style={{ width: "40%" }}>
          <p className="chart-header">Quarterly View Share</p>
          <p className="chart-desc">Views Share in the Last 365 Days</p>
          <PieChart
            series={[
              {
                paddingAngle: 3,
                cornerRadius: 5,
                innerRadius: 85,
                outerRadius: 110,
                data: quarterViewShare,
                highlightScope: { faded: "global", highlighted: "item" },
              },
            ]}
            height={300}
            slotProps={{
              legend: {
                itemGap: 10,
                itemMarkHeight: 3,
                itemMarkWidth: 15,
                labelStyle: {
                  fontSize: 14,
                  fill: "#727272",
                },
              },
            }}
          >
            <PieCenterLabel>Total Views</PieCenterLabel>
          </PieChart>
        </div>
      </div>
    </div>
  );
}
