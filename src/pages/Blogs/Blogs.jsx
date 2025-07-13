import React, { useState, useEffect } from "react";

import "./Blogs.css";
import { apiService } from "../../services/apiService";

import Footer from "../../components/Footer/Footer";
import Loader from "../../components/Loader/Loader";
import Carousel from "../../components/Carousel/Carousel";
import BlogCard2 from "../../components/BlogCard2/BlogCard2";
import AuthorCard from "../../components/AuthorCard/AuthorCard";

import arrow from "../../assets/editor_icons/back.png";
import { useTheme } from "../../contexts/theme";

function Blogs() {
  const [loading, setLoading] = useState(true);
  const [published, setPublished] = useState([]);
  const [authors, setAuthors] = useState([]);

  const { theme } = useTheme();

  const fetchPublished = async () => {
    try {
      const data = await apiService.get("/blogs/get-published");
      setPublished(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      const data = await apiService.get("/users/author/get-authors");
      setAuthors(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublished();
    fetchAuthors();
  }, []);

  const filteredIPublished = published.filter((blog) => blog.featured === true);

  const scrollContainerRef = React.createRef();

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  if (loading) return <Loader />;

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
          <button className="scroll-button scroll-left" onClick={scrollLeft}>
            <img src={arrow} alt="" />
          </button>
          <button className="scroll-button scroll-right" onClick={scrollRight}>
            <img src={arrow} alt="" />
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
