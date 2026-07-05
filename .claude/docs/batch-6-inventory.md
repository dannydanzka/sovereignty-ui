# Batch 6 Inventory — Agnostic Extraction from Products

> **Source products audited**: dearadry, sovertainty, followme, presskit, desarrollemos, trackia
> **Date**: 2026-07-05
> **Method**: enumerated every `src/libs/presentation/components/` (or `src/components/`) folder; classified each local component by duplication count and agnosticism.

---

## Classification A — Already in SUI (products need MIGRATION, not extraction)

Local copies exist because products are pinned to old versions (dearadry/followme/sovertainty → 0.2.0, desarrollemos → 0.4.0; presskit is not even a consumer):

Badge, Button, Card, Container, Input, Modal, Tabs, Spacer, FileUploader, ProgressBar, StatsCard, GlobalLoading, LazyFallback, ErrorFallback, StepCard, LoadingSpinner (=Spinner), AdminTable (=DataTable), AdminPagination (=Pagination), AdminSearch (=SearchInput), AdminDropdown (=Dropdown), AdminEntityCell (=EntityCell), AdminSortableHeader (=SortableHeader), AdminStates (=Empty/Error/LoadingState), AdminStats (=StatsCard/StatItem), AdminModalFooter (=ModalFooter), AdminPageLayout (=PageLayout), AdminDetailModal (=DetailLayout — DetailSection/Row/Label/Value/Divider/Amount/ContentBox/Media already shipped in Batch 5), ToggleActiveButton, ModalContainer (=Modal+useModal).

**Action**: none in the library. Follow-up per product: bump to latest SUI and delete local copies.

## Classification B — Extract as agnostic (Batch 6 IMPLEMENTED)

| New SUI export | Source (duplication) | De-coupling applied |
|---|---|---|
| `InlineIcon` (component) | followme, presskit | none needed — pure wrapper |
| `ActionButton` (component) | Admin*ActionButtons (dearadry, sovertainty, followme, presskit) | edit/delete/view/custom variants, icon via prop |
| `ImagePreviewModal` (component) | 5 products | i18n `t()` → `closeLabel` prop; CATEGORY_* domain constants → `badge?: ReactNode` slot |
| `TextField`, `SelectField`, `TextareaField` (patterns/FormFields) | Form*Field (dearadry, sovertainty, followme, presskit) | compose SUI FormField + Input/Select/Textarea |
| `AvatarUpload` (pattern) | 5 products | Supabase `useFileUpload` → `onFileSelect(file)` callback + `isUploading` prop |
| `ImageUploader` (pattern) | ImageUpload (followme, presskit) + MediaUpload (dearadry, sovertainty) | same de-coupling as AvatarUpload |
| `useNotifications` (hook) + `NotificationContainer` (pattern) | dearadry, sovertainty, followme, presskit | app state → local queue hook; renders SUI NotificationToast |
| `AuthLayout` (pattern) | PublicAuthLayout (5 products) | logo/brand → slots |
| `AppHeader` (pattern) | Header (5 products) | router/i18n/auth/brand → slots (logo, nav, actions) + mobile menu state only |
| `AppFooter` (pattern) | Footer (5 products) | columns/social/legal → props+slots |
| `FloatingActions` (pattern) | FloatingSocialMedia (followme, presskit, desarrollemos) | simple-icons dep + hardcoded URLs → `items: { icon, href/onClick, label }[]` |

## Classification C — Absorb improvements into existing SUI exports (IMPLEMENTED)

| SUI export | Improvement | Source |
|---|---|---|
| `DataTable` | optional row selection (`selectable`, `selectedKeys`, `onSelectionChange`) + `rowActions` | followme/presskit/desarrollemos `Table` |
| `StatsCard` | add `danger`/`info` variants (parity with StatItem) | trackia `MetricCard` tone |

## Classification D — Stays local (business/domain)

RoleBadge, StatusBadge, ConfirmDeleteModal*, AdminFiltersBar, AdminScreen (trackia — tenant logic), MeetButton, EventCard, EventHero, NotificationBell (server notifications domain), DocumentViewer, CategoryLeaderboard, PricingTable (checkout copy), SocialIcons (simple-icons dependency stays in products; SUI receives icons via props), Login/Signup/ForgotPassword/ResetPassword forms (auth flows), SimpleIcon (simple-icons wrapper — dep not allowed in SUI).

## Deferred to roadmap (not in products, demand-driven)

Breadcrumb, MultiSelect, DatePicker, TimePicker, RichTextEditor, Calendar, Stepper, `'use client'` dist banner (blocked by code-splitting chunk banners).
