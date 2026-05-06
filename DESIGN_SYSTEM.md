# Pleco Design System (Material Expressive)

This document outlines the core design principles, tokens, and component guidelines for the Pleco application, now standardized on the **Material Expressive (Material 3)** design system. **You must adhere to these guidelines during all future UI updates to ensure a cohesive and professional experience.**

## 1. Core Philosophy
- **Aesthetic**: A premium, high-density implementation of Material 3 in a unique "Olive Expressive" theme.
- **Vibe**: Natural, sophisticated, and deep. Colors are derived from an olive seed color (#7b7c25).
- **Shapes**: High-density rounded corners. We favor `rounded-2xl` (16px) for cards and `rounded-[28px]` (28px) for large containers and modals.
- **Micro-animations**: Interactive elements use `transition-all` with durations between 200ms and 300ms.

## 2. Color Tokens (Olive Expressive Palette)

### Backgrounds & Surfaces (Symmetric Elevation)
- **App Canvas**: `bg-md-background` (#0A1100) - The deepest layer.
- **Surface Containers**:
  - `bg-md-surface-container-lowest`: (#0F1604)
  - `bg-md-surface-container-low`: (#151C0A)
  - `bg-md-surface-container`: (#1B2312)
  - `bg-md-surface-container-high`: (#262D1C)
  - `bg-md-surface-container-highest`: (#313826)

### Typography & Semantic Colors
- **Primary Text**: `text-md-on-surface` (#E4E3D6) - High contrast body text.
- **Secondary Text**: `text-md-on-surface-variant` (#C8C8B6) - For labels and metadata.
- **Primary Brand**: `text-md-primary` (#E2E48C) - Light yellowish green for actions.
- **Primary Container**: `bg-md-primary-container` (#4B4C04) - Dark olive for grouped elements.

## 3. Typography Scale
We use **Outfit** as the recommended font for Material Design Expressive.
- **Display** (Hero text): `text-4xl font-semibold tracking-tight` (Sentence case)
- **Headline** (Page headers): `text-2xl font-medium tracking-normal` (Sentence case)
- **Title** (Section/Card headers): `text-lg font-medium` (Sentence case)
- **Body** (Standard reading): `text-[15px] font-normal` (Sentence case)
- **Label** (Buttons, Badges, Overlines): `text-[12px] font-bold uppercase tracking-[0.1em]`

## 4. Spacing & Layout
Standardized on an 8px grid with high-density overrides.
- **Page Wrapper**: `max-w-[1600px] mx-auto p-8`.
- **Section Gaps**: `gap-12` between major blocks.
- **Component Gaps**: `gap-4` for internal spacing.
- **Safe Area**: `px-6` for horizontal padding inside containers.

## 5. Borders & Outlines
Borders are used sparingly to define structure without adding noise.
- **Standard Outline**: `border border-md-outline-variant/10`.
- **Active Outline**: `border-md-primary/30`.

## 6. Border Radius (Shapes)
- **Standard Component (Buttons, Inputs)**: `rounded-xl` (12px).
- **Medium Elements (Cards, Breadcrumbs)**: `rounded-2xl` (16px).
- **Large Elements (Modals, Large Containers)**: `rounded-[28px]` or `rounded-[32px]`.
- **Icon Triggers**: `rounded-full`.

## 7. Interactive States
- **Hover**: Use `hover:bg-md-surface-variant/20` for neutral triggers or `hover:bg-md-primary/10` for themed triggers.
- **Active/Press**: Apply `active:scale-95` or `active:scale-90` for tactile feedback.
- **Shadows**:
  - `shadow-lg` for standard buttons.
  - `shadow-[0_24px_64px_rgba(0,0,0,0.6)]` for modals.
  - Always add a subtle color-matched shadow to buttons (e.g., `shadow-md-primary/20`).

## 8. Modals & Dialogs
- **Backdrop**: `bg-black/80` + `backdrop-blur-[4px]`.
- **Container**: `bg-md-surface-container-high`, `rounded-[28px]`, `shadow-2xl`.
- **Header**: Separated by `border-b border-md-outline-variant/10`.
- **Content**: Generous padding (`p-8`).

## 9. Structural Limitations
- **No legacy figma-* or discord-* classes.**
- **No pure white/black** backgrounds for UI elements.
- **Elevation**: Driven by `md-surface-container-*` variants rather than raw shadows.
- **Density**: Maintain high density (smaller fonts with wider tracking) to provide a professional, data-rich environment.
