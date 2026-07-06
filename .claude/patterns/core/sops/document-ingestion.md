# SOP: Document Ingestion — Convert Files to Queryable Knowledge

> **PURPOSE**: Convert documents (pdf, docx, xlsx, pptx, html, images, audio) into Markdown that Claude Code and any knowledge base can query
> **SCOPE**: Any file that contains operational, business, or analytical knowledge currently trapped in a binary format
> **PREREQUISITES**: MarkItDown CLI (`pip install 'markitdown[all]'`) + optional knowledge base (Confluence, Notion, etc.)
> **TOOL OF RECORD**: MarkItDown (Microsoft) — single tool, all formats. Pandoc/pandas remain as fallback only.
> **UPDATED**: 2026-06-27

---

## When to Use This SOP

A document should be ingested when it contains knowledge that is currently trapped in a file and needs to be accessible to developers, non-technical users, or as raw material for analysis.

| Document type | Example | Action |
|---------------|---------|--------|
| Process/flow documentation | "User Activation Flow.docx" | Convert → publish to knowledge base |
| API contract spec | "API Contract - Billing.xlsx" | Convert → publish as research doc |
| Business rules reference | "Business Rules - Catalog.pdf" | Convert → publish as module page |
| Meeting decisions | Minutes with decisions + action items | Convert → publish as decisions page |
| Bulk document corpus | A multi-year folder tree of statements/invoices | **Batch convert** → mirror to `_md/` (see §3) |

**Do NOT ingest:**
- Draft documents (ingest only when content is final or stable)
- Files with personal data (PII: RFC/SSN, account numbers, salary, CLABE) — see §5 before converting or committing
- Financial results not yet disclosed — follow `ai-usage-policy.md`

---

## Tool of Record: MarkItDown

MarkItDown converts **every common format to Markdown with one command**, which makes it superior to the old pandoc + pandas split for ingestion.

```bash
# Install once (CLI — not the MCP server; the CLI is what batch work needs)
pip install 'markitdown[all]'

# Single file → stdout
markitdown report.pdf

# Single file → Markdown file
markitdown statement.xlsx -o statement.md
```

| Format | Supported | Notes |
|--------|-----------|-------|
| PDF (text) | ✅ | Full text + tables extracted |
| docx / pptx | ✅ | mammoth / python-pptx under the hood |
| xlsx / xls / csv | ✅ | Sheets rendered as Markdown tables |
| html / xml / json / epub / zip | ✅ | |
| **Images (png/jpg) & scanned PDFs** | ⚠️ | Only EXIF/metadata without an LLM — **no OCR**. See §4. |
| Audio | ⚠️ | Transcription requires extra config |

> **Why not just `Read` the PDF?** For one-off reads, the native Read tool is fine. For a **corpus** (dozens–hundreds of files) you want durable `.md` on disk: greppable, diffable, queryable, and reusable across sessions without re-reading binaries every time.

---

## 1. Single Document

```bash
markitdown /path/document.pdf -o /path/document.md
```

For PDFs longer than ~20 pages that you only partially need, the native `Read` tool with a page range is still the lightest option.

---

## 2. Excel with Multiple Sheets

MarkItDown flattens an `.xlsx` into Markdown automatically. If you need per-sheet control, pandas remains the fallback:

```bash
python3 -c "
import pandas as pd
xl = pd.ExcelFile('/path/file.xlsx')
for s in xl.sheet_names:
    print(f'## Sheet: {s}'); print(xl.parse(s).to_markdown(index=False)); print()
"
```

---

## 3. Batch Conversion (a folder tree)

For a whole directory tree, use the reusable script. It creates an `_md/` subfolder inside **each** folder, mirroring structure, leaving originals untouched. It is **idempotent** (skips files already converted) and logs progress + failures.

```bash
# per-folder mode (default): SOURCE/<each folder>/_md/<name>.md
core/sops/scripts/markitdown-batch.sh /path/to/corpus

# mirror mode: SOURCE/_extraccion/<relative path>/<name>.md
core/sops/scripts/markitdown-batch.sh /path/to/corpus mirror
```

