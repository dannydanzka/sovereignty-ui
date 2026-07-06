# Custom Hooks Pattern

> **ESLint Enforcement**: `custom/enforce-hook-composition` ⚡

Use this pattern for extracting business logic from components into reusable hooks.

## File Structure

```
common/hooks/
└── [hookName]/
    ├── [hookName].js
    ├── [hookName].test.js
    └── index.js
```

## Custom Hook Template

```javascript
// use[HookName].js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { domainAction } from '../../../state/store/action/[domain]/[domain].action';
import {
  getData,
  getDataDetail,
  getActionSuccess,
  getShouldShowData,
  getShouldShowEmpty,
} from '../../../state/store/selectors/[domain].selectors';

/**
 * Hook for managing [domain] business logic.
 * Provides data and functions for [feature description].
 *
 * @param {string|number} [param] - Parameter description
 * @returns {Object} Hook return object
 * @returns {Object} return.data - Main data
 * @returns {Object} return.dataDetail - Detail data
 * @returns {boolean} return.actionSuccess - Success flag
 * @returns {boolean} return.shouldShowData - UI display flag
 * @returns {boolean} return.shouldShowEmpty - Empty state flag
 */
export const useHookName = (param) => {
  const dispatch = useDispatch();

  // Select data from Redux store
  const data = useSelector(getData);
  const dataDetail = useSelector(getDataDetail);
  const actionSuccess = useSelector(getActionSuccess);
  const shouldShowData = useSelector(getShouldShowData);
  const shouldShowEmpty = useSelector(getShouldShowEmpty);

  // Dispatch action on mount or param change
  useEffect(() => {
    if (param && (!data || data.id !== parseInt(param, 10))) {
      dispatch(domainAction(param));
    }
  }, [param, dispatch, data]);

  return {
    data,
    dataDetail,
    actionSuccess,
    shouldShowData,
    shouldShowEmpty,
  };
};
```

## Hook with Local State

For UI state management combined with Redux:

```javascript
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Hook for managing [feature] with local UI state.
 */
export const useFeature = (initialParam) => {
  const dispatch = useDispatch();
  const data = useSelector(getData);

  // Local state for UI
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (initialParam) {
      dispatch(fetchData(initialParam));
    }
  }, [initialParam, dispatch]);

  // Helper functions
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
  };

  return {
    data,
    isOpen,
    selectedItem,
    handleToggle,
    handleSelect,
  };
};
```

## Hook Testing Pattern

```javascript
// use[HookName].test.js
import React from 'react';
import { node } from 'prop-types';
import { Provider } from 'react-redux';
import { renderHook } from '@testing-library/react';
import configureStore from 'redux-mock-store';

import { useHookName } from './useHookName';

const mockStore = configureStore([]);

const createWrapper = (initialState = {}) => {
  const store = mockStore(initialState);

  const TestWrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

  TestWrapper.displayName = 'TestWrapper';
  TestWrapper.propTypes = {
    children: node.isRequired,
  };

  return TestWrapper;
};

describe('useHookName', () => {
  const mockData = {
    id: '1',
    name: 'Test',
  };

  it('should return data from store', () => {
    const initialState = {
      domainReducer: {
        data: mockData,
        actionSuccess: true,
      },
    };

    const wrapper = createWrapper(initialState);
    const { result } = renderHook(() => useHookName('1'), { wrapper });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.actionSuccess).toBe(true);
  });

  it('should handle missing param', () => {
    const initialState = {
      domainReducer: {
        data: null,
        actionSuccess: false,
      },
    };

    const wrapper = createWrapper(initialState);
    const { result } = renderHook(() => useHookName(null), { wrapper });

    expect(result.current.data).toBeNull();
    expect(result.current.actionSuccess).toBe(false);
  });

  it('should provide shouldShow flags', () => {
    const initialState = {
      domainReducer: {
        data: mockData,
        actionSuccess: true,
      },
    };

    const wrapper = createWrapper(initialState);
    const { result } = renderHook(() => useHookName('1'), { wrapper });

    expect(typeof result.current.shouldShowData).toBe('boolean');
    expect(typeof result.current.shouldShowEmpty).toBe('boolean');
  });
});
```

## Index File

```javascript
// index.js
export { useHookName } from './useHookName';
```

## Hook Responsibilities

### ✅ Custom hooks SHOULD:

- **Encapsulate business logic** separate from presentation
- **Select data from Redux** using selectors
- **Dispatch actions** based on component lifecycle
- **Return computed UI state** (shouldShow flags)
- **Handle side effects** with useEffect
- **Provide helper functions** for complex operations
- **Accept parameters** for dynamic behavior
- **Have JSDoc documentation** with clear param/return types

### ❌ Custom hooks SHOULD NOT:

- **Return JSX** (that's for components)
- **Handle routing** (use react-router hooks directly in components)
- **Manage global state** (use Redux actions/reducers)
- **Make direct API calls** (use Redux sagas)
- **Modify DOM directly** (use refs in components if needed)

## Common Hook Patterns

### 1. Data Fetching Hook

```javascript
export const useFetchData = (id) => {
  const dispatch = useDispatch();
  const data = useSelector(getData);
  const isLoading = useSelector(getIsLoading);
  const error = useSelector(getError);

  useEffect(() => {
    if (id) {
      dispatch(fetchData(id));
    }
  }, [id, dispatch]);

  return { data, isLoading, error };
};
```

### 2. Form Management Hook

```javascript
export const useFormData = (initialData) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    dispatch(submitForm(formData));
  };

  return { formData, errors, handleChange, handleSubmit };
};
```

### 3. List Management Hook

```javascript
export const useListData = () => {
  const dispatch = useDispatch();
  const list = useSelector(getList);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelect = (item) => {
    setSelectedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const handleDelete = (id) => {
    dispatch(deleteItem(id));
  };

  return { list, selectedItems, handleSelect, handleDelete };
};
```

## Usage in Components

```javascript
// In component
import { useHookName } from '../../../common/hooks/useHookName';

export const MyComponent = () => {
  const { data, shouldShowData, shouldShowEmpty } = useHookName(id);

  if (shouldShowEmpty) {
    return <EmptyState />;
  }

  if (shouldShowData) {
    return <DataDisplay data={data} />;
  }

  return null;
};
```

## Best Practices

1. **Named exports**: `export const useHookName`
2. **Prefix with "use"**: Hook naming convention
3. **JSDoc documentation**: Document params and return
4. **Return object**: Return multiple values as object
5. **Use selectors**: Always select via selectors, not direct state access
6. **Dependencies array**: Complete and correct in useEffect
7. **Test thoroughly**: Unit test with renderHook
8. **Single responsibility**: One hook per concern

---

## See also

**Standards**:
- `docs/development-standards/REDUX-STANDARDS.md` - Redux hooks patterns
- `docs/development-standards/TESTING-STANDARDS.md` - Hook testing

**Patterns**:
- `component-structure.md` - Component organization
- `redux-patterns.md` - Redux integration patterns
- `selector-patterns.md` - Selector usage

---

**Lines**: 317 | **Status**: ✅ Verified (custom hook patterns)
