import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiService } from "../../services/apiService";

import Loader from "../../components/Loader/Loader";
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

function BlogRead() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const { theme } = useTheme();

  const [blog, setBlog] = useState([]);
  const [author, setAuthor] = useState([]);

  const [followed, setFollowed] = useState(false);
  const [liked, setLiked] = useState(false);

  const [loading, setLoading] = useState(true);
  const [imgLoading, setImgLoading] = useState(true);

  const formData = new FormData();

  const followAuthor = async () => {
    if (user) {
      try {
        const data = await apiService.post(
          `/users/follow/${blog?.author}`,
          null,
          apiService.getAuthHeaders(user.token)
        );
        setFollowed(!followed);
        toast.success(data.message);
      } catch (error) {
        toast.error(error);
      }
    } else {
      toast.error("Please login to follow the author");
    }
  };

  const likeBlog = async () => {
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
  };

  const commentOnBlog = async () => {
    if (user) {
      try {
        const data = await apiService.post(
          `/blogs/comment/${id}`,
          formData,
          apiService.getAuthHeaders(user.token)
        );
        toast.success(data.message);
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      toast.error("Please login to comment on the blog");
    }
  };

  const fetchBlogDetails = async () => {
    try {
      const data = await apiService.get(`/blogs/blog-details?blog=${id}`);
      setBlog(data);
      setLiked(data?.liked_by?.includes(user?.id));
      fetchAuthor(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAuthor = async (blogData) => {
    try {
      const data = await apiService.get(`/users/author/${blogData?.author}`);
      setAuthor(data);
      setFollowed(data.followers?.includes(user.id));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBlogDetails();
  }, []);

  const handleImageLoaded = () => {
    setImgLoading(false);
  };

  if (loading) return <Loader />;

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
          <div className="blog-user-actions">
            <div style={{ display: "flex", gap: "2rem" }}>
              <button onClick={likeBlog} className="like-btn">
                <img src={liked ? heartfill : heart} alt="" />
                {liked ? "Unlike" : "Like"}
              </button>
              <button onClick={commentOnBlog} className="comment-btn">
                <img src={comment} alt="" /> Comment
              </button>
            </div>
            <button className="share-btn">
              <img src={share} alt="" /> Share
            </button>
          </div>
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: blog?.content }}
          ></div>
        </div>
        <div className="right-pane">
          <p id="about-the-author">Written by</p>
          <br />
          <div className="dp">
            <img src={author?.user?.profile_image_url} alt="" />
          </div>
          <div className="author-info">
            <p className="author-username">@{author?.user?.username}</p>
            <h3 className="author-name">
              {capitalizeFirstLetter(author?.user?.full_name)}
            </h3>

            <div className="author-metrics">
              <span className="author-metric">
                <img src={blogIcon} alt="" />
                {author?.blogs?.length}
              </span>
              <span className="author-metric">
                <img src={followers} alt="" />
                {author?.followers?.length}
              </span>
              <span className="author-metric">
                <img src={heart} alt="" />
                {author?.likes}
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
            <button className="follow-btn" onClick={followAuthor}>
              {followed ? "Unfollow" : "Follow"}
            </button>
          </div>
          <div className="about-para">{truncate(author?.user?.bio, 300)}</div>
        </div>
      </div>
    </div>
  );
}

export default BlogRead;
