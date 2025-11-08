# Atomic Design System - TLC Places

This document outlines the atomic design architecture implemented in the TLC Places application.

## Architecture Overview

The component system follows Atomic Design principles with three main levels:

### 🔬 Atoms (Basic Building Blocks)
Located in `src/components/atoms/`

- **GradientText**: Renders text with gradient styling using semantic design tokens
- **IconBadge**: Circular icon container with gradient backgrounds and hover effects
- **GlowingBadge**: Animated badge with pulse effects and icon support
- **FloatingOrb**: Decorative gradient orbs for background aesthetics
- **AnimatedEmoji**: Emojis with various animation options (bounce, spin, pulse, scale)

### 🧬 Molecules (Simple Component Groups)
Located in `src/components/molecules/`

- **SectionHeader**: Complete section header with title, description, icon, and emoji support
- **FeatureCard**: Interactive feature card with icon, title, description, and hover effects
- **StatCard**: Metric display card with icon, value, and label
- **CTASection**: Call-to-action section with title, description, and multiple button support

### 🦠 Organisms (Complex Component Combinations)
Located in `src/components/organisms/`

- **HeroSection**: Full hero section with badge, title, subtitle, description, floating orbs, and action buttons
- **NavigationBar**: Sticky navigation bar with logo and action slots

## Design System Integration

All atomic components leverage the design system defined in:
- `src/index.css` - CSS custom properties and semantic tokens
- `tailwind.config.ts` - Tailwind theme configuration

### Key Design Tokens Used

```css
/* Colors */
--primary, --primary-foreground
--accent, --accent-foreground
--secondary, --secondary-foreground
--background, --foreground
--card, --card-foreground
--muted, --muted-foreground

/* Effects */
.gradient-primary
.gradient-text
.shadow-glow
```

## Usage Examples

### Atoms
```tsx
import { GradientText, AnimatedEmoji, IconBadge } from "@/components/atoms";

<GradientText as="h1" className="text-4xl">Hello World</GradientText>
<AnimatedEmoji emoji="🎨" animation="bounce" size="lg" />
<IconBadge icon={Heart} gradient="from-pink-500 to-rose-500" size="md" />
```

### Molecules
```tsx
import { SectionHeader, FeatureCard } from "@/components/molecules";

<SectionHeader 
  title="Features" 
  description="Explore our amazing features"
  icon={Sparkles}
  emoji="✨"
/>

<FeatureCard
  title="Cartoonifier"
  description="Transform photos into cartoons"
  icon={Palette}
  emoji="🎨"
  gradient="from-purple-500 to-pink-500"
  onClick={() => navigate("/cartoonifier")}
/>
```

### Organisms
```tsx
import { HeroSection, NavigationBar } from "@/components/organisms";

<NavigationBar
  logo={<Logo />}
  actions={<DarkModeToggle />}
/>

<HeroSection
  badge={{ text: "New Feature", icon: Crown }}
  title="Welcome to TLC Places"
  description="Your love and adventure hub"
  actions={<Button>Get Started</Button>}
/>
```

## Benefits of Atomic Design

1. **Consistency**: Reusable components ensure consistent UI/UX
2. **Maintainability**: Changes propagate automatically to all instances
3. **Scalability**: Easy to add new features using existing atoms
4. **Performance**: Smaller, focused components are easier to optimize
5. **Testing**: Atomic components are easier to test in isolation
6. **Design System Compliance**: All components use semantic tokens

## Component Guidelines

### When to Create an Atom
- Single-purpose UI element
- Highly reusable across the app
- No complex internal logic
- Uses only design system tokens

### When to Create a Molecule
- Combines 2-3 atoms
- Represents a distinct UI pattern
- May have simple internal state
- Still relatively generic

### When to Create an Organism
- Complex, feature-specific component
- Combines multiple molecules/atoms
- May have significant business logic
- Page-level sections

## Future Enhancements

- [ ] Add Storybook for component documentation
- [ ] Create theme variants (light/dark optimizations)
- [ ] Add animation presets library
- [ ] Build accessibility testing suite
- [ ] Create component composition helpers
- [ ] Add responsive behavior utilities

## Maintenance

When adding new features:
1. Check if existing atoms/molecules can be used
2. Extract repeated patterns into new atoms
3. Keep components focused and single-purpose
4. Always use design system tokens
5. Document component props thoroughly
6. Add examples to this document
