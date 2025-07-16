import React, { useRef, useState, useContext } from "react";
import "./DropArea.css";
import { useFileContext } from "../../contexts/file.js";
import { useTheme } from "../../contexts/theme.js";
import { RiUploadCloudLine, RiImageLine, RiCloseLine } from "@remixicon/react";

const DropArea = ({ onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState();
  const { theme } = useTheme();

  const { setSelectedFiles, selectedFiles } = useFileContext();

  const handleFileDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      addFilesToInput(files);
      setSelectedFiles(files);
      console.log(selectedFiles);
    }
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      setFileName(files[0].name);
      setSelectedFiles(files);
      console.log(selectedFiles);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };
  const addFilesToInput = (files) => {
    const dataTransfer = new DataTransfer();
    for (let i = 0; i < files.length; i++) {
      dataTransfer.items.add(files[i]);
    }
    fileInputRef.current.files = dataTransfer.files;
    setFileName(dataTransfer.files[0].name);
  };

  const handleContainerClick = (e) => {
    e.stopPropagation(); // Prevent backdrop click when clicking on the container
  };

  return (
    <div
      className={`drop-container drop-${theme}`}
      onClick={handleContainerClick}
    >
      <button className="drop-close-btn" onClick={onClose}>
        <RiCloseLine size="1.5rem" />
      </button>
      <div
        className={`drag-area ${dragActive ? "drag-active" : ""}`}
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="drop-style">
          <RiUploadCloudLine size="3rem" />
          <h3>Drag & Drop your image here</h3>
          <p>or</p>
        </div>
        <div className="file-input-wrapper" onClick={handleFileInputClick}>
          <RiImageLine size="1.5rem" />
          {fileName ? (
            <span>{fileName}</span>
          ) : (
            <span>Click to Upload from File Browser</span>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="file-input"
            accept="image/*"
            onChange={handleFileSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default DropArea;
