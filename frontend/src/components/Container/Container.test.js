import Container from './Container';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';


test('should render container component', () => {
    render(<Container/>);
    const container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
});