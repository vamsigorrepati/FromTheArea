import React from 'react';
import {Avatar, Button, Divider} from "@nextui-org/react";
import {ChevronRight} from "../../public/ChevronRight";
import {LogoutIcon} from "../../public/LogoutIcon";
import styles from "@styles/Profile.module.scss";
import Link from 'next/link';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PeopleIcon from '@mui/icons-material/People';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { useEffect, useState } from "react";


const MyProfile = () => {

    const [user, setUser] = useState(null);

    useEffect(() => {      
        const fetchData = async () => {
            try {
                const response = await fetch("/userData", { credentials: "include", mode: "cors" });

                if (!response.ok) {
                    throw new Error("Bad response");
                }

                const data = await response.json();
                setUser(data);
                //console.log("user data", data);
            } catch (error) {
                console.error(error);
                router.push("/splash");
            }
        };
        ``
        fetchData();
    }, []);

    if (user === null) {
        return <p>Loading...</p>;
    }

    return (
        <>
        <br></br>
            <div className={styles.profileheader}>
                <Link href="/" passHref>
                    <ArrowBackIosIcon
                    className={styles.arrow}/>
                </Link>
                    
                <h4 
                    className={styles.header}
                >
                    My Profile
                </h4>
            </div>
                
            <br></br>
            <div className={styles.avatarsection}>
                    <Avatar
                        className={styles.avatar} />

                    <div className={styles.user}>
                        <h5 className={styles.username}>{user.name}</h5>
                        <h7 className={styles.usercontact}>{user.email}</h7>
                        <Button className={styles.editprofile}>Edit Profile</Button>
                    </div>
                </div>
                <br/>
                <br/>
                
                <div>
                <Link href="/favorites" passHref>
                    <Button
                        className={styles.favorites}
                        startContent={<FavoriteBorderIcon/>}
                        endContent={<ChevronRight className={styles.chevron} />}
                    >
                        Favorites
                    </Button>
                </Link>
                <Link href="/friends" passHref>
                    <Button
                        className={styles.friends}
                        startContent={<PeopleIcon/>}
                        endContent={<ChevronRight className={styles.chevron} />}
                    >
                        Friends
                    </Button>
                </Link>
                </div>
                <Divider
                    orientation="horizontal"
                    className={styles.divider}
                >
                </Divider>

                <Link href="/" passHref>
                    <div
                        className={styles.logout}>
                        <Button
                            className={styles.logoutbutton}
                            startContent={<LogoutIcon />}>
                            Logout
                        </Button>
                    </div>
                </Link>
            </>

    );
};

export default MyProfile;
