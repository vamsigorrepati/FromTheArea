import React, { useState } from 'react';
import Filter from '@components/Filter';
import styles from './MapButtons.module.scss';
import Image from 'next/image';
import { FilterIcon } from "../../../public/FilterIcon"; 
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Divider, Checkbox, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Accordion, AccordionItem} from "@nextui-org/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons'; // Filled heart
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'; // Regular heart

import darkImage from '../../../public/Dark.png';
import canvasImage from '../../../public/Canvas.png';
import blackImage from '../../../public/Black.png';
import lightImage from '../../../public/Light.png';

const MapButtons = ({ updateLocations, updateClearFilters, onMapChange, updateOnlyFavorites, isHeartSelected, toggleHeart }) => {
    const [isFilterModalOpen, setFilterModalOpen] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedMap, setSelectedMap] = useState('Canvas');
    
  
    const toggleFilterModal = () => {
      setFilterModalOpen(!isFilterModalOpen);
    };

    const handleMapSelection = (mapType) => {
        setSelectedMap(mapType);
        onMapChange(mapType); // Call the passed function with the new map type
    };

    return (
      <>
        <div className={styles.buttonGroup}>
            <button className={styles.button} onClick={onOpen}>
                <FontAwesomeIcon icon={faMap} />
            </button>
          <button className={styles.button} onClick={toggleFilterModal}>
            <FilterIcon />
          </button>
          <button className={`${styles.button} ${isHeartSelected ? styles.selected : ''}`} onClick={toggleHeart}>
                <FontAwesomeIcon icon={isHeartSelected ? fasHeart : farHeart} />
            </button>
        </div>

        <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        >
                <ModalContent>
                    <ModalHeader>Choose Map</ModalHeader>
                    <ModalBody>
                    <div className={styles.mapChoiceContainer}>

                        {/* Row 1 */}
                        <div className={styles.mapChoiceRow}>
                            <button
                              className={`${styles.mapChoiceButton} ${selectedMap === 'Canvas' ? styles.mapChoiceSelected : ''}`}
                              onClick={() => handleMapSelection('Canvas')}
                            >
                                <Image src={canvasImage} alt="Canvas" width={190} height={100} />
                                <span className={styles.mapChoiceTitle}>Canvas</span>
                            </button>
                            <button
                              className={`${styles.mapChoiceButton} ${selectedMap === 'Driving' ? styles.mapChoiceSelected : ''}`}
                              onClick={() => handleMapSelection('Driving')}
                            >
                                <Image src={lightImage} alt="Driving" width={190} height={100} />
                                <span className={styles.mapChoiceTitle}>Driving</span>
                            </button>
                        </div>

                        {/* Row 2 */}
                        <div className={styles.mapChoiceRow}>
                            <button
                              className={`${styles.mapChoiceButton} ${selectedMap === 'Grayscale' ? styles.mapChoiceSelected : ''}`}
                              onClick={() => handleMapSelection('Grayscale')}
                            >
                                <Image src={blackImage} alt="Grayscale" width={190} height={100} />
                                <span className={styles.mapChoiceTitle}>Grayscale</span>
                            </button>
                            <button
                              className={`${styles.mapChoiceButton} ${selectedMap === 'Satellite' ? styles.mapChoiceSelected : ''}`}
                              onClick={() => handleMapSelection('Satellite')}
                            >
                                <Image src={darkImage} alt="Satellite" width={190} height={100} />
                                <span className={styles.mapChoiceTitle}>Satellite</span>
                            </button>
                        </div>
                    </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
            
        <Filter 
          isOpen={isFilterModalOpen} 
          onOpenChange={toggleFilterModal}
          updateLocations={updateLocations}
          updateClearFilters={updateClearFilters}
          showButton={false}
        />
      </>
    );
};

export default MapButtons;
