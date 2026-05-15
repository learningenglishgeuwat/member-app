/**
 * Bug Condition Exploration Test for Vocabulary Card Border Visibility
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3**
 * 
 * This test explores the bug condition where vocabulary card borders have
 * opacity values that are too low, making them difficult to see.
 * 
 * CRITICAL: This test is EXPECTED TO FAIL on unfixed code.
 * - Failure confirms the bug exists
 * - Success after fix confirms the bug is resolved
 * 
 * DO NOT attempt to fix the test or code when it fails initially.
 */

const fs = require('fs');
const path = require('path');

describe('Bug Condition Exploration: Vocabulary Card Border Visibility', () => {
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
   * Helper function to extract opacity from rgba color string
   * @param {string} rgbaString - e.g., "rgba(110, 255, 141, 0.42)"
   * @returns {number} - opacity value (e.g., 0.42)
   */
  function extractOpacity(rgbaString) {
    const match = rgbaString.match(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)/);
    return match ? parseFloat(match[1]) : null;
  }

  /**
   * Helper function to extract border opacity from CSS rule
   * @param {string} css - CSS content
   * @param {string} selector - CSS selector
   * @returns {number|null} - opacity value or null if not found
   */
  function extractBorderOpacity(css, selector) {
    // Match the selector and extract border property
    const selectorRegex = new RegExp(
      `${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]+)\\}`,
      'i'
    );
    const match = css.match(selectorRegex);
    
    if (!match) return null;
    
    const ruleContent = match[1];
    const borderMatch = ruleContent.match(/border:\s*[^;]*rgba\([^)]+\)/i);
    
    if (!borderMatch) return null;
    
    return extractOpacity(borderMatch[0]);
  }

  /**
   * Helper function to extract CSS variable value
   * @param {string} css - CSS content
   * @param {string} selector - CSS selector
   * @param {string} variable - CSS variable name (e.g., '--card-border')
   * @returns {number|null} - opacity value or null if not found
   */
  function extractCssVariableOpacity(css, selector, variable) {
    const selectorRegex = new RegExp(
      `${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]+)\\}`,
      'i'
    );
    const match = css.match(selectorRegex);
    
    if (!match) return null;
    
    const ruleContent = match[1];
    const variableRegex = new RegExp(`${variable}:\\s*rgba\\([^)]+\\)`, 'i');
    const variableMatch = ruleContent.match(variableRegex);
    
    if (!variableMatch) return null;
    
    return extractOpacity(variableMatch[0]);
  }

  describe('Property 1: Bug Condition - Border Opacity Too Low', () => {
    test('vocab-topic-card border opacity should be ≥ 0.7 (currently 0.42)', () => {
      const opacity = extractBorderOpacity(vocabularyCss, '.vocab-topic-card');
      
      // Document the counterexample
      console.log(`\n[COUNTEREXAMPLE] vocab-topic-card border opacity: ${opacity}`);
      console.log(`Expected: ≥ 0.7, Actual: ${opacity}`);
      
      // This assertion will FAIL on unfixed code (opacity is 0.42)
      // This is EXPECTED - it confirms the bug exists
      expect(opacity).not.toBeNull();
      expect(opacity).toBeGreaterThanOrEqual(0.7);
    });

    test('vocab-card border opacity should be ≥ 0.7 (currently 0.42)', () => {
      const opacity = extractBorderOpacity(vocabularyCss, '.vocab-card');
      
      // Document the counterexample
      console.log(`\n[COUNTEREXAMPLE] vocab-card border opacity: ${opacity}`);
      console.log(`Expected: ≥ 0.7, Actual: ${opacity}`);
      
      // This assertion will FAIL on unfixed code (opacity is 0.42)
      // This is EXPECTED - it confirms the bug exists
      expect(opacity).not.toBeNull();
      expect(opacity).toBeGreaterThanOrEqual(0.7);
    });

    test('vocab-color-card default theme border opacity should be ≥ 0.75 (currently 0.45)', () => {
      const opacity = extractCssVariableOpacity(
        vocabularyColorCss,
        '.vocab-color-card',
        '--card-border'
      );
      
      // Document the counterexample
      console.log(`\n[COUNTEREXAMPLE] vocab-color-card default theme border opacity: ${opacity}`);
      console.log(`Expected: ≥ 0.75, Actual: ${opacity}`);
      
      // This assertion will FAIL on unfixed code (opacity is 0.45)
      // This is EXPECTED - it confirms the bug exists
      expect(opacity).not.toBeNull();
      expect(opacity).toBeGreaterThanOrEqual(0.75);
    });

    test('vocab-color-card black theme border opacity should be ≥ 0.75 (currently 0.55)', () => {
      const opacity = extractCssVariableOpacity(
        vocabularyColorCss,
        '.vocab-color-card--black',
        '--card-border'
      );
      
      // Document the counterexample
      console.log(`\n[COUNTEREXAMPLE] vocab-color-card black theme border opacity: ${opacity}`);
      console.log(`Expected: ≥ 0.75, Actual: ${opacity}`);
      
      // This assertion will FAIL on unfixed code (opacity is 0.55)
      // This is EXPECTED - it confirms the bug exists
      expect(opacity).not.toBeNull();
      expect(opacity).toBeGreaterThanOrEqual(0.75);
    });
  });

  describe('Additional Bug Condition Checks', () => {
    test('all vocab-color-card theme variants should have border opacity ≥ 0.75', () => {
      const themes = [
        '.vocab-color-card',
        '.vocab-color-card--red',
        '.vocab-color-card--blue',
        '.vocab-color-card--green',
        '.vocab-color-card--yellow',
        '.vocab-color-card--black',
        '.vocab-color-card--white',
        '.vocab-color-card--brown',
        '.vocab-color-card--gray',
        '.vocab-color-card--orange',
        '.vocab-color-card--pink',
        '.vocab-color-card--purple',
        '.vocab-color-card--gold',
        '.vocab-color-card--silver',
        '.vocab-color-card--navy',
        '.vocab-color-card--beige',
        '.vocab-color-card--maroon',
        '.vocab-color-card--turquoise',
        '.vocab-color-card--violet',
        '.vocab-color-card--cream',
        '.vocab-color-card--olive',
      ];

      const failingThemes = [];
      
      themes.forEach(theme => {
        const opacity = extractCssVariableOpacity(
          vocabularyColorCss,
          theme,
          '--card-border'
        );
        
        if (opacity !== null && opacity < 0.75) {
          failingThemes.push({ theme, opacity });
          console.log(`\n[COUNTEREXAMPLE] ${theme} border opacity: ${opacity} (expected ≥ 0.75)`);
        }
      });

      // Document all failing themes
      if (failingThemes.length > 0) {
        console.log(`\n[SUMMARY] ${failingThemes.length} theme(s) have border opacity < 0.75:`);
        failingThemes.forEach(({ theme, opacity }) => {
          console.log(`  - ${theme}: ${opacity}`);
        });
      }

      // This will fail if any theme has opacity < 0.75
      expect(failingThemes).toEqual([]);
    });
  });
});
