# Zod Route Validation

> **Module**: frontend/quality
> **Scope**: HTTP boundary input validation in Next.js App Router (and any framework with a `Request` object)
> **Updated**: 2026-05-08

---

## TL;DR

**DO**:
- Validate **every** mutating route body with a Zod schema before touching domain logic.
- Use `.strict()` to reject unknown fields. Extra fields are a contract violation.
- Co-locate the schema with the route: `route.schemas.ts` next to `route.ts`.
- Put the inferred type in a separate `route.schemas.interfaces.ts` (sovereignty `component-organization` rule).
- Convert validation failures to `AppError(VALIDATION, 422)` with `path: message` so the client gets actionable errors.

**DON'T**:
- Cast `await request.json()` to a typed body — that's a lie to the type system.
- Validate inside the use case — by then the impossible state may already have flowed.
- Reuse schemas across unrelated routes; route schemas are per-endpoint contracts.

---

## The helper

```ts
// libs/shared/helpers/http/validate-body.ts
import type { z, ZodTypeAny } from 'zod';
import { AppError } from '../error-handling';

const parseJsonOrThrow = (text: string): unknown => {
  if (text.length === 0) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    throw AppError.create('Invalid JSON body', { code: 'VALIDATION', statusCode: 422 });
  }
};

export const validateBody = async <Schema extends ZodTypeAny>(
  request: Request,
  schema: Schema,
): Promise<z.infer<Schema>> => {
  const text = await request.text();
  const raw = parseJsonOrThrow(text);
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const [first] = parsed.error.issues;
    const path = first?.path.join('.') ?? 'body';
    const message = first?.message ?? 'Invalid body';
    throw AppError.create(`${path}: ${message}`, { code: 'VALIDATION', statusCode: 422 });
  }
  return parsed.data;
};
```

The signature `<Schema extends ZodTypeAny>` (rather than `ZodSchema<T>`) preserves the input/output asymmetry from `transform`-using schemas (e.g., a string parsed into a `Date`).

---

## Schema layout

```
src/app/api/rentals/
├── route.ts
├── route.schemas.ts          ← schemas (Zod)
└── route.schemas.interfaces.ts ← inferred types (per component-organization)
```

```ts
// route.schemas.ts
import { z } from 'zod';

export const createRentalBodySchema = z
  .object({
    equipmentId: z.string().cuid(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    totalDue: z.number().positive().finite(),
  })
  .strict();
```

```ts
// route.schemas.interfaces.ts
import type { z } from 'zod';
import type { createRentalBodySchema } from './route.schemas';

export type CreateRentalBody = z.infer<typeof createRentalBodySchema>;
```

```ts
// route.ts
export async function POST(request: Request) {
  try {
    const body = await validateBody(request, createRentalBodySchema);
    const result = await executeCreateRental({ body, request });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
```

---

## Why `.strict()` is non-negotiable

Without `.strict()`, an attacker can send `{ ..., role: 'admin' }` to a profile-update endpoint and — if any layer naively spreads the body — escalate. `.strict()` makes the schema the **complete** contract: anything not in it is rejected.

---

## Anti-patterns observed

| Smell | Why it's wrong |
|-------|----------------|
| `const body = await request.json() as CreateRentalBody;` | Cast lies. Type system trusts user input. |
| Schema defined inline in the route handler | Loses test reuse, clutters handler. |
| Type co-located in `route.schemas.ts` | Violates `component-organization` rule (types in `.interfaces.ts`). |
| Validation in the use case, not at the route | Domain layer receives unvalidated `unknown`-shaped data. |
| `z.object({...})` without `.strict()` | Mass-assignment vulnerability surface. |

---

**Origin**: Distilled from a post-phase audit that found mutating endpoints accepting unvalidated JSON bodies and casting them to typed shapes.
