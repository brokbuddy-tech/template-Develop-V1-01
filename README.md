# template-Develop-V1-01

Standalone Next.js public template for client deployments.

Required env vars:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_ORG_SLUG`
- `TEMPLATE_HEX_CODE`

Deployment contract:

- Data loads from `/api/public/templates/:slug/:templateHexCode`
- Browser requests use the `/api/public-template` rewrite defined in `next.config.ts`

Checks before deploy:

- `npm run typecheck`
- `npm run build`

Reference:

- See [templates/README.md](../../README.md) for the shared deployment contract
