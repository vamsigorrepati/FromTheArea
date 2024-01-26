import React from "react";
import {
    Avatar,
    Divider,
} from "@nextui-org/react";
import Rating from '@mui/material/Rating';
import styles from './ReviewList.module.scss'
import Typography from '@mui/material/Typography';

const ReviewList = ({review}) => {
    let {userName, userRating, userReview} = review;

    return (
        <>
            <div>
                <div className={styles.nameRating} data-testid="reviewList">
                    <Avatar className={styles.avatar} showFallback size="sm" name={userName} data-testid="avatar"/>
                    <Rating className={styles.ratingModule} prevision={0.25} value={userRating} size="small" readOnly data-testid="rating"/>
                </div>
                <div className={styles.reviewBody}>
                    <Typography variant="body1" className={styles.review} data-testid="review">
                        {userReview}
                    </Typography>
                </div>
                <Divider orientation="horizontal" className={styles.divider}/>
            </div>
        </>
    );
};

export default ReviewList;