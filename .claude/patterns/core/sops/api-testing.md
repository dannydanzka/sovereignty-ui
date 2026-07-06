# SOP: API Testing with Claude

> **PURPOSE**: Test API endpoints directly from Claude using curl/httpie
> **SCOPE**: QA, debugging, integration validation, API exploration
> **PREREQUISITES**: API credentials, endpoint documentation
> **UPDATED**: 2026-02-23

---

## 1. Activate API Testing Mode

Provide Claude with:

```
1. Environment: QA / STAGING / PROD / DEV
2. Base URL: https://api.example.com
3. Auth method: Bearer token / API key / Basic auth / Cookie
4. Credentials: (per session, not stored)
5. Endpoint to test: METHOD /path
6. Test data: IDs, files, payloads
```

### Example Request

```
Test the endpoint POST /api/users
- Environment: QA
- Base URL: https://api-qa.example.com
- Auth: Bearer token (login first)
- User: testuser@example.com
- Password: [provided]
- Payload: { "name": "Test User", "email": "new@example.com" }
```

---

## 2. Authentication Patterns

### Pattern A: Bearer Token (JWT)

```bash
# Step 1: Login to get token
TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }' | jq -r '.token')

# Step 2: Use token in subsequent requests
curl -s -X GET "$BASE_URL/api/users" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### Pattern B: Large Tokens (Save to File)

For large tokens (>10KB), save to file to avoid shell issues:

```bash
# ✅ CORRECT - Save token to file
curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass"}' \
  | jq -r '.token' > /tmp/api_token.txt

# Use from file
curl -s -X GET "$BASE_URL/api/users" \
  -H "Authorization: Bearer $(cat /tmp/api_token.txt)" | jq '.'

# ❌ INCORRECT - Variable may truncate large tokens
TOKEN=$(curl ... | jq -r '.token')
curl -H "Authorization: Bearer $TOKEN" ...  # May fail!
```

### Pattern C: API Key

```bash
curl -s -X GET "$BASE_URL/api/data" \
  -H "X-API-Key: your-api-key-here" | jq '.'
```

### Pattern D: Cookie-Based

```bash
# Login and save cookies
curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass"}' \
  -c /tmp/cookies.txt

# Use cookies in subsequent requests
curl -s -X GET "$BASE_URL/api/users" \
  -b /tmp/cookies.txt | jq '.'
```

---

## 3. Request Types

### GET - Query Data

```bash
curl -s -X GET "$BASE_URL/api/users?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# With path parameters
curl -s -X GET "$BASE_URL/api/users/123" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### POST - Create Resource

```bash
curl -s -X POST "$BASE_URL/api/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }' | jq '.'
```

### PUT/PATCH - Update Resource

```bash
# Full update (PUT)
curl -s -X PUT "$BASE_URL/api/users/123" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Updated", "email": "john@example.com"}' | jq '.'

# Partial update (PATCH)
curl -s -X PATCH "$BASE_URL/api/users/123" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Updated"}' | jq '.'
```

### DELETE - Remove Resource

```bash
curl -s -X DELETE "$BASE_URL/api/users/123" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### POST with File Upload (multipart/form-data)

```bash
curl -s -X POST "$BASE_URL/api/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/document.pdf" \
  -F "description=Test upload" | jq '.'

# Multiple files
curl -s -X POST "$BASE_URL/api/upload/bulk" \
  -H "Authorization: Bearer $TOKEN" \
  -F "files[]=@/path/to/file1.jpg" \
  -F "files[]=@/path/to/file2.jpg" | jq '.'
```

### POST with CSV File

```bash
# Create CSV file
cat > /tmp/import.csv << 'EOF'
name,email,role
John Doe,john@example.com,user
Jane Doe,jane@example.com,admin
EOF

# Upload CSV
curl -s -X POST "$BASE_URL/api/users/import" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/tmp/import.csv" | jq '.'
```

---

## 4. Response Interpretation

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

### Extracting Specific Fields

```bash
# Get just the data
curl ... | jq '.data'

# Get specific field
curl ... | jq '.data.id'

# Get array length
curl ... | jq '.data | length'

# Get first item
curl ... | jq '.data[0]'

# Filter array
curl ... | jq '.data[] | select(.status == "active")'
```

---

## 5. Common Error Debugging

| HTTP Code | Error | Common Cause | Solution |
|-----------|-------|--------------|----------|
| 400 | Bad Request | Invalid payload | Check JSON syntax, required fields |
| 401 | Unauthorized | Missing/invalid token | Re-authenticate, check token |
| 403 | Forbidden | Insufficient permissions | Check user role, endpoint permissions |
| 404 | Not Found | Invalid endpoint/ID | Verify URL, check if resource exists |
| 422 | Unprocessable | Validation failed | Check field values, constraints |
| 500 | Server Error | Backend issue | Check server logs, report bug |

### Debug Flags

```bash
# Show headers
curl -s -i -X GET "$BASE_URL/api/users" \
  -H "Authorization: Bearer $TOKEN"

# Verbose mode (show request details)
curl -v -X GET "$BASE_URL/api/users" \
  -H "Authorization: Bearer $TOKEN"

