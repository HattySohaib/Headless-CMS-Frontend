import React, { useState } from "react";
import { toast } from "react-toastify";
import "./BlogCard.css";
import { Link } from "react-router-dom";
import { useRefresh } from "../../contexts/refresh.js";
import { useTheme } from "../../contexts/theme.js";
import GhostLoader from "../GhostLoader/GhostLoader";
import { useAuthContext } from "../../contexts/auth";
import { apiService } from "../../services/apiService";

import { truncate } from "../../utils/stringFunctions";

function BlogCard({ blog }) {
  const { user } = useAuthContext();
  const { setRefresh } = useRefresh();
  const { theme } = useTheme();

  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoaded = () => {
    setIsLoading(false);
  };

  const handleDraft = () => {
    apiService
      .post(
        `/blogs/move-to-drafts?blog=${blog._id}`,
        null,
        apiService.getAuthHeaders(user.token)
      )
      .then((res) => res.json())
      .then((result) => {
        setRefresh((prev) => !prev);
        toast.success(result);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleFeaturedToggle = () => {
    apiService
      .post(
        `/blogs/toggle-blog-feature?blog=${blog._id}`,
        null,
        apiService.getAuthHeaders(user.token)
      )
      .then((res) => res.json())
      .then((result) => {
        setRefresh((prev) => !prev);
        toast.success(result);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

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
        <button onClick={handleDraft} className="blog-control">
          Unpublish
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
