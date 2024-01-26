import Search from './Search';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';

test('should render search component', () => {
    render(<Search/>);
    const search = screen.getByTestId('search-1');
    expect(search).toBeInTheDocument();
});



describe('test search functionality', () => {
    test('updates on change', () => {
        const setSearch = jest.fn((value) => {})
        const {queryByPlaceholderText} = render(<Search onSearch={setSearch}/>)
        const searchInput = queryByPlaceholderText('Search Restaurant')
        fireEvent.change(searchInput, {target: {value: 'test'}})
        expect(searchInput.value).toBe('test')
    });
})

