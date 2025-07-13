import React, { useState } from "react";
import "./AuthorCard.css";
import { capitalizeFirstLetter } from "../../utils/stringFunctions";
import { Link } from "react-router-dom";
import heart from "../../assets/homeIcons/heart.png";
import followers from "../../assets/homeIcons/follow.png";
import blog from "../../assets/homeIcons/blog.png";
import { useTheme } from "../../contexts/theme";

import GhostLoader from "../GhostLoader/GhostLoader";

function AuthorCard({ author }) {
  const [isLoading, setIsLoading] = useState(true);
  const handleImageLoaded = () => {
    setIsLoading(false);
  };
  const { theme } = useTheme();
  return (
    <Link
      to={`/author/${author.authorId}`}
      key={author.authorId}
      className={`author author-${theme}`}
      style={{ flex: "0 0 auto", cursor: "pointer" }}
    >
      {isLoading && (
        <GhostLoader width={"4rem"} height={"4rem"} radius={"50%"} />
      )}

      <img
        onLoad={handleImageLoaded}
        style={{ display: isLoading ? "none" : "block" }}
        src={author?.user?.profile_image_url}
        alt=""
      />
      <div className="author-info">
        <h3>{capitalizeFirstLetter(author?.user?.full_name)}</h3>
        <div className="author-metrics">
          <span className="author-metric">
            <img src={blog} alt="" />
            {author.blogs.length}
          </span>
          <span className="author-metric">
            <img src={followers} alt="" />
            {author.followers.length}
          </span>
          <span className="author-metric">
            <img src={heart} alt="" />
            {author.likes}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default AuthorCard;
