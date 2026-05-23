/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { IpaText } from '../IpaText';

describe('IpaText', () => {
  it('renders children correctly', () => {
    render(<IpaText>/ʌ/</IpaText>);
    expect(screen.getByText('/ʌ/')).toBeInTheDocument();
  });

  it('applies font-ipa class by default', () => {
    const { container } = render(<IpaText>/ʌ/</IpaText>);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('font-ipa');
  });

  it('applies additional className', () => {
    render(<IpaText className="text-lg">/aɪ θɔːt ə θɔːt/</IpaText>);
    const element = screen.getByText('/aɪ θɔːt ə θɔːt/');
    expect(element).toHaveClass('font-ipa', 'text-lg');
  });

  it('renders as span by default', () => {
    const { container } = render(<IpaText>/ʌ/</IpaText>);
    const element = container.firstChild as HTMLElement;
    expect(element.tagName).toBe('SPAN');
  });

  it('renders as div when as="div"', () => {
    const { container } = render(<IpaText as="div">/ʌ/</IpaText>);
    const element = container.firstChild as HTMLElement;
    expect(element.tagName).toBe('DIV');
  });

  it('renders as p when as="p"', () => {
    const { container } = render(<IpaText as="p">/ʌ/</IpaText>);
    const element = container.firstChild as HTMLElement;
    expect(element.tagName).toBe('P');
  });

  it('sets lang attribute to und-fonipa', () => {
    const { container } = render(<IpaText>/ʌ/</IpaText>);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveAttribute('lang', 'und-fonipa');
  });

  it('sets data-ipa attribute', () => {
    const { container } = render(<IpaText>/ʌ/</IpaText>);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveAttribute('data-ipa');
  });

  it('sets aria-label from string children', () => {
    const { container } = render(<IpaText>/ʌ/</IpaText>);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveAttribute('aria-label', '/ʌ/');
  });

  it('allows custom aria-label override', () => {
    const { container } = render(
      <IpaText aria-label="schwa sound">/ʌ/</IpaText>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveAttribute('aria-label', 'schwa sound');
  });

  it('handles onClick event', () => {
    const handleClick = jest.fn();
    const { container } = render(
      <IpaText onClick={handleClick}>/ʌ/</IpaText>
    );
    const element = container.firstChild as HTMLElement;
    element.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom style', () => {
    const { container } = render(
      <IpaText style={{ color: 'red' }}>/ʌ/</IpaText>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveStyle({ color: 'red' });
  });

  it('renders complex children', () => {
    render(
      <IpaText>
        /aɪ <span className="highlight">θ</span>ɔːt/
      </IpaText>
    );
    expect(screen.getByText('θ')).toBeInTheDocument();
  });
});
