# BeeManHoney Frontend

A premium React e-commerce frontend for BeeManHoney (formerly BarkmanHoney), built with React, TypeScript, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1.  Navigate to the project directory:
    ```bash
    cd Frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Development
Start the development server:
```bash
npm run dev
```

### Build
Build for production:
```bash
npm run build
```
The output will be in the `dist/` directory.

## 🛠 Tech Stack

-   **Core:** React 18, TypeScript, Vite
-   **Styling:** Tailwind CSS
-   **Routing:** React Router DOM (HashRouter used for static hosting compatibility)
-   **Icons:** Lucide React

## 🎨 Design System & Deviations

### Brand Updates
-   **Name:** All instances of "BarkmanHoney" replaced with "BeeManHoney".
-   **Currency:** All pricing converted to INR (₹) with Indian locale formatting (e.g., ₹1,800).
-   **Region:** Context adapted for India (e.g., shipping texts, addresses in Contact page).

### Colors (Tailwind Config)
-   Primary (Honey Gold): `#FFA726`
-   Secondary (Deep Amber): `#D46F00`
-   Background: `#FDF8E4`
-   Text: `#4A2C2A`

### Implementation Details
-   **Images:** Used the source URLs provided in the reference HTML files to ensure high visual fidelity.
-   **Responsive Design:** Implemented mobile-first approaches. Some pages (Login, Recipes, History) are designed primarily for mobile viewports as per the reference designs but center gracefully on desktop.
-   **Navigation:**
    -   Desktop: Top sticky header.
    -   Mobile: Sticky bottom navigation bar for app-like feel on specific pages.

### Placeholders
-   Specific logic for "Cart" and "Auth" is UI-only (stateless or local state) as requested (Frontend only).
-   Product filtering works on the Client Side.

## 📂 Project Structure

-   `src/components`: Reusable UI components (Header, Footer, MobileNav).
-   `src/pages`: Individual page views matching the provided HTML files.
-   `src/utils`: Helper functions (Currency formatting).
-   `src/types.ts`: TypeScript definitions.
