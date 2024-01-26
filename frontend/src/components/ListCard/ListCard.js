import React, {useState, useEffect} from "react";
import { HeartIcon } from "../../../public/HeartIcon.js"
import { IconCall } from "../../../public/IconCall.js"
import { IconWeb } from "../../../public/IconWeb.js"
import {
    Card,
    CardHeader,
    CardFooter,
    Divider,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Button,
    useDisclosure,
    Chip,
} from "@nextui-org/react";
import ReviewCard from "@components/ReviewCard";
import Rating from '@mui/material/Rating';
import styles from './ListCard.module.scss'
import MUIButton from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddReviewButton from '@components/AddReviewButton';
import ReviewList from "@components/ReviewList";

const ListCard = ( {business, isFavorite} ) => {
    let listCardClassName = styles.listCard
    let {id, name, address, lat, long, price, image, typ, avg, phone_number, website_url, distance } = business
    if (!typ) {
        typ = "Restauraunt"
    } else {
        typ = typ.charAt(0).toUpperCase() + typ.slice(1);
    }
    const [favorited, setFavorite] = useState(isFavorite); //false will be replaced with alreadyFavorite
    const [averageRating, setAverageRating] = useState(0);
    const [numOfReviews, setNumOfReviews] = useState(0);
    const [reviews, setReviews] = useState([]);
    let opened = true

    const getBusinessInfo = () => {
        const apiURL = "/queryReviews?" +
        `businessid=${id}`

        fetch(apiURL)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Bad response");
            }
        })
        .then((data) => {
            if (data != null){
                const businessReviews = data
                    .filter((item) => item.body !== "")
                    .map((item) => ({
                        userName: item.user_netid,
                        userRating: item.value.toString(),
                        userReview: item.body,
                }));
                const businessRatings = data.map((item) => item.value);
                const avg = businessRatings.length > 0 ? businessRatings.reduce((sum, rating) => sum + rating, 0) / businessRatings.length : 0;
                
                setAverageRating(avg);
                setNumOfReviews(businessReviews.length);
                setReviews(businessReviews);
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }

    useEffect(() => {
        getBusinessInfo();
    }, []); 

    const toggleFavorite = () => {
        const method = favorited ? 'DELETE' : 'POST';

        const data = {
            business_id: id
        }

        fetch('/postLike', {
            method: method,
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), 
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Bad response");
            }
        })
        .then((data) => {
            setFavorite(!favorited);
        })
        .catch((error) => {
            console.error(error);
        });   
    };


    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => {
        setShowModal(false);
    };

    const [showReviewModal, setShowReviewModal] = useState(false);
    const handleShowAddReviewModal = () => {
        setShowAddReviewModal(true);
      };
    
      const handleCloseAddReviewModal = () => {
        setShowAddReviewModal(false);
      };

    const [showAddReviewModal, setShowAddReviewModal] = useState(false);

    const handleShowReviewModal = () => {
        setShowReviewModal(false);
    };
        
    return (
        <>
            <Card
                radius="lg"
                variant="bordered"
                className={listCardClassName}
                isPressable
                onPress={() => setShowModal(true)}
                data-testid="listCard"
            >
                <CardHeader>
                    <Button
                        isIconOnly
                        className={styles.heartIcon}
                        radius="full"
                        variant="light"
                        onPress={toggleFavorite}
                        data-testid="favoriteButton"
                    >
                        <HeartIcon
                            fill={favorited ? "currentColor" : "none"}
                        />
                    </Button>
                </CardHeader>
                <CardFooter className={styles.footer}>
                    <h4 className={styles.name} data-testid="name">{name}</h4>
                    <div className={styles.row1}>
                        <p className={styles.typ} data-testid="type"> 
                            {typ}
                        </p>
                        <Divider flexItem className={styles.divider} orientation="vertical" />
                        <p className={styles.price} data-testid="price"> 
                            {price}
                        </p>
                    </div>
                    <div className={styles.row2}>
                            <div className={styles.leftAlign}>
                                <p className={styles.distance}> {Math.round(distance*10)/10} miles</p>
                            <Divider flexItem className={styles.divider} orientation="vertical" />
                        </div>
                        <h5 className={styles.rating} data-testid="average">{averageRating.toFixed(1)}</h5>
                    </div>
                </CardFooter>
            </Card>
            <Modal
                isOpen={showModal}
                onClose={handleShowModal}
                scrollBehavior="inside"
                backdrop="blur"
                size="3xl"
                data-testid="detailModal"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className={styles.detailHeader}>
                                <h3 className={styles.detailName}>{name}</h3>
                                <div className="detailChips">
                                    <Chip className={styles.detailChips} size="sm">{typ}</Chip>
                                    <Chip className={styles.detailChips} size="sm">
                                        {price.length === 1 ? `\u00A0${price}\u00A0` : price}
                                    </Chip>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <div className={styles.callAndWeb}>
                                    {/* Call Button */}
                                    <MUIButton className={styles.callButton} href={phone_number} data-testid="callButton">
                                        <div className={styles.callIcon}>
                                            <IconCall marginTop="10px"/>
                                        </div>
                                        <p className={styles.callText}>Call</p>
                                    </MUIButton>

                                    {/* Website Button */}
                                    <MUIButton className={styles.webButton} href={website_url} data-testid="websiteButton">
                                        <div className={styles.webIcon}>
                                            <IconWeb marginTop="10px"/>
                                        </div>
                                        <p className={styles.webText}>Website</p>
                                    </MUIButton>

                                    {/* Add Review Button */}
                                    <MUIButton className={styles.reviewbutton} onClick={handleShowAddReviewModal}>
                                        <div className={styles.reviewicon}>
                                            <AddCircleIcon marginTop="10px"/>    
                                        </div>
                                        <p className={styles.reviewtext}>Review</p>
                                    </MUIButton>

                                    <AddReviewButton
                                        businessId={id}
                                        businessName={name}
                                        businessType={typ}
                                        businessPriceRange={price}
                                        getBusinessInfo={getBusinessInfo}  
                                        isOpen={showAddReviewModal}
                                        onOpen={handleShowAddReviewModal}
                                        onClose={handleCloseAddReviewModal}
                                        isButtonVisible={false}        
                                    />
                                </div>

                                <div>
                                    <div className={styles.ratingReviewRow1}>
                                        <h5>Ratings and Reviews</h5>
                                    </div>
                                    <div className={styles.ratingReviewRow2}>
                                        <Card
                                            shadow="sm"
                                            className={styles.reviewCard}
                                            radius="lg"
                                            variant="bordered"
                                            isPressable
                                            onPress={() => setShowReviewModal(true)}
                                            data-testid="ratingCard"
                                        >
                                            <CardHeader>
                                                <p className={styles.ratingsHeader}>Yale</p>
                                            </CardHeader>
                                            <CardFooter className={styles.ratingCardFooter}>
                                                <Rating className={styles.ratingModule} precision={0.5} value={averageRating} size="small" readOnly/>
                                                <div className={styles.ratingAndNum}>
                                                    <h6 className={styles.averageRating} data-testid="starRating">{averageRating.toFixed(1)}</h6>
                                                    <p className={styles.numReviews} data-testid="numReviews">{"(" + numOfReviews + ")"}</p>
                                                </div>
                                            </CardFooter>
                                        </Card>

                                        <Modal
                                            isOpen={showReviewModal}
                                            onClose={handleShowReviewModal}
                                            scrollBehavior="inside"
                                            size="full"
                                            data-testid="allReview"
                                        >
                                                <ModalContent>
                                                    {(onClose) => (
                                                        <>
                                                        <ModalHeader>All Reviews</ModalHeader>
                                                        <ModalBody>
                                                            <div>
                                                                {reviews.map((review, index) => (
                                                                    <ReviewList key={index} review={review}/>
                                                                ))}
                                                            </div>
                                                        </ModalBody>
                                                        </>
                                                    )}
                                                </ModalContent>
                                        </Modal>
                                        <div className={styles.reviewsCarousel}>
                                            {reviews.map((review, index) => (
                                                <ReviewCard key={index} review={review} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default ListCard;

