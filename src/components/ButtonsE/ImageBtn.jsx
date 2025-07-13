import React from "react";
import done from "../../assets/editor_icons/done.png";

function ImageBtn({ img, onChange, oldBanner, selectedFile }) {
  return (
    <div>
      <label
        id="banner-label"
        htmlFor={`desktop-banner`}
        className="file-upload-btn banner-label"
      >
        {!selectedFile && !oldBanner && (
          <>
            <img className="banner-btn-icon" src={img} />
            <span>Add banner</span>
          </>
        )}
        {(selectedFile || oldBanner) && (
          <>
            <img className="banner-btn-icon" src={done} />
            <span>Change banner</span>
          </>
        )}
      </label>
      <input
        name={`desktop-banner`}
        id={`desktop-banner`}
        className="banner-input"
        type="file"
        onChange={onChange}
      />
    </div>
  );
}

export default ImageBtn;
