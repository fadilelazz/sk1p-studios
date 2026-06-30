# SK1P Studios — Unity Asset Publisher Website

A single-page, dark-themed portfolio site for **SK1P Studios**, a Unity Asset Store publisher. Built with pure HTML, CSS, and JavaScript — no frameworks, no build step.

## Live Sections

1. **Hero** — logo, headline, subtitle, description, and primary/secondary CTAs
2. **About** — studio description with a "viewport" visual panel
3. **Products** — three asset-pack cards (Soviet Apartment Pack, Furniture Collection, Environment Props)
4. **Why Choose SK1P** — four feature cards (Game Ready, Optimized, Clean Topology, PBR Materials)
5. **Contact** — email, business email, Unity Asset Store and GitHub buttons
6. **Footer** — logo, copyright, social icons

## Project Structure

```
sk1p-studios/
├── index.html      # Page markup + SEO meta tags + structured data
├── style.css       # Full design system (variables, layout, responsive rules)
├── script.js       # Preloader, canvas background, scroll animations, nav
├── README.md       # This file
└── assets/
    └── img/        # Drop replacement images/screenshots here
```

## Design System

| Token | Value | Use |
|---|---|---|
| `--bg` | `#111111` | Page background |
| `--bg-alt` | `#1A1A1A` | Card / section surfaces |
| `--text` | `#FFFFFF` | Primary text |
| `--accent` | `#E53935` | Buttons, highlights, icons |
| Font (display/body) | **Inter** | All UI text |
| Font (labels/data) | **JetBrains Mono** | Section tags, stats, status badges |

All colors and spacing live in CSS variables at the top of `style.css` (`:root`), so re-theming only requires editing one block.

## Features Implemented

- **No frameworks** — vanilla HTML/CSS/JS only
- **Fully responsive** — breakpoints at 1024px (tablet) and 768px / 420px (mobile), with a slide-in mobile nav
- **Smooth scrolling** — native `scroll-behavior: smooth` + anchor links
- **Scroll-reveal animations** — `IntersectionObserver`-based fade/slide-in for any element tagged `data-aos`
- **Animated canvas background** — a lightweight particle/wireframe network on `<canvas>`, evoking a 3D viewport
- **Preloader** — branded loading screen with a minimum display time
- **Back-to-top button** — appears after scrolling, smooth-scrolls to hero
- **Accessibility** — visible focus states, semantic landmarks, `aria-label`s on icon-only buttons, and full `prefers-reduced-motion` support (canvas falls back to a static frame, all transitions shorten to ~0ms)
- **SEO** — descriptive `<title>`/meta description, Open Graph + Twitter card tags, canonical URL, and JSON-LD `Organization` schema
- **Performance** — no external JS libraries, system-cached Google Font, debounced resize handling, animation pauses when the tab is hidden

## How to Customize

### Replace placeholder content
- **Logo**: swap the `.hero-logo span` letter and `.brand-mark` text in `index.html`, or replace with an `<img>` tag pointing at `assets/img/logo.png`.
- **Product images**: each `.product-image` currently holds an inline SVG placeholder. Replace the `<svg>` block with an `<img src="assets/img/your-pack.jpg" alt="...">`.
- **Emails / links**: update the `mailto:`, Unity Asset Store, and GitHub URLs in the Contact section and footer.
- **Open Graph image**: add a real `assets/img/og-cover.jpg` (1200×630px recommended) and confirm the `og:image` path in `<head>`.

### Adjust the palette
Edit the variables at the top of `style.css`:
```css
:root {
  --bg: #111111;
  --bg-alt: #1a1a1a;
  --accent: #e53935;
  /* ... */
}
```

### Add or remove products / features
Each product card and feature card is a self-contained block in `index.html` (`.product-card`, `.feature-card`) — copy/paste a block and edit its text to add more.

## Deployment (GitHub Pages)

1. Push this folder to a GitHub repository (e.g. `sk1p-studios.github.io` or any repo with Pages enabled).
2. In the repo settings, enable **GitHub Pages** and point it at the branch/folder containing `index.html`.
3. Update the `canonical`, `og:url`, Unity Asset Store, and GitHub links in `index.html` to your real URLs.
4. Done — no build step required.

## Browser Support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). Uses `IntersectionObserver`, CSS `clamp()`, `backdrop-filter`, and `aspect-ratio` — all widely supported as of 2024+. Graceful fallbacks are included for `IntersectionObserver` and `prefers-reduced-motion`.

---

Built for **SK1P Studios** — Game-Ready 3D Assets for Unity.
