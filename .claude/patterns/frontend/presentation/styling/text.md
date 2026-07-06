# Text Truncation Patterns

> **Purpose**: Dynamic text truncation with ellipsis for responsive UI
> **Version**: 1.0
> **Updated**: 2026-01-25

---

## Philosophy

Text should adapt to its container, not the other way around. Non-critical text truncates gracefully with ellipsis rather than overflowing or breaking layout.

---

## Text Classification

### Critical (NEVER truncate)
- Error messages
- Form validation messages
- Prices and amounts
- Action button labels
- Status indicators
- Required field labels

### Truncatable (Single line with ellipsis)
- Entity IDs
- Entity names (tables, cards)
- Descriptions (short previews)
- Email addresses
- File names
- Timestamps (show relative or abbreviated)

### Collapsible (Show more/less)
- Long descriptions
- User bios
- Instructions
- Narrative content

---

## CSS Patterns

### Single Line Truncation (Most Common)
```typescript
// Use for: names, IDs, short descriptions, emails
export const TruncatedText = styled.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
```

### Multi-line Truncation (2-3 lines max)
```typescript
// Use for: descriptions, previews
export const MultiLineTruncate = styled.p<{ $lines?: number }>`
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ $lines = 2 }) => $lines};
  display: -webkit-box;
  overflow: hidden;
`;
```

### Flexible Width with Min/Max
```typescript
// Use for: table cells, card content
export const FlexibleText = styled.span`
  display: block;
  max-width: 100%;
  min-width: 0; // Critical for flex children
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
```

---

## Component Patterns

### Entity ID (Always truncatable)
```typescript
export const EntityId = styled.span`
  color: ${brandColor.landingTextGray};
  display: block;
  font-family: ${typography.family.mono};
  font-size: ${typography.size.xs};
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// Usage: <EntityId>{kit.id}</EntityId>
// Shows: "kit_rally_basico..." when compressed
// Shows: "kit_rally_basico_2025" when space available
```

### Entity Name (Primary identifier)
```typescript
export const EntityName = styled.span`
  color: ${brandColor.landingBlueDark};
  display: block;
  font-weight: ${typography.weight.semibold};
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
```

### Entity Description (Preview)
```typescript
export const EntityDescription = styled.p`
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: ${brandColor.landingTextGray};
  display: -webkit-box;
  font-size: ${typography.size.sm};
  margin: 0;
  overflow: hidden;
`;
```

---

## Table Cell Pattern

```typescript
// Table cells need special handling for flex/grid layouts
export const TableCellText = styled.div`
  align-items: center;
  display: flex;
  min-width: 0; // Allows flex child to shrink below content size
  width: 100%;
`;

export const TableCellContent = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// Usage in table:
<AdminTableCell>
  <TableCellText>
    <TableCellContent>{longText}</TableCellContent>
  </TableCellText>
</AdminTableCell>
```

---

## Anti-Patterns

### DON'T: Hard-coded slice
```typescript
// ❌ Bad - static truncation regardless of space
{kit.id.slice(0, 8)}...

// ✅ Good - dynamic truncation based on container
<EntityId>{kit.id}</EntityId>
```

### DON'T: Fixed width truncation
```typescript
// ❌ Bad - arbitrary fixed width
width: 150px;
overflow: hidden;

// ✅ Good - responsive to container
max-width: 100%;
min-width: 0;
overflow: hidden;
```

### DON'T: Forget min-width: 0
```typescript
// ❌ Bad - flex child won't shrink
.flex-child {
  overflow: hidden;
  text-overflow: ellipsis;
}

// ✅ Good - flex child can shrink
.flex-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

---

## Implementation Checklist

- [ ] Text is classified (critical vs truncatable)
- [ ] Uses CSS truncation, not JS slice()
- [ ] Has `min-width: 0` if inside flex/grid
- [ ] Has `max-width: 100%` for responsiveness
- [ ] Has `overflow: hidden` + `text-overflow: ellipsis`
- [ ] Has `white-space: nowrap` for single-line
- [ ] Tooltip shows full text on hover (optional, for IDs)

---

## Related

- `.claude/patterns/core/RESPONSIVE-DESIGN-STANDARDS.md`
- `.claude/patterns/component-structure.md`
