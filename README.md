# Vermazing · Hand Crafted Vegan Soaps

A small marketing site for **Vermazing** — small-batch, hand crafted vegan soaps made with plant
butters and pure essential oils. Kind to your skin, kind to the planet.

Built as a fast, dependency-light static site with [Vite](https://vitejs.dev/) and vanilla
JavaScript, ready to deploy on [Cloudflare](https://developers.cloudflare.com/pages/).

## Products

| Soap | Highlight |
| --- | --- |
| Crystal Triple Butters | Cocoa, Mango & Shea butters in one bar |
| Oatmeal & Shea Butter | Gentle exfoliation with real oatmeal flecks |
| Shea Butter | Pure, simple, skin-friendly care |
| NCO | Clarity & rich lather |

Product content lives in [`src/main.js`](src/main.js) and was extracted from the source document
`handmade soaps.odt`. Full ingredient sheets are included as PDFs in the repository root.

## Getting started

Requires [Node.js](https://nodejs.org/) (18+ recommended).

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:5173)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview the production build locally
npm run preview
```

## Project structure

```
.
├── index.html          # App entry / <head> metadata
├── src/
│   ├── main.js         # Product data + page rendering
│   └── style.css       # Styles
├── public/             # Static assets (favicon, product images)
├── package.json        # Scripts & dependencies (Vite, Wrangler)
└── Ingredients_*.pdf   # Full ingredient sheets per product
```

## Deployment

The project includes [Wrangler](https://developers.cloudflare.com/workers/wrangler/) as a dev
dependency for deploying to Cloudflare Pages. Build first, then deploy the `dist/` output.

## License

All product content, images, and formulations are © Vermazing. All rights reserved.
