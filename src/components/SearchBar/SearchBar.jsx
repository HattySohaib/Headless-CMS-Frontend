import React, { useState } from "react";
import "./SearchBar.css";

import searchIcon from "../../assets/dashboard_icons/search.png";
import { useTheme } from "../../contexts/theme";

const SearchBar = ({ placeholder, onSearch }) => {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className={`search-bar bar-${theme}`}>
      <img className="search-button" src={searchIcon} alt="" />
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyUp={handleSearch}
        className="search-input"
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchBar;
