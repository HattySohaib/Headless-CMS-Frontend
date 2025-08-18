import React, { useState, useEffect } from "react";
import "./BlogCard.css";
import { Link } from "react-router-dom";
import { useRefresh } from "../../contexts/refresh.js";
import { useTheme } from "../../contexts/theme.js";
import GhostLoader from "../GhostLoader/GhostLoader";
import { blogApi } from "../../API/blogApi.js";

import { truncate } from "../../utils/stringFunctions";

function BlogCard({ blog }) {
  const { setRefresh } = useRefresh();
  const { theme } = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [blogData, setBlogData] = useState(blog);

  const handleImageLoaded = () => {
    setIsLoading(false);
  };

  const handlePublish = async () => {
    const response = await blogApi.updateBlog(blog._id, {
      published: !blog.published,
    });
    if (response.success) {
      setBlogData(response.data);
      setRefresh((prev) => !prev);
    }
    // Error handling is done by apiService centrally
  };

  const handleFeaturedToggle = async () => {
    const response = await blogApi.updateBlog(blog._id, {
      featured: !blog.featured,
    });
    if (response.success) {
      setBlogData(response.data);
      setRefresh((prev) => !prev);
    }
    // Error handling is done by apiService centrally
  };

  useEffect(() => {}, [blogData]);

  return (
    <div key={blog._id} className={`blog-card recommended-blog blog-${theme}`}>
      <Link className="clickable-link" to={`/read-this-blog/${blog._id}`}>
        {isLoading && <GhostLoader width={"100%"} height={"45%"} />}
        <img
          onLoad={handleImageLoaded}
          style={{ display: isLoading ? "none" : "block" }}
          src={blog.banner}
          alt=""
        />
        <div className="blog-text">
          <h3>{truncate(blog.title, 50)}</h3>
          <p>{truncate(blog.meta, 80)}</p>
        </div>
      </Link>
      <div className="blog-card-actions">
        <button onClick={handlePublish} className="blog-control">
          {blog.published ? "Unpublish" : "Publish"}
        </button>
        <button onClick={handleFeaturedToggle} className="blog-control">
          {blog.featured ? "Unfeature" : "Feature"}
        </button>
        <Link
          id="action-nav-link"
          className="blog-control"
          to={`/editor/${blog._id}`}
        >
          Edit
        </Link>
      </div>
    </div>
  );
}

export default BlogCard;
