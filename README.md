# aymericfoyer.com

Personal portfolio: photos, projects, and past work, with ASCII-style transitions.
Built with Next.js (App Router), Tailwind, GSAP, and motion. Uses `bun`.

## Run it

```bash
bun install
bun dev        # http://localhost:3000
```

Other scripts: `bun run lint`, `bun run typecheck`, `bun run check:nav`, `bun test`, `bun run build`.

## Editing the site

Everything you are likely to change lives in `src/content/`. Components only
render what those files export, so you should never need to open a component
to change text, a link, or a colour.

| Want to change… | Edit |
|---|---|
| Your name, tagline, tab title, social links, default hero photo | `src/content/site.ts` |
| Nav sections and items | `src/content/nav.ts` |
| Light/dark colours | `src/content/theme.ts` |
| Text on a specific page | `src/app/(main)/<page>/content.ts` |

### Add a nav item

1. Open `src/content/nav.ts` and add an entry to the right section. `label` and `href` are required.
2. Put an animated ASCII preview at `public/images/gifs/<slug>-ascii.gif` and reference it as `preview`.
3. Optionally put a photo at `public/images/nav2/<slug>.jpg` and reference it as `frame`.
4. Create the page (next section).
5. Run `bun run check:nav`. It fails if any internal link has no page.

### Add a page

1. Create `src/app/(main)/<path>/page.tsx` with a default-exported component.
2. If the page has prose, put it in `src/app/(main)/<path>/content.ts` and import from there.
3. Page images go in `public/images/<page>/`.

### Change a colour

Every key in `src/content/theme.ts` has a `light` and a `dark` value and becomes a
CSS variable. To add a new one, add the key there and a matching
`--color-<name>: var(--<name>);` line in `src/app/globals.css`.

## Layout

```
src/
  content/        site-wide editable data (see table above)
  app/            routes; each page folder may have a content.ts
  components/     reusable UI
  store/          zustand stores (theme, transition, hero)
  lib/            small utilities
scripts/          check-nav.ts and its test
amplify/          backend that fetches Flickr photos
public/images/    gifs/ (nav previews), nav2/ (hero frames), <page>/ (page assets)
```
