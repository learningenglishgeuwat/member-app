/**
 * Preservation Property Tests for Vocabulary Card Border Visibility Fix
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
 * 
 * These tests verify that all visual effects and interactions remain unchanged
 * when the border opacity fix is applied. They capture the baseline behavior
 * on UNFIXED code and ensure no regressions occur.
 * 
 * IMPORTANT: These tests are EXPECTED TO PASS on unfixed code.
 * - Passing confirms baseline behavior to preserve
 * - Passing after fix confirms no regressions
 * 
 * Property-based testing is used to generate many test cases for stronger guarantees.
 */

const fs = require('fs');
const path = require('path');
const fc = require('fast-check');

describe('Preservation Property Tests: Vocabulary Card Border Visibility', () => {
  let vocabularyCss;
  let vocabularyColorCss;

  beforeAll(() => {
    // Read the CSS files
    vocabularyCss = fs.readFileSync(
      path.join(__dirname, 'vocabulary.css'),
      'utf-8'
    );
    vocabularyColorCss = fs.readFileSync(
      path.join(__dirname, 'vocabulary-color.css'),
      'utf-8'
    );
  });

  /**
   * Helper function to extract RGB values from rgba color string
   * @param {string} rgbaString - e.g., "rgba(110, 255, 141, 0.42)"
   * @returns {object} - {r, g, b, a} values
   */
  function extractRGBA(rgbaString) {
    const match = rgbaString.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/);
    if (!match) return null;
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
      a: parseFloat(match[4])
    };
  }

  /**
   * Helper function to extract border color from CSS rule
   * @param {string} css - CSS content
   * @param {string} selector - CSS selector
   * @returns {string|null} - rgba string or null if not found
   */
  function extractBorderColor(css, selector) {
    const selectorRegex = new RegExp(
      `${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]+)\\}`,
      'i'
    );
    const match = css.match(selectorRegex);
    
    if (!match) return null;
    
    const ruleContent = match[1];
    const borderMatch = ruleContent.match(/border:\s*[^;]*(rgba\([^)]+\))/i);
    
    return borderMatch ? borderMatch[1] : null;
  }

  /**
   * Helper function to extract CSS property value
   * @param {string} css - CSS content
   * @param {string} selector - CSS selector
   * @param {string} property - CSS property name
   * @returns {string|null} - property value or null if not found
   */
  function extractCSSProperty(css, selector, property) {
    const selectorRegex = new RegExp(
      `${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]+)\\}`,
      'i'
    );
    const match = css.match(selectorRegex);
    
    if (!match) return null;
    
    const ruleContent = match[1];
    const propertyRegex = new RegExp(`${property}:\\s*([^;]+);`, 'i');
    const propertyMatch = ruleContent.match(propertyRegex);
    
    return propertyMatch ? propertyMatch[1].trim() : null;
  }

  /**
   * Helper function to extract CSS variable value
   * @param {string} css - CSS content
   * @param {string} selector - CSS selector
   * @param {string} variable - CSS variable name
   * @returns {string|null} - variable value or null if not found
   */
  function extractCSSVariable(css, selector, variable) {
    const selectorRegex = new RegExp(
      `${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]+)\\}`,
      'i'
    );
    const match = css.match(selectorRegex);
    
    if (!match) return null;
    
    const ruleContent = match[1];
    const variableRegex = new RegExp(`${variable}:\\s*([^;]+);`, 'i');
    const variableMatch = ruleContent.match(variableRegex);
    
    return variableMatch ? variableMatch[1].trim() : null;
  }

  /**
   * Helper function to extract box-shadow value
   * @param {string} css - CSS content
   * @param {string} selector - CSS selector
   * @returns {string|null} - box-shadow value or null if not found
   */
  function extractBoxShadow(css, selector) {
    const selectorRegex = new RegExp(
      `${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]+)\\}`,
      's'
    );
    const match = css.match(selectorRegex);
    
    if (!match) return null;
    
    const ruleContent = match[1];
    // Match box-shadow including multi-line values
    const boxShadowMatch = ruleContent.match(/box-shadow:\s*([^;]+);/s);
    
    return boxShadowMatch ? boxShadowMatch[1].trim().replace(/\s+/g, ' ') : null;
  }

  describe('Property 2: Preservation - RGB Values Unchanged', () => {
    /**
     * Test that RGB values of border colors remain the same
     * Only opacity (alpha) should change, not the color itself
     */
    test('vocab-topic-card border RGB values should remain (110, 255, 141)', () => {
      const borderColor = extractBorderColor(vocabularyCss, '.vocab-topic-card');
      expect(borderColor).not.toBeNull();
      
      const rgba = extractRGBA(borderColor);
      expect(rgba).not.toBeNull();
      expect(rgba.r).toBe(110);
      expect(rgba.g).toBe(255);
      expect(rgba.b).toBe(141);
      // Note: opacity may change, but RGB should not
    });

    test('vocab-card border RGB values should remain (110, 255, 141)', () => {
      const borderColor = extractBorderColor(vocabularyCss, '.vocab-card');
      expect(borderColor).not.toBeNull();
      
      const rgba = extractRGBA(borderColor);
      expect(rgba).not.toBeNull();
      expect(rgba.r).toBe(110);
      expect(rgba.g).toBe(255);
      expect(rgba.b).toBe(141);
    });

    test('vocab-color-card default theme border RGB values should remain (168, 235, 255)', () => {
      const borderColor = extractCSSVariable(vocabularyColorCss, '.vocab-color-card', '--card-border');
      expect(borderColor).not.toBeNull();
      
      const rgba = extractRGBA(borderColor);
      expect(rgba).not.toBeNull();
      expect(rgba.r).toBe(168);
      expect(rgba.g).toBe(235);
      expect(rgba.b).toBe(255);
    });

    test('vocab-color-card black theme border RGB values should remain (170, 180, 201)', () => {
      const borderColor = extractCSSVariable(vocabularyColorCss, '.vocab-color-card--black', '--card-border');
      expect(borderColor).not.toBeNull();
      
      const rgba = extractRGBA(borderColor);
      expect(rgba).not.toBeNull();
      expect(rgba.r).toBe(170);
      expect(rgba.g).toBe(180);
      expect(rgba.b).toBe(201);
    });
  });

  describe('Property 2: Preservation - Box Shadow Unchanged', () => {
    /**
     * Test that box-shadow values remain unchanged
     */
    test('vocab-topic-card box-shadow should remain unchanged', () => {
      const boxShadow = extractBoxShadow(vocabularyCss, '.vocab-topic-card');
      expect(boxShadow).not.toBeNull();
      expect(boxShadow).toContain('0 0 0 1px rgba(110, 255, 141, 0.12)');
    });

    test('vocab-card box-shadow should remain unchanged', () => {
      const boxShadow = extractBoxShadow(vocabularyCss, '.vocab-card');
      expect(boxShadow).not.toBeNull();
      // Check for the multi-layer box-shadow
      expect(boxShadow).toContain('0 0 0 1px rgba(110, 255, 141, 0.14)');
      expect(boxShadow).toContain('0 0 14px rgba(57, 255, 20, 0.14)');
    });

    test('vocab-color-card box-shadow should remain unchanged', () => {
      const boxShadow = extractBoxShadow(vocabularyColorCss, '.vocab-color-card');
      expect(boxShadow).not.toBeNull();
      expect(boxShadow).toContain('0 0 0 1px');
      expect(boxShadow).toContain('color-mix');
    });
  });

  describe('Property 2: Preservation - Background Gradients Unchanged', () => {
    /**
     * Test that background gradients remain unchanged
     */
    test('vocab-topic-card background gradient should remain unchanged', () => {
      const background = extractCSSProperty(vocabularyCss, '.vocab-topic-card', 'background');
      expect(background).not.toBeNull();
      expect(background).toContain('linear-gradient');
      expect(background).toContain('rgba(8, 34, 14, 0.32)');
      expect(background).toContain('rgba(6, 22, 10, 0.22)');
    });

    test('vocab-card background gradient should remain unchanged', () => {
      const background = extractCSSProperty(vocabularyCss, '.vocab-card', 'background');
      expect(background).not.toBeNull();
      expect(background).toContain('linear-gradient');
      expect(background).toContain('rgba(8, 34, 14, 0.34)');
      expect(background).toContain('rgba(6, 21, 10, 0.22)');
    });

    test('vocab-color-card background gradient should remain unchanged', () => {
      const background = extractCSSProperty(vocabularyColorCss, '.vocab-color-card', 'background');
      expect(background).not.toBeNull();
      expect(background).toContain('linear-gradient');
      expect(background).toContain('var(--card-top)');
      expect(background).toContain('var(--card-bottom)');
    });
  });

  describe('Property 2: Preservation - Backdrop Filter Unchanged', () => {
    /**
     * Test that backdrop-filter remains unchanged
     */
    test('vocab-topic-card backdrop-filter should remain unchanged', () => {
      const backdropFilter = extractCSSProperty(vocabularyCss, '.vocab-topic-card', 'backdrop-filter');
      expect(backdropFilter).not.toBeNull();
      expect(backdropFilter).toBe('blur(2px)');
    });

    test('vocab-card backdrop-filter should remain unchanged', () => {
      const backdropFilter = extractCSSProperty(vocabularyCss, '.vocab-card', 'backdrop-filter');
      expect(backdropFilter).not.toBeNull();
      expect(backdropFilter).toBe('blur(2px)');
    });

    test('vocab-color-card backdrop-filter should remain unchanged', () => {
      const backdropFilter = extractCSSProperty(vocabularyColorCss, '.vocab-color-card', 'backdrop-filter');
      expect(backdropFilter).not.toBeNull();
      expect(backdropFilter).toBe('blur(2px)');
    });
  });

  describe('Property 2: Preservation - Layout Properties Unchanged', () => {
    /**
     * Test that layout properties (border-width, border-radius, padding) remain unchanged
     */
    test('vocab-topic-card border-width should remain 1px', () => {
      const border = extractCSSProperty(vocabularyCss, '.vocab-topic-card', 'border');
      expect(border).not.toBeNull();
      expect(border).toContain('1px solid');
    });

    test('vocab-topic-card border-radius should remain 0.9rem', () => {
      const borderRadius = extractCSSProperty(vocabularyCss, '.vocab-topic-card', 'border-radius');
      expect(borderRadius).not.toBeNull();
      expect(borderRadius).toBe('0.9rem');
    });

    test('vocab-topic-card padding should remain 1.1rem', () => {
      const padding = extractCSSProperty(vocabularyCss, '.vocab-topic-card', 'padding');
      expect(padding).not.toBeNull();
      expect(padding).toBe('1.1rem');
    });

    test('vocab-card border-width should remain 1px', () => {
      const border = extractCSSProperty(vocabularyCss, '.vocab-card', 'border');
      expect(border).not.toBeNull();
      expect(border).toContain('1px solid');
    });

    test('vocab-card border-radius should remain 0.9rem', () => {
      const borderRadius = extractCSSProperty(vocabularyCss, '.vocab-card', 'border-radius');
      expect(borderRadius).not.toBeNull();
      expect(borderRadius).toBe('0.9rem');
    });

    test('vocab-card padding should remain 1rem', () => {
      const padding = extractCSSProperty(vocabularyCss, '.vocab-card', 'padding');
      expect(padding).not.toBeNull();
      expect(padding).toBe('1rem');
    });
  });

  describe('Property 2: Preservation - Hover Effects Unchanged', () => {
    /**
     * Test that hover effects remain unchanged
     */
    test('vocab-topic-card:hover border color should remain rgba(156, 255, 184, 0.86)', () => {
      const hoverBorderColor = extractBorderColor(vocabularyCss, '.vocab-topic-card:hover');
      expect(hoverBorderColor).not.toBeNull();
      
      const rgba = extractRGBA(hoverBorderColor);
      expect(rgba).not.toBeNull();
      expect(rgba.r).toBe(156);
      expect(rgba.g).toBe(255);
      expect(rgba.b).toBe(184);
      expect(rgba.a).toBe(0.86);
    });

    test('vocab-topic-card:hover box-shadow should remain unchanged', () => {
      const hoverBoxShadow = extractBoxShadow(vocabularyCss, '.vocab-topic-card:hover');
      expect(hoverBoxShadow).not.toBeNull();
      expect(hoverBoxShadow).toContain('0 0 0 1px rgba(156, 255, 184, 0.36)');
      expect(hoverBoxShadow).toContain('0 0 24px rgba(57, 255, 20, 0.24)');
    });

    test('vocab-topic-card:hover transform should remain translateY(-2px)', () => {
      const hoverTransform = extractCSSProperty(vocabularyCss, '.vocab-topic-card:hover', 'transform');
      expect(hoverTransform).not.toBeNull();
      expect(hoverTransform).toBe('translateY(-2px)');
    });

    test('vocab-card:hover border color should remain rgba(156, 255, 184, 0.82)', () => {
      const hoverBorderColor = extractBorderColor(vocabularyCss, '.vocab-card:hover');
      expect(hoverBorderColor).not.toBeNull();
      
      const rgba = extractRGBA(hoverBorderColor);
      expect(rgba).not.toBeNull();
      expect(rgba.r).toBe(156);
      expect(rgba.g).toBe(255);
      expect(rgba.b).toBe(184);
      expect(rgba.a).toBe(0.82);
    });

    test('vocab-card:hover box-shadow should remain unchanged', () => {
      const hoverBoxShadow = extractBoxShadow(vocabularyCss, '.vocab-card:hover');
      expect(hoverBoxShadow).not.toBeNull();
      expect(hoverBoxShadow).toContain('0 0 0 1px rgba(156, 255, 184, 0.32)');
      expect(hoverBoxShadow).toContain('0 0 20px rgba(57, 255, 20, 0.24)');
    });
  });

  describe('Property 2: Preservation - State Classes Unchanged', () => {
    /**
     * Test that .is-speaking and .is-active state classes remain unchanged
     */
    test('vocab-card.is-speaking border color should remain rgba(156, 255, 184, 0.96)', () => {
      const speakingBorderColor = extractBorderColor(vocabularyCss, '.vocab-card.is-speaking');
      expect(speakingBorderColor).not.toBeNull();
      
      const rgba = extractRGBA(speakingBorderColor);
      expect(rgba).not.toBeNull();
      expect(rgba.r).toBe(156);
      expect(rgba.g).toBe(255);
      expect(rgba.b).toBe(184);
      expect(rgba.a).toBe(0.96);
    });

    test('vocab-card.is-speaking box-shadow should remain unchanged', () => {
      const speakingBoxShadow = extractBoxShadow(vocabularyCss, '.vocab-card.is-speaking');
      expect(speakingBoxShadow).not.toBeNull();
      expect(speakingBoxShadow).toContain('0 0 0 1px rgba(164, 255, 189, 0.26)');
      expect(speakingBoxShadow).toContain('0 0 18px rgba(57, 255, 20, 0.22)');
    });

    test('vocab-color-card.is-speaking box-shadow should remain unchanged', () => {
      const speakingBoxShadow = extractBoxShadow(vocabularyColorCss, '.vocab-color-card.is-speaking');
      expect(speakingBoxShadow).not.toBeNull();
      expect(speakingBoxShadow).toContain('0 0 0 1px rgba(255, 255, 255, 0.3)');
      expect(speakingBoxShadow).toContain('color-mix');
    });
  });

  describe('Property 2: Preservation - Theme Color Variables Unchanged', () => {
    /**
     * Property-based test: All vocab-color-card theme variants should preserve
     * their RGB values (only opacity may change)
     */
    test('property: all vocab-color-card themes preserve RGB values', () => {
      const themes = [
        { selector: '.vocab-color-card', expectedRGB: { r: 168, g: 235, b: 255 } },
        { selector: '.vocab-color-card--red', expectedRGB: { r: 255, g: 155, b: 162 } },
        { selector: '.vocab-color-card--blue', expectedRGB: { r: 156, g: 199, b: 255 } },
        { selector: '.vocab-color-card--green', expectedRGB: { r: 156, g: 255, b: 190 } },
        { selector: '.vocab-color-card--yellow', expectedRGB: { r: 255, g: 240, b: 162 } },
        { selector: '.vocab-color-card--black', expectedRGB: { r: 170, g: 180, b: 201 } },
        { selector: '.vocab-color-card--white', expectedRGB: { r: 196, g: 224, b: 244 } },
        { selector: '.vocab-color-card--brown', expectedRGB: { r: 236, g: 192, b: 160 } },
        { selector: '.vocab-color-card--gray', expectedRGB: { r: 209, g: 220, b: 235 } },
        { selector: '.vocab-color-card--orange', expectedRGB: { r: 255, g: 205, b: 158 } },
        { selector: '.vocab-color-card--pink', expectedRGB: { r: 255, g: 197, b: 224 } },
        { selector: '.vocab-color-card--purple', expectedRGB: { r: 215, g: 190, b: 255 } },
        { selector: '.vocab-color-card--gold', expectedRGB: { r: 255, g: 230, b: 152 } },
        { selector: '.vocab-color-card--silver', expectedRGB: { r: 231, g: 241, b: 255 } },
        { selector: '.vocab-color-card--navy', expectedRGB: { r: 169, g: 188, b: 255 } },
        { selector: '.vocab-color-card--beige', expectedRGB: { r: 249, g: 235, b: 205 } },
        { selector: '.vocab-color-card--maroon', expectedRGB: { r: 243, g: 161, b: 187 } },
        { selector: '.vocab-color-card--turquoise', expectedRGB: { r: 169, g: 249, b: 241 } },
        { selector: '.vocab-color-card--violet', expectedRGB: { r: 220, g: 194, b: 255 } },
        { selector: '.vocab-color-card--cream', expectedRGB: { r: 255, g: 244, b: 192 } },
        { selector: '.vocab-color-card--olive', expectedRGB: { r: 205, g: 226, b: 127 } },
      ];

      fc.assert(
        fc.property(
          fc.constantFrom(...themes),
          (theme) => {
            const borderColor = extractCSSVariable(
              vocabularyColorCss,
              theme.selector,
              '--card-border'
            );
            
            if (!borderColor) {
              throw new Error(`Border color not found for ${theme.selector}`);
            }
            
            const rgba = extractRGBA(borderColor);
            
            if (!rgba) {
              throw new Error(`Invalid RGBA format for ${theme.selector}: ${borderColor}`);
            }
            
            // Verify RGB values match expected (only opacity may differ)
            expect(rgba.r).toBe(theme.expectedRGB.r);
            expect(rgba.g).toBe(theme.expectedRGB.g);
            expect(rgba.b).toBe(theme.expectedRGB.b);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 2: Preservation - Transition Properties Unchanged', () => {
    /**
     * Test that transition properties remain unchanged
     */
    test('vocab-topic-card transition should remain unchanged', () => {
      const transition = extractCSSProperty(vocabularyCss, '.vocab-topic-card', 'transition');
      expect(transition).not.toBeNull();
      expect(transition).toContain('border-color 0.25s ease');
      expect(transition).toContain('box-shadow 0.25s ease');
      expect(transition).toContain('transform 0.25s ease');
    });

    test('vocab-card transition should remain unchanged', () => {
      const transition = extractCSSProperty(vocabularyCss, '.vocab-card', 'transition');
      expect(transition).not.toBeNull();
      expect(transition).toContain('border-color 0.25s ease');
      expect(transition).toContain('box-shadow 0.25s ease');
    });
  });

  describe('Property 2: Preservation - Property-Based Tests', () => {
    /**
     * Property-based test: For any card selector, layout properties should remain unchanged
     */
    test('property: all card types preserve layout properties', () => {
      const cardSelectors = [
        '.vocab-topic-card',
        '.vocab-card',
      ];

      fc.assert(
        fc.property(
          fc.constantFrom(...cardSelectors),
          (selector) => {
            // Border should be 1px solid
            const border = extractCSSProperty(vocabularyCss, selector, 'border');
            expect(border).toContain('1px solid');
            
            // Border-radius should be 0.9rem
            const borderRadius = extractCSSProperty(vocabularyCss, selector, 'border-radius');
            expect(borderRadius).toBe('0.9rem');
            
            // Should have backdrop-filter
            const backdropFilter = extractCSSProperty(vocabularyCss, selector, 'backdrop-filter');
            expect(backdropFilter).toBe('blur(2px)');
            
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    /**
     * Property-based test: For any card selector, hover effects should be preserved
     */
    test('property: all card types preserve hover effects', () => {
      const cardHoverSelectors = [
        '.vocab-topic-card:hover',
        '.vocab-card:hover',
      ];

      fc.assert(
        fc.property(
          fc.constantFrom(...cardHoverSelectors),
          (selector) => {
            // Hover should have border-color change
            const hoverBorderColor = extractBorderColor(vocabularyCss, selector);
            expect(hoverBorderColor).not.toBeNull();
            expect(hoverBorderColor).toContain('rgba(156, 255, 184');
            
            // Hover should have box-shadow
            const hoverBoxShadow = extractBoxShadow(vocabularyCss, selector);
            expect(hoverBoxShadow).not.toBeNull();
            expect(hoverBoxShadow).toContain('rgba(57, 255, 20');
            
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
