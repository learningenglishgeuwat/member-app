/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HighlightVisibilityToggle } from '../HighlightVisibilityToggle';

describe('HighlightVisibilityToggle', () => {
  it('renders the orange highlight switch', () => {
    render(<HighlightVisibilityToggle checked={true} onChange={jest.fn()} color="orange" />);

    expect(screen.getByText('Orange Highlight')).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Orange Highlight visibility' })).toBeChecked();
  });

  it('renders the magenta highlight switch', () => {
    render(<HighlightVisibilityToggle checked={false} onChange={jest.fn()} color="magenta" />);

    expect(screen.getByText('Magenta Highlight')).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Magenta Highlight visibility' })).not.toBeChecked();
  });

  it('calls onChange with the next checked state', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<HighlightVisibilityToggle checked={false} onChange={handleChange} color="orange" />);

    await user.click(screen.getByRole('switch', { name: 'Orange Highlight visibility' }));

    expect(handleChange).toHaveBeenCalledWith(true);
  });
});
