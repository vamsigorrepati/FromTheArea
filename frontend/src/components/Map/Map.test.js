import Map from './Map';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';


test('should render map component', () => {
    render(<Map/>);
    const map = screen.getByTestId('map');
    expect(map).toBeInTheDocument();
});