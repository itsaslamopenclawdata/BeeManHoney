# UI/UX Specifications

## 1. Visual Language
-   **Palette**:
    -   Primary: `Honey Gold (#FFA726)`
    -   Secondary: `Deep Amber (#D46F00)`
    -   Text: `Charcoal (#1F2937)`
    -   Background: `Cream (#FAFAF9)`
-   **Typography**: `Open Sans` (Body), `Playfair Display` (Headings).

## 2. Component Specifications

### 2.1. Header (Sticky)
-   **Left**: Logo (Icon + Text).
-   **Center**: Nav Links (Hidden on Mobile).
-   **Right**: Search, User Profile, Cart (Badge).
-   **Interaction**: On scroll, add `shadow-md` and `bg-white/90` backdrop blur.

### 2.2. Product Card
-   **Layout**: Vertical Stack.
-   **Elements**: Image (AspectRatio 1:1), Title (H3), Price (Bold), Add to Cart (Button).
-   **Hover**: Slight `scale-105` and `shadow-lg` lift effect.

### 2.3. AI Chat Widget
-   **State**: Collapsed (Floating Action Button) -> Expanded (Modal/Panel).
-   **Animation**: `AnimatePresence` (framer-motion) slide-up.
-   **Typing Indicator**: "Bee is thinking..." pulsating loader.

## 3. Accessibility (WCAG 2.1 AA)
-   **Contrast**: All text must maintain 4.5:1 ratio.
-   **Keyboard**: Focus trap within Chat Widget.
-   **Semantics**: Use `<article>` for products, `<nav>` for links.
-   **Images**: `alt` tags mandatory for all product images.

## 4. Responsive Breakpoints
-   **Mobile**: < 640px (Hamburger Menu, 1 Col Grid).
-   **Tablet**: 640px - 1024px (2 Col Grid).
-   **Desktop**: > 1024px (3 Col Grid).
