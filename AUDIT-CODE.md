# AreaIQ Code Quality Audit — March 2026

**Overall Grade: B+**

Well-built, production-ready solo-developer codebase with genuinely impressive patterns and a few notable gaps. The architecture is clean, TypeScript is strict, and error handling is thoughtful. Security and testing are the weak spots that prevent elite grade.

---

## What's Elite

### Architecture
- **Scoring engine isolation.** `src/lib/scoring-engine.ts` is pure, deterministic, and completely separated from the AI layer. Scores computed first, then enforced post-AI response (`generate-report.ts:268-276`). The AI can never lie about numbers.
- **Data source abstraction.** Each of the 7 sources has its own file under `src/lib/data-sources/` with consistent pattern: type, fetch function, format-for-prompt function.
- **Parallel data fetching.** All 7 external APIs called via `Promise.all` with individual timeouts.
- **Server/client split.** `page.tsx` (server) + `client.tsx` (client) pattern used consistently.

### TypeScript
- **Zero `any` types** across the entire codebase. Genuinely rare.
- **`strict: true`** in tsconfig.
- **Clean domain types** in `src/lib/types.ts`.

### Error Handling
- **Graceful degradation.** Every data source returns `null` on failure. Scoring engine handles all nulls with fallback scores (typically 50). A single API failure never crashes the whole report.
- **Fail-safe telemetry.** Activity tracking wrapped in try/catch so analytics never break main request path.
- **Consistent API errors.** Every route returns `{ error: "message" }` with correct HTTP status codes.

### Dependencies
- **Minimal.** Only 7 production deps. No bloated component libraries.
- **Current.** Next.js 16.1.6, React 19.2.3.
- **Properly separated.** Dev deps (Tailwind, ESLint, TS types) in devDependencies.

---

## Critical Issues

### ~~1. SHA-256 for password hashing (no salt, no bcrypt)~~ DONE (AR-73)
Replaced with PBKDF2-SHA256 (600,000 iterations, random 16-byte salt) in `src/lib/crypto.ts`. All 4 duplicate `hashPassword` and 4 duplicate `generateToken` functions eliminated. Backward-compatible: old hashes detected and transparently re-hashed on next login. Constant-time comparison.

### ~~2. Report GET has no auth check (IDOR)~~ DONE
Auth check added to GET `/api/report/[id]`. Now requires session and verifies `user_id` matches, consistent with DELETE. Returns 401 if unauthenticated, 404 if report doesn't belong to user.

### 3. Zero tests
No unit tests, integration tests, or e2e tests. No Jest, Vitest, or Playwright config.

The scoring engine is pure functions with deterministic outputs — perfect for unit testing. Validation module and cache key normalization are also highly testable.

**Fix:** Add Vitest. Start with scoring-engine.ts (highest value, easiest to test).

---

## Important Issues

### 4. Massive code duplication (PARTIALLY DONE)
- ~~`hashPassword` duplicated in **4 files**~~ DONE - extracted to `src/lib/crypto.ts`
- ~~`generateToken` duplicated in **4 files**~~ DONE - extracted to `src/lib/crypto.ts`
- `ensureUsersTable` duplicated in **2 files** - still needs extracting
- `getRAG` (score-to-color mapping) duplicated in **4 files** plus similar logic in 2 more - still needs extracting

### 5. Unprotected JSON.parse on AI response
**File:** `src/lib/generate-report.ts:266`
```typescript
const report: AreaReport = JSON.parse(textContent.text);
```
If Claude returns malformed JSON (LLMs do this), this throws an unhandled exception.

**Fix:** Wrap in try/catch. Retry once on parse failure. Return structured error if both fail.

### 6. In-memory rate limiter resets on cold starts
**File:** `src/lib/rate-limit.ts`

Uses a module-level `Map` which resets on each Vercel cold start and is not shared across instances. Rate limits are effectively per-instance, not per-user.

