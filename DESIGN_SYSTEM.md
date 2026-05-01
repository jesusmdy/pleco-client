# Pleco Design System

This document outlines the core design principles, tokens, and component guidelines for the Pleco application. **You must adhere to these guidelines during all future UI updates to ensure a cohesive and professional experience.**

## 1. Core Philosophy
- **Aesthetic**: A premium blend of Discord's dark mode palette and Google Drive's structured, spacious layout. 
- **Vibe**: Sleek, professional, and dark. Avoid bright, jarring colors outside of intentional accent elements.
- **Micro-animations**: Interactive elements should feel alive through subtle transitions, not bouncy or exaggerated transforms.

## 2. Color Tokens

### Backgrounds
- **Primary Page Background**: `bg-discord-bg-primary` (Deepest shade, used for the main application canvas).
- **Secondary Background**: `bg-discord-bg-secondary` (Slightly lighter, used for Sidebars, Modals, and large Cards).
- **Tertiary Background**: `bg-discord-bg-tertiary` (Used for Search bars, Input fields, and deep nested areas).
- **Overlays**: `bg-black/60` (Used for modal backdrops).

### Text & Typography
- **Primary Text**: `text-white` or `text-discord-text-primary` (For headings and active data).
- **Secondary/Muted Text**: `text-discord-text-muted` (For labels, breadcrumbs, descriptions).
- **Danger Text**: `text-discord-red` (For delete actions, sign-out).
- **Success Text**: `text-[#23a559]` (For verified badges, success toasts).

### Accents & Brands
- **Primary Brand / Action**: `bg-discord-blurple` (Primary buttons, active states, main brand logos).
- **Danger Action**: `bg-discord-red` (Destructive buttons).

## 3. Typography Scale
We use standard sans-serif (Inter/system-ui default) with specific size constraints to maintain crispness.
- **H1 (Page Title)**: `text-3xl font-bold mb-8`
- **H2 (Section Header)**: `text-xl font-semibold mb-6`
- **H3 (Card Header)**: `text-lg font-semibold`
- **Standard Body**: `text-[15px]` or `text-[14px]`
- **Metadata/Small**: `text-[13px]` or `text-[12px]`

## 4. Spacing & Layout
Avoid tight, cluttered layouts. Let the UI breathe.
- **Page Wrapper**: Use `w-full` inside a flex layout. Maintain `px-4` or `px-6` padding globally.
- **Section Gaps**: Use `gap-6` between major list items or form groups.
- **Component Gaps**: Use `gap-2` or `gap-3` between icons and text.
- **Vertical Spacing**: Use `mt-8` or `mb-8` to separate distinct page sections.

## 5. Borders & Dividers
Borders should be nearly invisible, providing structure without drawing the eye.
- **Standard Divider**: `border-b border-white/5` or `border-black/10` depending on the background depth.
- **Card Borders**: `border border-white/10`.
- **Focus Rings**: `focus:ring-1 focus:ring-discord-blurple border-transparent`. Never use default browser outlines.

## 6. Border Radius (Corners)
- **Small Elements (Inputs, Buttons, Badges)**: `rounded` or `rounded-md` (approx 4px - 6px).
- **Cards & Modals**: `rounded-lg` or `rounded-xl` (approx 8px - 12px) for a softer, modern edge.
- **Avatars & Quick Action Icons**: `rounded-full`.

## 7. Interactive States (Hover & Active)
All clickable elements must have a defined hover state.
- **Ghost/Text Buttons**: Use `hover:bg-white/5` or `hover:bg-white/10`.
- **Danger Elements**: Use a subtle red wash `hover:bg-discord-red/10` and `hover:text-red-400`.
- **Transitions**: Apply `transition-colors` or `transition-all` to ensure hover states fade in smoothly (150ms default).
- **Micro-interactions**: Use `group` and `group-hover` to slightly nudge icons. Example: `group-hover:-translate-x-1` for a back/logout arrow.

## 8. Modals & Dialogs
- Must always have a dark backdrop (`bg-black/60`).
- Must trap clicks (clicking backdrop closes modal).
- Must have a clear header with a close (`X`) icon.
- Max width should typically be `max-w-md` for actions, or `max-w-xl` for complex forms.

## 9. Structural Limitations
- **No pure white backgrounds** anywhere.
- **No excessive box-shadows**. Use `shadow-sm` for buttons and `shadow-xl` for Modals to create depth without glow.
- **Data Tables/Lists**: Avoid horizontal lines everywhere. Favor grid-alignments or flex-between layouts with generous vertical gaps (like the Profile page).
