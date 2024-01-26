import Link from 'next/link';
import Image from 'next/image';
import React from "react";

import { Tabs, Tab } from "@nextui-org/react";
import { useState } from "react";

import Container from '@components/Container';
import logoSrc from './logo.png';

import styles from './Header.module.scss';
import {ListIcon} from "../../../public/ListIcon";
import {MapIcon} from "./MapIcon";


const Header = ({ mapView, listView, isMapView }) => {
  
  const [selected, setSelected] = useState(isMapView ? "map" : "list");
  const headerClass = selected === "map" ? styles.headerMap : styles.header;

  return (
    <header data-testid="header" className={headerClass}>
      <Container className={styles.headerContainer}>
      
      <div className={styles.headerContent}>

        
          {selected === "list" && (
            <Link href="/" passHref>
              <Image 
                src={logoSrc} 
                alt="FromTheArea Logo" 
                width={160}
                height={100}
                objectFit='contain'
              />
            </Link>
          )}

          <div className={styles.toggle}>
            <Tabs
                aria-label="Options"
                selectedKey={selected}
                onSelectionChange={setSelected}
                color={selected === "list" ? "primary" : "warning"} 
            >
              
                <Tab
                  key="list"
                  title={
                    <div className={styles.tab} >
                      <span
                        className={styles.togglelist}>
                        {<ListIcon className={styles.iconlist}/>} 
                        List
                      </span>
                    </div>
                  }
                >
                  {selected === "list" && listView()}
                </Tab>

                <Tab
                  key="map"
                  title={
                    <div className={styles.tab}>
                      <span
                        className={styles.togglelist}>
                        {<MapIcon className={styles.iconlist}/>}
                        Map
                      </span>
                    </div>
                  }
                >
                  {selected === "map" && mapView()}
                </Tab>

            </Tabs>
          </div>
        </div>


      </Container>
    </header>
  );
};

export default Header;
