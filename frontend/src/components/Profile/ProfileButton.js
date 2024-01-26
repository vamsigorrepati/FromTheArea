import React from "react";
import {Avatar, AvatarIcon} from "@nextui-org/react";
import Link from 'next/link';
import styles from './ProfileButton.module.scss'
import { useEffect, useState } from "react";



/**
 * Assuming this is visitCount that is passed in
 *  version: profile1, visit: 40
 *  version: profile2, visit: 42
 *  version: profile3, visit 18
 * 
 * Once backend gets implemented, fetch visitCount referring
 * to the expected layout above and uncomment the code I've commented.
 * 
 */
const ProfileButton = () => {
    const [chosenProfile, setChosenProfile] = useState(null);
    const chooseRandomProfile = () => {
        const profiles = ['profile1', 'profile2', 'profile3'];
        const randomIndex = Math.floor(Math.random() * profiles.length);
        const randomProfile = profiles[randomIndex];
        setChosenProfile(randomProfile);
        return randomProfile;
    }

    useEffect(() => {
        const chosen = chooseRandomProfile();
        fetch('/metrics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({profile: chosen, type: 'visit'}),
        })
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
    }, []);

    const countProfile = () => {
        fetch('/metrics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({profile: chosenProfile, type: 'click'}),
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }




    // let {profile1, profile2, profile3} = visitCount;
    // let maxVisit = 0; 
    // let maxVisitVersion = null;
    // let styling = styles.profile1;

    // visitCount.forEach(item => {
    //     if(item.visit > maxVisit) {
    //         maxVisit = item.visit;
    //         maxVisitVersion = item.version;
    //     }
    // });

    // if(maxVisitVersion == 'profile1') {
    //     styling = styles.profile1;
    // } else if (maxVisitVersion == 'profile2') {
    //     styling = styles.profile2;
    // } else {
    //     styling = styles.profile3;
    // }


    


    return (
        <Link href="/profile" passHref>
            <Avatar
                icon={<AvatarIcon/>}
                className={styles[chosenProfile]}
                as="button"
                data-testid="profile"
                onClick={countProfile}
            />
        </Link>
    );
};

export default ProfileButton;
