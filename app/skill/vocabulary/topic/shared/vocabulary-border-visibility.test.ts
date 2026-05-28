/**
 * Bug Condition Exploration Test for Vocabulary Card Border Visibility
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3**
 * 
 * This test is designed to FAIL on unfixed code to confirm the bug exists.
 * It uses a scoped property-based testing approach for deterministic bugs.
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists.
 * DO NOT attempt to fix the test or the code when it fails.
 * 
 * Expected counterexamples on unfixed code:
 * - vocab-topic-card shows opacity 0.42 (expected ≥ 0.7)
 * - vocab-card shows opacity 0.42 (expected ≥ 0.7)
 * - vocab-color-card default theme shows opacity 0.45 (expected ≥ 0.75)
 * - vocab-color-card black theme shows opacity 0.55 (expected ≥ 0.75)
 */

import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

// Helper function to extract opacity from rgba string
function extractOpacity(rgbaString: string): number | null {
  const match = rgbaString.match(/rgba?\([^)]+,\s*([0-9.]+)\)/);
  return match ? parseFloat(match[1]) : null;
}

// Helper function to parse CSS and extract border opacity for a selector
function getBorderOpacityFromCSS(cssContent: string, selector: string): number | null {
  // Find the selector block
  const selectorRegex = new RegExp(`${selector.replace('.', '\\.')}\\s*{([^}]+)}`, 's');
  const match = cssContent.match(selectorRegex);
  
  if (!match) {
    return null;
  }
  
  const block = match[1];
  
  // Extract border property
  const borderMatch = block.match(/border:\s*[^;]+rgba?\([^)]+\)/);
  if (borderMatch) {
    return extractOpacity(borderMatch[0]);
  }
  
  return null;
}

// Helper function to extract CSS variable value
function getCSSVariableValue(cssContent: string, className: string, variableName: string): number | null {
  // Find the class block
  const classRegex = new RegExp(`${className.replace('.', '\\.')}\\s*{([^}]+)}`, 's');
  const match = cssContent.match(classRegex);
  
  if (!match) {
    return null;
  }
  
  const block = match[1];
  
  // Extract the CSS variable
  const varRegex = new RegExp(`${variableName}:\\s*rgba?\\([^)]+\\)`);
  const varMatch = block.match(varRegex);
  
  if (varMatch) {
    return extractOpacity(varMatch[0]);
  }
  
  return null;
}

describe('Property 1: Bug Condition - Border Opacity Too Low', () => {
  const vocabularyCSSPath = path.join(__dirname, 'vocabulary.css');
  const vocabularyColorCSSPath = path.join(__dirname, 'vocabulary-color.css');
  
  let vocabularyCSS: string;
  let vocabularyColorCSS: string;
  
  beforeAll(() => {
    vocabularyCSS = fs.readFileSync(vocabularyCSSPath, 'utf-8');
    vocabularyColorCSS = fs.readFileSync(vocabularyColorCSSPath, 'utf-8');
  });
  
  /**
   * Test for vocab-topic-card border opacity
   * Expected to FAIL on unfixed code (opacity 0.42 < 0.7)
   */
  test('vocab-topic-card border opacity should be >= 0.7', () => {
    const opacity = getBorderOpacityFromCSS(vocabularyCSS, '.vocab-topic-card');
    
    expect(opacity).not.toBeNull();
    expect(opacity).toBeGreaterThanOrEqual(0.7);
  });
  
  /**
   * Test for vocab-card border opacity
   * Expected to FAIL on unfixed code (opacity 0.42 < 0.7)
   */
  test('vocab-card border opacity should be >= 0.7', () => {
    const opacity = getBorderOpacityFromCSS(vocabularyCSS, '.vocab-card');
    
    expect(opacity).not.toBeNull();
    expect(opacity).toBeGreaterThanOrEqual(0.7);
  });
  
  /**
   * Test for vocab-color-card default theme border opacity
   * Expected to FAIL on unfixed code (opacity 0.45 < 0.75)
   */
  test('vocab-color-card default theme border opacity should be >= 0.75', () => {
    const opacity = getCSSVariableValue(vocabularyColorCSS, '.vocab-color-card', '--card-border');
    
    expect(opacity).not.toBeNull();
    expect(opacity).toBeGreaterThanOrEqual(0.75);
  });
  
  /**
   * Test for vocab-color-card black theme border opacity
   * Expected to FAIL on unfixed code (opacity 0.55 < 0.75)
   */
  test('vocab-color-card black theme border opacity should be >= 0.75', () => {
    const opacity = getCSSVariableValue(vocabularyColorCSS, '.vocab-color-card--black', '--card-border');
    
    expect(opacity).not.toBeNull();
    expect(opacity).toBeGreaterThanOrEqual(0.75);
  });
  
  /**
   * Property-based test: All vocabulary card types should have sufficient border opacity
   * This test uses scoped PBT approach - testing concrete failing cases
   */
  test('property: all vocabulary cards should have border opacity meeting minimum thresholds', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          { selector: '.vocab-topic-card', file: 'vocabulary.css', minOpacity: 0.7, type: 'border' },
          { selector: '.vocab-card', file: 'vocabulary.css', minOpacity: 0.7, type: 'border' },
          { selector: '.vocab-color-card', file: 'vocabulary-color.css', minOpacity: 0.75, type: 'variable', variable: '--card-border' },
          { selector: '.vocab-color-card--black', file: 'vocabulary-color.css', minOpacity: 0.75, type: 'variable', variable: '--card-border' }
        ),
        (cardConfig) => {
          const cssContent = cardConfig.file === 'vocabulary.css' ? vocabularyCSS : vocabularyColorCSS;
          
          let opacity: number | null;
          if (cardConfig.type === 'border') {
            opacity = getBorderOpacityFromCSS(cssContent, cardConfig.selector);
          } else {
            opacity = getCSSVariableValue(cssContent, cardConfig.selector, cardConfig.variable!);
          }
          
          // This assertion will fail on unfixed code, surfacing counterexamples
          expect(opacity).not.toBeNull();
          expect(opacity).toBeGreaterThanOrEqual(cardConfig.minOpacity);
          
          return true;
        }
      ),
      { numRuns: 100 } // Run 100 times to ensure we test all card types multiple times
    );
  });
});
