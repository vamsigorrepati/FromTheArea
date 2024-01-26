import ProfileButton from './ProfileButton';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';



test('should render profile component', () => {
    render(<ProfileButton/>);
    const profile = screen.getByTestId('profile');
    expect(profile).toBeInTheDocument();
});

