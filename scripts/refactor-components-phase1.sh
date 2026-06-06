#!/bin/bash
# Component Organization Refactoring - Phase 1: Setup
# Creates folder structure without moving files

set -e

echo "🏗️  Phase 1: Creating folder structure..."

# UI Components
mkdir -p app/components/ui/buttons
mkdir -p app/components/ui/loading
mkdir -p app/components/ui/links
echo "✅ UI folders created"

# Feature Components
mkdir -p app/components/features/navigation/MobileBottomNav
mkdir -p app/components/features/pronunciation/IpaText
mkdir -p app/components/features/learning
mkdir -p app/components/features/control-center
echo "✅ Feature folders created"

# Layout
mkdir -p app/components/layout
echo "✅ Layout folder created"

# Guards
mkdir -p app/components/guards
echo "✅ Guards folder created"

# Effects
mkdir -p app/components/effects
echo "✅ Effects folder created"

# Create placeholder barrel exports
cat > app/components/ui/buttons/index.ts << 'EOF'
// Barrel export for button components
// Will be populated during migration
export {};
EOF

cat > app/components/ui/loading/index.ts << 'EOF'
// Barrel export for loading components
export {};
EOF

cat > app/components/ui/links/index.ts << 'EOF'
// Barrel export for link components
export {};
EOF

cat > app/components/features/navigation/index.ts << 'EOF'
// Barrel export for navigation components
export {};
EOF

cat > app/components/features/pronunciation/index.ts << 'EOF'
// Barrel export for pronunciation components
export {};
EOF

cat > app/components/features/learning/index.ts << 'EOF'
// Barrel export for learning components
export {};
EOF

cat > app/components/features/control-center/index.ts << 'EOF'
// Barrel export for control center
export {};
EOF

cat > app/components/layout/index.ts << 'EOF'
// Barrel export for layout components
export {};
EOF

cat > app/components/guards/index.ts << 'EOF'
// Barrel export for guard components
export {};
EOF

cat > app/components/effects/index.ts << 'EOF'
// Barrel export for effect components
export {};
EOF

echo "✅ Barrel exports created"

echo ""
echo "✨ Phase 1 Complete!"
echo ""
echo "Next steps:"
echo "1. Review folder structure: ls -la app/components/"
echo "2. Run: npm run typecheck (should still pass)"
echo "3. Proceed to Phase 2 when ready"
