import React, { useState, useEffect } from "react";
import "./AuthorCard.css";
import { capitalizeFirstLetter } from "../../utils/stringFunctions";
import { Link } from "react-router-dom";
import { RiHeartLine, RiUserAddLine, RiFileTextLine } from "@remixicon/react";
import { useTheme } from "../../contexts/theme";

import GhostLoader from "../GhostLoader/GhostLoader";

function AuthorCard({ author }) {
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading state when author changes
  useEffect(() => {
    setIsLoading(true);
  }, [author._id]);

  const handleImageLoaded = () => {
    setIsLoading(false);
  };
  const { theme } = useTheme();
  return (
    <Link
      to={`/author/${author._id}`}
      key={author._id}
      className={`author author-${theme}`}
      style={{ flex: "0 0 auto", cursor: "pointer" }}
    >
      {isLoading && (
        <GhostLoader width={"4rem"} height={"4rem"} radius={"50%"} />
      )}

      <img
        onLoad={handleImageLoaded}
        style={{ display: isLoading ? "none" : "block" }}
        src={author?.profileImageUrl}
        alt=""
      />
      <div className="author-info">
        <h3>{capitalizeFirstLetter(author?.fullName)}</h3>
        <div className="author-metrics">
          <span className="author-metric">
            <RiFileTextLine size={16} />
            {author.blogCount}
          </span>
          <span className="author-metric">
            <RiUserAddLine size={16} />
            {author.followersCount}
          </span>
          <span className="author-metric">
            <RiHeartLine size={16} />
            {author.likesCount}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default AuthorCard;
