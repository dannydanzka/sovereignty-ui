# Media Uploads

> **Module**: frontend/media
> **Stack**: Sharp + Supabase Storage + WebP conversion

---

## TL;DR

**DO**:
- Server-side processing ONLY (Sharp)
- WebP conversion for all images
- `.rotate()` FIRST (EXIF normalization)
- Service role key for RLS bypass
- `credentials: 'include'` in fetch
- Cleanup on save failure (rollback)

**DON'T**:
- Client-side image processing
- Skip EXIF rotation (causes bugs)
- Allow image replacement on edit (orphans)
- Expose service role key to client

---

## Architecture Flow

```
Component → useFileUpload → /api/upload
    ↓
validateFile() → processImage() → supabase.upload()
    ↓
Return public URL
```

---

## Size Limits

| Bucket | Limit | Use Case |
|--------|-------|----------|
| profiles | 5 MB | Avatars |
| gallery | 10 MB | Gallery images |
| evidenceImage | 10 MB | Evidence photos |
| evidenceVideo | 50 MB | Evidence videos |
| documents | 25 MB | PDFs, Word |

---

## Image Processing

```typescript
// CRITICAL: .rotate() normalizes EXIF orientation
let sharpInstance = sharp(buffer).rotate();

// Resize if exceeds max
if (metadata.width > preset.maxDimension) {
  sharpInstance = sharpInstance.resize(preset.maxDimension);
}

// Convert to WebP
const result = await sharpInstance.webp({ quality: 85 }).toBuffer();
```

---

## Quality Presets

| Preset | Quality | Max Dimension |
|--------|---------|---------------|
| high | 85% | 2000px |
| medium | 75% | 1600px |
| low | 60% | 1200px |

---

## API Route Pattern

```typescript
export const POST = withAuthMiddleware(
  async (request: NextRequest) => {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as string;

    // Validate
    const validation = validateFile(file, bucket);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error, success: false });
    }

    // Process image
    const processed = await processImage(fileBuffer, file.type, 'high');

    // Upload to Supabase
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, processed.buffer);

    return NextResponse.json({ success: true, url: publicUrl, path: data.path });
  },
  ['admin', 'participant']
);
```

---

## Cleanup on Failure

```typescript
let uploadedPath: string | null = null;

try {
  const result = await upload();
  uploadedPath = result.path;
  await saveToDatabase({ imageUrl: result.url }); // May fail
} catch (error) {
  if (uploadedPath) {
    await cleanupUploadedFile(bucket, uploadedPath); // Rollback
  }
  throw error;
}
```

---

## Edit Mode Restriction

```typescript
{isEditing ? (
  // Read-only when editing (NO replacement)
  <ReadOnlyImage src={formData.imageUrl} />
) : (
  // Full dropzone when creating
  <Dropzone onDrop={handleFileSelect} />
)}
```

**Why**: Image replacement creates orphaned files.

---

## Related

- `frontend/media/images.md` - Image handling patterns
- `frontend/infrastructure/services.md` - Service patterns

