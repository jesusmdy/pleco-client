# Pleco Coding Standards & Way of Work

This document outlines the engineering principles and React best practices for the Pleco application. Adhering to these rules ensures our codebase remains highly maintainable, readable, and scalable.

## 1. Component Architecture (No Waterfall Code)
Avoid monolithic, "waterfall" files where a single component handles dozens of UI responsibilities, complex state, and data fetching all at once.
- **Extract Early & Often**: If a component's `return` statement exceeds 50-60 lines or contains deeply nested UI sections, extract those sections into sub-components.
- **Single Responsibility Principle**: A component should do one thing well. For example, a `Page` component should handle layout and data-fetching orchestration, while delegating the actual rendering of lists, tables, or modals to child components.
- **Colocation**: Place sub-components close to where they are used. If a sub-component is only used by `ProfilePage`, place it in `app/components/profile/`.

## 2. DRY (Don't Repeat Yourself) & Reusability
- **Reusable Primitives**: Build small, generic building blocks (e.g., `<Button>`, `<Modal>`, `<TextInput>`) in `app/components/ui/`. Never hardcode complex CSS for standard buttons inline—always use the shared primitives.
- **Abstract Common Logic**: If you find yourself writing the same UI pattern twice, stop and extract it into a reusable component.
- **Custom Hooks**: Extract complex state management or repeated data-fetching logic into custom hooks (e.g., `useDrive()`) to share behavior across different components without repeating `useQuery` setups.

## 3. State & Logic Separation
- **Dumb vs. Smart Components**: Favor "dumb" (presentation) components that simply receive props and render UI. Keep state and data fetching ("smart" logic) as high up the tree as necessary, passing down data and callbacks.
- **Avoid Inline Functions**: For complex logic, define handler functions outside the `return` statement rather than embedding deep arrow functions inside JSX props.

## 4. TypeScript Best Practices
- **Strict Typing**: Always define `interface` or `type` for component props. Avoid using `any` whenever possible.
- **Descriptive Naming**: Name interfaces clearly (e.g., `UserProfileProps`).
- **Optional Props**: Clearly mark optional props with `?` and provide sensible defaults in the component signature if necessary.

## 5. Styling & Tailwind Conventions
- **Utility Class Ordering**: Group Tailwind classes logically (e.g., layout, then spacing, then typography, then colors, then interactions).
- **Avoid Magic Values**: Rely on the Design System. Do not use arbitrary values like `w-[314px]` or `bg-[#123456]` unless absolutely necessary. Use the established utility tokens.
- **Conditional Classes**: Use template literals for simple conditional classes, or a utility like `clsx` or `tailwind-merge` for complex dynamic class strings.

## 6. Performance & Optimization
- **React Query**: Use `@tanstack/react-query` for all server state. Let it handle caching, background refetching, and loading states.
- **Memoization**: Only use `useMemo` and `useCallback` when passing props to heavily optimized child components or when calculating computationally expensive values. Do not prematurely optimize everything.
- **Lazy Loading**: For extremely heavy components or routes that aren't immediately visible, consider using `React.lazy()` or Next.js `next/dynamic`.

## 7. Next.js App Router Paradigms
- **Client vs. Server Components**: Default to Server Components. Only add `"use client"` at the top of files that require interactivity (`useState`, `onClick`, `useSession`, `useQuery`).
- **Push Interactivity Down**: If a page needs state, try to keep the Page itself a Server Component and import a Client Component to handle the interactive slice of the UI.
