/**
 * Preservation Property Tests for Vocabulary Card Border Visibility Bugfix
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
 * 
 * These tests verify that all visual effects and interactions remain unchanged
 * when fixing the border opacity bug. Tests are run on UNFIXED code first to
 * establish baseline behavior, then re-run after the fix to ensure no regressions.
 * 
 * Property 2: Preservation - Visual Effects and Interactions Unchanged
 */

import * as fc from 'fast-check';
import { JSDOM } from 'jsdom';
import * as fs from 'fs';
import * as path from 'path';

// Load CSS files
const vocabularyCssPath = path.join(__dirname, 'vocabulary.css');
const vocabularyColorCssPath = path.join(__dirname, 'vocabulary-color.css');
const vocabularyCss = fs.readFileSync(vocabularyCssPath, 'utf-8');
const vocabularyColorCss = fs.readFileSync(vocabularyColorCssPath, 'utf-8');

/**
 * Helper function to create a DOM environment with CSS loaded
 */
function createDOMWithCSS(): JSDOM {
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>${vocabularyCss}</style>
        <style>${vocabularyColorCss}</style>
      </head>
      <body>
        <div class="vocab-page"></div>
      </body>
    </html>
  `);
  return dom;
}

/**
 * Helper function to extract RGB values from rgba() string
 */
function extractRGB(rgbaString: string): { r: number; g: number; b: number } | null {
  const match = rgbaString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return null;
  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
  };
}

describe('Vocabulary Card Preservation Property Tests', () => {
  describe('Property 2.1: RGB Values Preserved (Only Opacity Changes)', () => {
    /**
     * Test that RGB values of border colors remain the same for each card type
     * Only the alpha/opacity channel should change in the fix
     */
    it('should preserve RGB values for vocab-topic-card border', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const dom = createDOMWithCSS();
          const document = dom.window.document;
          const container = document.querySelector('.vocab-page') as HTMLElement;
          
          const card = document.createElement('div');
          card.className = 'vocab-topic-card';
          container.appendChild(card);
          
          const computedStyle = dom.window.getComputedStyle(card);
          const borderColor = computedStyle.borderColor || computedStyle.borderTopColor;
          
          const rgb = extractRGB(borderColor);
          
          // Expected RGB values for vocab-topic-card: rgba(110, 255, 141, ...)
          expect(rgb).not.toBeNull();
          expect(rgb!.r).toBe(110);
          expect(rgb!.g).toBe(255);
          expect(rgb!.b).toBe(141);
        })
      );
    });

    it('should preserve RGB values for vocab-card border', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const dom = createDOMWithCSS();
          const document = dom.window.document;
          const container = document.querySelector('.vocab-page') as HTMLElement;
          
          const card = document.createElement('div');
          card.className = 'vocab-card';
          container.appendChild(card);
          
          const computedStyle = dom.window.getComputedStyle(card);
          const borderColor = computedStyle.borderColor || computedStyle.borderTopColor;
          
          const rgb = extractRGB(borderColor);
          
          // Expected RGB values for vocab-card: rgba(110, 255, 141, ...)
          expect(rgb).not.toBeNull();
          expect(rgb!.r).toBe(110);
          expect(rgb!.g).toBe(255);
          expect(rgb!.b).toBe(141);
        })
      );
    });

    it('should preserve RGB values for vocab-color-card default theme', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const dom = createDOMWithCSS();
          const document = dom.window.document;
          const container = document.querySelector('.vocab-page') as HTMLElement;
          
          const card = document.createElement('div');
          card.className = 'vocab-card vocab-color-card';
          container.appendChild(card);
          
          const computedStyle = dom.window.getComputedStyle(card);
          const borderColor = computedStyle.borderColor || computedStyle.borderTopColor;
          
          const rgb = extractRGB(borderColor);
          
          // Expected RGB values for default theme: rgba(168, 235, 255, ...)
          expect(rgb).not.toBeNull();
          expect(rgb!.r).toBe(168);
          expect(rgb!.g).toBe(235);
          expect(rgb!.b).toBe(255);
        })
      );
    });
  });

  describe('Property 2.2: Layout Properties Preserved', () => {
    /**
     * Test that border-width, border-radius, padding, and spacing remain unchanged
     */
    it('should preserve border-width for all card types', () => {
      const cardClasses = [
        'vocab-topic-card',
        'vocab-card',
        'vocab-card vocab-color-card',
      ];

      fc.assert(
        fc.property(fc.constantFrom(...cardClasses), (cardClass) => {
          const dom = createDOMWithCSS();
          const document = dom.window.document;
          const container = document.querySelector('.vocab-page') as HTMLElement;
          
          const card = document.createElement('div');
          card.className = cardClass;
          container.appendChild(card);
          
          const computedStyle = dom.window.getComputedStyle(card);
          const borderWidth = computedStyle.borderWidth || computedStyle.borderTopWidth;
          
          // All cards should have 1px border
          expect(borderWidth).toBe('1px');
        })
      );
    });

    it('should preserve border-radius for all card types', () => {
      const cardClasses = [
        'vocab-topic-card',
        'vocab-card',
        'vocab-card vocab-color-card',
      ];

      fc.assert(
        fc.property(fc.constantFrom(...cardClasses), (cardClass) => {
          const dom = createDOMWithCSS();
          const document = dom.window.document;
          const container = document.querySelector('.vocab-page') as HTMLElement;
          
          const card = document.createElement('div');
          card.className = cardClass;
          container.appendChild(card);
          
          const computedStyle = dom.window.getComputedStyle(card);
          const borderRadius = computedStyle.borderRadius;
          
          // All cards should have 0.9rem border-radius (approximately 14.4px at 16px base)
          expect(borderRadius).toMatch(/14\.4px|0\.9rem/);
        })
      );
    });

    it('should preserve padding for vocab-topic-card', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const dom = createDOMWithCSS();
          const document = dom.window.document;
          const container = document.querySelector('.vocab-page') as HTMLElement;
          
          const card = document.createElement('div');
          card.className = 'vocab-topic-card';
          container.appendChild(card);
          
          const computedStyle = dom.window.getComputedStyle(card);
          const padding = computedStyle.padding;
          
          // vocab-topic-card should have 1.1rem padding (approximately 17.6px)
          expect(padding).toMatch(/17\.6px|1\.1rem/);
        })
      );
    });

    it('should preserve padding for vocab-card', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const dom = createDOMWithCSS();
          const document = dom.window.document;
          const container = document.querySelector('.vocab-page') as HTMLElement;
          
          const card = document.createElement('div');
          card.className = 'vocab-card';
          container.appendChild(card);
          
          const computedStyle = dom.window.getComputedStyle(card);
          const padding = computedStyle.padding;
          
          // vocab-card should have 1rem padding (16px)
          expect(padding).toMatch(/16px|1rem/);
        })
      );
    });
  });

  describe('Property 2.3: Box-Shadow Values Preserved', () => {
    /**
     * Test that box-shadow layers remain unchanged
     */
    it('should preserve box-shadow for vocab-topic-card', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const dom = createDOMWithCSS();
          const document = dom.window.document;
          const container = document.querySelector('.vocab-page') as HTMLElement;
          
          const card = document.createElement('div');
          card.className = 'vocab-topic-card';
          container.appendChild(card);
          
          const computedStyle = dom.window.getComputedStyle(card);
          const boxShadow = computedStyle.boxShadow;
          
          // Should have box-shadow defined
          expect(boxShadow).toBeDefined();
          expect(boxShadow).not.toBe('none');
          
          // Should contain the characteristic green glow
          expect(boxShadow).toMatch(/rgba?\(.*110.*255.*141/);
        })
      );
    });

    it('should preserve box-shadow for vocab-card', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const dom = createDOMWithCSS();
          const document = dom.window.document;
          const container = document.querySelector('.vocab-page') as HTMLElement;
          
          const card = document.createElement('div');
          card.className = 'vocab-card';
          container.appendChild(card);
          
          const computedStyle = dom.window.getComputedStyle(card);
          const boxShadow = computedStyle.boxShadow;
          
          // Should have box-shadow defined
          expect(boxShadow).toBeDefined();
          expect(boxShadow).not.toBe('none');
          
          // Should contain multiple shadow layers
          expect(boxShadow).toMatch(/rgba?\(.*110.*255.*141/);
        })
      );
    });
  });

  describe('Property 2.4: Background Gradients Preserved', () => {
    /**
     * Test that gradient backgrounds and backdrop-filter remain unchanged
     */
    it('should preserve background gradient for vocab-topic-card', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const dom = createDOMWithCSS();
          const document = dom.window.document;
          const container = document.querySelector('.vocab-page') as HTMLElement;
          
          const card = document.createElement('div');
          card.className = 'vocab-topic-card';
          container.appendChild(card);
          
          const computedStyle = dom.window.getComputedStyle(card);
          const background = computedStyle.background || computedStyle.backgroundImage;
          
          // Should have linear-gradient
          expect(background).toMatch(/linear-gradient/);
          expect(background).toMatch(/155deg/);
        })
      );
    });

    it('should preserve background gradient for vocab-card', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const dom = createDOMWithCSS();
          const document = dom.window.document;
          const container = document.querySelector('.vocab-page') as HTMLElement;
          
          const card = document.createElement('div');
          card.className = 'vocab-card';
          container.appendChild(card);
          
          const computedStyle = dom.window.getComputedStyle(card);
          const background = computedStyle.background || computedStyle.backgroundImage;
          
          // Should have linear-gradient
          expect(background).toMatch(/linear-gradient/);
          expect(background).toMatch(/155deg/);
        })
      );
    });

    it('should preserve backdrop-filter for vocab-card', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const dom = createDOMWithCSS();
          const document = dom.window.document;
          const container = document.querySelector('.vocab-page') as HTMLElement;
          
          const card = document.createElement('div');
          card.className = 'vocab-card';
          container.appendChild(card);
          
          const computedStyle = dom.window.getComputedStyle(card);
          const backdropFilter = computedStyle.backdropFilter || (computedStyle as any).webkitBackdropFilter;
          
          // Should have backdrop-filter with blur
          expect(backdropFilter).toMatch(/blur\(2px\)/);
        })
      );
    });
  });

  describe('Property 2.5: Theme Colors Preserved for vocab-color-card', () => {
    /**
     * Test that each theme maintains its characteristic RGB values
     */
    const themeTests = [
      { className: 'vocab-color-card--red', expectedRGB: { r: 255, g: 155, b: 162 } },
      { className: 'vocab-color-card--blue', expectedRGB: { r: 156, g: 199, b: 255 } },
      { className: 'vocab-color-card--green', expectedRGB: { r: 156, g: 255, b: 190 } },
      { className: 'vocab-color-card--yellow', expectedRGB: { r: 255, g: 240, b: 162 } },
      { className: 'vocab-color-card--black', expectedRGB: { r: 170, g: 180, b: 201 } },
    ];

    themeTests.forEach(({ className, expectedRGB }) => {
      it(`should preserve RGB values for ${className}`, () => {
        fc.assert(
          fc.property(fc.constant(null), () => {
            const dom = createDOMWithCSS();
            const document = dom.window.document;
            const container = document.querySelector('.vocab-page') as HTMLElement;
            
            const card = document.createElement('div');
            card.className = `vocab-card vocab-color-card ${className}`;
            container.appendChild(card);
            
            const computedStyle = dom.window.getComputedStyle(card);
            const borderColor = computedStyle.borderColor || computedStyle.borderTopColor;
            
            const rgb = extractRGB(borderColor);
            
            expect(rgb).not.toBeNull();
            expect(rgb!.r).toBe(expectedRGB.r);
            expect(rgb!.g).toBe(expectedRGB.g);
            expect(rgb!.b).toBe(expectedRGB.b);
          })
        );
      });
    });
  });

  describe('Property 2.6: Transition Properties Preserved', () => {
    /**
     * Test that transition animations remain unchanged
     */
    it('should preserve transition for vocab-topic-card', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const dom = createDOMWithCSS();
          const document = dom.window.document;
          const container = document.querySelector('.vocab-page') as HTMLElement;
          
          const card = document.createElement('div');
          card.className = 'vocab-topic-card';
          container.appendChild(card);
          
          const computedStyle = dom.window.getComputedStyle(card);
          const transition = computedStyle.transition;
          
          // Should have transition defined
          expect(transition).toBeDefined();
          expect(transition).toMatch(/border-color/);
          expect(transition).toMatch(/box-shadow/);
          expect(transition).toMatch(/transform/);
          expect(transition).toMatch(/0\.25s/);
        })
      );
    });

    it('should preserve transition for vocab-card', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const dom = createDOMWithCSS();
          const document = dom.window.document;
          const container = document.querySelector('.vocab-page') as HTMLElement;
          
          const card = document.createElement('div');
          card.className = 'vocab-card';
          container.appendChild(card);
          
          const computedStyle = dom.window.getComputedStyle(card);
          const transition = computedStyle.transition;
          
          // Should have transition defined
          expect(transition).toBeDefined();
          expect(transition).toMatch(/border-color/);
          expect(transition).toMatch(/box-shadow/);
          expect(transition).toMatch(/0\.25s/);
        })
      );
    });
  });

  describe('Property 2.7: State Classes Preserved', () => {
    /**
     * Test that .is-speaking and .is-active states maintain their visual effects
     */
    it('should preserve .is-speaking state for vocab-card', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const dom = createDOMWithCSS();
          const document = dom.window.document;
          const container = document.querySelector('.vocab-page') as HTMLElement;
          
          const card = document.createElement('div');
          card.className = 'vocab-card is-speaking';
          container.appendChild(card);
          
          const computedStyle = dom.window.getComputedStyle(card);
          const borderColor = computedStyle.borderColor || computedStyle.borderTopColor;
          const boxShadow = computedStyle.boxShadow;
          
          // .is-speaking should have enhanced border and shadow
          expect(borderColor).toMatch(/rgba?\(.*156.*255.*184/);
          expect(boxShadow).toBeDefined();
          expect(boxShadow).not.toBe('none');
        })
      );
    });

    it('should preserve .is-active state for vocab-phase-btn', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const dom = createDOMWithCSS();
          const document = dom.window.document;
          const container = document.querySelector('.vocab-page') as HTMLElement;
          
          const btn = document.createElement('button');
          btn.className = 'vocab-phase-btn is-active';
          container.appendChild(btn);
          
          const computedStyle = dom.window.getComputedStyle(btn);
          const borderColor = computedStyle.borderColor || computedStyle.borderTopColor;
          const boxShadow = computedStyle.boxShadow;
          
          // .is-active should have enhanced border and shadow
          expect(borderColor).toBeDefined();
          expect(boxShadow).toBeDefined();
          expect(boxShadow).not.toBe('none');
        })
      );
    });
  });
});
