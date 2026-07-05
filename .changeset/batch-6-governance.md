---
'@dannydanzka/sovereignty-ui': minor
---

Batch 6 extraction + library governance

- New components: ActionButton (row actions with view/edit/delete/neutral variants), ImagePreviewModal (fullscreen preview with badge slot, Escape/overlay close), InlineIcon (icon-with-text alignment wrapper)
- New patterns: TextField/SelectField/TextareaField (FormFields), AvatarUpload and ImageUploader (callback-based, consumer owns the upload), NotificationContainer (+ useNotifications hook: local toast queue with auto-dismiss and max cap), AuthLayout (+ AuthCard), AppHeader, AppFooter, FloatingActions
- DataTable: optional row selection (selectable/selectedKeys/onSelectionChange) and per-row rowActions
- StatsCard: new danger and info variants (StatsCardVariant type exported)
- Governance: CLAUDE.md + .claude/rules (lib discipline), 6 additional canon ESLint rules (22 total), tsconfig noUncheckedIndexedAccess + verbatimModuleSyntax, sideEffects:false for tree-shaking, vitest clearMocks/restoreMocks
- Backfilled 0.5.0 CHANGELOG entry (createBrandPalette)
