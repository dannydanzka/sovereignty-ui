# Media Patterns

> **Module**: frontend/media
> **Scope**: Images, uploads, storage
> **Updated**: 2026-03-23

---

## Patterns

| Pattern | Purpose | Priority |
|---------|---------|----------|
| `images.md` | Image component with fallback, static vs dynamic | High |
| `uploads.md` | File upload, cloud storage, image processing | High |

---

## TL;DR

**Component decision**:
```
Static asset (bundled)  → next/image + static import
Dynamic URL (may fail)  → <Image> component with fallback
```

**Upload flow**:
```
File → Resize/process → Cloud Storage → URL
```

---

## When to Consult

- Displaying images → `images.md`
- Uploading files → `uploads.md`
- Image error handling → `images.md`

---

**Total**: 2 patterns | **Updated**: 2026-03-23
