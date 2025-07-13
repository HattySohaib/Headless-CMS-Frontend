import React, { useRef, useState, useContext } from "react";
import "./DropArea.css";
import { useFileContext } from "../../contexts/file.js";

const DropArea = () => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState();

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

  return (
    <div className="drop-container">
      <div
        className={`drag-area ${dragActive ? "drag-active" : ""}`}
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="drop-style">
          <span className="material-symbols-outlined dnd">cloud_upload</span>
          <p>Drag & Drop your image here</p>
        </div>
        <p>or</p>
        <div className="file-input-wrapper" onClick={handleFileInputClick}>
          {fileName && (
            <p>
              <span className="material-symbols-outlined">image</span>
              {fileName}
            </p>
          )}
          {!fileName && (
            <p>
              <span className="material-symbols-outlined">image</span>Click to
              Upload from File Browser
            </p>
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
