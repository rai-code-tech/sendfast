# SendFast - Encrypted File Transfer

## Project Overview
Build a modern, encrypted file transfer SaaS inspired by transfer.zip. The product lets users send files of any size with end-to-end encryption, no account required for basic transfers. Premium features include branding, analytics, and receive links.

**Brand Name:** SendFast
**Tagline:** "Send files. Fast. Encrypted."

## Tech Stack (STRICT - do not deviate)
- **Framework:** Next.js 15 (latest, App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** Better Auth (email + password authentication)
- **Payments:** Stripe (subscriptions)
- **Storage:** MinIO (S3-compatible) for file storage
- **Encryption:** Web Crypto API (client-side E2E encryption)
- **Real-time:** WebSocket or Server-Sent Events for transfer progress

## Superpowers Skills (MUST USE)
You have access to superpowers skills. Use them in this order for every feature:

1. **Before ANY implementation:** Use `/superpowers:brainstorming` to explore the feature design
2. **Before coding:** Use `/superpowers:writing-plans` to create a step-by-step plan
3. **When implementing:** Use `/superpowers:test-driven-development` - write tests FIRST
4. **When executing plans:** Use `/superpowers:executing-plans` for systematic execution
5. **Before claiming done:** Use `/superpowers:verification-before-completion` to verify everything works
6. **After major features:** Use `/superpowers:requesting-code-review` to review quality

## Core Features to Build

### Phase 1 - MVP (Build This First)
1. **Landing Page** - Clean, trust-focused with hero, features, pricing, trust badges
2. **File Upload & Share** (free tier, no account needed)
   - Drag & drop file upload
   - Client-side E2E encryption (AES-256-GCM)
   - Generate shareable download link
   - Progress bar for upload/download
   - Auto-expire after 24h (free) or configurable (paid)
   - Password protection option
   - Up to 2GB per transfer (free), 10GB (paid)
3. **Download Page** - Clean page to download shared files with decryption
4. **User Auth** - Optional sign up for premium features
5. **Dashboard** - Manage active transfers, see download stats

### Phase 2 - Monetization
6. **Stripe Subscriptions** - Free / Pro ($9/mo) / Business ($19/mo)
7. **Custom Branding** - Logo, colors, custom background on download page
8. **Advanced Analytics** - Download count, location, device, time
9. **Receive Links** - Personalized upload links to receive files from others
10. **Email Notifications** - Notify sender when file is downloaded

### Phase 3 - Growth
11. **Direct P2P Transfer** - WebRTC peer-to-peer for instant transfers
12. **Team Features** - Shared workspace, team branding
13. **API Access** - REST API for programmatic file transfers
14. **Custom Domains** - White-label download pages

## Database Schema (Prisma)
Design tables for: User, Subscription, Transfer, Download, ReceiveLink

## How Encryption Works
1. User selects file(s) in browser
2. Browser generates random AES-256-GCM key
3. File is encrypted client-side using Web Crypto API
4. Encrypted file is uploaded to MinIO via chunked upload
5. Encryption key is embedded in URL fragment (#key=...) - never sent to server
6. Recipient opens link, browser extracts key from URL fragment
7. Encrypted file is downloaded and decrypted client-side
8. Server NEVER sees the unencrypted file or encryption key

## Pricing Plans
- **Free:** 2GB per transfer, 24h expiry, 5 transfers/day, basic encryption
- **Pro ($9/mo):** 10GB per transfer, 30-day expiry, unlimited transfers, password protection, analytics
- **Business ($19/mo):** Everything in Pro + custom branding, receive links, email notifications, API access

## Design Guidelines
- Clean, minimal, trust-evoking design (think: security + speed)
- Dark mode support
- Mobile-responsive
- Prominent encryption/security badges
- Upload experience must feel fast and smooth
- Inspired by transfer.zip but with our own brand identity
- Use blues/greens for trust colors

## File Structure
```
src/
  app/
    (marketing)/        # Landing, pricing, about pages
    (auth)/             # Login, register
    dashboard/          # User dashboard
    upload/             # File upload page
    d/[id]/             # Download page (public)
    receive/[slug]/     # Receive link page
    api/                # API routes
  components/
    ui/                 # shadcn/ui components
    transfer/           # File transfer components
    layout/             # Header, footer
  lib/
    prisma.ts           # Prisma client
    stripe.ts           # Stripe helpers
    auth.ts             # Auth config
    crypto.ts           # Encryption/decryption helpers
    minio.ts            # MinIO client
    upload.ts           # Chunked upload logic
  types/
```

## Environment Variables Needed
```
DATABASE_URL=postgresql://sendfast:sendfast@localhost:5433/sendfast
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
MINIO_ENDPOINT=localhost
MINIO_PORT=9002
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
```

## Commands
- `npm run dev` - Start dev server
- `npx prisma migrate dev` - Run migrations
- `npx prisma studio` - Database GUI
- `npm run build` - Production build
- `npm test` - Run tests

## CRITICAL: Auth Migration Required
The project currently uses NextAuth (next-auth). This MUST be replaced with Better Auth (better-auth npm package).
- Remove all next-auth, @auth/prisma-adapter, @auth/core dependencies
- Install `better-auth` package
- Configure Better Auth with email+password authentication in `src/lib/auth.ts`
- Update Prisma schema to match Better Auth's required tables (user, session, account, verification)
- Update all auth-related API routes, middleware, and components
- Remove `src/types/next-auth.d.ts`
- Remove `src/app/api/auth/[...nextauth]/` route
- Create Better Auth API route at `src/app/api/auth/[...all]/route.ts`
- Update session provider, navbar, sign-in/sign-up pages to use Better Auth client
- See https://www.better-auth.com/docs for documentation

## Important Notes
- ENCRYPTION KEY MUST NEVER BE SENT TO SERVER - use URL fragment (#)
- Use chunked upload for large files (multipart upload to MinIO)
- Implement proper cleanup cron for expired transfers
- Rate limit public upload endpoint
- Use server components where possible
- All API routes should validate input with zod
- Show clear security indicators to build user trust
- File download must support resume (Range headers)
- Commit changes after completing each major feature
