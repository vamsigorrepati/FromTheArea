
import Filter from './Filter';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';



test('should render filter button', () => {
    render(<Filter/>);
    const filter = screen.getByTestId('filter-1');
    expect(filter).toBeInTheDocument();
});

describe('test filter functionality updated', () => {
    beforeEach(() => {
        fetchMock.doMock()
        fetch.resetMocks()
    });

    const mockLocations = jest.fn();
    const mockClear = jest.fn();
    

    test('filter with ratings 2,3,4,5, bar, happy hour, and price $$,$$$,$$$$', async () => {
        
       
        render(<Filter updateLocations={mockLocations}/>);


        fireEvent.click(screen.getByTestId('filter-1'));
        fireEvent.click(screen.getByTestId('restaurant-button'));
        fireEvent.click(screen.getByTestId('rating-1'));
        fireEvent.click(screen.getByTestId('price-1'));
 
        fireEvent.click(screen.getByTestId('apply'));
        
        
        expect(mockLocations).toHaveBeenCalledWith({
            prices: ["$$", "$$$", "$$$$"],
            types: ["Bar"],
            ratings: [2, 3, 4, 5],
            happyhour: false,
        });

    });

    test('filter with rating 1, restaurant, and $', async () => {

        
        render(<Filter updateLocations={mockLocations} updateClearFilters={mockClear}/>);
        fireEvent.click(screen.getByTestId('filter-1'));

        fireEvent.click(screen.getByTestId('bars-button'));
        fireEvent.click(screen.getByTestId('rating-2'));
        fireEvent.click(screen.getByTestId('rating-3'));
        fireEvent.click(screen.getByTestId('rating-4'));
        fireEvent.click(screen.getByTestId('rating-5'));

        fireEvent.click(screen.getByTestId('price-2'));
        fireEvent.click(screen.getByTestId('price-3'));
        fireEvent.click(screen.getByTestId('price-4'));

     


        fireEvent.click(screen.getByTestId('apply'));

        expect(mockLocations).toHaveBeenCalledWith({
            prices: ["$"],
            types: ["Restaurant"],
            ratings: [1],
            happyhour: false,
        });

        // test "else" statement for toggleRating and togglePrice
        fireEvent.click(screen.getByTestId('filter-1'));
        fireEvent.click(screen.getByTestId('rating-2'));
        fireEvent.click(screen.getByTestId('price-2'))
        fireEvent.click(screen.getByTestId('apply'));
        expect(mockLocations).toHaveBeenCalledWith({
            prices: ["$", "$$"],
            types: ["Restaurant"],
            ratings: [1, 2],
            happyhour: false,
        });
        
        
    });

    test('clear filter', async () => {

       
        render(<Filter updateLocations={mockLocations} updateClearFilters={mockClear}/>);
        fireEvent.click(screen.getByTestId('filter-1'));

        fireEvent.click(screen.getByTestId('bars-button'));
        fireEvent.click(screen.getByTestId('rating-2'));

        fireEvent.click(screen.getByTestId('apply'));


        // test clear
        fireEvent.click(screen.getByTestId('filter-1'));
        fireEvent.click(screen.getByTestId('clear'));

        expect(mockClear).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByTestId('filter-1'));
        fireEvent.click(screen.getByTestId('apply'));
        expect(mockLocations).toHaveBeenCalledWith({
            prices: ["$"],
            types: ["Restaurant"],
            ratings: [1],
            happyhour: false,
        });
        
    });


});



