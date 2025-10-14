import React, { useState, useEffect, useCallback } from "react";
import "./Blogs.css";
import { IradaBlogsCarousel } from "irada-widgets";
import { useTheme } from "../../contexts/theme";
import { blogApi } from "../../API/blogApi";
import { userApi } from "../../API/userApi";
import { Link } from "react-router-dom";
import {
  RiUserStarLine,
  RiLineChartFill,
  RiEyeLine,
  RiArticleLine,
  RiUserLine,
  RiFireLine,
  RiTimeLine,
  RiArrowRightLine,
} from "@remixicon/react";

function Blogs() {
  const [topAuthors, setTopAuthors] = useState([]);
  const [topBlogs, setTopBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  // Fetch top authors
  const fetchTopAuthors = useCallback(async () => {
    const response = await userApi.getTopAuthors();
    if (response.success) {
      setTopAuthors(response.data.authors || []);
    }
  }, []);

  // Fetch trending blogs
  const fetchTopBlogs = useCallback(async () => {
    const response = await blogApi.getTrendingBlogs();
    if (response.success) {
      setTopBlogs(response.data.blogs || []);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchTopAuthors(), fetchTopBlogs()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchTopAuthors, fetchTopBlogs]);

  if (isLoading) {
    return (
      <div className={`blogs-page blogs-${theme}`}>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`blogs-page blogs-${theme}`}>
      {/* Top Viewed Authors Section */}
      <section className="top-authors-section">
        <div className="container">
          <div className="section-header">
            <div className="header-badge">
              <RiUserStarLine size={20} />
              <span>This Week's Stars</span>
            </div>
            <h2>Most Viewed Authors</h2>
            <p>Discover the content creators making waves this week</p>
          </div>

          <div className="authors-grid">
            {topAuthors.map((author, index) => (
              <Link
                key={author._id}
                to={`/author/${author._id}`}
                className="author-card"
              >
                <div className="rank-indicator">{index + 1}</div>
                <div className="author-avatar-wrapper">
                  <div className="author-avatar">
                    <img
                      src={author.profileImageUrl}
                      alt={author.fullName}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/120?text=Author";
                      }}
                    />
                  </div>
                  <div className="weekly-badge">
                    <RiFireLine size={14} />
                    <span>{author.weeklyViews}</span>
                  </div>
                </div>
                <div className="author-info">
                  <h3>{author.fullName}</h3>
                  <p className="author-username">@{author.username}</p>
                  <p className="author-bio">
                    {author.bio?.substring(0, 80)}...
                  </p>
                  <div className="author-stats">
                    <div className="stat-item">
                      <RiArticleLine size={16} />
                      <span>{Math.abs(author.blogCount)} posts</span>
                    </div>
                    <div className="stat-item">
                      <RiEyeLine size={16} />
                      <span>{author.totalViews.toLocaleString()} views</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blogs Carousel Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Stories</h2>
            <p>Handpicked articles from our editorial team</p>
          </div>
          <div className="carousel-wrapper">
            <IradaBlogsCarousel
              apiKey="56c43b56a55751dcf7d389b0b913eabea62fa3ac43d28c800caf8d49bf19bd8e"
              theme={theme}
            />
          </div>
        </div>
      </section>

      {/* Trending Blogs of the Day Section */}
      <section className="trending-blogs-section">
        <div className="container">
          <div className="section-header">
            <div className="header-badge trending">
              <RiLineChartFill size={20} />
              <span>Trending Today</span>
            </div>
            <h2>Today's Hot Topics</h2>
            <p>The most engaging stories from the last 24 hours</p>
          </div>

          <div className="trending-blogs-grid">
            {topBlogs.map((blog, index) => (
              <Link
                key={blog._id}
                to={`/blog/${blog.slug}`}
                className={`trending-blog-card ${
                  index === 0 ? "featured" : ""
                }`}
              >
                <div className="blog-rank">#{index + 1}</div>
                <div className="blog-banner">
                  <img
                    src={blog.banner}
                    alt={blog.title}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/600x400?text=Blog";
                    }}
                  />
                  <div className="trending-overlay">
                    <div className="trending-badge">
                      <RiFireLine size={16} />
                      <span>{blog.todayViews} views today</span>
                    </div>
                  </div>
                </div>
                <div className="blog-content">
                  <div className="blog-meta">
                    <div className="author-info-mini">
                      <img
                        src={blog.author.profileImageUrl}
                        alt={blog.author.username}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/32?text=A";
                        }}
                      />
                      <span>@{blog.author.username}</span>
                    </div>
                    <div className="publish-date">
                      <RiTimeLine size={14} />
                      <span>
                        {new Date(blog.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <h3 className="blog-title">{blog.title}</h3>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="blog-tags">
                      {blog.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="blog-footer">
                    <div className="view-count-stat">
                      <RiEyeLine size={16} />
                      <span>{blog.totalViews} total views</span>
                    </div>
                    <div className="read-more">
                      <span>Read article</span>
                      <RiArrowRightLine size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Blogs;
