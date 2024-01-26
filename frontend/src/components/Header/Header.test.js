import Header from './Header';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';



test('should render header component', () => {
    const mapViewMock = jest.fn();
    const listViewMock = jest.fn();
    const isMapViewMock = jest.fn();

    render(<Header mapView={mapViewMock} listView={listViewMock} 
        isMapView={isMapViewMock}/>);
    const header = screen.getByTestId('header');
    expect(header).toBeInTheDocument();
});