import React, { useState } from 'react';
import {Input} from "@nextui-org/react";
import {SearchIcon} from "../../../public/SearchIcon";
import styles from './Search.module.scss';

const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
      const value = event.target.value;
      setSearchTerm(value);
      if (onSearch) {
          onSearch(value);
      }
  };

  return (
      <div className={styles.search} data-testid="search-1">
          <Input
            value={searchTerm}
            size="xsm"
            radius="md"
            onChange={handleSearchChange}
            placeholder="Search Restaurant"
            startContent={<SearchIcon className={styles.searchIcon} />}
          />
      </div>
      
  );
};

export default Search;