**Fix:** Use Vercel KV or Neon for rate limit state.

### 7. Widget endpoint unauthenticated
**File:** `src/app/api/widget/route.ts:96-99`

Generates full reports (including Claude API calls) on cache misses with no authentication. Anyone can trigger expensive AI calls.

**Fix:** Add spending cap, require domain allowlist, or serve cached-only results.

### 8. Account deletion not transactional
**File:** `src/app/api/settings/delete-account/route.ts:14-19`

6 sequential DELETE statements. If one fails midway, user data is partially deleted.

**Fix:** Wrap in a Postgres transaction.

### 9. String interpolation in external API queries
**Files:** `src/lib/data-sources/deprivation.ts:21`, `src/lib/data-sources/land-registry.ts:69`

Constructs query strings via string interpolation for ArcGIS and SPARQL endpoints. Injection vectors against third-party APIs.

**Fix:** Sanitize/encode all interpolated values. Use parameterized queries where the API supports it.

### 10. Stripe webhook signature fallback
**File:** `src/app/api/stripe/webhook/route.ts:59-61`

If `STRIPE_WEBHOOK_SECRET` is not set, falls back to `JSON.parse(body)` with no verification.

**Fix:** Remove the fallback. Fail hard if secret is missing.

---

## Moderate Issues

### 11. No formal DB migration system
All schema via inline `CREATE TABLE IF NOT EXISTS` and `ALTER TABLE ADD COLUMN IF NOT EXISTS`. Works for solo dev but dangerous with multiple contributors.

### 12. `ensureTable` called on every request (10 files, 28 calls)
Some files use `let tableReady = false` guard, others don't. Inconsistent and adds unnecessary DB round-trips.

### 13. No error typing
All error handling is `catch (error)` with `console.error`. No custom error classes (RateLimitError, DataSourceError, etc.).

### 14. Large files need splitting
- `src/app/area/[slug]/page.tsx`: 2,368 lines
- `src/app/home-client.tsx`: 1,286 lines
- `src/components/report-view.tsx`: 1,026 lines
- `src/app/dashboard/client.tsx`: 900 lines

### 15. No shared UI primitives
Score badges, terminal cards, stat boxes reimplemented inline across multiple files. No `src/components/ui/` directory.

### 16. `/admin` not in middleware matcher
**File:** `src/middleware.ts`

Admin page does its own auth check but is not in the middleware matcher.

### 17. SQL result types require excessive casting
~50+ instances of `as string`, `as number` on Neon query results. A typed query wrapper or Zod validation at the DB boundary would eliminate these.

---

## Scores by Category

| Category | Grade | Notes |
|----------|-------|-------|
| Architecture & Structure | B+ | Clean separation, but files too large |
| TypeScript Quality | A- | Zero `any`, strict mode, but heavy type assertions from SQL |
| Error Handling | B+ | Graceful degradation everywhere, but no error types |
| **Security** | **C+** | **SHA-256 passwords, IDOR, injection in external queries** |
| Performance | B | Good parallelism, but in-memory rate limiter is per-instance |
| Code Style & Consistency | B | Consistent naming, but severe code duplication |
| Database | B | Parameterized queries, but no migrations or transactions |
| API Design | B+ | Clean errors and rate limiting, but unauthenticated widget |
| **Testing** | **F** | **Zero tests** |
| Dependencies | A | Minimal, current, properly separated |

---

## Priority Fix Order

1. Replace SHA-256 with bcrypt/scrypt for password hashing
2. Add auth check to GET `/api/report/[id]`
3. Add Vitest + scoring engine unit tests
4. Extract duplicated functions to shared modules
5. Wrap JSON.parse on AI response in try/catch with retry
6. Sanitize inputs to external API queries
7. Remove webhook signature verification fallback
8. Add `/admin` to middleware matcher
9. Wrap account deletion in transaction
10. Add authentication/spending caps to widget endpoint
