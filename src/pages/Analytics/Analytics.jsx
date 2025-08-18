import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { analyticsApi } from "../../API/analyticsApi";

import { useTheme } from "../../contexts/theme";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { chartsGridClasses } from "@mui/x-charts/ChartsGrid";

import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";

import "./Analytics.css";
import StatCard from "../../components/StatCard/StatCard";
import { useUserContext } from "../../contexts/user";
import {
  RiAddCircleFill,
  RiMailLine,
  RiUserLine,
  RiFileTextLine,
  RiBarChartLine,
  RiHeartLine,
} from "@remixicon/react";
import Loader from "../../components/Loader/Loader";
import { useAuthContext } from "../../contexts/auth";
import { truncate } from "../../utils/stringFunctions";

const getDailyViewsLast30Days = (dailyViewsData) => {
  const last30DaysCounts = Array(30).fill(0);

  // Create a map of dates to view counts
  const viewsMap = {};
  dailyViewsData.forEach((item) => {
    viewsMap[item._id] = item.totalViews;
  });

  // Fill the array with view counts for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateString = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD

    last30DaysCounts[i] = viewsMap[dateString] || 0;
  }

  return last30DaysCounts;
};

const getDailyLikesLast30Days = (dailyLikesData) => {
  const last30DaysCounts = Array(30).fill(0);

  // Create a map of dates to like counts
  const likesMap = {};
  dailyLikesData.forEach((item) => {
    likesMap[item._id] = item.totalLikes;
  });

  // Fill the array with like counts for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateString = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD

    last30DaysCounts[i] = likesMap[dateString] || 0;
  }

  return last30DaysCounts;
};

const getTopBlogsWithDailyViews = (detailedViewsData) => {
  // Process detailed views data with createdAt timestamps and blog IDs
  const today = new Date();
  const blogViews = {};

  detailedViewsData.forEach((view) => {
    const viewDate = new Date(view.createdAt); // Use createdAt instead of timestamp
    const daysAgo = Math.floor((today - viewDate) / (1000 * 60 * 60 * 24));

    if (daysAgo < 7 && daysAgo >= 0) {
      const blogId = view.blog._id; // Use blog field directly

      if (!blogViews[blogId]) {
        blogViews[blogId] = {
          title: view.blog.title,
          total: 0,
          dailyViews: Array(7).fill(0),
        };
      }

      // Increment total view count and the specific day's view count
      blogViews[blogId].total++;
      blogViews[blogId].dailyViews[6 - daysAgo]++;
    }
  });

  // Convert blogViews to an array and sort by total views, then get the top 2
  const sortedTopBlogs = Object.entries(blogViews)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 2)
    .map(([blogId, data]) => ({
      blogId,
      title: truncate(data.title, 25),
      totalViews: data.total,
      dailyViews: data.dailyViews,
    }));

  return sortedTopBlogs;
};

const colors = ["#ffd4c8", "#ffa991", "#ff724b", "#E43D11"];

