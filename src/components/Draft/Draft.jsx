import { useState } from "react";
import "./Draft.css";
import { Link } from "react-router-dom";
import { useRefresh } from "../../contexts/refresh.js";
import { truncate } from "../../utils/stringFunctions";
import { formatTableDate } from "../../utils/dateUtils";
import {
  RiEditLine,
  RiEyeLine,
  RiEyeOffLine,
  RiMoreLine,
  RiStarLine,
  RiStarFill,
  RiDeleteBinLine,
  RiHeartLine,
  RiBarChartLine,
} from "@remixicon/react";

import { blogApi } from "../../API/blogApi.js";

function Draft({ blog }) {
  const [menu, setMenu] = useState(false);
  const { setRefresh } = useRefresh();

  const openMenu = () => {
    setMenu(!menu);
  };

  const handleUpdateBlog = async (published) => {
    const response = await blogApi.updateBlog(blog._id, { published });
    if (response.success) {
      setRefresh((prev) => !prev);
    }
    // Error handling is done by apiService centrally
  };

  const handleDeleteBlog = async () => {
    const response = await blogApi.deleteBlog(blog._id);
    if (response.success) {
      setRefresh((prev) => !prev);
      openMenu();
    }
    // Error handling is done by apiService centrally
  };

  const handleFeaturedToggle = async () => {
    const response = await blogApi.updateBlog(blog._id, {
      featured: !blog.featured,
    });
    if (response.success) {
      setRefresh((prev) => !prev);
    }
    // Error handling is done by apiService centrally
  };

  return (
    <div className="draft">
      <p className="draft-title">{truncate(blog.title, 45)}</p>

      {/* Status for both desktop and mobile */}
      <span
        className={`draft-status status-${blog.published ? "green" : "red"}`}
      >
        <span className="circle"></span>
        {blog.published ? "Live" : "Draft"}
      </span>

      {/* Views Count */}
      <div className="draft-stat">
        <RiBarChartLine size={14} />
        <span>{blog.viewsCount || 0}</span>
      </div>

      {/* Likes Count */}
      <div className="draft-stat">
        <RiHeartLine size={14} />
        <span>{blog.likesCount || 0}</span>
      </div>

      {/* Last edited date for desktop */}
      <span className="draft-edited">{formatTableDate(blog.updatedAt)}</span>

      {/* Mobile-only wrapper div that will show status and date in a row */}
      <div className="draft-info-row">
        <span
          className={`draft-status-mobile status-${
            blog.published ? "green" : "red"
          }`}
        >
          <span className="circle"></span>
          {blog.published ? "Live" : "Draft"}
        </span>
        <div className="draft-stats-mobile">
          <div className="draft-stat-mobile">
            <RiBarChartLine size={12} />
            <span>{blog.viewsCount || 0}</span>
          </div>
          <div className="draft-stat-mobile">
            <RiHeartLine size={12} />
            <span>{blog.likesCount || 0}</span>
          </div>
        </div>
        <span className="draft-edited-mobile">
          {formatTableDate(blog.updatedAt)}
        </span>
      </div>

      <div className="draft-actions">
        <Link className="clickable-link" to={`/editor/${blog._id}`}>
          <button className="draft-action-btn" title="Edit Blog">
            <RiEditLine size={16} />
          </button>
        </Link>
        <button
          className="draft-action-btn"
          onClick={() => handleUpdateBlog(!blog.published)}
          title={blog.published ? "Move to Drafts" : "Publish Blog"}
        >
          {blog.published ? (
            <RiEyeOffLine size={16} />
          ) : (
            <RiEyeLine size={16} />
          )}
        </button>
        <button
          className={`draft-action-btn ${blog.featured ? "featured-btn" : ""}`}
          onClick={handleFeaturedToggle}
          title={blog.featured ? "Remove from Featured" : "Add to Featured"}
        >
          {blog.featured ? (
            <RiStarFill size={16} color="#e6c300ff" />
          ) : (
            <RiStarLine size={16} />
          )}
        </button>
        <button id="draft-kebab-btn" onClick={openMenu} title="More Options">
          <RiMoreLine size={18} />
        </button>
      </div>

      {menu && (
        <>
          <div className="background-layer" onClick={openMenu}></div>
          <div className="kebab-menu">
            <button id="kebab-menu-btn" onClick={handleDeleteBlog}>
              <RiDeleteBinLine size={16} />
              <span>Delete</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Draft;
