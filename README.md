# Nomad / Studio

## Short write-up

I built the experience around a guided workspace-builder flow: users choose a desk, chair, accessories, and lighting vibe while a shared workspace state keeps the live preview, summary, and pricing in sync. I used Next.js with the App Router and TypeScript for the application structure, React state for the interactive configuration, and Three.js through React Three Fiber for the 3D scene; the visual system is implemented with responsive CSS and design tokens.

From a business perspective, I would use more time to validate which customer segments and workspace bundles drive demand, then test rental duration, pricing, and delivery messaging to improve conversion and retention. I would connect checkout to real inventory, payment, and logistics systems so availability and margins are accurate, and add analytics around the builder funnel to identify drop-off points. I would also explore a lighter-weight preview for lower-powered devices so the interactive experience remains accessible to more prospective customers.