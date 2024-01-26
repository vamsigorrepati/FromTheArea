import Sort from './Sort';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';


test('should render sort button', () => {
    render(<Sort/>);
    const sort = screen.getByTestId('sort');
    expect(sort).toBeInTheDocument();
});

describe('test sort functionality', () => {
    beforeEach(() => {
        fetchMock.doMock()
        fetch.resetMocks()
    });

    const mockSort = jest.fn();

  
   

    test('sort by rating', async () => {
        
        render(<Sort onSortChange={mockSort}/>);

        fireEvent.click(screen.getByTestId('sort'));
        fireEvent.click(screen.getByText('Rating'));

        expect(mockSort).toHaveBeenCalledWith(
            "Rating"
        );

        
    });

    test('sort by price ascending', async () => {
        
        render(<Sort onSortChange={mockSort}/>);

        fireEvent.click(screen.getByTestId('sort'));
        fireEvent.click(screen.getByText('Price ↑'));

        expect(mockSort).toHaveBeenCalledWith(
            "PriceAsc"
        );
    });

    test('sort by price descending', async () => {
        
        render(<Sort onSortChange={mockSort}/>);

        fireEvent.click(screen.getByTestId('sort'));
        fireEvent.click(screen.getByText('Price ↓'));

        expect(mockSort).toHaveBeenCalledWith(
            "PriceDesc"
        );
    });

    test('sort by distance', async () => {
        
        render(<Sort onSortChange={mockSort}/>);

        fireEvent.click(screen.getByTestId('sort'));
        fireEvent.click(screen.getByText('Distance'));

        expect(mockSort).toHaveBeenCalledWith(
            "Distance"
        );
        expect(screen.getByText('Distance')).toBeInTheDocument();

    })
})