# Show only response code
curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/api/users" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 6. Environment Configuration

### Template for Project-Specific Config

Create in your project's `.claude/rules/reference/api-testing-config.md`:

```markdown
# API Testing Configuration

## Environments

| Environment | Base URL | Auth URL |
|-------------|----------|----------|
| DEV | http://localhost:3000 | http://localhost:3000/api/auth |
| QA | https://api-qa.example.com | https://api-qa.example.com/api/auth |
| STAGING | https://api-staging.example.com | https://api-staging.example.com/api/auth |
| PROD | https://api.example.com | https://api.example.com/api/auth |

## Test Users

| Environment | Email | Role |
|-------------|-------|------|
| QA | qa-admin@example.com | admin |
| QA | qa-user@example.com | user |

## Quick Commands

\`\`\`bash
# Set environment
export BASE_URL="https://api-qa.example.com"
export AUTH_URL="$BASE_URL/api/auth"

# Login
curl -s -X POST "$AUTH_URL/login" ...
\`\`\`
```

---

## 7. Synchronize Code with API

When tests reveal discrepancies between API and code:

### Files to Update

| Type | Location | What to Update |
|------|----------|----------------|
| **Interfaces** | `src/types/` or `src/domain/entities/` | Request/Response types |
| **Services** | `src/services/` or `src/infrastructure/services/` | Endpoint methods |
| **Mocks** | `src/mocks/` or `__mocks__/` | Test data |

### Synchronization Process

```
1. Identify discrepancy (API response ≠ code interface)
2. Update interface with correct structure
3. Update mocks to reflect real data
4. Update service if endpoint changed
5. Run type-check: yarn type-check
6. Run tests: yarn test
```

---

## 8. Testing Checklist

Before considering endpoint tested:

- [ ] Happy path works (valid input → expected output)
- [ ] Authentication verified (token required endpoints reject without token)
- [ ] Validation works (invalid input → appropriate error)
- [ ] Edge cases handled (empty arrays, null values, max limits)
- [ ] Error messages are user-friendly
- [ ] Response structure matches documentation/interfaces

---

## 9. Useful jq Recipes

```bash
# Pretty print
curl ... | jq '.'

# Compact output
curl ... | jq -c '.'

# Get keys
curl ... | jq 'keys'

# Count items
curl ... | jq '.data | length'

# Map to specific fields
curl ... | jq '.data[] | {id, name}'

# Filter by condition
curl ... | jq '.data[] | select(.status == "active")'

# Sort by field
curl ... | jq '.data | sort_by(.createdAt)'

# Group by field
curl ... | jq '.data | group_by(.status)'
```

---

## 10. Bulk Testing Helper

For testing all endpoints in a project systematically:

```bash
# Define helper function
test_ep() {
  local method=$1 url=$2 body=$3
  if [ -n "$body" ]; then
    code=$(curl -s -o /tmp/ep_response.json -w "%{http_code}" -X "$method" "$BASE_URL$url" \
      -H "Authorization: Bearer $(cat /tmp/api_token.txt)" \
      -H "X-Forwarded-For: 192.168.1.100" \
      -H "Content-Type: application/json" \
      -d "$body")
  else
    code=$(curl -s -o /tmp/ep_response.json -w "%{http_code}" -X "$method" "$BASE_URL$url" \
      -H "Authorization: Bearer $(cat /tmp/api_token.txt)" \
      -H "X-Forwarded-For: 192.168.1.100")
  fi
  preview=$(python3 -c "import json; d=json.load(open('/tmp/ep_response.json')); print(json.dumps(d)[:150])" 2>/dev/null || echo "(non-json)")
  echo "$code | $method $url | $preview"
}

# Usage
test_ep GET "/api/users"
test_ep POST "/api/users" '{"name":"Test","email":"test@test.com"}'
```

### Rate Limit Bypass (Development Only)

When rate limits block testing, use different `X-Forwarded-For` IPs:

```bash
# Different IPs for rate-limited endpoints
curl -H "X-Forwarded-For: 192.168.1.101" ...
curl -H "X-Forwarded-For: 192.168.1.102" ...
```

**WARNING**: Only works in development. Production infrastructure sets real IP.

---

## 11. Test Results Snapshot

After bulk testing, create a snapshot at `.claude/status/API-TESTING-SNAPSHOT.md`:

```markdown
# API Testing Snapshot

> **Date**: YYYY-MM-DD
> **Environment**: DEV/QA/PROD
> **User**: email (role)

## Summary Table
| Category | Total | 200 | 400 | 401 | 403 | 405 | 500 |

## Per-Endpoint Results
| HTTP | Endpoint | Status | Response |

## Issues Found
- Documentation mismatches
- Missing endpoints
- Security concerns
```

---

## See Also

- **Pattern**: `.claude/patterns/frontend/nextjs/api-routes.md` - API route implementation
- **Pattern**: `.claude/patterns/frontend/infrastructure/services.md` - Service layer
- **Per-project config**: `.claude/rules/reference/api-testing-config.md`
- **Per-project results**: `.claude/status/API-TESTING-SNAPSHOT.md`
