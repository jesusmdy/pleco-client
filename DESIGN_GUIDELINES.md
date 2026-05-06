# DESIGN_GUIDELINES.md: Material Design Expressive Agent Instructions

## Overview
This document serves as the foundational instruction manual and specification guide for any autonomous agent, designer, or developer tasked with generating, evaluating, or implementing user interfaces based on the **Material Design Expressive (Material 3 / Material You)** design system. 

As an operating agent, your primary objective is to balance **systematic consistency** with **expressive personalization**. You must prioritize dynamic adaptation, accessibility, and structural symmetry.

---

## 1. Core Philosophy
Material Expressive shifts the paradigm from a rigid, monolithic design language to a highly personal, adaptable, and emotionally resonant framework.

* **Personalized over Universal:** The UI should adapt to the user's context, preferences, and wallpaper (Dynamic Color).
* **Expressive over Neutral:** Use varied shapes, expressive typography scales, and rich tonal elevation to create character.
* **Accessible by Default:** All generative choices must strictly adhere to WCAG AAA standards for contrast, especially when using dynamic tonal palettes.

---

## 2. Color System & Dynamic Tones
Agents must not hardcode hex values. All color assignments must utilize **Color Roles** mapped to **Tonal Palettes**.

### 2.1 Tonal Palettes
When given a single key color, generate a tonal palette consisting of 13 tones (0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100).
* **0:** Pure Black
* **100:** Pure White

### 2.2 Expressive Color Roles
Assign colors based on structural hierarchy:
* **Primary:** High-emphasis elements (FABs, primary buttons, active states). Maps to Primary Tone 40 (Light) / 80 (Dark).
* **Secondary:** Medium-emphasis, tonal elements (Filter chips, secondary buttons). Maps to Secondary Tone 40 / 80.
* **Tertiary:** Accents that provide contrast and expressive pop. Maps to Tertiary Tone 40 / 80.
* **Error:** Destructive actions. Maps strictly to Error Tone 40 / 80.
* **Containers:** Elements like cards use `[Role] Container` (Tone 90/30) with `On [Role] Container` (Tone 10/90) for text.
* **Surfaces:** Backgrounds use `Surface` and `Surface Variant`. 

*Agent Rule:* Always pair a color role (e.g., `Primary`) with its designated contrasting text/icon role (e.g., `On Primary`) to ensure legibility.

---

## 3. Shape & Symmetry Specs
Shape is a primary driver of expression. The system categorizes shapes into distinct families and scales.

### 3.1 Shape Families
* **Rounded:** Soft, approachable, organic.
* **Cut:** Angular, precise, technical.

### 3.2 Shape Scale & Symmetrical Guides
Agents must apply symmetrical or asymmetrical rounding strictly according to component semantics:
* **None (0dp):** Full bleed imagery, tables.
* **Extra Small (4dp):** Snackbars, Text Fields, Checkboxes. (Highly symmetrical).
* **Small (8dp):** Tooltips, rich media frames.
* **Medium (12dp):** Cards, Dialogs.
* **Large (16dp):** Navigation drawers, complex bottom sheets.
* **Extra Large (28dp):** Large structural containers.
* **Full (Pill / 50% height):** Buttons, FABs, Chips.

### 3.3 Expressive Asymmetry
To create an "Expressive" layout, agents can employ asymmetric shaping on containers (e.g., Cards, Image containers).
* **Top-Left / Bottom-Right Symmetry:** e.g., 28dp top-left, 4dp top-right, 28dp bottom-right, 4dp bottom-left. 
* *Agent Rule:* Never mix "Cut" and "Rounded" families within the same single component. Asymmetry should be intentional, drawing the eye to an action or establishing a visual rhythm.

---

## 4. Typography & Expressive Text
Typography in Material Expressive focuses on variable fonts and distinct scale roles. 

### 4.1 Type Scale
Agents should strictly map content to the following roles:
* **Display (Large/Medium/Small):** For hero sections, highly expressive, short copy.
* **Headline (Large/Medium/Small):** Standard page headers, structural dividers.
* **Title (Large/Medium/Small):** Component headers (Cards, Dialogs).
* **Body (Large/Medium/Small):** Long-form reading, descriptions.
* **Label (Large/Medium/Small):** Buttons, metadata, captions. (Always use heavier weights for legibility).

### 4.2 Typographic Expression
* **Weight & Width Variability:** Agents should leverage variable font axes (Weight, Width, Optical Size) to create hierarchy without relying solely on size or color.
* **Pairing:** Use a highly stylized serif or display font for `Display` and `Headline` roles, while maintaining a clean sans-serif for `Body` and `Label` roles to preserve readability.

---

## 5. Elevation & Depth
Material Expressive abandons heavy drop-shadows in favor of **Tonal Elevation**.

### 5.1 Tonal Surfaces
Rather than simulating physical height via shadow blur, elevation is simulated by lightening or darkening the surface color.
* **Level 0:** Standard Surface (Base)
* **Level 1:** Surface + 5% Primary overlay 
* **Level 2:** Surface + 8% Primary overlay
* **Level 3:** Surface + 11% Primary overlay
* **Level 4:** Surface + 12% Primary overlay
* **Level 5:** Surface + 14% Primary overlay

### 5.2 Shadows (Expressive Use Only)
* Use soft, diffuse shadows strictly for transient elements (FABs, Dialogs, Dropdown Menus) to separate them from the foundational layout. Structural elements (Cards) should rely purely on tonal elevation and borders.

---

## 6. Layout, Grid, and Spatial Symmetry
### 6.1 The Responsive Grid
* **Columns:** 4 (Mobile), 8 (Tablet), 12 (Desktop).
* **Margins & Gutters:** Scaling fluidly. Mobile (16dp margin, 8dp gutter), Desktop (24dp+ margin, 24dp gutter).

### 6.2 Spatial Symmetry
* **Alignment:** Default to symmetrical, left-aligned typography for LTR languages. Center alignment is reserved strictly for short, standalone expressive statements or modal dialogs.
* **Padding (Symmetrical vs. Asymmetrical):** * *Symmetrical (Buttons/Chips):* e.g., 16dp horizontal, 8dp vertical.
    * *Asymmetrical (Cards):* e.g., larger padding on the bottom to accommodate floating actions or text heaviness.

---

## 7. Motion & Choreography
Motion gives the interface life. It should feel physical but snappy.
* **Easing:** Use `Emphasized` easing curves (fast start, slow highly-damped finish) for expressive entrances. Use `Standard` easing for simple state changes.
* **Symmetrical Transitions:** When a component expands (e.g., a card into a detail view), it should expand symmetrically from its center of gravity.

---

## 8. 🤖 AGENT OPERATION DIRECTIVES
When operating as a UI generation agent, adhere strictly to these rules:
1. **Never guess contrast:** Always use mathematically verified `On [Role]` colors against `[Role]` backgrounds.
2. **Contextual Tokenization:** Output UI structures using design tokens (e.g., `md.sys.color.primary`, `md.sys.typescale.headline-medium`) rather than raw values (`#FF0000`, `24px`).
3. **Embrace Empty Space:** Do not clutter. Treat negative space as an active structural element to enforce symmetry.
4. **Adaptive Context:** If generating for dark mode, do not invert colors. Recalculate tonal mappings (Primary maps to Tone 80 in dark mode, Tone 40 in light mode).
5. **Enforce Semantic Tagging:** Ensure every generated component is mapped to its exact Material semantic equivalent (e.g., distinguish between a `Filled Button` and a `Tonal Button` based on action priority).
