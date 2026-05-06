# Pleco Design System (Material Expressive)

This document outlines the core design principles, tokens, and component guidelines for the Pleco application, now standardized on the **Material Expressive (Material 3)** design system. **You must adhere to these guidelines during all future UI updates to ensure a cohesive and professional experience.** For detailed technical specifications and agent operation instructions, refer to the [Design Guidelines](./DESIGN_GUIDELINES.md).

## 1. Core Philosophy
- **Aesthetic**: A premium, high-density implementation of Material 3 in a unique "Olive Expressive" theme.
- **Vibe**: Natural, sophisticated, and clean. Colors are derived from an olive seed color (#7b7c25).
- **Shapes**: High-density rounded corners. We favor `rounded-2xl` (16px) for cards and `rounded-[28px]` (28px) for large containers and modals.
- **Micro-animations**: Interactive elements use `transition-all` with durations between 200ms and 300ms.

## 2. Color Tokens (Olive Expressive Palette)

### Backgrounds & Surfaces (Tonal Elevation)
- **App Canvas**: `bg-md-background` (#0A1100 / #FBFBF0) - The base layer.
- **Surface Containers**:
  - `bg-md-surface-container-lowest`
  - `bg-md-surface-container-low`
  - `bg-md-surface-container`
  - `bg-md-surface-container-high`
  - `bg-md-surface-container-highest`

### Typography & Semantic Colors
- **Primary Text**: `text-md-on-surface` - High contrast body text.
- **Secondary Text**: `text-md-on-surface-variant` - For labels and metadata.
- **Primary Brand**: `text-md-primary` - Olive brand color for actions.
- **Primary Container**: `bg-md-primary-container` - Tonal background for grouped elements.

## 3. Typography Scale
We use **Outfit** as the recommended font for Material Design Expressive.
- **Display** (Hero text): `text-4xl font-semibold tracking-tight` (Sentence case)
- **Headline** (Page headers): `text-2xl font-medium tracking-normal` (Sentence case)
- **Title** (Section/Card headers): `text-lg font-medium` (Sentence case)
- **Body** (Standard reading): `text-[15px] font-normal` (Sentence case)
- **Label** (Buttons, Badges, Overlines): `text-[13px] font-semibold tracking-tight` (Sentence case)

## 4. Spacing & Layout
Standardized on an 8px grid with high-density overrides.
- **Page Padding**: Use `p-container` (dynamic spacing based on density settings).
- **Card Padding**: Use `p-card` (dynamic spacing based on density settings).
- **Sidebar Width**: Use `w-sidebar` (dynamic).
- **Header Height**: Use `h-header` (dynamic).

## 5. Elevation & Shadows
We prioritize **natural borders** and **subtle shadows** for a clean, professional aesthetic, inspired by modern flat design.
- **Flat (Level 0)**: Background and Sidebar. Use `border-md-outline-variant/10` for separation.
- **Subtle (Level 1)**: Cards, search inputs, and chips. Use `shadow-sm`.
- **Raised (Level 2)**: Overlays, modals, and popovers. Use `shadow-md` or `shadow-lg` with low opacity.
- **Natural Borders**: Every contained surface should have a subtle border (`border border-md-outline-variant/10`) to define its edges in both Light and Dark modes.
- **No Glows**: Avoid primary-tinted shadows or "outer glows" on buttons or chips.

## 6. Border Radius (Shapes)
- **Standard Component (Buttons, Inputs)**: `rounded-xl` (12px).
- **Medium Elements (Cards, Breadcrumbs)**: `rounded-2xl` (16px).
- **Large Elements (Modals, Large Containers)**: `rounded-[28px]` or `rounded-[32px]`.
- **Icon Triggers**: `rounded-full`.

## 7. Interactive States
- **Hover**: Use `hover:bg-md-surface-variant/20` for neutral triggers or `hover:bg-md-primary/10` for themed triggers.
- **Active/Press**: Apply `active:scale-95` or `active:scale-90` for tactile feedback.
- **Shadows**: Only use subtle shadows on hover for extra depth if needed, but keep them neutral.

## 8. Modals & Dialogs
- **Backdrop**: `bg-black/80` + `backdrop-blur-[4px]`.
- **Container**: `bg-md-surface-container-high`, `rounded-[28px]`, `border border-md-outline-variant/10`, `shadow-xl`.
- **Header**: Separated by `border-b border-md-outline-variant/10`.

## 9. Structural Limitations
- **No legacy figma-* or discord-* classes.**
- **No pure white/black backgrounds for UI elements.**
- **Elevation**: Driven by tonal surfaces and borders rather than raw shadows.
- **Density**: Maintain high density to provide a professional, data-rich environment.
