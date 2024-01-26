import ReviewList from './ReviewList';
import {render, screen, within} from '@testing-library/react';

const review = {
    userName: "Claire",
    userRating: 4,
    userReview: "Great place"
}

describe("ReviewList tests", () => {
    test('should render ReviewList component', () => {
        render(<ReviewList review={review}/>);
        const reviewList = screen.getByTestId('reviewList');
        expect(reviewList).toBeDefined();
    });

    describe('ReviewList should display correct review information', () => {
        test('display review', () => {
            render(<ReviewList review={review}/>);
            const {getByText} = within(screen.getByTestId('review'));
            expect(getByText('Great place')).toBeInTheDocument();
        });

        test('display review user', () => {
            render(<ReviewList review={review}/>);
            expect(screen.getByTestId('avatar')).toBeInTheDocument();
        });

        test('display review rating', () => {
            render(<ReviewList review={review}/>);
            expect(screen.getByTestId('rating')).toBeInTheDocument();
        });
    });
   
})