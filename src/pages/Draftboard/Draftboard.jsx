import React, { useState, useEffect } from "react";
import "./Draftboard.css";
import Dropdown from "../../components/Dropdown/Dropdown";
import SearchBar from "../../components/SearchBar/SearchBar";
import Draft from "../../components/Draft/Draft";
import { apiService } from "../../services/apiService";

import Loader from "../../components/Loader/Loader";

import { useRefresh } from "../../contexts/refresh";
import { useAuthContext } from "../../contexts/auth";
import { toast } from "react-toastify";
import { useTheme } from "../../contexts/theme";

function Draftboard() {
  const [loading, setLoading] = useState(true);

  const [drafts, setDrafts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const { refresh } = useRefresh();
  const { setRefresh } = useRefresh();
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useAuthContext();
  const { theme } = useTheme();

  const fetchDrafts = async () => {
    try {
      const data = await apiService.get(
        `/blogs/get-blogs-by-user/${user?.id}`,
        apiService.getAuthHeaders(user.token)
      );
      setDrafts(data);
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
    try {
      fetchDrafts();
      fetchCategories();
    } catch (error) {
      toast.error(error);
    }
  }, [refresh, setRefresh]);

  const filteredDrafts = drafts.filter(
    (blog) =>
      blog.category.toLowerCase().includes(category.toLowerCase()) &&
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOnCategoryChange = (e) => {
    if (e === "All") setCategory("");
    else setCategory(e);
  };

  const handleOnSearchChange = (e) => {
    setSearchTerm(e);
  };

  if (loading) {
    return (
      <div className="loader-div">
        <Loader />
      </div>
    );
  }

  return (
    <div id="draftboard" className={`draftboard-${theme}`}>
      <div className="editor-top-bar">
        <div className="lined-header">
          <div className="line"></div>
          <p className="top-bar-header">Blogs</p>
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
      <div className="drafts-container">
        <div className="table-headers">
          <p className="table-header">Title</p>
          <p className="table-header">Status</p>
          <p className="table-header">Last Edited</p>
          <p className="table-header">Actions</p>
        </div>
        {!filteredDrafts.length && (
          <p className="blank-text">No records found.</p>
        )}
        {filteredDrafts.map((e, key) => (
          <Draft key={key} blog={e} />
        ))}
      </div>
    </div>
  );
}

export default Draftboard;
