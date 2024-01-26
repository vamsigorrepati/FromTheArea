import styles from "@styles/Friends.module.scss";
import SearchFriends from "@components/SearchFriends";
import {Divider, Avatar, User, Button} from "@nextui-org/react";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Link from 'next/link';


const Friends = () => {
    return (
        <>
        <br></br>
        <div className={styles.friendsheader}>
        
            <Link href="/profile" passHref>
                <ArrowBackIosIcon
                className={styles.arrow}/>
            </Link>
                
            <h4 
                className={styles.header}
            >
                My Friends
            </h4>
        </div>
        

        <Divider
            orientation="horizontal"
            className={styles.divider}
        >
        </Divider>

        <div className={styles.search}>
            <SearchFriends/>
        </div>
        
        <br></br>
        {/* Need to have a loop here that outputs all your friends */}
        <div className={styles.friendsarea}>
            <Button
                className={styles.friendsbutton}
            >
                <div className={styles.friendinfo}>
                    
                    <User
                        name="Vamsi Gorrepati"
                    >
                        
                    </User>
                </div>
            </Button>
            <Button
                radius="full"
                variant="bordered"
                className={styles.unfriend}
            >
                Unfriend
            </Button>
        </div>

        <div className={styles.friendsarea}>
            <Button
                className={styles.friendsbutton}
            >
                <div className={styles.friendinfo}>
                    
                    <User
                        name="Kenan Collignon"
                    >
                        
                    </User>
                </div>
            </Button>
            <Button
                radius="full"
                variant="bordered"
                className={styles.unfriend}
            >
                Unfriend
            </Button>
        </div>


        </>
    );
};

export default Friends;