import React, { useState } from "react";
import "./MessageCard.css";
import { useTheme } from "../../contexts/theme";
import {
  RiMailLine,
  RiMailOpenLine,
  RiDeleteBin6Line,
  RiCheckLine,
  RiEyeLine,
  RiTimeLine,
} from "@remixicon/react";

const MessageCard = ({
  message,
  isSelected,
  onSelect,
  onMarkAsRead,
  onDelete,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const handleCheckboxChange = () => {
    onSelect(message._id);
  };

  const handleMarkAsRead = (e) => {
    e.stopPropagation();
    onMarkAsRead(message._id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this message?")) {
      onDelete(message._id);
    }
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    // Mark as read when expanding
    if (!isExpanded && !message.read) {
      onMarkAsRead(message._id);
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div
      className={`message-card message-card-${theme} ${
        !message.read ? "unread" : ""
      }`}
    >
      <div className="message-row" onClick={handleExpand}>
        {/* Desktop Layout */}
        <div className="desktop-layout">
          <div className="message-checkbox">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleCheckboxChange}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="message-status">
            {message.read ? (
              <RiMailOpenLine size={16} className="read-icon" />
            ) : (
              <RiMailLine size={16} className="unread-icon" />
            )}
          </div>

          <div className="message-sender">
            <span className="sender-email">{message.senderEmail}</span>
          </div>

          <div className="message-subject">
            <span className="subject-text">
              {message.subject || "No Subject"}
            </span>
            <span className="message-preview">
              {truncateText(message.message)}
            </span>
          </div>

          <div className="message-date">
            <RiTimeLine size={14} />
            <span>{formatDate(message.createdAt)}</span>
          </div>

          <div className="message-actions">
            <button
              className="action-btn view-btn"
              onClick={handleExpand}
              title={isExpanded ? "Collapse" : "Expand"}
            >
              <RiEyeLine size={14} />
            </button>
            <button
              className="action-btn delete-btn"
              onClick={handleDelete}
              title="Delete message"
            >
              <RiDeleteBin6Line size={14} />
            </button>
            {!message.read && (
              <button
                className="action-btn mark-read-btn"
                onClick={handleMarkAsRead}
                title="Mark as read"
              >
                <RiCheckLine size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="mobile-layout">
          <div className="message-header-row">
            <div className="message-checkbox">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={handleCheckboxChange}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="message-status">
              {message.read ? (
                <RiMailOpenLine size={16} className="read-icon" />
              ) : (
                <RiMailLine size={16} className="unread-icon" />
              )}
            </div>

            <div className="message-actions">
              <button
                className="action-btn view-btn"
                onClick={handleExpand}
                title={isExpanded ? "Collapse" : "Expand"}
              >
                <RiEyeLine size={14} />
              </button>
              <button
                className="action-btn delete-btn"
                onClick={handleDelete}
                title="Delete message"
              >
                <RiDeleteBin6Line size={14} />
              </button>
              {!message.read && (
                <button
                  className="action-btn mark-read-btn"
                  onClick={handleMarkAsRead}
                  title="Mark as read"
                >
                  <RiCheckLine size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="message-info-row">
            <div className="message-subject">
              <span className="subject-text">
                {message.subject || "No Subject"}
              </span>
              <span className="message-preview">
                {truncateText(message.message)}
              </span>
            </div>

            <div className="message-meta-mobile">
              <span className="sender-email">{message.senderEmail}</span>
              <div className="message-date">
                <RiTimeLine size={12} />
                <span>{formatDate(message.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="message-expanded">
          <div className="message-details">
            <div className="message-meta">
              <div className="meta-item">
                <strong>From:</strong> {message.senderEmail}
              </div>
              <div className="meta-item">
                <strong>Date:</strong>{" "}
                {new Date(message.createdAt).toLocaleString()}
              </div>
              {message.subject && (
                <div className="meta-item">
                  <strong>Subject:</strong> {message.subject}
                </div>
              )}
            </div>
            <div className="message-content">
              <div className="content-label">
                <strong>Message:</strong>
              </div>
              <div className="content-text">
                {message.message.split("\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageCard;
