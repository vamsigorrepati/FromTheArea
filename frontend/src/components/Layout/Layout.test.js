import Layout from './Layout';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';


test('should render layout component', () => {
    const childrenMock = jest.fn();
    const classNameMock = jest.fn();
    const mapViewMock = jest.fn();
    const listViewMock = jest.fn();
    const isMapViewMock = jest.fn();
    render(<Layout children={childrenMock} className={classNameMock}
        mapView={mapViewMock} listView={listViewMock} isMapView={isMapViewMock} />);
    const layout = screen.getByTestId('layout');
    expect(layout).toBeInTheDocument();
});