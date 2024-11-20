import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const SearchBar = () => {
  const [searchText, setSearchText] = useState('');

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <div style={{ minWidth: '250px' }}>
      <input
        type="text"
        className="form-control"
        placeholder="Search..."
        value={searchText}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default SearchBar;
