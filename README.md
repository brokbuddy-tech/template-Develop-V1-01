# template-Develop-V1-01

Standalone Next.js public template for client deployments.

Required env vars:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_ORG_SLUG`

Deployment contract:

- Canonical public routes stay root-based, for example `/about`, `/agents/:agentSlug`, and `/property/:id`
- Browser data and asset requests flow through `/api/public-template-proxy/*`
- The organization slug and template hex code are resolved server-side and never exposed in browser fetch URLs
- Browser requests use the `/api/public-template` rewrite defined in `next.config.ts`

Checks before deploy:

- `npm run typecheck`
- `npm run build`

Reference:

- See [templates/README.md](../../README.md) for the shared deployment contract
