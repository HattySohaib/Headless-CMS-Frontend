import React, { useState, useEffect, useCallback } from "react";
import "./Dashboard.css";
import { toast } from "react-toastify";
import BlogCard from "../../components/BlogCard/BlogCard";
import Loader from "../../components/Loader/Loader";
import AsyncErrorBoundary from "../../components/ErrorBoundary/AsyncErrorBoundary";
import { useRefresh } from "../../contexts/refresh";
import SearchBar from "../../components/SearchBar/SearchBar";
import Filter from "../../components/Filter/Filter";
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

function Dashboard() {
  const [featured, setFeatured] = useState([]);
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

  const handleGetFeaturedByUser = useCallback(
    async (page = 1) => {
      if (!user?.id) return; // Guard clause

      setLoading(true);
      const apiParams = filterConfig?.buildApiParams(
        filterConfig.frontendFilters,
        searchTerm,
        page,
        user?.id
      );
      // Add featured flag to ensure we only get featured blogs
      if (apiParams) {
        apiParams.featured = true;
      }
      const response = await blogApi.getBlogs(
        apiParams || { featured: true, author: user?.id }
      );
      if (response.success) {
        setFeatured(response.data.blogs || []);
        setPagination(
          response.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalBlogs: 0,
            limit: 10,
            hasNextPage: false,
            hasPrevPage: false,
          }
        );
        // Sync the current page state with the pagination response
        if (response.data.pagination?.currentPage) {
          setCurrentPage(response.data.pagination.currentPage);
        }
      }
      // Error handling is done by apiService centrally
      setLoading(false);
    },
    [filterConfig, searchTerm, user?.id]
  );

  const handleGetCategories = useCallback(async () => {
    const response = await categoryApi.getCategories();
    if (response.success) {
      setCategories(response.data?.map((obj) => obj.value) || []);
    }
    // Error handling is done by apiService centrally
  }, []);

  useEffect(() => {
    // Always call handleGetFeaturedByUser, but only if we have a user
    if (user?.id) {
      handleGetFeaturedByUser(currentPage);
    }
  }, [refresh, currentPage, searchTerm, filterConfig, user?.id]);

  useEffect(() => {
    handleGetCategories();
  }, [handleGetCategories]);

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
    const { totalPages } = pagination;
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
    <div id="dashboard" className={`dashboard-${theme}`}>
      <div className="editor-top-bar">
        <div className="lined-header">
          <div className="line"></div>
          <p className="top-bar-header">Featured Blogs</p>
        </div>
        <div className="dropdowns">
          <SearchBar
            placeholder={"Search featured blogs by title or content..."}
            onSearch={handleOnSearchChange}
            debounceMs={300}
          />
          <Filter
            onFiltersChange={handleFiltersChange}
            availableCategories={categories}
          />
        </div>
      </div>

      {/* Results summary */}
      <div className="results-summary">
        <p className="summary-text">
          Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
          {Math.min(currentPage * pagination.limit, pagination.totalBlogs)} of{" "}
          {pagination.totalBlogs} featured blogs
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          {!featured.length && (
            <p className="blank-text">No featured blogs found.</p>
          )}
          <AsyncErrorBoundary
            name="Dashboard-BlogCards"
            title="Blog Loading Error"
            message="There was an error loading the blog cards. Please try again."
            compact={true}
          >
            <div className="recents-container">
              {featured.map((blog, key) => (
                <BlogCard blog={blog} key={blog._id || key} />
              ))}
            </div>
          </AsyncErrorBoundary>
        </>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            <p className="pagination-text">
              Page {currentPage} of {pagination.totalPages}
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
                    pageNum === currentPage ? "active" : ""
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

export default Dashboard;
