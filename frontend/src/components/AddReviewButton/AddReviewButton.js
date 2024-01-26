import React, {useState} from 'react';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Divider, Textarea} from "@nextui-org/react";
import styles  from './AddReviewButton.module.scss';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BasicRating from '../ListCard/Overall';


const RateReviewButton = ({
    businessId,
    businessName,
    businessType,
    businessPriceRange,
    getBusinessInfo,
    isOpen,
    onOpen,
    onClose,
    isButtonVisible = true, // default to true for backward compatibility
}) => {
    const [rating, setRating] = useState(2);
    const [review, setReview] = useState("");

    const submitReview = async () => {
        const reviewData = {
            body: review,
            value: rating,
            business_id: businessId,
            net_id: "ded42" // hard code, change
        }
        
        try {
            if (review != ""){
                const reviewResponse = await fetch('/postReview', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(reviewData), 
                });

                if (reviewResponse.ok) {
                    //console.log('Review posted successfully');
                    getBusinessInfo();
                } else {
                    console.error('Failed to post review');
                }
            }
        } catch (error) {
          console.error('Error while posting review:', error);
        }
      };
      

    return (
        <div className={styles.footerButtonWrapper}>
            {isButtonVisible && (
                <button data-testid="RateReviewButton" className={styles.reviewbutton} onClick={onOpen}>
                    <AddCircleIcon className='reviewicon'/>
                </button>
            )}
            <Modal 
                size={"full"}
                isOpen={isOpen} 
                placement={"bottom"}
                onOpenChange={onClose} 
                scrollBehavior={"inside"}
                data-testid="RateReviewButtonModal"
                >
                <ModalContent>
                    {(onClose) => (
                        <>
                        <ModalHeader className={styles.header}>
                        <h4 className={styles.restaurantname}>{businessName}</h4>
                        <h7 className={styles.restaurantdescription}>{businessType} | {businessPriceRange}</h7>

                        </ModalHeader>
                        <ModalBody>
                            <Divider
                                orientation="horizontal"
                                className={styles.divider}
                            >
                            </Divider>
              

                            <p class={styles.textsize}>
                                Overall Experience?
                            </p>
                            <div className={styles.food}>
                               <BasicRating
                                    onRatingChange={(newRating) => {
                                        setRating(newRating);
                                    }} 
                               />
                            </div>

                            <Divider
                                orientation="horizontal"
                                className={styles.divider}
                            >
                            </Divider>

                            <Divider
                                orientation="horizontal"
                                className={styles.divider}
                            >
                            </Divider>

                            {/* Input for experience */}
                            <p class={styles.textsize}>
                                Tell us about your experience
                            </p>
                            <div className={styles.experience}>
                                
                                <Textarea 
                                placeholder="Write your review here"
                                onChange={(event) => {
                                    setReview(event.target.value); 
                                }}
                                />
                            </div>
                            
                        </ModalBody>
                        <ModalFooter className={styles.footer}>
                           
                            <Button data-testid="AddReview" className={styles.apply} onClick={() => { submitReview(); onClose(); }}>
                                Add Review
                            </Button>
                        </ModalFooter>
                    </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default RateReviewButton;
