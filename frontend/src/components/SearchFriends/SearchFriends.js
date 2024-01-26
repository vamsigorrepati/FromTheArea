import React, { useState } from 'react';
import {Input} from "@nextui-org/react";
import {SearchIcon} from "../../../public/SearchIcon";
import styles from './SearchFriends.module.scss';

const SearchFriends = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
      const value = event.target.value;
      setSearchTerm(value);
      if (onSearch) {
          onSearch(value);
      }
  };

  return (
      <div className={styles.search}
            data-testid="searchfriends">
          <Input
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search Friends"
              startContent={<SearchIcon className={styles.searchIcon} />}
          />
      </div>
      
  );
};

export default SearchFriends;