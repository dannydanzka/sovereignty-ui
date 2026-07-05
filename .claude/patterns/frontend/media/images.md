# Image Handling Patterns

> **Scope**: Universal patterns for image management in React/Next.js applications
> **Version**: 1.1
> **Updated**: 2026-02-04

---

## Overview

This pattern covers the complete lifecycle of images in web applications:
- Static assets (bundled with app)
- Dynamic/remote images (URLs from API/database)
- User uploads (to cloud storage)
- Downloads
- Fallback handling
- Optimization

---

## 1. Image Categories

### 1.1 Static Assets (Bundled)

**Use case**: Logos, icons, backgrounds, illustrations bundled with the app.

**Technology**: `next/image` with static imports

```typescript
// ✅ CORRECT - Static imports with next/image
import Image from 'next/image';
import { LogoImage, HeroBackground } from '@assets';

export const Header = () => (
  <Image
    alt="Company Logo"
    src={LogoImage}        // StaticImageData
    priority               // For above-the-fold
    fill                   // Or width/height
  />
);
```

**Benefits**:
- Build-time optimization (WebP, AVIF)
- Automatic srcset generation
- Blur placeholder support
- Guaranteed to exist (build fails if missing)

**When to use**:
- Brand assets (logos, icons)
- Decorative images (backgrounds, illustrations)
- Marketing images (hero sections)
- Any image that ships with the application

---

### 1.2 Dynamic/Remote Images (API URLs)

**Use case**: User avatars, product images, CMS content, any URL from database.

**Technology**: Custom `Image` component with fallback

```typescript
// ✅ CORRECT - Custom Image with implicit fallback
import { Image } from '@components';

export const UserAvatar = ({ user }) => (
  <AvatarWrapper>
    <Image
      alt={user.name}
      src={user.avatarUrl}  // May be null, undefined, or fail to load
    />
  </AvatarWrapper>
);
```

**Component Structure** (5-file pattern):

```
src/libs/presentation/components/common/Image/
├── Image.tsx
├── Image.interfaces.ts
├── Image.styled.ts
├── Image.test.tsx
└── index.ts
```

**Implementation**:

```typescript
// Image.interfaces.ts
export interface ImageProps {
  alt: string;
  className?: string;
  fallbackIcon?: ReactNode;
  fallbackText?: string;
  height?: string | number;
  loading?: 'eager' | 'lazy';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  src?: string | null;
  width?: string | number;
}

// Image.tsx
export const Image = ({
  alt,
  className,
  fallbackIcon,
  fallbackText = 'Sin imagen',
  height,
  loading = 'lazy',
  objectFit = 'cover',
  src,
  width,
}: ImageProps) => {
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  const showFallback = !src || hasError;

  if (showFallback) {
    return (
      <ImageContainer className={className}>
        <FallbackContainer>
          <FallbackIcon>{fallbackIcon ?? <ImageIcon />}</FallbackIcon>
          <FallbackText>{fallbackText}</FallbackText>
        </FallbackContainer>
      </ImageContainer>
    );
  }

  return (
    <ImageContainer className={className}>
      <StyledImage
        alt={alt}
        loading={loading}
        src={src}
        onError={handleError}
      />
    </ImageContainer>
  );
};
```

**When to use**:
- User-uploaded content (avatars, evidence, gallery)
- CMS/API content (blog images, product photos)
- Any URL that might not exist or fail to load

---

## 2. Upload Patterns

### 2.1 Direct Upload to Cloud Storage

**Use case**: User uploads images directly to Supabase/S3/Cloudinary.

```typescript
// useFileUpload.ts
export const useFileUpload = ({
  bucket = 'uploads',
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  onSuccess,
  onError,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = useCallback(async (file: File) => {
    // Validate
    if (!acceptedTypes.includes(file.type)) {
      onError?.('Tipo de archivo no soportado');
      return null;
    }
    if (file.size > maxSize) {
      onError?.('Archivo demasiado grande');
      return null;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const filename = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filename, file, {
          onUploadProgress: (p) => setProgress(Math.round((p.loaded / p.total) * 100)),
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      onSuccess?.(publicUrl);
      return publicUrl;
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Error al subir');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [bucket, maxSize, acceptedTypes, onSuccess, onError]);

  return { upload, isUploading, progress };
};
```

### 2.2 Server-Side Processing (Sharp)

**Use case**: Resize, optimize, or transform images before storage.

