/**
 * Root barrel export - Backward compatible public API
 * 
 * Components are now organized by category:
 * - ui/              Pure UI components (no business logic)
 * - features/        Feature-specific components
 * - layout/          App structure & theming
 * - guards/          Auth & access control
 * - effects/         Side effects & behaviors
 * 
 * Preferred import (explicit category):
 *   import { PlayStopButton } from '@/app/components/ui/buttons';
 * 
 * Also works (backward compatible):
 *   import { PlayStopButton } from '@/app/components';
 */

// UI Components
export * from './ui';

// Feature Components
export * from './features';

// Layout Components
export * from './layout';

// Guards
export * from './guards';

// Effects
export * from './effects';
