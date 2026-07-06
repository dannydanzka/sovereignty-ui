# Stripe Integration Pattern

> **Layer**: Infrastructure
> **Purpose**: Payment processing with Stripe
> **Mode**: Checkout Sessions (redirect) - NOT Elements
> **Version**: 1.0.0

---

## Overview

Stripe Checkout Sessions provide a hosted payment page. This pattern uses **redirect mode** (not embedded Elements) for simplicity and PCI compliance.

**Key Concepts**:
- **Checkout Session**: Server-side object that creates a payment page
- **Payment Intent**: Represents a payment attempt (created by Checkout)
- **Webhook**: Server callback when payment status changes
- **Metadata**: Custom data attached to payments for tracking

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      STRIPE CHECKOUT FLOW                           │
└─────────────────────────────────────────────────────────────────────┘

Frontend                    Backend                         Stripe
────────                    ───────                         ──────
    │                           │                              │
    │ 1. Click "Pay"            │                              │
    │ ─────────────────────────►│                              │
    │                           │ 2. Create Checkout Session   │
    │                           │ ────────────────────────────►│
    │                           │                              │
    │                           │◄──── Session URL + ID ───────│
    │◄── Redirect to Stripe ────│                              │
    │                           │                              │
    │ 3. Complete payment on Stripe hosted page ──────────────►│
    │                           │                              │
    │◄── Redirect to success_url (with session_id) ───────────│
    │                           │                              │
    │                           │◄─ 4. Webhook: payment_intent │
    │                           │      .succeeded              │
    │                           │                              │
    │                           │ 5. Update database           │
    │                           │    (mark as paid)            │
    │                           │                              │
```

---

## File Structure

```
src/
├── libs/infrastructure/config/stripe/
│   ├── stripe.config.ts           # Server-side Stripe SDK
│   └── index.ts
├── app/api/
│   ├── public/payment/checkout/
│   │   └── route.ts               # Create checkout session
│   └── webhooks/stripe/
│       └── route.ts               # Handle webhooks
└── apps/{context}/domain/use-cases/payment/
    ├── create-checkout-session/
    │   ├── create-checkout-session.use-case.ts
    │   └── create-checkout-session.interfaces.ts
    └── process-webhook/
        ├── process-webhook.use-case.ts
        └── process-webhook.interfaces.ts
```

---

## Environment Variables

```bash
# Server-side (NEVER expose to client)
STRIPE_SECRET_KEY=sk_test_...      # Test: sk_test_, Live: sk_live_
STRIPE_WEBHOOK_SECRET=whsec_...    # From Stripe CLI or Dashboard

# Client-side (safe to expose)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Security Rules**:
- `STRIPE_SECRET_KEY`: Server-only, never in client bundle
- `STRIPE_WEBHOOK_SECRET`: Server-only, for signature verification
- `NEXT_PUBLIC_*`: Safe for client, used only if using Elements

---

## Server Configuration

### Stripe SDK Setup

```typescript
// src/libs/infrastructure/config/stripe/stripe.config.ts
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env['STRIPE_SECRET_KEY'];
const STRIPE_WEBHOOK_SECRET = process.env['STRIPE_WEBHOOK_SECRET'];

if (!STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

if (!STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is required');
}

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-09-30.acacia',  // Use latest stable
  typescript: true,
});

export { STRIPE_WEBHOOK_SECRET };
```

---

## Creating Checkout Sessions

### Use Case Pattern

