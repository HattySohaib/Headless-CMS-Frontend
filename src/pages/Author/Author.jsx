import React, { useState, useEffect } from "react";
import "./Author.css";
import { userApi } from "../../API/userApi";
import { blogApi } from "../../API/blogApi";

import {
  RiHeartLine,
  RiUserAddLine,
  RiTeamLine,
  RiFileTextLine,
  RiEyeLine,
} from "@remixicon/react";

import GhostLoader from "../../components/GhostLoader/GhostLoader";

import { useParams } from "react-router-dom";
import { useAuthContext } from "../../contexts/auth";
import { useTheme } from "../../contexts/theme";
import { toast } from "react-toastify";
import BlogCard2 from "../../components/BlogCard2/BlogCard2";

import { capitalizeFirstLetter } from "../../utils/stringFunctions";
import Loader from "../../components/Loader/Loader";

function Author() {
  const [author, setAuthor] = useState(null);
  const [published, setPublished] = useState([]);
  const [followed, setFollowed] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const { user } = useAuthContext();
  const { theme } = useTheme();

  const handleFollowUser = async () => {
    if (!user) {
      toast.error("Please login to follow the author");
      return;
    }
    const res = await userApi.followUser(author.id);
    if (res.success) {
      setFollowed(!followed);
    }
    // Error handling is done by apiService centrally
  };

  const handleGetUserById = async () => {
    setLoading(true);
    const response = await userApi.getUser(id);
    if (response.success) {
      setAuthor(response.data);
    }
    // Error handling is done by apiService centrally
    setLoading(false);
  };

  const handleGetBlogsByUser = async () => {
    const response = await blogApi.getBlogs({ author: id });
    if (response.success) {
      setPublished(response.data.blogs || []);
    }
    // Error handling is done by apiService centrally
  };

  const handleImageLoaded = () => {
    setImgLoading(false);
  };

  useEffect(() => {
    handleGetUserById();
    handleGetBlogsByUser();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div id="author-page" className={`author-page-${theme}`}>
      <div className="author-details">
        <div className="top-header">
          <div className="lined-header">
            <div className="line"></div>
            <p>Author Details</p>
          </div>

          {user && (
            <button className="follow-btn" onClick={handleFollowUser}>
              {!followed ? "Follow" : "Unfollow"}
            </button>
          )}
        </div>

        <div className="author-info2">
          <img
            onLoad={handleImageLoaded}
            className="author-dp"
            src={author?.profileImageUrl}
            alt=""
            style={{ display: imgLoading ? "none" : "block" }}
          />
          {imgLoading && (
            <GhostLoader width={"8rem"} height={"8rem"} radius={"50%"} />
          )}
          <div className="author-text">
            <h1>{capitalizeFirstLetter(author?.fullName)}</h1>
            <div className="author-personal">
              <div className="author-sub-text">
                <p>Username</p>
                <p>@{author?.username}</p>
              </div>
              <div className="author-sub-text">
                <p>Email</p>
                <p>{author?.email}</p>
              </div>
              <div className="author-sub-text">
                <p>Joined</p>
                <p>{author?.createdAt}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="author-stats">
          <div className="stat">
            <div className="stat-icon">
              <RiFileTextLine size={24} />
            </div>
            <div>
              <h2>{author?.blogCount}</h2>
              <p>Blogs</p>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon">
              <RiUserAddLine size={24} />
            </div>
            <div>
              <h2>{author?.followersCount}</h2>
              <p>Followers</p>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon">
              <RiTeamLine size={24} />
            </div>
            <div>
              <h2>{author?.followingCount}</h2>
              <p>Following</p>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon">
              <RiHeartLine size={24} />
            </div>
            <div>
              <h2>{author?.likesCount}</h2>
              <p>Total Likes</p>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon">
              <RiEyeLine size={24} />
            </div>
            <div>
              <h2>{author?.viewCount}</h2>
              <p>Total Views</p>
            </div>
          </div>
        </div>
      </div>
      <div className="author-blogs">
        {published.map((blog) => (
          <BlogCard2 blog={blog} key={blog._id} />
        ))}
      </div>
    </div>
  );
}

export default Author;
