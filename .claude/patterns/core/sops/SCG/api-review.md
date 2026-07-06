# SCG Step 7: API Review

> **Input**: API contracts from external docs or ticket system
> **Output**: Verified endpoints, typed interfaces matching actual responses
> **Trigger**: Only when backend delivers new/changed APIs

---

## Procedure

### 7.1 Read the contract

Source: external docs page `Contrato API - <Feature>` or ticket system attachments.

Extract:
- Base URL + endpoint path
- HTTP method (GET, POST, PATCH, DELETE)
- Request body shape
- Response body shape
- Error responses
- Auth requirements

### 7.2 Test with curl

```bash
# Authenticate first
curl -s -X POST "$AUTH_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"USER","password":"PASS","tokenCSRF":"EEbOfre_9VgcuIRhHfEUp","includedStrategies":["your-strategy"]}' \
  | jq -r '.data.sessionToken' > /tmp/bn3_token.txt

# Test the endpoint
curl -s -X GET "$URL/endpoint" \
  -H "Authorization: Bearer $(cat /tmp/bn3_token.txt)" | jq '.'
```

### 7.3 Verify response shape

| Check | How |
|-------|-----|
| Fields match contract | Compare curl response vs external docs doc |
| Types match | string vs number vs boolean — match TypeScript interfaces |
| Nullability | Which fields can be `null` or `undefined`? |
| Error format | What does the error response look like? |
| Pagination | Is the response paginated? What are the params? |

### 7.4 Create/update interfaces

Based on ACTUAL response (not just contract), create typed interfaces:

```typescript
export interface FeatureResponse {
  data: FeatureItem[];
  total: number;
  page: number;
}
```

---

## Rules

- Test against QA/DEV environment — never production
- If response differs from contract, flag to developer and backend team
- Config URLs from `config/default.json` — NEVER hardcode
- See `rules/sop/api-testing.md` for auth URLs and credentials reference
