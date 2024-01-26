import React from "react";
import {
    Card,
    CardHeader,
    CardFooter,
    Avatar,
} from "@nextui-org/react";
import Rating from '@mui/material/Rating';
import styles from './ReviewCard.module.scss'
import Typography from '@mui/material/Typography';

const ReviewCard = ( {review}) => {  
    let {userName, userRating, userReview} = review;
    let reviewCardClassName = styles.reviewCard;  
    
    return (
        <>
            <Card
                shadow="sm"
                radius="lg"
                variant="bordered"
                className={reviewCardClassName}
                data-testid="reviewCard"
            > 
                <CardHeader className={styles.cardHeader}>
                    <Typography variant="body1" className={styles.review} data-testid="review">
                        {userReview}
                    </Typography>
                </CardHeader>
                <CardFooter className={styles.cardFooter}>
                    <Avatar className={styles.avatar} showFallback size="sm" name={userName} data-testid="avatar"/>
                    <Rating className={styles.ratingModule} precision={0.25} value={userRating} size="small" readOnly data-testid="rating"/>
                </CardFooter>
            </Card> 
        </>
    );
};

export default ReviewCard;

