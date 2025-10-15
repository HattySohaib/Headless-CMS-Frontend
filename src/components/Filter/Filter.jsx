import React, { useState, useEffect } from "react";
import "./Filter.css";
import { useTheme } from "../../contexts/theme";
import { RiFilterLine, RiCloseLine } from "@remixicon/react";

const Filter = ({
  onFiltersChange,
  availableCategories = [],
  isMessagesFilter = false,
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    sortBy: isMessagesFilter ? "createdAt" : "updatedAt",
    sortOrder: "desc",
    dateRange: "",
    readStatus: "", // For messages
  });

  // Convert frontend filters to API parameters
  const buildApiParams = (
    frontendFilters,
    searchTerm = "",
    page = 1,
    author = null
  ) => {
    const params = {
      page: page,
      limit: 10,
    };

    // Add author if provided (only for blogs, not messages)
    if (author && !isMessagesFilter) {
      params.author = author;
    }

    // Add search term if provided
    if (searchTerm.trim()) {
      // Use 'search' parameter as expected by APIFeatures.search() method
      params.search = searchTerm.trim();
    }

    if (isMessagesFilter) {
      // Message-specific filters
      if (frontendFilters.readStatus) {
        if (frontendFilters.readStatus === "read") {
          params.read = "true";
        } else if (frontendFilters.readStatus === "unread") {
          params.read = "false";
        }
      }
    } else {
      // Blog-specific filters
      if (frontendFilters.category) {
        params.category = frontendFilters.category;
      }

      if (frontendFilters.status) {
        // Map status to published field in schema
        if (frontendFilters.status === "published") {
          params.published = "true";
        } else if (frontendFilters.status === "draft") {
          params.published = "false";
        }
      }
    }

    if (frontendFilters.dateRange) {
      const now = new Date();
      let startDate;

      switch (frontendFilters.dateRange) {
        case "today":
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          params["createdAt[gte]"] = startDate.toISOString();
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          params["createdAt[gte]"] = startDate.toISOString();
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          params["createdAt[gte]"] = startDate.toISOString();
          break;
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1);
          params["createdAt[gte]"] = startDate.toISOString();
          break;
      }
    }

    // Add sorting parameters - APIFeatures expects 'sort' parameter
    if (frontendFilters.sortBy && frontendFilters.sortOrder) {
      const sortDirection = frontendFilters.sortOrder === "desc" ? "-" : "";
      let sortField = frontendFilters.sortBy;

      // Map frontend sort fields to schema fields
      if (frontendFilters.sortBy === "views") {
        sortField = "viewsCount";
      }

      params.sort = `${sortDirection}${sortField}`;
    } else {
      // Default sorting
      params.sort = "-updatedAt";
    }

    return params;
  };

  // Call onFiltersChange with both frontend filters and API params builder
  useEffect(() => {
    onFiltersChange({
      frontendFilters: filters,
      buildApiParams: buildApiParams,
    });
  }, [filters]);

  const statusOptions = isMessagesFilter
    ? [
        { value: "", label: "All Messages" },
        { value: "unread", label: "Unread" },
        { value: "read", label: "Read" },
      ]
    : [
        { value: "", label: "All Status" },
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
        { value: "archived", label: "Archived" },
      ];

  const sortOptions = isMessagesFilter
    ? [
        { value: "createdAt", label: "Date Received" },
        { value: "senderEmail", label: "Sender" },
        { value: "subject", label: "Subject" },
      ]
    : [
        { value: "updatedAt", label: "Last Updated" },
        { value: "createdAt", label: "Date Created" },
        { value: "title", label: "Title" },
        { value: "views", label: "Views" },
      ];

  const dateRangeOptions = [
    { value: "", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      category: "",
      status: "",
      sortBy: isMessagesFilter ? "createdAt" : "updatedAt",
      sortOrder: "desc",
      dateRange: "",
      readStatus: "", // For messages
    };
    setFilters(defaultFilters);
  };

  const hasActiveFilters =
    filters.category ||
    filters.status ||
    filters.dateRange ||
    filters.sortBy !== "updatedAt" ||
    filters.sortOrder !== "desc";

  return (
    <div className={`filter-component filter-${theme}`}>
      <button
        className={`filter-toggle ${isOpen ? "active" : ""} ${
          hasActiveFilters ? "has-filters" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <RiFilterLine size={16} />
        <span>Filters</span>
        {hasActiveFilters && <span className="filter-indicator"></span>}
      </button>

      {isOpen && (
        <div className="filter-dropdown">
          <div className="filter-header">
            <h4>Filter Options</h4>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <RiCloseLine size={16} />
            </button>
          </div>

          <div className="filter-content">
            {!isMessagesFilter && (
              <div className="filter-group">
                <label className="filter-label">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="filter-select"
                >
                  <option value="">All Categories</option>
                  {availableCategories.map((cat) => {
                    // Handle both object {_id, name} and string formats
                    const categoryId = cat._id || cat;
                    const categoryName = cat.name || cat;
                    return (
                      <option key={categoryId} value={categoryName}>
                        {categoryName}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            <div className="filter-group">
              <label className="filter-label">
                {isMessagesFilter ? "Read Status" : "Status"}
              </label>
              <select
                value={isMessagesFilter ? filters.readStatus : filters.status}
                onChange={(e) =>
                  handleFilterChange(
                    isMessagesFilter ? "readStatus" : "status",
                    e.target.value
                  )
                }
                className="filter-select"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) =>
                  handleFilterChange("dateRange", e.target.value)
                }
                className="filter-select"
              >
                {dateRangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label className="filter-label">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="filter-select"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Order</label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) =>
                    handleFilterChange("sortOrder", e.target.value)
                  }
                  className="filter-select"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>

            <div className="filter-actions">
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
