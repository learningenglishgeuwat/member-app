/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IpaVisibilityToggle } from '../IpaVisibilityToggle';

describe('IpaVisibilityToggle', () => {
  it('renders the default IPA label', () => {
    render(<IpaVisibilityToggle checked={true} onChange={jest.fn()} />);

    expect(screen.getByText('IPA')).toBeInTheDocument();
  });

  it('reflects checked state as an accessible switch', () => {
    render(<IpaVisibilityToggle checked={true} onChange={jest.fn()} />);

    const switchInput = screen.getByRole('switch', { name: 'IPA visibility' });
    expect(switchInput).toBeChecked();
  });

  it('calls onChange with the next checked state', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<IpaVisibilityToggle checked={false} onChange={handleChange} />);

    await user.click(screen.getByRole('switch', { name: 'IPA visibility' }));

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('supports custom label and className', () => {
    const { container } = render(
      <IpaVisibilityToggle
        checked={false}
        onChange={jest.fn()}
        label="Phonetics"
        className="custom-toggle"
      />,
    );

    expect(screen.getByText('Phonetics')).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Phonetics visibility' })).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('custom-toggle');
  });

  it('does not call onChange while disabled', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<IpaVisibilityToggle checked={false} onChange={handleChange} disabled />);

    await user.click(screen.getByRole('switch', { name: 'IPA visibility' }));

    expect(handleChange).not.toHaveBeenCalled();
  });
});
