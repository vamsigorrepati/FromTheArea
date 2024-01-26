import Head from "next/head";
import Container from "@components/Container";
import ListCard from "@components/ListCard";
import Search from "@components/Search";
import Sort from "@components/Sort";
import Filter from "@components/Filter";
import React from "react";
import Link from 'next/link';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import "bootstrap/dist/css/bootstrap.css";

import { useEffect, useState } from "react";

import styles from "@styles/Favorites.module.scss";

export default function Home({user}) {
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // 1. Add a state for the search query
  // let {net_id, likes, reviews} = user;
  
  // 2. Create a function to handle search input changes
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  // 3. Derive the filtered locations based on the search query
  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [selectedFilters, setSelectedFilters] = useState({
    prices: ["$", "$$", "$$$", "$$$$"],
    types: ["Restaurant", "Bar"],
    ratings: [1, 2, 3, 4, 5],
    happyhour: false,
  });

  const [selectedSortStyle, setSelectedSortStyle] = useState("Rating");
  const profile = false;

  const updateSort = (sortStyle) => {
    setSelectedSortStyle(sortStyle);
    const apiURL =
      "/queryBusinesses?" +
      `prices=${Array.from(selectedFilters.prices).join(",")}` +
      `&types=${Array.from(selectedFilters.types)
        .map((typ) => typ.toLowerCase())
        .join(",")}` +
      `&happyhour=${selectedFilters.happyhour}` +
      `&sortstyle=${sortStyle}` +
      `&favorites=true`

    fetch(apiURL)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Bad response");
        }
      })
      .then((data) => {
        setLocations(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const updateLocations = (filters) => {
    setSelectedFilters(filters);
    const apiURL =
      "/queryBusinesses?" +
      `prices=${Array.from(filters.prices).join(",")}` +
      `&types=${Array.from(filters.types)
        .map((typ) => typ.toLowerCase())
        .join(",")}` +
      `&happyhour=${filters.happyhour}` +
      `&sortstyle=${selectedSortStyle}` +
      `&favorites=true`;

    fetch(apiURL)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Bad response");
        }
      })
      .then((data) => {
        setLocations(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const updateClearFilters = () => {
    const clearedFilters = {
      prices: [],
      types: [],
      ratings: [],
      happyhour: false,
    };
    setSelectedFilters(clearedFilters);
  };

  useEffect(() => {
      updateLocations(selectedFilters);
  }, []);

  return (
    <>
      <Head>
          <title>FromTheArea</title>
          <meta name="description" content="..." />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600&family=Roboto+Condensed:wght@300;400;500;700&display=swap"
            rel="stylesheet"
          />
      </Head>
      <header className={styles.header}>
        <Container className={styles.headerContainer}>
          <Link className={styles.link} href="/profile" passHref>
              <ArrowBackIosIcon
              className={styles.arrow}/>
          </Link>
          <h5 className={styles.favoriteHeader}>
            Your Favorites
          </h5>
        </Container>
      </header>
      <div className="listSection">
        <div className={styles.listheader}>
          <Search className={styles.search} onSearch={handleSearchChange} />
          <Filter
            updateLocations={updateLocations}
            updateClearFilters={updateClearFilters}
          />
          <Sort onSortChange={updateSort} />
        </div>
        <div className={styles.listBody}>
          {filteredLocations.map(
            (
              loc // 4. Use the filtered locations here
            ) => (
              <ListCard key={loc.id} business={loc} isFavorite={true}/> // Make sure to use a unique key for each child
            )
          )}
        </div>
      </div>
    </>
  )
}
