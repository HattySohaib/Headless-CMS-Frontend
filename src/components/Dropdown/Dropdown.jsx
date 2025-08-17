import React, { useState } from "react";
import "./Dropdown.css";
import { RiArrowDownSLine } from "@remixicon/react";
import { useTheme } from "../../contexts/theme";

const Dropdown = ({ text, defaultText, options, onSelect }) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect(option);
  };

  return (
    <div className={`dropdown bar-${theme}`}>
      <div className="dropdown-header" onClick={toggleDropdown}>
        <span className="dropdown-key">{text}</span>
        <span className="dropdown-value">{selectedOption || defaultText}</span>
        <RiArrowDownSLine
          className={`dropdown-arrow ${isOpen ? "open" : ""}`}
          size={20}
        />
      </div>
      {isOpen && (
        <div className="dropdown-list">
          <div
            className="dropdown-list-item"
            onClick={() => handleOptionClick("All")}
          >
            All
          </div>
          {options.map((option, index) => (
            <div
              key={index}
              className="dropdown-list-item"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
