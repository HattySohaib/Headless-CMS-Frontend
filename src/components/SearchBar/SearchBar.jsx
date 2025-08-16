import React, { useState, useEffect } from "react";
import "./SearchBar.css";

import searchIcon from "../../assets/dashboard_icons/search.png";
import { useTheme } from "../../contexts/theme";

const SearchBar = ({ placeholder, onSearch, debounceMs = 500 }) => {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, onSearch, debounceMs]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch(query);
    }
  };

  return (
    <div className={`search-bar bar-${theme}`}>
      <img className="search-button" src={searchIcon} alt="" />
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        className="search-input"
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchBar;
