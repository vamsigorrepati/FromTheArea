import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Divider, Checkbox} from "@nextui-org/react";
import { useState } from "react";
import {FilterIcon} from "../../../public/FilterIcon";
import {FoodIcon} from "../../../public/FoodIcon";
import {DrinkIcon} from "../../../public/DrinkIcon";
import styles from './Filter.module.scss';


const Filter = ({ isOpen: propsIsOpen, onOpenChange: propsOnOpenChange, updateLocations, showButton = true, updateClearFilters }) => {
    const { isOpen: internalIsOpen, onOpen: internalOnOpen, onOpenChange: internalOnOpenChange } = useDisclosure();


    const isOpen = propsIsOpen !== undefined ? propsIsOpen : internalIsOpen;
    const onOpenChange = propsOnOpenChange || internalOnOpenChange;

    const handleClose = () => {
        onOpenChange(false);  
    };

    const [selectedTypes, setSelectedTypes] = useState(["Restaurant", "Bar"]);
    const [selectedRatings, setSelectedRatings] = useState([1, 2, 3, 4, 5]);
    const [selectedPrices, setSelectedPrices] = useState(["$", "$$", "$$$", "$$$$"]);
    const [selectedActiveHappyHour, setSelectedActiveHappyHour] = useState(false);

    const clearFilters = () => {
        setSelectedTypes([]);
        setSelectedRatings([]);
        setSelectedPrices([]);
        setSelectedActiveHappyHour(false);
        updateClearFilters();
    }

    let onClose;
    


    const toggleRating = (rating) => {
        setSelectedRatings((prevRatings) => {
            if (prevRatings.includes(rating)) {
                return prevRatings.filter((selectedRating) => selectedRating !== rating);
            } else {
                return [...prevRatings, rating];
            }
        });
    };

    const togglePrice = (price) => {
        setSelectedPrices((prevPrices) => {
            if (prevPrices.includes(price)) {
                return prevPrices.filter((selectedPrices) => selectedPrices !== price);
            } else {
                return [...prevPrices, price];
            }
        });
    };

    

    return (
        <>
        {showButton && (
        <Button 
            size = "md"
            className={styles.button}
            data-testid="filter-1"
            startContent={
                <FilterIcon/>
            }
            onPress={() => {
                handleClose(); 
              }}> Filter
        </Button>
        )}
        <Modal 
            className={styles.modal}
            size = {"full"}
            isOpen={isOpen} 
            placement={"bottom"}
            onOpenChange={onOpenChange}
            scrollBehavior={"inside"}
            >
            <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader 
                        className={styles.header}>
                    </ModalHeader>
                    <ModalBody>
                        <Divider
                            orientation="horizontal"
                            className={styles.divider}
                        >
                        </Divider>
                        <p className={styles.textsize}>
                            Category
                        </p>
                        
                        <div className={styles.category}>
                            <Button
                                startContent={<FoodIcon/>}
                                data-testid="restaurant-button"
                                onPress={() => {
                                    setSelectedTypes((prevTypes) =>
                                      prevTypes.includes("Restaurant")
                                        ? prevTypes.filter((cat) => cat !== "Restaurant")
                                        : [...prevTypes, "Restaurant"]
                                    ); 
                                }}
                                className={selectedTypes.includes("Restaurant") ? styles.buttonclicked : styles.filterbutton}
                                
                            >
                                    Restaurants
                            </Button>
                            <Button
                                startContent={<DrinkIcon/>}
                                data-testid="bars-button"
                                onPress={() => {
                                    setSelectedTypes((prevTypes) =>
                                      prevTypes.includes("Bar")
                                        ? prevTypes.filter((cat) => cat !== "Bar")
                                        : [...prevTypes, "Bar"]
                                    ); 
                                }}   
                                className={selectedTypes.includes("Bar")  ? styles.buttonclicked : styles.filterbutton}
                                
                            >
                                    Bars
                            </Button>
                        </div>
                        
                        <Divider
                            orientation="horizontal"
                            className={styles.divider}
                        >
                        </Divider>
                        <p class={styles.textsize}>
                            Rating
                        </p>
                        <div className={styles.ratingprice}>
                        <Checkbox
                            color="primary"
                            onValueChange={() => toggleRating(1)}
                            defaultSelected={selectedRatings.includes(1)}
                            isSelected={selectedRatings.includes(1)}
                            data-testid="rating-1"

                        >
                            1
                        </Checkbox>
                        <Checkbox
                            onValueChange={() => toggleRating(2)}
                            defaultSelected={selectedRatings.includes(2)}
                            isSelected={selectedRatings.includes(2)}
                            data-testid="rating-2"
                        >
                            2
                        </Checkbox>
                        <Checkbox
                            onValueChange={() => toggleRating(3)}
                            defaultSelected={selectedRatings.includes(3)}
                            isSelected={selectedRatings.includes(3)}
                            data-testid="rating-3"

                        >
                            3
                        </Checkbox>
                        <Checkbox
                            onValueChange={() => toggleRating(4)}
                            defaultSelected={selectedRatings.includes(4)}
                            isSelected={selectedRatings.includes(4)}
                            data-testid="rating-4"

                        >
                            4
                        </Checkbox>
                        <Checkbox
                            onValueChange={() => toggleRating(5)}
                            defaultSelected={selectedRatings.includes(5)}
                            isSelected={selectedRatings.includes(5)}
                            data-testid="rating-5"

                        >
                            5
                        </Checkbox>
                        </div>
                        <Divider
                            orientation="horizontal"
                            className={styles.divider}
                        >
                        </Divider>

                        <p class={styles.textsize}>
                            Price
                        </p>
                        <div className={styles.ratingprice}>
                        <Checkbox
                            onValueChange={() => togglePrice("$")}
                            defaultSelected={selectedPrices.includes("$")}
                            isSelected={selectedPrices.includes("$")}
                            data-testid="price-1"

                        >
                            $
                        </Checkbox>
                        <Checkbox
                            onValueChange={() => togglePrice("$$")}
                            defaultSelected={selectedPrices.includes("$$")}
                            isSelected={selectedPrices.includes("$$")}
                            data-testid="price-2"

                        >
                            $$
                        </Checkbox>
                        <Checkbox
                            onValueChange={() => togglePrice("$$$")}
                            defaultSelected={selectedPrices.includes("$$$")}
                            isSelected={selectedPrices.includes("$$$")}
                            data-testid="price-3"

                        >
                            $$$
                        </Checkbox>
                        <Checkbox
                            onValueChange={() => togglePrice("$$$$")}
                            defaultSelected={selectedPrices.includes("$$$$")}
                            isSelected={selectedPrices.includes("$$$$")}
                            data-testid="price-4"

                        >
                            $$$$
                        </Checkbox>
                        </div>

                        <Divider
                            orientation="horizontal"
                            className={styles.divider}
                        >
                        </Divider>
                        


                    </ModalBody>

                    <ModalFooter className={styles.footer}>
                        <Button 
                            className={styles.cleartext}
                            variant="light" 
                            onPress={clearFilters}
                            data-testid="clear">
                            Clear
                        </Button>
                        <Button 
                            className={`${styles.apply} ${styles.buttonclicked}`} 
                            data-testid="apply"
                            onPress={() => {
                            const applyFilters = () => {
                                updateLocations({
                                    prices: Array.from(selectedPrices),
                                    types: Array.from (selectedTypes),
                                    ratings: Array.from(selectedRatings),
                                    happyhour: selectedActiveHappyHour,
                                });
                                onClose();
                            };

                            applyFilters(); 
                        }}>
                            Apply Filters
                        </Button>
                    </ModalFooter>

                </>
                )}
            </ModalContent>
        </Modal>
        </>
    );
};

export default Filter;
