import ReviewCard from './ReviewCard';
import { render, screen, within, fireEvent } from '@testing-library/react';

const review = {
    userName: "Claire",
    userRating: 4,
    userReview: "Great place"
}

describe("ReviewCard tests", () => {
    test('should render ReviewCard component', () => {
        const {getByTestId} = render(<ReviewCard review={review}/>);
        const reviewCard = getByTestId("reviewCard");
        expect(reviewCard).toBeDefined();
    });

    describe('ReviewCard should display correct review information', () => {
        test('display review', () => {
            render(<ReviewCard review={review}/>);
            const {getByText} = within(screen.getByTestId("review"));
            expect(getByText('Great place')).toBeInTheDocument();
        });
    
        test('display review user', () => {
            render(<ReviewCard review={review}/>);
            expect(screen.getByTestId("avatar")).toBeInTheDocument();
        });

        test('display review rating', () => {
            render(<ReviewCard review={review}/>);
            expect(screen.getByTestId("rating")).toBeInTheDocument();
        });
    });
})

