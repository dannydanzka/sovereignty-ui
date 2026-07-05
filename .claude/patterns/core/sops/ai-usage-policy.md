# AI Usage Policy: Claude Code in Enterprise Environments

> **Version**: 1.0.0 | **Created**: 2026-02-17 | **Author**: Danny Ramirez
> **Scope**: Enterprise teams using Claude Code CLI for software development
> **Classification**: Internal - Security Policy

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Anthropic's Protection Mechanisms](#2-anthropics-protection-mechanisms)
3. [Data Flow: What Stays Local vs What Goes to Anthropic](#3-data-flow)
4. [Plan Comparison: Consumer vs Commercial](#4-plan-comparison)
5. [Mandatory Enterprise Configuration](#5-mandatory-enterprise-configuration)
6. [Permission Model & Access Controls](#6-permission-model)
7. [Telemetry Controls](#7-telemetry-controls)
8. [Hooks: Runtime Security Gates](#8-hooks-runtime-security-gates)
9. [Compliance & Certifications](#9-compliance--certifications)
10. [IP Ownership & Legal Protections](#10-ip-ownership--legal-protections)
11. [Risk Matrix](#11-risk-matrix)
12. [Recommended Enterprise Deployment](#12-recommended-enterprise-deployment)
13. [Policy Checklist](#13-policy-checklist)
14. [References](#14-references)

---

## 1. Executive Summary

Claude Code is Anthropic's CLI tool that provides AI-assisted software development directly in the terminal. It reads local files, executes commands, and communicates with Anthropic's API to generate code suggestions and perform development tasks.

**Key guarantees under Commercial Terms (API/Team/Enterprise):**

- Code is **NOT used for model training** (unless explicitly opted in)
- Data retention is **30 days by default**, configurable to **zero** (ZDR)
- All transmission is **encrypted via TLS**
- Anthropic holds **SOC 2 Type II**, **ISO 27001**, and **ISO 42001** certifications
- Customer **owns all outputs** with copyright indemnification
- Enterprise plan provides **SSO, audit logs, SCIM, and compliance API**

**Critical requirement**: Teams MUST use Commercial Terms (API key or Team/Enterprise plan), never consumer plans (Free/Pro/Max) for proprietary code work.

---

## 2. Anthropic's Protection Mechanisms

### 2.1 No Training on Commercial Data

Anthropic explicitly commits:

> "Anthropic does not train generative models using code or prompts sent to Claude Code under commercial terms, unless the customer has chosen to provide their data for model improvement."

This applies to: API usage, Team plans, Enterprise plans.

**Exception**: The [Development Partner Program](https://support.claude.com/en/articles/11174108-about-the-development-partner-program) is opt-in only.

### 2.2 Data Retention

| Account Type | Retention | Notes |
|---|---|---|
| **Commercial (standard)** | 30 days | Default for all API traffic |
| **Commercial with ZDR** | Zero | Data discarded after response returned |
| **Enterprise (custom)** | Configurable | Custom retention controls available |
| **Consumer (training OFF)** | 30 days | Not recommended for enterprise use |
| **Consumer (training ON)** | Up to 5 years | **NEVER use for proprietary code** |

### 2.3 Zero Data Retention (ZDR)

ZDR ensures data submitted through API endpoints is not stored after the API response is returned.

**Exceptions even under ZDR:**
- User Safety classifier results (abuse prevention)
- Productivity/metrics metadata (no code content)
- `/bug` command transcripts (5-year retention, can be disabled)

### 2.4 Encryption

| Layer | Standard |
|---|---|
| In transit | TLS (all API communications) |
| At rest (telemetry) | AES-256 |
| API credentials | Encrypted via secure credential storage |

### 2.5 Restricted Access

Anthropic enforces restricted access to user session data internally. Access is limited to authorized personnel under strict audit controls.

---

## 3. Data Flow

### 3.1 What Stays LOCAL (never leaves your machine)

- Source code files on disk (read locally by Claude Code)
- Local session cache (`.claude/projects/`)
- Permission configurations and settings
- `.claude/` directory contents
- Git history and local branches
- Environment variables and credentials files

### 3.2 What Gets SENT to Anthropic's API

| Data | When | Purpose |
|---|---|---|
| User prompts | Every interaction | LLM processing |
| File contents read by `Read` tool | When Claude reads a file | Context for code generation |
| Bash command outputs | When Claude executes commands | Understanding command results |
| `Grep`/`Glob` results | When Claude searches | File paths and matching lines |
| CLAUDE.md contents | Session start | System instructions |
| Model responses | Every interaction | Returned to user |

**Important**: When Claude reads a file, the **actual file content** (up to 2,000 lines) is sent to the API, not a summary. Line truncation occurs at 2,000 characters per line.

### 3.3 What Gets Sent to Third-Party Telemetry

| Service | Data | Default State |
|---|---|---|
| **Statsig** | Latency, reliability, usage metrics (NO code/paths) | ON (1P API) / OFF (Bedrock/Vertex) |
| **Sentry** | Operational error logs | ON (1P API) / OFF (Bedrock/Vertex) |
| **Feedback surveys** | Numeric rating only (1/2/3) | ON (1P API) / OFF (Bedrock/Vertex) |

---

## 4. Plan Comparison: Consumer vs Commercial

| Dimension | API / Commercial | Consumer (Free/Pro/Max) |
|---|---|---|
| Training on data | **NO** | YES (default, opt-out available) |
| Default retention | 30 days | 30 days / 5 years (if training ON) |
| ZDR available | **YES** | NO |
| IP ownership | **Customer owns all outputs** | License to use |
| Copyright indemnification | **YES** | NO |
| BAA / HIPAA | **Available** | NO |
| Enterprise controls | **Full suite** | None |

### Decision

**MANDATORY**: All enterprise development MUST use Commercial Terms (API key, Team, or Enterprise plan). Consumer plans are prohibited for work on proprietary codebases.

---

## 5. Mandatory Enterprise Configuration

### 5.1 Managed Settings (IT-Deployed)

Managed settings are the highest-priority configuration, deployed by IT and cannot be overridden by users.

**Location**: `/Library/Application Support/ClaudeCode/managed-settings.json` (macOS)

```json
{
  "permissions": {
    "deny": [
      "Bash(curl *)",
      "Bash(wget *)",
      "Bash(git push --force *)",
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Read(//**/credentials*)"
    ],
    "allow": [
      "Bash(git status *)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Bash(npm run lint *)",
      "Bash(npm run test *)",
      "Bash(npm run build *)"
    ]
  },
  "env": {
    "DISABLE_TELEMETRY": "1",
    "DISABLE_ERROR_REPORTING": "1",
    "DISABLE_BUG_COMMAND": "1",
    "CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY": "1"
  },
  "disableBypassPermissionsMode": true,
  "allowManagedPermissionRulesOnly": false,
  "allowManagedHooksOnly": false
}
```

### 5.2 Critical Managed-Only Settings

| Setting | Purpose | Recommendation |
|---|---|---|
| `disableBypassPermissionsMode` | Prevents `--dangerously-skip-permissions` | **ALWAYS true** |
| `allowManagedPermissionRulesOnly` | Only IT-defined rules apply | true for high-security teams |
| `allowManagedHooksOnly` | Only IT-defined hooks can run | true for regulated environments |

### 5.3 Environment Variables (Minimum Enterprise)

```bash
# Disable ALL non-essential external traffic (master switch)
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1

# Or granular control:
export DISABLE_TELEMETRY=1
export DISABLE_ERROR_REPORTING=1
export DISABLE_BUG_COMMAND=1
export CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY=1

# Optional: hide account info from UI
export CLAUDE_CODE_HIDE_ACCOUNT_INFO=1
```

---

## 6. Permission Model

### 6.1 Rule Evaluation Order

Rules evaluate in strict order: **deny -> ask -> allow** (first match wins, deny always takes precedence).

### 6.2 Tool Permission Tiers

| Tool Type | Examples | Default Behavior |
|---|---|---|
| Read-only | Read, Grep, Glob | Auto-allowed |
| File modification | Edit, Write | Requires approval (session-scoped) |
| Command execution | Bash | Requires approval (project-permanent) |

### 6.3 Permission Modes

| Mode | Behavior | Enterprise Use |
|---|---|---|
| `default` | Prompts for each tool first use | Recommended |
| `plan` | Read-only, no modifications | Code review sessions |
| `acceptEdits` | Auto-accepts file edits | Trusted development |
| `bypassPermissions` | Skips ALL checks | **PROHIBITED** (disable via managed settings) |

### 6.4 Built-in Security Protections

These protections work regardless of permission configuration:

- **Command injection detection**: Suspicious bash commands flagged even if allowlisted
- **Shell operator awareness**: `safe-cmd && malicious-cmd` cannot bypass prefix rules
- **Write restriction**: Claude Code can only write to launch directory and subdirectories
- **Fail-closed matching**: Unrecognized commands default to requiring manual approval
- **MCP server trust**: First-time servers require explicit trust verification

### 6.5 Settings Precedence (Highest to Lowest)

1. **Managed settings** (IT-deployed, cannot be overridden)
2. **Command line arguments**
3. **Local project** (`.claude/settings.local.json` - gitignored)
4. **Shared project** (`.claude/settings.json` - committed)
5. **User settings** (`.claude/settings.json`)

---

## 7. Telemetry Controls

### 7.1 Master Kill Switch

```bash
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1
```

This single variable disables: Statsig telemetry, Sentry error reporting, `/bug` command, feedback surveys, and auto-updater.

### 7.2 Granular Controls

| Variable | Disables |
|---|---|
| `DISABLE_TELEMETRY=1` | Statsig analytics |
| `DISABLE_ERROR_REPORTING=1` | Sentry error logs |
| `DISABLE_BUG_COMMAND=1` | `/bug` transcript sending |
| `CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY=1` | Feedback prompts |
| `DISABLE_AUTOUPDATER=1` | Auto-update checks |
| `DISABLE_NON_ESSENTIAL_MODEL_CALLS=1` | Non-essential LLM calls |

### 7.3 Third-Party Provider Defaults

| Traffic Type | Claude API (1P) | Bedrock/Vertex (3P) |
|---|---|---|
| Telemetry | ON | **OFF by default** |
| Error reporting | ON | **OFF by default** |
| Bug reports | ON | **OFF by default** |
| Surveys | ON | **OFF by default** |

**Recommendation**: If using direct Claude API, explicitly disable all non-essential traffic. If using Bedrock/Vertex, defaults are already secure.

### 7.4 OpenTelemetry (Your Own Observability)

For routing metrics to your internal observability stack:

```bash
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_ENDPOINT=https://your-otel-collector:4318
```

---

## 8. Hooks: Runtime Security Gates

Hooks are shell commands that execute at specific lifecycle points, enabling custom security enforcement.

### 8.1 Security-Critical Hook Events

| Event | Purpose | Can Block? |
|---|---|---|
| `PreToolUse` | Validate before tool execution | **YES** (deny/allow) |
| `UserPromptSubmit` | Filter user input | **YES** |
| `PermissionRequest` | Override permission dialogs | **YES** |
| `PostToolUse` | Audit after execution | No (feedback only) |

### 8.2 Example: Block Sensitive File Access

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read|Edit|Write",
        "type": "command",
        "command": "bash -c 'INPUT=$(cat); FILE=$(echo \"$INPUT\" | jq -r \".tool_input.file_path // .tool_input.path // empty\"); if echo \"$FILE\" | grep -qE \"\\.(env|pem|key|secret)$|credentials|secrets/\"; then echo \"BLOCKED: Access to sensitive file\" >&2; exit 2; fi'"
      }
    ]
  }
}
```

### 8.3 Example: Audit Log All Tool Usage

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "type": "command",
        "command": "bash -c 'INPUT=$(cat); echo \"$(date -u +%Y-%m-%dT%H:%M:%SZ) | tool=$(echo $INPUT | jq -r .tool_name) | session=$CLAUDE_SESSION_ID\" >> /var/log/claude-code-audit.log'",
        "async": true
      }
    ]
  }
}
```

### 8.4 Hook Security Properties

- Hooks snapshot at session startup; mid-session changes require explicit review
- `allowManagedHooksOnly: true` blocks all user/project-defined hooks
- Exit code 2 = block action; exit code 0 = allow; other = non-blocking error
- Async hooks run in background without blocking execution

---

## 9. Compliance & Certifications

### 9.1 Anthropic Certifications

| Certification | Status | Scope |
|---|---|---|
| **SOC 2 Type I** | Obtained | General security controls |
| **SOC 2 Type II** | Obtained | Operational effectiveness over time |
| **ISO 27001:2022** | Obtained | Information Security Management |
| **ISO/IEC 42001:2023** | Obtained | AI Management Systems |
| **HIPAA** | Ready (requires BAA + ZDR) | Healthcare data protection |

SOC 2 Type II report available under NDA via [Anthropic Trust Center](https://trust.anthropic.com).

### 9.2 Enterprise Plan Features

| Feature | Purpose |
|---|---|
| SAML 2.0 / OIDC SSO | Centralized authentication |
| SCIM provisioning | Automated user lifecycle |
| Domain capture | Claim all users under company domain |
| Audit logs (180 days) | Activity tracking and export |
| Compliance API | Programmatic access to usage data |
| Role-based permissions | Granular access control |
| Custom data retention | Organization-defined retention windows |

### 9.3 Maximum Isolation: Bedrock/Vertex Deployment

For organizations requiring data to never leave their cloud account:

| Provider | Benefit |
|---|---|
| **AWS Bedrock** | Data stays in your AWS account; Anthropic never sees prompts/outputs |
| **Google Vertex AI** | Data stays in your GCP project; same isolation |

Configuration:

```bash
# AWS Bedrock
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-east-1

# Google Vertex AI
export CLAUDE_CODE_USE_VERTEX=1
export CLOUD_ML_REGION=us-east5
export ANTHROPIC_VERTEX_PROJECT_ID=your-project-id
```

---

## 10. IP Ownership & Legal Protections

### 10.1 Under Commercial Terms

- **Customer owns all outputs**: Anthropic explicitly disclaims rights to generated code
- **Copyright indemnification**: Anthropic defends customers against infringement claims for authorized use
- **No training**: Code submitted under commercial terms is not used to improve models

### 10.2 Legal Considerations

- AI-generated code copyright depends on level of human creative involvement (US law)
- The more human direction/selection, the stronger the copyright claim
- Purely AI-generated works may not qualify for copyright under current precedent
- Recommendation: Use Claude Code as an assistant (human directs, selects, modifies), not as autonomous generator

### 10.3 Applicable Agreements

| Plan | Terms |
|---|---|
| API / Team / Enterprise | [Commercial Terms of Service](https://www.anthropic.com/legal/commercial-terms) |
| Free / Pro / Max | [Consumer Terms of Service](https://www.anthropic.com/legal/consumer-terms) |

---

## 11. Risk Matrix

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Code sent to Anthropic API | Certain | Medium | Commercial terms + ZDR + Bedrock/Vertex |
| Anthropic trains on code | None (commercial) | Critical | Commercial terms guarantee no training |
| Sensitive files exposed | Low | High | Deny rules + hooks for `.env`, secrets |
| Unauthorized commands | Low | High | Permission model + managed settings |
| Telemetry leaks metadata | Low | Low | `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1` |
| `/bug` sends full transcript | Medium | High | `DISABLE_BUG_COMMAND=1` |
| IP ownership disputes | Low | Medium | Commercial terms + human-directed usage |
| Data breach at Anthropic | Very Low | Critical | SOC 2 + ZDR + Bedrock for max isolation |
| Bypass permissions mode | Low | Critical | `disableBypassPermissionsMode: true` |

---

## 12. Recommended Enterprise Deployment

### Tier 1: Standard Enterprise (API + Controls)

```
Commercial API Key + Managed Settings + Telemetry Disabled + Permission Rules
```

- Use Commercial Terms (API or Team plan)
- Deploy managed settings via IT
- Disable all non-essential traffic
- Define deny rules for sensitive paths
- Train developers on permission model

### Tier 2: High Security (ZDR + Hooks)

```
Tier 1 + Zero Data Retention + Custom Hooks + Audit Logging
```

- Enable ZDR on API keys
- Deploy security hooks for file access control
- Implement audit logging via PostToolUse hooks
- Use `allowManagedPermissionRulesOnly: true`
- Regular audit log reviews

### Tier 3: Maximum Isolation (Cloud Provider)

```
Tier 2 + AWS Bedrock or Google Vertex AI
```

- Route all traffic through your own cloud account
- Anthropic never sees prompts or outputs
- All non-essential traffic OFF by default
- Full compliance with data residency requirements
- Combine with VPC controls and network policies

---

## 13. Policy Checklist

### Before First Use

- [ ] Confirm Commercial Terms (API/Team/Enterprise) are active
- [ ] Deploy managed settings to all developer machines
- [ ] Set `disableBypassPermissionsMode: true`
- [ ] Configure deny rules for `.env`, secrets, credentials, PEM files
- [ ] Set `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1` globally
- [ ] Disable `/bug` command (`DISABLE_BUG_COMMAND=1`)
- [ ] Request SOC 2 Type II report from [trust.anthropic.com](https://trust.anthropic.com)

### Ongoing

- [ ] Review audit logs quarterly (Enterprise plan)
- [ ] Update managed settings when security policies change
- [ ] Verify ZDR status if applicable
- [ ] Monitor for new Claude Code versions and security updates
- [ ] Train new developers on permission model and approved workflows
- [ ] Review hooks configuration annually

### Prohibited Actions

- [ ] Using consumer plans (Free/Pro/Max) for proprietary code
- [ ] Running with `--dangerously-skip-permissions`
- [ ] Using `/bug` command with sensitive code in context
- [ ] Disabling managed settings
- [ ] Sharing API keys between personal and enterprise use

---

## 14. References

| Resource | URL |
|---|---|
| Claude Code Security Docs | https://code.claude.com/docs/en/security |
| Claude Code Data Usage | https://code.claude.com/docs/en/data-usage |
| Claude Code Permissions | https://code.claude.com/docs/en/permissions |
| Claude Code Hooks | https://code.claude.com/docs/en/hooks |
| Claude Code Settings | https://code.claude.com/docs/en/settings |
| Anthropic Trust Center | https://trust.anthropic.com |
| Anthropic Privacy Center | https://privacy.claude.com |
| Commercial Terms of Service | https://www.anthropic.com/legal/commercial-terms |
| Consumer Terms Update | https://www.anthropic.com/news/updates-to-our-consumer-terms |
| ZDR Documentation | https://platform.claude.com/docs/en/build-with-claude/zero-data-retention |
| Enterprise Plans | https://www.anthropic.com/enterprise |
| Legal & Compliance | https://code.claude.com/docs/en/legal-and-compliance |
| Sandboxing Architecture | https://www.anthropic.com/engineering/claude-code-sandboxing |

---

**Document Control**: This policy should be reviewed quarterly or when Anthropic updates their terms/features. Last verified against Anthropic documentation: 2026-02-17.
