# Project: ShopFront

A personal portfolio with many ASCII style transitions, showcasing my photos, projects, and past work. This project uses NextJS's App Router style.

## Code Style

- TypeScript strict mode, no `any` types
- This project uses bun.
- Use named exports, not default exports
- CSS: Tailwind utility classes, no custom CSS files
- Use common design tokens for color, be mindful of mobile/desktop as well as light/dark layouts
- Use CSS Modules (index.module.css)
    - For GSAP, use data-id attributes (`data-id="foo"`) to select elements, create them as needed

## Commands

- `bun dev`: Start development server (port 3000)

## Architecture

- `/amplify`: Amplify backend to fetch Flickr Photos
- `/src/components/`: Reusable UI components

## Important Notes

- NEVER commit .env files
- Product images are stored in Flickr
- This project uses GSAP and motion packages for smooth transitions. Use GSAP for any scroll animation and motion for simple transitions (hover,click, AnimatePresence). Use your best judgement.