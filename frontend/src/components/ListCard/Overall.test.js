import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import BasicRating from './Overall';

describe('BasicRating Component Tests', () => {
    let valueOnChange;

    beforeEach(() => {
        valueOnChange = jest.fn();
    });

    test('renders BasicRating component', () => {
        render(<BasicRating onRatingChange={valueOnChange} />);
        const ratingStars = screen.getAllByRole('radio');
        expect(ratingStars).toHaveLength(6); // 5 stars + 1 hidden input for empty value
    });

    test('default rating value is 2', () => {
        render(<BasicRating onRatingChange={valueOnChange} />);
        const ratingStars = screen.getAllByRole('radio');
        expect(ratingStars[1].checked).toBe(true); // The second star represents a rating of 2
    });

    test('changes rating value on click', () => {
        render(<BasicRating onRatingChange={valueOnChange} />);

        const ratingStars = screen.getAllByRole('radio');
        fireEvent.click(ratingStars[3]); // Click the 4th star

        expect(ratingStars[3].checked).toBe(true);
    });

    test('calls onRatingChange when rating changes', () => {
        render(<BasicRating onRatingChange={valueOnChange} />);

        const ratingStars = screen.getAllByRole('radio');
        fireEvent.click(ratingStars[4]); // Click the 5th star

        expect(valueOnChange).toHaveBeenCalledWith(5);
    });
});
