import { useState } from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import {SortIcon} from "../../../public/SortIcon";

import styles from './Sort.module.scss';


const Sort = ({onSortChange}) => {
    const [sortTitle, setSortTitle] = useState("Sort");

    const newSortTitle = (title) => {
        setSortTitle(title);
    };


    const applySort = (item) => {
        onSortChange(item.key);
    }

    const items = [{key: "Rating", label: "Rating",}, {key: "Distance", label: "Distance",}, {key: "PriceAsc", label: "Price ↑",}, {key: "PriceDesc", label: "Price ↓",}];
    return (
            <Dropdown>
                <DropdownTrigger>
                    <Button 
                        className={styles.button}
                        size = "md"
                        data-testid="sort"
                        startContent={
                            <SortIcon/>
                        }
                        
                        >
                        {sortTitle}
                    </Button>
                </DropdownTrigger>
                <DropdownMenu 
                    
                    aria-label="Dynamic Actions" 
                    items={items}
                    onAction={(key) => {newSortTitle(key)}}
                >
                    {(item) => (
                        <DropdownItem
                            key={item.key}
                            onClick={() => applySort(item)}
                        >
                            {item.label}
                        </DropdownItem>
                    )}
                </DropdownMenu>
            </Dropdown>
    
    );
};

export default Sort;