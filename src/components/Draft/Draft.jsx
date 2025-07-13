import React, { useState } from "react";
import "./Draft.css";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useRefresh } from "../../contexts/refresh.js";
import { useAuthContext } from "../../contexts/auth";
import { apiService } from "../../services/apiService";
import { truncate } from "../../utils/stringFunctions";

import kebabIcon from "../../assets/icons/kebab.png";

function Draft({ blog }) {
  const { user } = useAuthContext();
  const [menu, setMenu] = useState(false);
  const { setRefresh } = useRefresh();

  const openMenu = () => {
    setMenu(!menu);
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
    openMenu();
  };

  const handleDelete = () => {
    apiService
      .post(
        `/blogs/delete-from-drafts?blog=${blog._id}`,
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
    openMenu();
  };

  const handlePublish = () => {
    apiService
      .post(
        `/blogs/publish-blog?blog=${blog._id}`,
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
    <div className="draft">
      <p className="draft-title">{truncate(blog.title, 45)}</p>
      <span
        className={`draft-status status-${blog.published ? "green" : "red"}`}
      >
        <span className="circle"></span>
        {blog.published ? "Live" : "Draft"}
      </span>
      <span className="draft-edited">{blog.date}</span>
      <div className="draft-actions">
        <Link className="clickable-link" to={`/editor/${blog._id}`}>
          <button className="draft-action-btn">Edit</button>
        </Link>
        <button className="draft-action-btn" onClick={handlePublish}>
          Publish
        </button>
        <button id="draft-kebab-btn" onClick={openMenu}>
          <img src={kebabIcon} alt="" />
        </button>
      </div>

      {menu && (
        <>
          <div className="background-layer" onClick={openMenu}></div>
          <div className="kebab-menu">
            <button id="kebab-menu-btn" onClick={handleDraft}>
              Unpublish
            </button>
            <button id="kebab-menu-btn" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Draft;
