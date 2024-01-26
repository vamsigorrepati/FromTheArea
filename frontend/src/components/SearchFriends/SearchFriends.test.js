
import SearchFriends from './SearchFriends';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';


test('should render search component', () => {
    render(<SearchFriends/>);
    const search = screen.getByTestId('searchfriends');
    expect(search).toBeInTheDocument();
});



describe('test search functionality', () => {
    test('updates on change', () => {
        const setSearch = jest.fn((value) => {})
        const {queryByPlaceholderText} = render(<SearchFriends onSearch={setSearch}/>)
        const searchInput = queryByPlaceholderText('Search Friends')
        fireEvent.change(searchInput, {target: {value: 'test'}})
        expect(searchInput.value).toBe('test')
    });

    
})