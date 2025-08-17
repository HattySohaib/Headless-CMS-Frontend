import React, { useState, useEffect } from "react";
import "./Blogs.css";

import Footer from "../../components/Footer/Footer";
import Carousel from "../../components/Carousel/Carousel";
import BlogCard2 from "../../components/BlogCard2/BlogCard2";
import AuthorCard from "../../components/AuthorCard/AuthorCard";
import { RiArrowRightSLine, RiArrowLeftSLine } from "@remixicon/react";

import { useTheme } from "../../contexts/theme";
import { blogApi } from "../../API/blogApi";
import { userApi } from "../../API/userApi";

function Blogs() {
  const [published, setPublished] = useState([]);
  const [authors, setAuthors] = useState([]);

  const { theme } = useTheme();

  const handleGetPublished = async () => {
    const data = await blogApi.getBlogs({ published: true });
    setPublished(data.blogs);
  };

  const handleGetUsers = async () => {
    const data = await userApi.getUsers();
    setAuthors(data.users);
  };

  useEffect(() => {
    handleGetPublished();
    handleGetUsers();
  }, []);

  const filteredIPublished = published.filter((blog) => blog.featured === true);

  const scrollContainerRef = React.createRef();

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div id="blogs" className={`blogs-${theme}`}>
      <div className="featured-authors">
        <Carousel slides={Array.from(filteredIPublished)} />
      </div>
      <div className="author-list">
        <h2>Popular Authors</h2>
        <div className="authors" ref={scrollContainerRef}>
          {authors.map((author) => (
            <AuthorCard author={author} key={author._id} />
          ))}
        </div>
        <div className="scroll-buttons">
          <button className="scroll-button" onClick={scrollLeft}>
            <RiArrowLeftSLine size={24} />
          </button>
          <button className="scroll-button" onClick={scrollRight}>
            <RiArrowRightSLine size={24} />
          </button>
        </div>
      </div>
      <div className="recommended-blogs">
        <h2>Top Trending Blogs</h2>
        <div className="recommended-blogs-list">
          {published.map((blog) => (
            <BlogCard2 blog={blog} key={blog._id} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Blogs;