```typescript
// API Route: /api/upload
import sharp from 'sharp';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  const buffer = Buffer.from(await file.arrayBuffer());

  // Process with Sharp
  const processed = await sharp(buffer)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  // Upload to storage
  const { data } = await supabase.storage
    .from('images')
    .upload(`processed/${Date.now()}.webp`, processed, {
      contentType: 'image/webp',
    });

  return Response.json({ url: getPublicUrl(data.path) });
}
```

---

## 3. Download Patterns

### 3.1 Browser Download

```typescript
const downloadImage = (url: string, filename: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
```

### 3.2 Fetch and Download (CORS-safe)

```typescript
const downloadImageBlob = async (url: string, filename: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(blobUrl);
};
```

---

## 4. Wrapper Pattern for Click Handlers

When images need click handlers (preview, lightbox), wrap the Image component:

```typescript
// ❌ WRONG - Image component doesn't support onClick
<Image onClick={handleClick} src={url} alt="Preview" />

// ✅ CORRECT - Clickable wrapper
<ClickableImageWrapper onClick={handleClick}>
  <Image src={url} alt="Preview" />
</ClickableImageWrapper>

// Styled wrapper
export const ClickableImageWrapper = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: block;
  overflow: hidden;
  padding: 0;
  width: 100%;

  &:hover {
    opacity: 0.9;
  }
`;
```

---

## 5. Dimension Patterns

### 5.1 Fixed Dimensions (Wrapper controls size)

```typescript
// Wrapper defines dimensions, Image fills it
const AvatarWrapper = styled.div`
  border-radius: 50%;
  height: 48px;
  overflow: hidden;
  width: 48px;
`;

<AvatarWrapper>
  <Image src={user.avatar} alt={user.name} />
</AvatarWrapper>
```

### 5.2 Aspect Ratio

```typescript
const CardImageWrapper = styled.div`
  aspect-ratio: 16 / 9;
  overflow: hidden;
  width: 100%;
`;

<CardImageWrapper>
  <Image src={card.thumbnail} alt={card.title} />
</CardImageWrapper>
```

### 5.3 Max Dimensions (Preview/Modal)

```typescript
const PreviewWrapper = styled.div`
  max-height: 80vh;
  max-width: 90vw;
  overflow: hidden;
`;

<PreviewWrapper>
  <Image src={preview.url} alt={preview.title} objectFit="contain" />
</PreviewWrapper>
```

---

## 6. Fallback Customization

```typescript
// Default fallback
<Image src={url} alt="Product" />
// Shows: [ImageIcon] + "Sin imagen"

// Custom fallback text
<Image
  src={url}
  alt="Product"
  fallbackText="Imagen no disponible"
/>

// Custom fallback icon
<Image
  src={url}
  alt="User"
  fallbackIcon={<UserIcon />}
  fallbackText="Sin foto"
/>
```

---

## 7. Media Card Contexts (Asset vs Preview)

When displaying images/videos in cards, there are two distinct contexts:

### 7.1 Asset Mode (Image is the primary record)

**Use case**: Gallery management, CMS assets, media library.

The image IS the main entity being managed. Requires:
- Title and description
- Status badge (active/inactive)
- Action buttons (edit, delete, toggle, download)
- Category badge

```typescript
// Gallery management - image is the asset
<MediaCard
  image={galleryItem}
  showActions={true}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onToggle={handleToggle}
/>
```

### 7.2 Preview Mode (Image is part of another record)

**Use case**: Story sections, user profiles, event thumbnails, product images.

The image is a COMPLEMENT to another entity. The parent record controls lifecycle:
- Image is deleted when parent is deleted
- Image is edited from parent's form
- NO action buttons on the image card
- Fixed height for visual consistency

```typescript
// Story section - image belongs to the section
<MediaCard
  image={sectionImage}
  variant='preview'
  previewHeight={120}
  onPreview={handlePreview}
/>

// User profile - image belongs to the user
<MediaCard
  image={userAvatar}
  variant='preview'
  previewHeight={80}
  onPreview={handlePreview}
/>
```

### 7.3 MediaCard Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'asset' \| 'preview'` | `'asset'` | Display mode |
| `previewHeight` | `number` | `120` | Fixed height for preview mode |
| `showActions` | `boolean` | `false` | Show action buttons (asset mode only) |
| `onPreview` | `function` | - | Click handler for enlarging |
| `onEdit` | `function` | - | Edit handler (asset mode) |
| `onDelete` | `function` | - | Delete handler (asset mode) |
| `onToggle` | `function` | - | Toggle active handler (asset mode) |
| `onDownload` | `function` | - | Download handler |

