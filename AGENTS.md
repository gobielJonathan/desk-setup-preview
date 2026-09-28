# Project guidance

## Product

Nomad / Studio is a workspace-rental configurator. The main journey is:

1. Configure a desk, chair, accessories, and lighting vibe at `/`.
2. See the selection reflected in the interactive 3D workspace, summary, and quote.
3. Continue to `/checkout`, choose a rental duration, validate delivery details, and show a confirmation state.

The current checkout is a client-side preview; it does not collect payment or call a backend.

## Agent skills

Load the relevant skill before starting work in its area:

- `.agents/skills/frontend-design/SKILL.md` — Read when building new UI or reshaping existing UI. Use it for distinctive visual direction, typography, layout, motion, interface copy, accessibility, and reduced-motion decisions.
- `.agents/skills/nextjs-app-architecture/SKILL.md` — Read before scaffolding, adding features, auditing, or refactoring this Next.js App Router app. Use it for React Server Component composition, feature placement, server/client boundaries, Suspense and skeletons, route props, actions, and caching.

## Source of truth

- `lib/catalog.ts` owns product types, IDs, prices, colors, and accessory limits.
- `lib/pricing.ts` owns rental durations and quote calculations.
- `lib/workspace-store.tsx` owns `WorkspaceState`, reducer actions, context helpers, and local-storage persistence. Use `useWorkspace()` instead of creating parallel selection state or price math.
- `features/workspace/components/workspace-builder.tsx` owns the builder flow; `features/checkout/components/checkout-experience.tsx` owns duration selection, delivery validation, and confirmation. The route files compose those feature components.
- `components/scene/Workspace3D.tsx` maps workspace state to the React Three Fiber scene. `WorkspaceScene.tsx` is the client-only dynamic boundary.
- `app/globals.css` owns design tokens, responsive layout, component styling, and reduced-motion behavior.

Keep product IDs stable because saved selections reference them. When adding an accessory, update its catalog entry, quote behavior if needed, and its 3D placement/rendering together.

## Change boundaries

- Keep quote and duration logic in `lib/pricing.ts`; consumers should render its result.
- Route selection changes through the workspace reducer and context so the builder, 3D preview, summary, and checkout stay synchronized.
- Reuse the existing CSS variables and responsive patterns before introducing new visual tokens.
- Preserve the warm, editorial Nomad / Studio visual language and verify both desktop and mobile layouts for UI changes.
- For 3D changes, keep the compact checkout scene usable and retain a loading fallback, reduced-motion support, and reasonable rendering cost.

## Verification

Before handing off a change:

1. Run `npm run lint`.
2. Run `npm run build`.
3. Manually verify that builder selections update the preview, summary, and price; checkout duration changes update the quote; invalid delivery fields show errors; and a valid submission reaches confirmation.
4. Check the affected flow at mobile width and with reduced motion enabled.

The change is complete when the relevant source of truth is updated, all dependent views remain synchronized, and the verification steps pass.
