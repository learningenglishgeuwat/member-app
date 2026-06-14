import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { renderHighlightedWord } from '../highlightHelpers';

describe('highlightHelpers.renderHighlightedWord', () => {
  it('renders mixed string and index patterns correctly', () => {
    const markup = renderToStaticMarkup(
      <>{renderHighlightedWord('condition', ['ion', '1'], 'ə', { color: 'red' } as React.CSSProperties)}</>
    );

    expect(markup).toContain('c<span class="symbol-letter-highlight" style="color:red">o</span>nd');
    expect(markup).toContain('<span class="symbol-letter-highlight" style="color:red">ion</span>');
  });

  it('renders o_e pattern by highlighting only o and e', () => {
    const markup = renderToStaticMarkup(
      <>{renderHighlightedWord('love', ['o_e'], 'o', { color: 'orange' } as React.CSSProperties)}</>
    );

    expect(markup).toContain('l<span class="symbol-letter-highlight" style="color:orange">o</span>v<span class="symbol-letter-highlight" style="color:orange">e</span>');
    expect(markup).not.toContain('<span class="symbol-letter-highlight" style="color:orange">ove</span>');
  });
});
