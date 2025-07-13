import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import BlogCard from "../../components/BlogCard/BlogCard";
import { useRefresh } from "../../contexts/refresh";
import Dropdown from "../../components/Dropdown/Dropdown";
import SearchBar from "../../components/SearchBar/SearchBar";
import Loader from "../../components/Loader/Loader";
import { useAuthContext } from "../../contexts/auth";
import { apiService } from "../../services/apiService";

import { useTheme } from "../../contexts/theme";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [published, setPublished] = useState([]);
  const [categories, setCategories] = useState(["All"]);

  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { refresh } = useRefresh();
  const { user } = useAuthContext();
  const { theme } = useTheme();

  const fetchPublished = async () => {
    try {
      const data = await apiService.get(`/blogs/get-featured/${user?.id}`);
      setPublished(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiService.get(
        "/categories/",
        apiService.getAuthHeaders(user.token)
      );
      setCategories(data.map((obj) => obj.value));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchPublished();
    fetchCategories();
  }, [refresh]);

  const handleOnCategoryChange = (e) => {
    if (e === "All") setCategory("");
    else setCategory(e);
  };

  const handleOnSearchChange = (e) => {
    setSearchTerm(e);
  };

  const filteredIPublished = published.filter(
    (blog) =>
      blog.category.toLowerCase().includes(category.toLowerCase()) &&
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loader-div">
        <Loader />
      </div>
    );
  }

  return (
    <div id="dashboard" className={`dashboard-${theme}`}>
      <div className="editor-top-bar">
        <div className="lined-header">
          <div className="line"></div>
          <p className="top-bar-header">Featured Blogs</p>
        </div>
        <div className="dropdowns">
          <SearchBar
            placeholder={"Search using a keyword"}
            onSearch={handleOnSearchChange}
          />
          <Dropdown
            text={"Category :"}
            defaultText="All"
            options={categories}
            onSelect={handleOnCategoryChange}
          />
        </div>
      </div>
      {!filteredIPublished.length && (
        <p className="blank-text">No records found.</p>
      )}
      <div className="recents-container">
        {filteredIPublished.map((e, key) => (
          <BlogCard blog={e} key={key} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
