# Payments Infrastructure

> **Layer**: Infrastructure
> **Purpose**: Payment processing patterns and integrations

---

## Patterns

| Pattern | Purpose |
|---------|---------|
| [stripe.md](./stripe.md) | Stripe Checkout Sessions integration |

---

## Overview

Payment infrastructure handles external payment processing. All payment logic follows Clean Architecture:

- **Use Cases**: Create checkout, process webhooks
- **Repositories**: Store payment records
- **Config**: SDK initialization, secrets management

---

**Index Version**: 1.0.0 | **Created**: 2026-02-12