const getQuarterViewShare = (quarterlyData) => {
  // The API now returns data in the correct format: [{label, value, color}, ...]
  // If it's already formatted, return as is. If it's an array of numbers, format it.
  if (Array.isArray(quarterlyData) && quarterlyData.length > 0) {
    // Check if first item has label property (already formatted)
    if (quarterlyData[0] && quarterlyData[0].label) {
      return quarterlyData;
    }
    // If it's an array of numbers, format it
    const quarterLabels = ["Q1", "Q2", "Q3", "Q4"];
    return quarterlyData.map((value, index) => ({
      label: quarterLabels[index],
      value: value,
      color: colors[index],
    }));
  }

  // Fallback to default data
  return [
    { label: "Q1", value: 0, color: colors[0] },
    { label: "Q2", value: 0, color: colors[1] },
    { label: "Q3", value: 0, color: colors[2] },
    { label: "Q4", value: 0, color: colors[3] },
  ];
};

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
  const { user } = useAuthContext();
  const { theme } = useTheme();
  const { userData } = useUserContext();

  const id = user?.id;

  const [monthlyViews, setMonthlyViews] = useState([]);
  const [monthlyLikes, setMonthlyLikes] = useState([]);
  const [topBlogs, setTopBlogs] = useState([]);
  const [quarterViewShare, setQuarterViewShare] = useState([]);

  // New state for enhanced analytics
  const [blogStats, setBlogStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
  });

  const [messageStats, setMessageStats] = useState({
    totalMessages: 0,
    unreadMessages: 0,
    messagesThisWeek: 0,
    messagesByDay: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!userData) return;
      setIsLoading(true);

      // 1. Fetch 30-day daily view counts for StatCard
      const dailyViews30Response = await analyticsApi.getDailyViews30Days();
      if (dailyViews30Response.success) {
        const monthlyViewsArray = getDailyViewsLast30Days(
          dailyViews30Response.data || []
        );
        setMonthlyViews(monthlyViewsArray);
      }

      // 1.1. Fetch 30-day daily like counts for StatCard
      const dailyLikes30Response = await analyticsApi.getDailyLikes();
      if (dailyLikes30Response.success) {
        const monthlyLikesArray = getDailyLikesLast30Days(
          dailyLikes30Response.data || []
        );
        setMonthlyLikes(monthlyLikesArray);
      }

      // 2. Fetch detailed views with timestamps for blog-specific analysis
      const detailedViews7Response = await analyticsApi.getDetailedViews7Days();
      if (detailedViews7Response.success) {
        setTopBlogs(
          getTopBlogsWithDailyViews(detailedViews7Response.data || [])
        );
      }

      // 3. Fetch quarterly view distribution
      const quarterlyResponse = await analyticsApi.getQuarterlyViews();
      if (quarterlyResponse.success) {
        setQuarterViewShare(getQuarterViewShare(quarterlyResponse.data));
      }

      // Use userData context for basic stats instead of API call
      setBlogStats({
        totalBlogs: userData.blogCount || 0,
        publishedBlogs: userData.blogCount || 0, // Assuming published = total for now
        draftBlogs: 0, // Will need to be fetched separately if needed
        totalViews: userData.viewCount || 0,
        totalLikes: userData.likeCount || 0,
        totalComments: 0, // Will need to be fetched if available
      });

      // Fetch message statistics
      const messageStatsResponse = await analyticsApi.getMessageStats();
      if (messageStatsResponse.success) {
        setMessageStats(messageStatsResponse.data);
      }

      setIsLoading(false);
    };

    fetchAnalytics();
  }, [id, userData]);

  const getViewGrowthRate = () => {
    // Calculate growth based on today's views vs yesterday's views
    if (monthlyViews.length < 2) return 0;
    const todayViews = monthlyViews[monthlyViews.length - 1] || 0;
    const yesterdayViews = monthlyViews[monthlyViews.length - 2] || 0;

    // If yesterday had no views, return 100% if today has views, otherwise 0%
    if (yesterdayViews === 0) {
      return todayViews > 0 ? 100 : 0;
    }

    // Calculate percentage change and round to nearest integer
    const percentageChange =
      ((todayViews - yesterdayViews) / yesterdayViews) * 100;
    return Math.round(percentageChange);
  };

  const getEngagementRate = () => {
    const { totalViews, totalLikes, totalComments } = blogStats;
    if (totalViews === 0) return 0;
    return (((totalLikes + totalComments) / totalViews) * 100).toFixed(1);
  };

  const getMessageGrowth = () => {
    // Calculate growth based on this week vs average
    const weeklyAverage = messageStats.totalMessages / 4; // Rough estimate
    if (weeklyAverage === 0) return 0;
    return (
      ((messageStats.messagesThisWeek - weeklyAverage) / weeklyAverage) *
      100
    ).toFixed(1);
  };

  if (!userData || isLoading) return <Loader />;
  return (
    <div id="analytics" className={`analytics-${theme}`}>
      {/* Welcome Card */}
      <div className="new-blog-card">
        <p>Hi, {userData?.fullName} </p>
        <p>Grow your portfolio by uploading new blogs.</p>
        <div className="new-blog-card-btns">
          <Link className="new-blog-btn" to="/editor">
            <RiAddCircleFill />
            New Blog
          </Link>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="kpi-section">
        <div className="kpi-grid">
          <div className="kpi-card">
            <h4>Total Views</h4>
            <p className="kpi-value">
              {(
                userData?.viewCount ||
                userData?.views ||
                userData?.totalViews ||
                0
              ).toLocaleString()}
            </p>
            <span
              className={`kpi-change ${
                getViewGrowthRate() >= 0 ? "positive" : "negative"
              }`}
            >
              {getViewGrowthRate() >= 0 ? "+" : ""}
              {getViewGrowthRate()}% today
            </span>
          </div>

          <div className="kpi-card">
            <h4>Live Blogs</h4>
            <p className="kpi-value">
              {userData?.blogCount ||
                userData?.blogs ||
                userData?.totalBlogs ||
                0}
            </p>
            <span className="kpi-subtitle">Finish that draft!</span>
          </div>

          <div className="kpi-card">
            <h4>Messages</h4>
            <p className="kpi-value">{messageStats.unreadMessages}</p>
            <span className="kpi-change positive">
              +{messageStats.messagesThisWeek} messages this week
            </span>
          </div>

          <div className="kpi-card">
            <h4>Followers</h4>
            <p className="kpi-value">
              {userData?.followerCount ||
                userData?.followers ||
                userData?.followersCount ||
                0}
            </p>
            <span className="kpi-subtitle">People following you</span>
          </div>
        </div>
      </div>

      {/* Main Analytics Dashboard */}
      <div className="dashboard-layout">
        {/* Left Column - Charts */}
        <div className="charts-column">
          <div className="chart-container line-chart">
            <div className="chart-header">
              <h4>Blog Performance Trends</h4>
              <p className="chart-desc">
                Top performing blogs over the last 7 days
              </p>
            </div>
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
                  data: topBlogs[0]?.dailyViews || [],
                  curve: "natural",
                  label: topBlogs[0]?.title || "Blog 1",
                  color: "#E43D11",
                  area: true,
                },
                {
                  id: "second",
                  data: topBlogs[1]?.dailyViews || [],
                  curve: "natural",
                  label: topBlogs[1]?.title || "Blog 2",
                  color: "#188fffff",
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
              <AreaGradient color="#6ab7ffff" id="second" />
            </LineChart>
          </div>

          {/* Message Activity Chart */}
          <div className="chart-container message-activity">
            <div className="chart-header">
              <h4>Message Activity</h4>
              <p className="chart-desc">
                Daily message volume over the last 7 days
              </p>
            </div>
            <BarChart
              height={250}
              series={[
                {
                  data: messageStats.messagesByDay,
                  label: "Messages",
                  color: "#b6563cff",
                },
              ]}
              xAxis={[
                {
                  scaleType: "band",
                  data: xLabels,
                  categoryGapRatio: 0.3,
                  barGapRatio: 0.1,
                  tickLabelStyle: {
                    fontSize: 12,
                    fill: "#727272",
                  },
                },
              ]}
              grid={{ horizontal: true }}
              leftAxis={null}
              slotProps={{
                legend: { hidden: true },
              }}
              sx={() => ({
                [`.${axisClasses.root}`]: {
                  [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                    stroke: "#727272",
                    strokeWidth: 1,
                  },
                },
                [`& .${chartsGridClasses.line}`]: {
                  strokeDasharray: "5 3",
                  strokeWidth: 1,
                  stroke: "#72727244",
                },
              })}
            />
          </div>
          <div className="quick-actions-section">
            <div className="quick-actions">
              <Link to="/playground/all-blogs" className="action-card">
                <RiFileTextLine size={24} />
                <h4>Manage Blogs</h4>
                <p>View and edit your blogs</p>
              </Link>
              <Link to="/playground/messages" className="action-card">
                <RiMailLine size={24} />
                <h4>Check Messages</h4>
                <p>{messageStats.unreadMessages} unread messages</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column - Performance Cards and Pie Chart */}
        <div className="performance-column">
          <div className="performance-metrics">
            <h4 className="metrics-title">Performance Overview</h4>
            <div className="mini-stat-cards">
              <StatCard
                color={"green"}
                data={monthlyViews}
                header={"Blog Views"}
                desc={"Daily views in the last 30 days"}
                value={monthlyViews.reduce((a, b) => a + b, 0)}
                icon={<RiBarChartLine />}
              />
              <StatCard
                color={"red"}
                data={monthlyLikes}
                header={"Total Likes"}
                desc={"Daily likes in the last 30 days"}
                value={monthlyLikes.reduce((a, b) => a + b, 0)}
                icon={<RiHeartLine />}
              />
            </div>
          </div>
          <div className="chart-container pie-chart">
            <div className="chart-header">
              <h4>Content Distribution</h4>
              <p className="chart-desc">Quarterly view distribution</p>
            </div>
            <PieChart
              series={[
                {
                  paddingAngle: 3,
                  cornerRadius: 5,
                  innerRadius: 60,
                  outerRadius: 100,
                  data:
                    quarterViewShare.length > 0
                      ? quarterViewShare
                      : [
                          { label: "Q1", value: 25, color: "#ffd4c8" },
                          { label: "Q2", value: 30, color: "#ffa991" },
                          { label: "Q3", value: 25, color: "#ff724b" },
                          { label: "Q4", value: 20, color: "#E43D11" },
                        ],
                  highlightScope: { faded: "global", highlighted: "item" },
                },
              ]}
              height={300}
              slotProps={{
                legend: {
                  itemGap: 10,
                  itemMarkHeight: 8,
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
    </div>
  );
}
