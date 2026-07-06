# Helper Functions Pattern

Use this pattern for creating pure utility functions.

## File Structure

```
common/helpers/
└── [domain]/
    ├── [domain].helpers.js
    ├── [domain].helpers.test.js
    └── index.js
```

## Helper File Template

```javascript
// [domain].helpers.js
import { DOMAIN_CONSTANTS } from '../../constants/domain.constants';

/**
 * Transforms raw data to display format.
 *
 * @param {Object} data - Raw data from API
 * @returns {Object} - Transformed data
 */
export const transformData = (data) => {
  if (!data) return null;

  return {
    id: data.id,
    displayName: `${data.firstName} ${data.lastName}`,
    formattedDate: formatDate(data.createdAt),
  };
};

/**
 * Formats ISO date string to display format.
 *
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date (DD/MM/YYYY)
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Validates email format.
 *
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generates route with parameters.
 *
 * @param {string} route - Route template
 * @param {Object} params - Route parameters
 * @returns {string} - Generated route
 */
export const generateRoute = (route, params) => {
  let result = route;

  Object.keys(params).forEach((key) => {
    result = result.replace(`:${key}`, params[key]);
  });

  return result;
};

/**
 * Checks if object has required properties.
 *
 * @param {Object} obj - Object to check
 * @param {string[]} requiredProps - Required property names
 * @returns {boolean} - True if all properties exist
 */
export const hasRequiredProps = (obj, requiredProps) => {
  if (!obj || typeof obj !== 'object') return false;

  return requiredProps.every((prop) => obj.hasOwnProperty(prop) && obj[prop] !== undefined);
};

/**
 * Converts status code to readable text.
 *
 * @param {number} status - Status code
 * @returns {string} - Readable status text
 */
export const getStatusText = (status) => {
  return DOMAIN_CONSTANTS.STATUS_LABELS[status] || 'Unknown';
};
```

## Helper Test Template

```javascript
// [domain].helpers.test.js
import {
  formatDate,
  generateRoute,
  getStatusText,
  hasRequiredProps,
  isValidEmail,
  transformData,
} from './domain.helpers';

describe('Domain Helpers', () => {
  describe('formatDate', () => {
    it('should format ISO date correctly', () => {
      const result = formatDate('2024-01-15T00:00:00Z');
      expect(result).toBe('15/01/2024');
    });

    it('should return empty string for null', () => {
      expect(formatDate(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(formatDate(undefined)).toBe('');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
    });

    it('should reject empty email', () => {
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('generateRoute', () => {
    it('should replace route parameters', () => {
      const route = '/users/:userId/posts/:postId';
      const params = { userId: '123', postId: '456' };
      const result = generateRoute(route, params);
      expect(result).toBe('/users/123/posts/456');
    });
  });

  describe('hasRequiredProps', () => {
    it('should return true when all props exist', () => {
      const obj = { id: 1, name: 'Test', email: 'test@test.com' };
      const required = ['id', 'name', 'email'];
      expect(hasRequiredProps(obj, required)).toBe(true);
    });

    it('should return false when prop is missing', () => {
      const obj = { id: 1, name: 'Test' };
      const required = ['id', 'name', 'email'];
      expect(hasRequiredProps(obj, required)).toBe(false);
    });
  });

  describe('transformData', () => {
    it('should transform data correctly', () => {
      const input = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        createdAt: '2024-01-15T00:00:00Z',
      };

      const result = transformData(input);

      expect(result).toEqual({
        id: 1,
        displayName: 'John Doe',
        formattedDate: '15/01/2024',
      });
    });

    it('should return null for null input', () => {
      expect(transformData(null)).toBeNull();
    });
  });

  describe('getStatusText', () => {
    it('should return correct status text', () => {
      expect(getStatusText(1)).toBe('Active');
      expect(getStatusText(2)).toBe('Inactive');
    });

    it('should return Unknown for invalid status', () => {
      expect(getStatusText(999)).toBe('Unknown');
    });
  });
});
```

## Common Helper Patterns

### Data Transformation

```javascript
/**
 * Maps API response to UI model
 */
export const mapApiToModel = (apiData) => ({
  id: apiData.id,
  name: apiData.full_name,
  email: apiData.email_address,
  isActive: apiData.status === 1,
  createdAt: new Date(apiData.created_at),
});

/**
 * Maps UI model to API request
 */
export const mapModelToApi = (model) => ({
  id: model.id,
  full_name: model.name,
  email_address: model.email,
  status: model.isActive ? 1 : 0,
});
```

