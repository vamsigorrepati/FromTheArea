import ListCard from './ListCard';
import { render, screen, within, fireEvent } from '@testing-library/react';

const user = {
    net_id: "ck123",
    likes: {},
    review: {}
}

const business = {
    id: 20,
    name: "116 Crown", 
    price: '$$$', 
    typ: 'bar', 
    address: '116 Crown St, New Haven, CT 06510', 
    lat: 41.30443160180317, 
    long: -72.92621937116458,
    phone_number: "tel:123-456-7890",
    website_url: "https://www.116crown.com/"
}

const faulty_business = {
    id: 20,
    name: "116 Crown", 
    price: '$$$', 
    typ: null, 
    address: '116 Crown St, New Haven, CT 06510', 
    lat: 41.30443160180317, 
    long: -72.92621937116458,
    phone_number: "tel:123-456-7890",
    website_url: "https://www.116crown.com/"
}

describe("ListCard tests", () => {
    beforeEach(() => {
        fetchMock.doMock()
        fetch.resetMocks()
    });

    test('should render listCard component', () => {
        const {getByTestId} = render(<ListCard business={business}/>);
        const listCard = getByTestId("listCard");
        expect(listCard).toBeDefined();
    });

    test('business fetching', async () => {
        const mockData = [
            {
                user_netid: "ck733",
                value: 4.3,
                body: "Good place to eat"
            },
        ];
        fetch.mockResponseOnce(JSON.stringify(mockData));
        render(<ListCard business={business}/>);

        expect(fetchMock).toHaveBeenCalledWith('/queryReviews?businessid=20');
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });
    
    describe('Listcard should display correct business information', () => {
        test('display business name', () => {
            render(<ListCard business={business}/>);
            const {getByText} = within(screen.getByTestId("name"));
            expect(getByText('116 Crown')).toBeInTheDocument();
        });
    
        test('display business price', () => {
            render(<ListCard business={business}/>);
            const {getByText} = within(screen.getByTestId("price"));
            expect(getByText('$$$')).toBeInTheDocument();
        });
    
        test('display business type', () => {
            render(<ListCard business={business}/>);
            const {getByText} = within(screen.getByTestId("type"));
            expect(getByText('Bar')).toBeInTheDocument();
        });
    
        test('display business average review', () => {
            render(<ListCard business={business}/>);
            const {getByText} = within(screen.getByTestId("average"));
            expect(getByText('0.0')).toBeInTheDocument();
        });

        test('faulty type should set to Restauraunt', () => {
            render(<ListCard business={faulty_business}/>);
            const {getByText} = within(screen.getByTestId("type"));
            expect(getByText('Restauraunt')).toBeInTheDocument();
        })

    });
    
    // test('clicking favorite button adds business to user likes', () => {

    // });
    
    describe('Detail view upon clicking on card', () => {
        test('should render modal upon click', () => {
            const {getByTestId} = render(<ListCard business={business}/>);
            const listCard = getByTestId("listCard"); 
            fireEvent.click(listCard);
            expect(getByTestId('detailModal')).toBeInTheDocument();
        });

        test('call button calls business', () => {
            const {getByTestId} = render(<ListCard business={business}/>);
            const listCard = getByTestId("listCard");
            fireEvent.click(listCard);
            const call = getByTestId("callButton");
            expect(call.href).toBe("tel:123-456-7890");
        });

        test('website button redirects to website', () => {
            const {getByTestId} = render(<ListCard business={business}/>);
            const listCard = getByTestId("listCard");
            fireEvent.click(listCard);
            const call = getByTestId("websiteButton");
            expect(call.href).toBe("https://www.116crown.com/");
        });
    });   
    
    describe('Rating and review section tests', () => {
        test('should render review card within detail', () => {
            const {getByTestId} = render(<ListCard business={business}/>);
            const listCard = getByTestId("listCard"); 
            fireEvent.click(listCard);
            expect(getByTestId('ratingCard')).toBeInTheDocument();
        });

        test('should open up all reviews upon click', () => {
            const {getByTestId} = render(<ListCard business={business}/>);
            const listCard = getByTestId("listCard"); 
            fireEvent.click(listCard);
            const reviewCard = getByTestId('ratingCard');
            fireEvent.click(reviewCard);
            expect(getByTestId('allReview')).toBeInTheDocument();
        });

        test('display average rating', () => {
            const {getByTestId} = render(<ListCard business={business}/>);
            const listCard = getByTestId("listCard"); 
            fireEvent.click(listCard);
            const {getByText} = within(screen.getByTestId("starRating"));
            expect(getByText('0.0')).toBeInTheDocument();
        });

        test('display number of ratings', () => {
            const {getByTestId} = render(<ListCard business={business}/>);
            const listCard = getByTestId("listCard"); 
            fireEvent.click(listCard);
            const {getByText} = within(screen.getByTestId("numReviews"));
            expect(getByText('(0)')).toBeInTheDocument();
        });
    });

})

