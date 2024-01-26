import Head from "next/head";

import Layout from "@components/Layout";
import Container from "@components/Container";
import Map from "@components/Map";
import ListCard from "@components/ListCard";
import Search from "@components/Search";
import Sort from "@components/Sort";
import Filter from "@components/Filter";
import MapCard from "@components/MapCard";
import MapButtons from "@components/MapButtons";
import ProfileButton from '@components/Profile';
import { Button } from "@nextui-org/react";

import { useRouter } from "next/router";

import "bootstrap/dist/css/bootstrap.css";

import { useEffect, useState } from "react";

import styles from "@styles/Home.module.scss";
import StickyBar from "@components/StickyBar";

const DEFAULT_CENTER = [41.316307, -72.922585];

export default function Home() {
  const [locations, setLocations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState([]);
  const [isMapView, setIsMapView] = useState(true);
  const [latitude, setLat] = useState(DEFAULT_CENTER[0]);
  const [longitude, setLong] = useState(DEFAULT_CENTER[1]);
  const [isHeartSelected, setIsHeartSelected] = useState(false);
  const [locationFetched, setLocationFetched] = useState(false);

  const router = useRouter();

  // In index.js, at the top of your component
  const [mapUrl, setMapUrl] = useState("https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg");
  const handleMapChange = (mapType) => {
    const urlMap = {
      Canvas: "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg",
      Driving: "https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png",
      Grayscale: "https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png",
      Satellite: "https://tiles.stadiamaps.com/data/satellite/{z}/{x}/{y}.jpg",
    };
    setMapUrl(urlMap[mapType]);
  };

  const [searchQuery, setSearchQuery] = useState(""); 

  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  const [selectedFilters, setSelectedFilters] = useState({
    prices: ["$", "$$", "$$$", "$$$$"],
    types: ["Restaurant", "Bar"],
    ratings: [1, 2, 3, 4, 5],
    happyhour: false,
  });

  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const [selectedSortStyle, setSelectedSortStyle] = useState("Rating");
  const profile = false;

  const updateOnlyFavorites = (isHeartSelected) => {
    setOnlyFavorites(isHeartSelected);    
    const apiURL =
      "/queryBusinesses?" +
      `prices=${Array.from(selectedFilters.prices).join(",")}` +
      `&types=${Array.from(selectedFilters.types)
        .map((typ) => typ.toLowerCase())
        .join(",")}` +
      `&happyhour=${selectedFilters.happyhour}` +
      `&sortstyle=${selectedSortStyle}` +
      `&favorites=${isHeartSelected}` +
      `&latitude=${latitude}` +
      `&longitude=${longitude}`;

    fetch(apiURL, { credentials: "include" })
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

  const updateSort = (sortStyle) => {
    updateFavorites();
    setSelectedSortStyle(sortStyle);
    const apiURL =
      "/queryBusinesses?" +
      `prices=${Array.from(selectedFilters.prices).join(",")}` +
      `&types=${Array.from(selectedFilters.types)
        .map((typ) => typ.toLowerCase())
        .join(",")}` +
      `&happyhour=${selectedFilters.happyhour}` +
      `&sortstyle=${sortStyle}` +
      `&favorites=${onlyFavorites}` +
      `&latitude=${latitude}` +
      `&longitude=${longitude}`;

    fetch(apiURL, { credentials: "include" })
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
    updateFavorites();
    setSelectedFilters(filters);
    const apiURL =
      "/queryBusinesses?" +
      `prices=${Array.from(filters.prices).join(",")}` +
      `&types=${Array.from(filters.types)
        .map((typ) => typ.toLowerCase())
        .join(",")}` +
      `&happyhour=${filters.happyhour}` +
      `&sortstyle=${selectedSortStyle}` +
      `&favorites=${onlyFavorites}` +
      `&latitude=${latitude}` +
      `&longitude=${longitude}`;

    fetch(apiURL, { credentials: "include" })
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

  const updateFavorites = () =>{
    const apiURL = 
      "/queryBusinesses?" + 
      "favorites=true";
      fetch(apiURL, { credentials: "include" })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Bad response");
          }
        })
        .then((data) => {
          setFavorites(data);
        })
        .catch((error) => {
          console.error(error);
        }); 
  }

  const isBusinessInFavorites = (business) => favorites.some((fav) => fav.id === business.id);

  const updateClearFilters = () => {
    const clearedFilters = {
      prices: [],
      types: [],
      ratings: [],
      happyhour: false,
    };
    setSelectedFilters(clearedFilters);
  };

const toggleHeart = () => {
  setIsHeartSelected(prev => !prev);
  updateOnlyFavorites(!isHeartSelected);
};

  useEffect(() => {
    fetch("/userData", { credentials: "include", mode: "cors" })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Bad response");
        }
      })
      .then((data) => {
        /*console.log('user');
        console.log(data);*/
        setUser(data);
      })
      .catch((error) => {
        console.error(error);
        router.push("/splash");
      });
  }, []);

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setLat(latitude);
          setLong(longitude);
          setLocationFetched(!locationFetched);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
  }, []);

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
      updateLocations(selectedFilters);
  }, [locationFetched, selectedFilters]);


  const mapView = () => {
    setIsMapView(true);
  };

  const listView = () => {
    setIsMapView(false);
    setOnlyFavorites(false);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  /**
   * 11/14: once user profiles are working, Layout component needs to pass in a user parameter
   * which stores information on the signed-in user's friends, likes, reviews, net_id
   * I commented out user={user} since it was not running - 11/17 ashley
   *  */ 
  return (
    <Layout mapView={mapView} listView={listView} isMapView={isMapView} user={user}>
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
      <br />
      
      {!isMapView && (
        
        <div className="listSection">  
  
          <div className={styles.listheader}>
            <Search onSearch={setSearchQuery}/>
            <Filter
              updateLocations={updateLocations}
              updateClearFilters={updateClearFilters}
            />
            <Sort onSortChange={updateSort} />
          </div>

          <div className={styles.profile}>
            <ProfileButton/>
          </div>
          
          <div className={styles.listBody}>
            {filteredLocations.map(
              (loc) => (
                <ListCard key={loc.id} business={loc} isFavorite={isBusinessInFavorites(loc)}/> // Make sure to use a unique key for each child
              )
            )}
          </div>
        </div>
      )}

      <Container>
        {isMapView && (

          <div>

            <Map
              className={styles.homeMap}
              width="3"
              height="2"
              // Does not dynamically update
              center={[latitude, longitude]}
              zoom={15}
            >
              {({ TileLayer, Marker, Popup }) => (
                <>
                  {
                    <TileLayer
                      url={mapUrl}
                      maxZoom={16}
                      attribution="&copy; <a href='https://stadiamaps.com/' target='_blank'>Stadia Maps</a> contributors"
                    />
                  }
                  {filteredLocations.map((loc) => (
                    <Marker position={[loc.lat, loc.long]}>
                      <Popup className={styles.custompopup}>
                        <MapCard
                          className={styles.popupContent}
                          key={loc.id}
                          business={loc}
                          isFavorite={isBusinessInFavorites(loc)}
                        />
                      </Popup>
                    </Marker>
                  ))}
                </>
              )}
            </Map>
            <div className={styles.mapButtonsContainer}>
              <MapButtons 
                updateLocations={updateLocations} 
                updateClearFilters={updateClearFilters} 
                onMapChange={handleMapChange}
                updateOnlyFavorites={updateOnlyFavorites}
                isHeartSelected={isHeartSelected}
                toggleHeart={toggleHeart}
              />
            </div>
            
            <StickyBar
              onSearch={setSearchQuery} 
            />

          </div>
        )}
      </Container>
    </Layout>
  );
}