### Formatting

```javascript
/**
 * Formats currency
 */
export const formatCurrency = (amount, currency = 'MXN') => {
  return new Intl.NumberFormat('es-MX', {
    currency,
    style: 'currency',
  }).format(amount);
};

/**
 * Formats phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '';

  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phone;
};

/**
 * Truncates text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
```

### Validation

```javascript
/**
 * Validates required fields
 */
export const validateRequired = (value) => {
  return value !== null && value !== undefined && value !== '';
};

/**
 * Validates minimum length
 */
export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

/**
 * Validates numeric value
 */
export const isNumeric = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Validates URL
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
```

### Array Utilities

```javascript
/**
 * Groups array by key
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

/**
 * Removes duplicates from array
 */
export const unique = (array) => {
  return [...new Set(array)];
};

/**
 * Sorts array by key
 */
export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};
```

### Object Utilities

```javascript
/**
 * Deep clones object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Checks if object is empty
 */
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

/**
 * Picks specific keys from object
 */
export const pick = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

/**
 * Omits specific keys from object
 */
export const omit = (obj, keys) => {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
};
```

### String Utilities

```javascript
/**
 * Capitalizes first letter
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Converts to title case
 */
export const toTitleCase = (str) => {
  if (!str) return '';
  return str.split(' ').map(capitalize).join(' ');
};

/**
 * Converts to slug
 */
export const toSlug = (str) => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
```

### Number Utilities

```javascript
/**
 * Clamps number between min and max
 */
export const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};

/**
 * Generates random number in range
 */
export const randomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Rounds to decimal places
 */
export const roundTo = (num, decimals = 2) => {
  return Math.round(num * 10 ** decimals) / 10 ** decimals;
};
```

## Best Practices

### ✅ DO

1. **Pure functions only** - no side effects
2. **Single responsibility** - one function, one task
3. **JSDoc documentation** - params, returns, description
4. **Defensive programming** - check null/undefined
5. **Return early** - guard clauses at top
6. **Use constants** for magic values
7. **Test all edge cases**
8. **Named exports** for all helpers
9. **Group related helpers** in same file
10. **Use descriptive names** - `formatDate` not `fd`

### ❌ DON'T

1. **Don't mutate inputs** - return new values
2. **Don't use global state** - pass as parameters
3. **Don't make API calls** - use services layer
4. **Don't use external dependencies** unnecessarily
5. **Don't skip validation** - always check inputs
6. **Don't use `any` type** in JSDoc
7. **Don't mix concerns** - separate formatters from validators

## File Organization

```javascript
// helpers/domain/domain.helpers.js

// ============================================================
// TRANSFORMATIONS
// ============================================================
export const transformData = () => {};
export const mapApiToModel = () => {};
export const mapModelToApi = () => {};

// ============================================================
// FORMATTING
// ============================================================
export const formatDate = () => {};
export const formatCurrency = () => {};
export const formatPhone = () => {};

// ============================================================
// VALIDATION
// ============================================================
export const isValidEmail = () => {};
export const isValidUrl = () => {};
export const validateRequired = () => {};

// ============================================================
// UTILITIES
// ============================================================
export const generateRoute = () => {};
export const getStatusText = () => {};
export const hasRequiredProps = () => {};
```

## Index File

```javascript
// helpers/domain/index.js
export * from './domain.helpers';
```

## Centralized Helpers Index

```javascript
// helpers/index.js
export * from './agreements/agreements.helpers';
export * from './cart/cart.helpers';
export * from './dropdown/dropdown.helpers';
export * from './filterByPrizeType/filterByPrizeType.helpers';
export * from './history/history.helpers';
```

---

## See also

**Standards**:
- `docs/development-standards/FILE-MODULARIZATION-STANDARDS.md` - When to extract helpers
- `docs/development-standards/NAMING-STANDARDS.md` - Helper naming conventions
- `docs/development-standards/EXPORT-IMPORT-STANDARDS.md` - Barrel exports

**Patterns**:
- `exports-imports.md` - Export patterns
- `monorepo-centralization.md` - Shared code organization

---

**Lines**: 518 | **Status**: ✅ Verified (helper function patterns)
