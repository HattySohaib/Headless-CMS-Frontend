import React, { useState, useEffect, useCallback } from "react";
import "./Blogs.css";
import { IradaBlogsCarousel, IradaBlogCard } from "irada-widgets";
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
} from "@remixicon/react";

function Blogs() {
  const [topAuthors, setTopAuthors] = useState([]);
  const [topBlogs, setTopBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  // Fetch top authors (NEEDS BACKEND: Add viewCount/totalViews sorting)
  const fetchTopAuthors = useCallback(async () => {
    const response = await userApi.getUsers({ limit: 8 });
    if (response.success) {
      setTopAuthors(response.data.users || []);
    }
  }, []);

  // Fetch top blogs (NEEDS BACKEND: Add dailyViews sorting)
  const fetchTopBlogs = useCallback(async () => {
    const response = await blogApi.getBlogs({ published: true, limit: 15 });
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
            <RiUserStarLine className="header-icon" size={32} />
            <h2>Most Viewed Authors</h2>
            <p>Discover the most popular content creators on our platform</p>
          </div>

          <div className="authors-grid">
            {topAuthors.map((author) => (
              <Link
                key={author._id}
                to={`/author/${author._id}`}
                className="author-card"
              >
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
                <div className="author-info">
                  <h3>{author.fullName}</h3>
                  <p className="author-username">@{author.username}</p>
                  <div className="author-stats">
                    <div className="stat-item">
                      <RiArticleLine size={16} />
                      <span>{author.blogCount || 0} posts</span>
                    </div>
                    <div className="stat-item">
                      <RiUserLine size={16} />
                      <span>{author.followersCount || 0} followers</span>
                    </div>
                  </div>
                  {/* NEEDS BACKEND: Add author.totalViews field */}
                  <div className="view-count">
                    <RiEyeLine size={16} />
                    <span>{author.totalViews || "N/A"} views</span>
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

      {/* Top 15 Blogs of the Day Section */}
      <section className="top-blogs-section">
        <div className="container">
          <div className="section-header">
            <RiLineChartFill className="header-icon" size={32} />
            <h2>Today's Top Stories</h2>
            <p>The most engaging content from the last 24 hours</p>
          </div>

          {/* <div className="blogs-grid">
            {topBlogs.map((blog, index) => (
              <div key={blog._id} className="blog-card-wrapper">
                {index < 3 && (
                  <div className={`rank-badge rank-${index + 1}`}>
                    #{index + 1}
                  </div>
                )}
                <IradaBlogCard blog={blog} theme={theme} />
              </div>
            ))}
          </div> */}
        </div>
      </section>
    </div>
  );
}

export default Blogs;