Script: [`scripts/markitdown-batch.sh`](scripts/markitdown-batch.sh)

**What it does:**
- Skips `.md`, `.DS_Store`, and anything already inside `_md/` / `_extraccion/`
- Validates each output is non-empty; deletes and logs empties as failures
- Writes `_markitdown-progress.log` and `_markitdown-failed.log` at the source root
- Prints a final `ok / fail / skip / total` summary

**Run a large batch in the background** and check the progress log instead of blocking the session.

---

## 4. Images & Scanned PDFs (OCR)

MarkItDown does **not** OCR without an LLM. Image files and image-based PDFs produce empty output (the script logs them as failures). Options:

1. **Connect an LLM to MarkItDown** for image descriptions:
   ```bash
   # Requires an OpenAI-compatible client configured in a small Python wrapper
   # markitdown(..., llm_client=client, llm_model="...")
   ```
2. **Native multimodal Read** — for a handful of images, `Read /path/image.png` lets Claude read them directly.
3. **Dedicated OCR** (`tesseract`, cloud Document Intelligence) for high-volume scanned corpora.

> Expect every text-bearing file to convert and every pure-image file to need one of the above. A batch run where the only failures are images/scans is a **clean** result, not a broken one.

---

## 5. PII & Sovereignty Caveat

Converted Markdown is **plain text and trivially greppable** — that makes sensitive data more exposed, not less.

- Identify PII before converting: RFC/tax IDs, account numbers, CLABE/IBAN, salaries, health data.
- For knowledge-base publishing: **anonymize first**.
- For private analysis corpora (e.g. a personal financial history): keep originals + `_md/` **out of version control** — add the data directory to `.gitignore` before the first commit.
- When in doubt, follow `ai-usage-policy.md`.

---

## 6. Publishing to a Knowledge Base (optional)

| Content type | Destination |
|--------------|-------------|
| Module operational knowledge | Platform Knowledge section |
| Feature research doc | Technical Research section |
| Business rules reference | Module page |

After creation: add the page URL to a knowledge index, and a "See also" link from the related module's docs.

---

## 7. Checklist

- [ ] MarkItDown installed (`markitdown --version`)
- [ ] Stable/operational content (not a draft)
- [ ] PII identified → anonymized (publishing) or `.gitignore`d (private corpus)
- [ ] Converted: single (`markitdown`) or batch (`markitdown-batch.sh`)
- [ ] Reviewed `_markitdown-failed.log` — failures are images/scans only, or handled via §4
- [ ] (If publishing) Published + indexed + query-tested

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `markitdown: command not found` | CLI not installed / wrong env | `pip install 'markitdown[all]'`; check `which markitdown` |
| Empty `.md` output | Image or scanned PDF | OCR path — see §4 |
| `ReadTimeoutError` during install | `[all]` pulls heavy deps (onnxruntime) | Retry with `pip install --default-timeout=120 'markitdown[all]'` |
| Garbled tables / OCR artifacts | Bank/structured PDFs with digital signatures | Normal — data is present; clean during the distillation step, not ingestion |
| Batch re-runs everything | Output dir changed | Script is idempotent only if the `_md/` outputs persist next to sources |

---

## Anti-Patterns

| Don't | Do Instead |
|-------|-----------|
| Install `markitdown-mcp` to batch hundreds of files | Use the CLI + `markitdown-batch.sh` (one loop, not N tool calls) |
| Convert a corpus by hand, file by file | Run the batch script in the background |
| Commit converted PII to git | `.gitignore` the data dir; anonymize before publishing |
| Treat image failures as a broken run | Expected without OCR — handle via §4 |

---

## See Also

- [`scripts/markitdown-batch.sh`](scripts/markitdown-batch.sh) — Reusable batch converter
- `core/sops/ai-usage-policy.md` — Data protection rules before pasting content
- `core/sops/mcp-setup.md` — MCP server configuration (if the MarkItDown MCP is ever needed)
- `core/sops/mcp-confluence.md` — Confluence MCP full reference
