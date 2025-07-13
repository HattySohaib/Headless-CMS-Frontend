import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./BlogCard2.css";

import { capitalizeFirstLetter, truncate } from "../../utils/stringFunctions";
import GhostLoader from "../GhostLoader/GhostLoader";
import { useTheme } from "../../contexts/theme";

function BlogCard2({ blog }) {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const handleImageLoaded = () => {
    setIsLoading(false);
  };
  return (
    <Link
      to={`/read-this-blog/${blog._id}`}
      key={blog._id}
      className={`recommended-blog blog-${theme}`}
    >
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
      <div className="details">
        <span>
          <img src={blog?.author?.profile_image_url} alt="" />
          {capitalizeFirstLetter(blog?.author?.full_name)}
        </span>
        <span>{blog.date}</span>
      </div>
    </Link>
  );
}

export default BlogCard2;