```typescript
// create-checkout-session.use-case.ts
import { stripe } from '@config';

interface CreateCheckoutParams {
  orderId: string;
  userId: string;
  items: Array<{
    name: string;
    description: string;
    amount: number;  // In cents (e.g., $10.00 = 1000)
    quantity: number;
  }>;
  successUrl: string;
  cancelUrl: string;
}

export const executeCreateCheckoutSession = async (
  params: CreateCheckoutParams
) => {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',

    // Line items (products/services)
    line_items: params.items.map((item) => ({
      price_data: {
        currency: 'usd',  // or 'mxn', 'eur', etc.
        product_data: {
          name: item.name,
          description: item.description,
        },
        unit_amount: item.amount,
      },
      quantity: item.quantity,
    })),

    // CRITICAL: Metadata in BOTH locations
    metadata: {
      orderId: params.orderId,
      userId: params.userId,
    },
    payment_intent_data: {
      metadata: {
        orderId: params.orderId,
        userId: params.userId,
      },
    },

    // Redirect URLs
    success_url: `${params.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: params.cancelUrl,
  });

  return {
    sessionId: session.id,
    url: session.url,
  };
};
```

### Critical: Metadata Propagation

**ALWAYS set metadata in BOTH locations**:

```typescript
stripe.checkout.sessions.create({
  // Session-level metadata (for session queries)
  metadata: { orderId, userId },

  // Payment Intent metadata (for webhooks)
  payment_intent_data: {
    metadata: { orderId, userId },
  },
});
```

**Why?** The webhook receives `payment_intent.succeeded`, which only has access to `payment_intent.metadata`, NOT session metadata.

---

## Webhook Handler

### API Route Pattern

```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe, STRIPE_WEBHOOK_SECRET } from '@config';

// Verify webhook signature
const verifySignature = (
  body: string,
  signature: string
): Stripe.Event | null => {
  try {
    return stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return null;
  }
};

export const POST = async (request: NextRequest) => {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    );
  }

  const event = verifySignature(body, signature);
  if (!event) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle specific events
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { orderId, userId } = paymentIntent.metadata;

      // Delegate to use case
      await executeProcessPayment({ orderId, userId, paymentIntent });
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      // Handle failure...
      break;
    }
  }

  // Always return 200 to acknowledge receipt
  return NextResponse.json({ received: true });
};
```

### Events to Handle

| Event | When | Action |
|-------|------|--------|
| `payment_intent.succeeded` | Payment completed | Mark order as paid |
| `payment_intent.payment_failed` | Payment failed | Notify user, log error |
| `checkout.session.completed` | Session completed | Alternative to payment_intent |
| `checkout.session.expired` | Session expired | Cleanup pending order |

---

## Frontend Integration

### Redirect to Checkout

```typescript
// usePayment hook
const handlePayment = async () => {
  const response = await fetch('/api/payment/checkout', {
    method: 'POST',
    body: JSON.stringify({ orderId, items }),
  });

  const { url } = await response.json();

  if (url) {
    window.location.href = url;  // Redirect to Stripe
  }
};
```

### Success Page

```typescript
// app/payment/success/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  // Optionally verify session status
  // Usually webhook has already processed payment

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Your order is being processed.</p>
    </div>
  );
};
```

---

## Testing

### Test Cards

| Number | Scenario |
|--------|----------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Decline |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0027 6000 3184` | 3D Secure required |

**Expiry**: Any future date
**CVC**: Any 3 digits
**ZIP**: Any 5 digits

### Local Webhook Testing

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Note the webhook signing secret (whsec_...)
# Update STRIPE_WEBHOOK_SECRET in .env.local
```

---

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `signature_verification_failed` | Wrong webhook secret | Update STRIPE_WEBHOOK_SECRET |
| `resource_missing` | Invalid session/payment ID | Verify IDs in metadata |
| `api_key_expired` | Test key expired | Regenerate in Dashboard |
| `amount_too_small` | Amount below minimum | Minimum is 50 cents |

### Webhook Idempotency

Webhooks may be sent multiple times. Always check if already processed:

```typescript
// Check if payment already processed
const existingPayment = await paymentRepo.findByStripeId(paymentIntentId);
if (existingPayment) {
  return { success: true, message: 'Already processed' };
}
```

---

## Security Checklist

- [ ] `STRIPE_SECRET_KEY` only on server
- [ ] Webhook signature always verified
- [ ] Metadata validated before processing
- [ ] Idempotent webhook handling
- [ ] HTTPS in production
- [ ] Test mode for development
- [ ] Live mode only in production

---

## Related Documentation

- [Stripe Checkout Docs](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

---

**Pattern Version**: 1.0.0 | **Created**: 2026-02-12
