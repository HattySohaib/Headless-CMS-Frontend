import React, { useState, useEffect } from "react";
import "./Draftboard.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import Filter from "../../components/Filter/Filter";
import Draft from "../../components/Draft/Draft";
import Loader from "../../components/Loader/Loader";

import { useRefresh } from "../../contexts/refresh";
import { useAuthContext } from "../../contexts/auth";
import { useTheme } from "../../contexts/theme";
import { blogApi } from "../../API/blogApi";
import { categoryApi } from "../../API/categoryApi";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowLeftDoubleLine,
  RiArrowRightDoubleLine,
} from "@remixicon/react";

function Draftboard() {
  const [drafts, setDrafts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBlogs: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterConfig, setFilterConfig] = useState(null);

  const { refresh } = useRefresh();
  const { user } = useAuthContext();
  const { theme } = useTheme();

  const handleGetBlogsByUser = async (page = 1) => {
    setLoading(true);
    try {
      const apiParams = filterConfig.buildApiParams(
        filterConfig.frontendFilters,
        searchTerm,
        page,
        user.id
      );
      const data = await blogApi.getBlogs(apiParams);
      setDrafts(data.blogs || []);
      setPagination(
        data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalBlogs: 0,
          limit: 10,
          hasNextPage: false,
          hasPrevPage: false,
        }
      );
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetCategories = async () => {
    const data = await categoryApi.getCategories();
    setCategories(data.map((obj) => obj.value) || []);
  };

  useEffect(() => {
    if (filterConfig) {
      handleGetBlogsByUser(currentPage);
    }
  }, [refresh, currentPage, searchTerm, filterConfig]);

  useEffect(() => {
    handleGetCategories();
  }, []);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, filterConfig]);

  const handleOnSearchChange = (searchValue) => {
    setSearchTerm(searchValue);
  };

  const handleFiltersChange = (newFilterConfig) => {
    setFilterConfig(newFilterConfig);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(pagination.totalPages);
  };

  const handlePrevPage = () => {
    if (pagination.hasPrevPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const { currentPage, totalPages } = pagination;
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start < maxVisiblePages - 1) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div id="draftboard" className={`draftboard-${theme}`}>
      <div className="editor-top-bar">
        <div className="lined-header">
          <div className="line"></div>
          <p className="top-bar-header">Blogs</p>
        </div>
        <div className="dropdowns">
          <SearchBar
            placeholder={"Search blogs by title or content..."}
            onSearch={handleOnSearchChange}
            debounceMs={300}
          />
          <Filter
            onFiltersChange={handleFiltersChange}
            availableCategories={categories}
          />
        </div>
      </div>
      <div className="drafts-container">
        <div className="table-headers">
          <p className="table-header">Title</p>
          <p className="table-header">Status</p>
          <p className="table-header">Views</p>
          <p className="table-header">Likes</p>
          <p className="table-header">Last Edited</p>
          <p className="table-header">Actions</p>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <>
            {!drafts.length && <p className="blank-text">No records found.</p>}
            {drafts.map((e, key) => (
              <Draft key={e._id || key} blog={e} />
            ))}
          </>
        )}
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            <p className="pagination-text">
              Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.limit,
                pagination.totalBlogs
              )}{" "}
              of {pagination.totalBlogs} blogs
            </p>
          </div>

          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={handleFirstPage}
              disabled={!pagination.hasPrevPage}
              title="First Page"
            >
              <RiArrowLeftDoubleLine size={16} />
            </button>

            <button
              className="pagination-btn"
              onClick={handlePrevPage}
              disabled={!pagination.hasPrevPage}
              title="Previous Page"
            >
              <RiArrowLeftSLine size={16} />
            </button>

            <div className="pagination-numbers">
              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  className={`pagination-number ${
                    pageNum === pagination.currentPage ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              className="pagination-btn"
              onClick={handleNextPage}
              disabled={!pagination.hasNextPage}
              title="Next Page"
            >
              <RiArrowRightSLine size={16} />
            </button>

            <button
              className="pagination-btn"
              onClick={handleLastPage}
              disabled={!pagination.hasNextPage}
              title="Last Page"
            >
              <RiArrowRightDoubleLine size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Draftboard;
