import React, { useState, useEffect } from "react";
import "./Messages.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import Filter from "../../components/Filter/Filter";
import MessageCard from "../../components/MessageCard/MessageCard";
import { useRefresh } from "../../contexts/refresh";
import { useAuthContext } from "../../contexts/auth";
import { useTheme } from "../../contexts/theme";
import { messageApi } from "../../API/messageApi";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowLeftDoubleLine,
  RiArrowRightDoubleLine,
  RiMailLine,
  RiMailOpenLine,
  RiDeleteBin6Line,
  RiCheckLine,
} from "@remixicon/react";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalMessages: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterConfig, setFilterConfig] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedMessages, setSelectedMessages] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const { refresh } = useRefresh();
  const { user } = useAuthContext();
  const { theme } = useTheme();

  const handleGetMessages = async (page = 1) => {
    const apiParams = filterConfig.buildApiParams(
      filterConfig.frontendFilters,
      searchTerm,
      page
    );
    const data = await messageApi.getMessages(apiParams);
    setMessages(data.messages || []);
    setPagination(
      data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalMessages: 0,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false,
      }
    );
  };

  const handleGetUnreadCount = async () => {
    const response = await messageApi.getUnreadCount();
    setUnreadCount(response.unreadCount || 0);
  };

  // Update data when search term, filter config, or page changes
  useEffect(() => {
    if (filterConfig) {
      handleGetMessages(currentPage);
      handleGetUnreadCount();
    }
  }, [refresh, currentPage, searchTerm, filterConfig]);

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

  const handleMessageSelect = (messageId) => {
    const newSelected = new Set(selectedMessages);
    if (newSelected.has(messageId)) {
      newSelected.delete(messageId);
    } else {
      newSelected.add(messageId);
    }
    setSelectedMessages(newSelected);
    setSelectAll(newSelected.size === messages.length);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMessages(new Set());
      setSelectAll(false);
    } else {
      setSelectedMessages(new Set(messages.map((msg) => msg._id)));
      setSelectAll(true);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    await messageApi.markAsRead(messageId);
    // Update the message in the local state
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg._id === messageId ? { ...msg, read: true } : msg
      )
    );
    // Update unread count
    handleGetUnreadCount();
  };

  const handleDeleteMessage = async (messageId) => {
    await messageApi.deleteMessage(messageId);
    // Remove message from local state
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg._id !== messageId)
    );
    // Update unread count
    handleGetUnreadCount();
    // Refresh pagination if needed
    if (messages.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      handleGetMessages(currentPage);
    }
  };

  const handleBulkMarkAsRead = async () => {
    const unreadSelected = Array.from(selectedMessages).filter((id) => {
      const message = messages.find((msg) => msg._id === id);
      return message && !message.read;
    });

    for (const messageId of unreadSelected) {
      await handleMarkAsRead(messageId);
    }
    setSelectedMessages(new Set());
    setSelectAll(false);
  };

  const handleBulkDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedMessages.size} message(s)?`
      )
    ) {
      for (const messageId of selectedMessages) {
        await handleDeleteMessage(messageId);
      }
      setSelectedMessages(new Set());
      setSelectAll(false);
    }
  };

  return (
    <div id="messages" className={`messages-${theme}`}>
      <div className="messages-top-bar">
        <div className="lined-header">
          <div className="line"></div>
          <p className="top-bar-header">
            Messages {<span className="unread-badge">{unreadCount}</span>}
          </p>
        </div>
        <div className="dropdowns">
          <SearchBar
            placeholder={"Search messages by sender, subject, or content..."}
            onSearch={handleOnSearchChange}
            debounceMs={300}
          />
          <Filter
            onFiltersChange={handleFiltersChange}
            availableCategories={[]} // Messages don't have categories
            isMessagesFilter={true}
          />
        </div>
      </div>

      {/* Bulk actions */}
      {selectedMessages.size > 0 && (
        <div className="bulk-actions">
          <div className="bulk-info">
            <span>{selectedMessages.size} message(s) selected</span>
          </div>
          <div className="bulk-buttons">
            <button
              className="bulk-btn mark-read-btn"
              onClick={handleBulkMarkAsRead}
              title="Mark selected as read"
            >
              <RiCheckLine />
              Mark as Read
            </button>
            <button
              className="bulk-btn delete-btn"
              onClick={handleBulkDelete}
              title="Delete selected"
            >
              <RiDeleteBin6Line />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Results summary */}
      <div className="results-summary">
        <p className="summary-text">
          Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
          {Math.min(
            pagination.currentPage * pagination.limit,
            pagination.totalMessages
          )}{" "}
          of {pagination.totalMessages} messages
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>

      <div className="messages-container">
        {/* Table header */}
        <div className="messages-header">
          <div className="header-checkbox">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              title="Select all"
            />
          </div>
          <div className="header-status">Status</div>
          <div className="header-sender">Sender</div>
          <div className="header-subject">Subject</div>
          <div className="header-date">Date</div>
          <div className="header-actions">Actions</div>
        </div>

        {!messages.length && <p className="blank-text">No messages found.</p>}

        {messages.map((message) => (
          <MessageCard
            key={message._id}
            message={message}
            isSelected={selectedMessages.has(message._id)}
            onSelect={handleMessageSelect}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDeleteMessage}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            <p className="pagination-text">
              Page {pagination.currentPage} of {pagination.totalPages}
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

export default Messages;
