import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import GhostLoader from "../../components/GhostLoader/GhostLoader";
import "./BlogRead.css";

import heart from "../../assets/homeIcons/heart.png";
import heartfill from "../../assets/homeIcons/heartfill.png";
import comment from "../../assets/homeIcons/comment.png";
import share from "../../assets/homeIcons/share.png";
import followers from "../../assets/homeIcons/follow.png";
import blogIcon from "../../assets/homeIcons/blog.png";

import { useAuthContext } from "../../contexts/auth";
import { useTheme } from "../../contexts/theme";

import { capitalizeFirstLetter, truncate } from "../../utils/stringFunctions";
import { userApi } from "../../API/userApi";
import { blogApi } from "../../API/blogApi";
import Loader from "../../components/Loader/Loader";

function BlogRead() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const { theme } = useTheme();

  const [blog, setBlog] = useState([]);
  const [author, setAuthor] = useState([]);

  const [followed, setFollowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imgLoading, setImgLoading] = useState(true);

  const formData = new FormData();

  const handleFollowUser = async () => {
    if (!user) {
      toast.error("Please login to follow the author");
      return;
    }
    await userApi.followUser(author.id);
    setFollowed(!followed);
  };

  // const likeBlog = async () => {
  // if (user) {
  //   await fetch(`/api/blogs/like/${id}`, {
  //     method: "POST",
  //     headers: { Authorization: user.token },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setLiked(!liked);
  //       toast.success(data);
  //     })
  //     .catch((error) => {
  //       toast.error(error);
  //     });
  // } else {
  //   toast.error("Please login to like the blog");
  // }
  // };

  // const commentOnBlog = async () => {
  //   if (user) {
  //     try {
  //       const data = await apiService.post(
  //         `/blogs/${id}/comment`,
  //         formData,
  //         apiService.getAuthHeaders(user.token)
  //       );
  //       toast.success(data.message);
  //     } catch (error) {
  //       toast.error(error.message);
  //     }
  //   } else {
  //     toast.error("Please login to comment on the blog");
  //   }
  // };

  const handleGetBlog = async () => {
    setLoading(true);
    const data = await blogApi.getBlog(id);
    setBlog(data);
    handleGetUserById(data.author._id);
  };

  const handleGetUserById = async (authorId) => {
    const data = await userApi.getUser(authorId);
    setAuthor(data);
    setLoading(false);
  };

  useEffect(() => {
    if (id) handleGetBlog();
  }, []);

  const handleImageLoaded = () => {
    setImgLoading(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div id="blog-read" className={`blog-read-${theme}`}>
      <div className="banner-container">
        {imgLoading && (
          <GhostLoader width={"100%"} height={"50vh"} radius={"0"} />
        )}
        <img
          style={{ display: imgLoading ? "none" : "block" }}
          onLoad={handleImageLoaded}
          src={blog?.banner}
          alt=""
        />
      </div>
      <div className="blogread-info">
        <p className="blogread-title">{blog?.title}</p>
        <p className="blogread-meta">{blog?.meta}</p>
        <p className="blogread-category">
          {blog?.category}
          <span style={{ marginLeft: "1rem" }}>{blog?.date}</span>
        </p>
      </div>
      <div className="data-container">
        <div className="left-pane">
          {/* <div className="blog-user-actions">
            <div style={{ display: "flex", gap: "2rem" }}>
              <button className="like-btn">
                <img src={liked ? heartfill : heart} alt="" />
                {liked ? "Unlike" : "Like"}
              </button>
              <button className="comment-btn">
                <img src={comment} alt="" /> Comment
              </button>
            </div>
            <button className="share-btn">
              <img src={share} alt="" /> Share
            </button>
          </div> */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: blog?.content }}
          ></div>
        </div>
        <div className="right-pane">
          <p id="about-the-author">Written by</p>
          <br />
          <div className="dp">
            <img src={author?.profileImageUrl} alt="" />
          </div>
          <div className="author-info">
            <p className="author-username">@{author?.username}</p>
            <h3 className="author-name">
              {capitalizeFirstLetter(author?.fullName)}
            </h3>

            <div className="author-metrics">
              <span className="author-metric">
                <img src={blogIcon} alt="" />
                {author?.blogCount}
              </span>
              <span className="author-metric">
                <img src={followers} alt="" />
                {author?.followCount}
              </span>
              <span className="author-metric">
                <img src={heart} alt="" />
                {author?.likeCount}
              </span>
            </div>
          </div>
          <div style={{ margin: "1rem", display: "flex", gap: "1rem" }}>
            <Link
              style={{ textDecoration: "none" }}
              to={`/author/${author?.authorId}`}
              className="follow-btn"
            >
              View Profile
            </Link>
            <button className="follow-btn" onClick={handleFollowUser}>
              {followed ? "Unfollow" : "Follow"}
            </button>
          </div>
          <div className="about-para">{truncate(author?.bio, 300)}</div>
        </div>
      </div>
    </div>
  );
}

export default BlogRead;
