import React from 'react';
import { render, screen } from '@testing-library/react';
import StickyBar from './stickybar';

jest.mock('@components/Search', () => (props) => (
  <div data-testid="mock-search">
    <button onClick={() => props.onSearch('test')}>Search</button>
  </div>
));

jest.mock('@components/Profile', () => (props) => (
  <div data-testid="mock-profile">{props.user.name}</div>
));

describe('StickyBar Component Tests', () => {
    const mockOnSearch = jest.fn();
    const mockUser = { name: 'John Doe' };

    test('renders StickyBar component', () => {
        render(<StickyBar onSearch={mockOnSearch} user={mockUser} />);
        const footerElement = screen.getByRole('contentinfo');
        expect(footerElement).toBeInTheDocument();
    });

    test('contains Search and ProfileButton components', () => {
        render(<StickyBar onSearch={mockOnSearch} user={mockUser} />);
        const searchComponent = screen.getByTestId('mock-search');
        const profileComponent = screen.getByTestId('mock-profile');
        expect(searchComponent).toBeInTheDocument();
        expect(profileComponent).toBeInTheDocument();
    });

    test('passes onSearch prop to Search component', () => {
        render(<StickyBar onSearch={mockOnSearch} user={mockUser} />);
        const searchButton = screen.getByText('Search');
        searchButton.click();
        expect(mockOnSearch).toHaveBeenCalledWith('test');
    });

    test('passes user prop to ProfileButton component', () => {
        render(<StickyBar onSearch={mockOnSearch} user={mockUser} />);
        const profileComponent = screen.getByTestId('mock-profile');
        expect(profileComponent.textContent).toBe(mockUser.name);
    });
});
