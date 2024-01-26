import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RateReviewButton from './AddReviewButton';

jest.mock('node-fetch');

const mockOnOpen = jest.fn();
const mockOnClose = jest.fn();
const defaultProps = {
    businessId: "someBusinessId", // Mock any other necessary props here
    businessName: "Business Name",
    businessType: "Type",
    businessPriceRange: "Price Range",
    getBusinessInfo: jest.fn(),
    isOpen: false,
    onOpen: mockOnOpen,
    onClose: mockOnClose,
};

test('should render component', () => {
    render(<RateReviewButton {...defaultProps} />);
    const rateReviewButton = screen.getByTestId('RateReviewButton');
    expect(rateReviewButton).toBeInTheDocument();
});

test('opens modal when button is clicked', () => {
    render(<RateReviewButton {...defaultProps} />);
    fireEvent.click(screen.getByTestId('RateReviewButton'));

    expect(mockOnOpen).toHaveBeenCalled();
});

test('submits review when Add Review button is clicked', async () => {
    render(<RateReviewButton {...defaultProps} isOpen={true} />);
    
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Review posted successfully' }),
    });

    fireEvent.change(screen.getByPlaceholderText('Write your review here'), {
        target: { value: 'This is a great restaurant!' },
    });

    fireEvent.click(screen.getByTestId('AddReview'));

    await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
    });

    expect(global.fetch).toHaveBeenCalledWith('/postReview', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            body: 'This is a great restaurant!',
            value: 2, 
            business_id: defaultProps.businessId, 
            net_id: 'ded42',
        }),
    });
});

test('handles error during review submission', async () => {
    render(<RateReviewButton {...defaultProps} isOpen={true} />);    
    fireEvent.click(screen.getByTestId('RateReviewButton'));
    
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Failed to post review'));
    const consoleErrorSpy = jest.spyOn(console, 'error');

    fireEvent.change(screen.getByPlaceholderText('Write your review here'), {
        target: { value: 'This is a great restaurant!' },
    });

    fireEvent.click(screen.getByTestId('AddReview'));
    await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error while posting review:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
});