### 7.4 Context Decision Guide

| Context | Variant | Actions Location |
|---------|---------|------------------|
| Gallery management | `asset` | Inside card (overlay) |
| Story section image | `preview` | Outside card (section actions) |
| User profile avatar | `preview` | Parent form |
| Event hero image | `preview` | Event edit form |
| Product thumbnail | `preview` | Product edit form |
| CMS media library | `asset` | Inside card (overlay) |

### 7.5 Don't Reinvent the Wheel

**CRITICAL**: MediaCard already solves:
- Fallback for broken images
- Video thumbnails and playback
- Preview modal integration
- Responsive sizing
- Loading states

❌ **DON'T** create a new image component when you need to show images/videos
✅ **DO** use MediaCard with appropriate variant

```typescript
// ❌ WRONG - Reinventing the wheel
<Image src={section.imageUrl} onClick={handleClick} />
// Missing: video support, fallback, preview modal, consistent sizing

// ✅ CORRECT - Reuse existing component
<MediaCard
  image={sectionData}
  variant='preview'
  onPreview={handlePreview}
/>
```

---

## 8. Decision Matrix

| Scenario | Solution | Component |
|----------|----------|-----------|
| Logo/brand asset | Static import | `next/image` |
| Hero background | Static import | `next/image` |
| User avatar | Dynamic URL | `Image` (custom) |
| Gallery image | Dynamic URL | `Image` (custom) |
| CMS content | Dynamic URL | `Image` (custom) |
| Upload preview | Blob URL | `Image` (custom) |
| Clickable image | Wrapper + Image | `Wrapper` + `Image` |

---

## 9. File Organization

```
src/
├── assets/                          # Static images
│   ├── images/
│   │   ├── logo.png
│   │   ├── hero-background.jpg
│   │   └── index.ts                 # Export all
│   └── index.ts
├── libs/
│   ├── presentation/
│   │   └── components/
│   │       └── common/
│   │           └── Image/           # Global Image component
│   │               ├── Image.tsx
│   │               ├── Image.interfaces.ts
│   │               ├── Image.styled.ts
│   │               ├── Image.test.tsx
│   │               └── index.ts
│   └── infrastructure/
│       └── services/
│           └── storage/
│               └── upload.service.ts
└── app/
    └── api/
        └── upload/
            └── route.ts             # Server-side processing
```

---

## 10. Testing

```typescript
describe('Image', () => {
  it('renders image when src is provided', () => {
    render(<Image alt="Test" src="https://example.com/img.jpg" />);
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/img.jpg');
  });

  it('shows fallback when src is null', () => {
    render(<Image alt="Test" src={null} />);
    expect(screen.getByText('Sin imagen')).toBeInTheDocument();
  });

  it('shows fallback on load error', () => {
    render(<Image alt="Test" src="https://example.com/broken.jpg" />);
    fireEvent.error(screen.getByRole('img'));
    expect(screen.getByText('Sin imagen')).toBeInTheDocument();
  });

  it('uses custom fallback text', () => {
    render(<Image alt="Test" fallbackText="No disponible" src={null} />);
    expect(screen.getByText('No disponible')).toBeInTheDocument();
  });
});
```

---

## 11. Quick Reference

```typescript
// Static asset (bundled)
import Image from 'next/image';
import { Logo } from '@assets';
<Image src={Logo} alt="Logo" />

// Dynamic URL (may fail)
import { Image } from '@components';
<Image src={user.avatar} alt={user.name} />

// With custom fallback
<Image src={url} alt="Product" fallbackText="Sin foto" />

// Clickable
<ClickableWrapper onClick={onPreview}>
  <Image src={url} alt="Preview" />
</ClickableWrapper>

// Fixed size (wrapper controls)
<AvatarWrapper>
  <Image src={url} alt="Avatar" />
</AvatarWrapper>

// Upload
const { upload, isUploading } = useFileUpload({ bucket: 'avatars' });
const url = await upload(file);
```

---

## Related Documentation

**Standards**:
- `.claude/patterns/core/COMPONENT-STRUCTURE-STANDARDS.md` - 5-file component structure
- `.claude/patterns/core/TESTING-STANDARDS.md` - Testing patterns

**Patterns**:
- `.claude/patterns/media-upload-patterns.md` - Detailed upload patterns with Sharp
- `.claude/patterns/component-structure.md` - Component architecture

---

**Version**: 1.1 | **Author**: Claude | **Updated**: 2026-02-04
