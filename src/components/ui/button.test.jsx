import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../components/ui/Button';

describe('Button Component', () => {
	test('renders button with text', () => {
		render(<Button>Click Me</Button>);
		const buttonElement = screen.getByText(/Click Me/i);
		expect(buttonElement).toBeInTheDocument();
	});

	test('button click triggers event', () => {
		const handleClick = jest.fn();
		render(<Button onClick={handleClick}>Click Me</Button>);
		const buttonElement = screen.getByText(/Click Me/i);
		fireEvent.click(buttonElement);
		expect(handleClick).toHaveBeenCalledTimes(1);
	});
});