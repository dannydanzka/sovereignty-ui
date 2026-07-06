# Navigation Pattern — React Native

> **Framework**: React Navigation v7
> **Scope**: Mobile-only (web uses React Router)
> **Sovereignty principle**: Clear Borders — navigation is the treaty between screens

---

## File Structure

```
src/navigation/
├── Navigation.js                    # Main navigation configuration
├── navigationConstants.js           # Route names and params
├── navigationHelpers.js             # Navigation utilities
├── navigators/                      # Stack/Drawer navigators
├── store/                           # Navigation state
└── types/
    └── navigation.d.ts              # TypeScript navigation types
```

---

## Navigator Types

| Type | Use Case | Package |
|------|----------|---------|
| Stack | Linear flows (detail, form) | `@react-navigation/native-stack` |
| Drawer | Side menu navigation | `@react-navigation/drawer` |
| Bottom Tabs | Main app sections | `@react-navigation/bottom-tabs` |
| Material Top Tabs | Tabbed content | `@react-navigation/material-top-tabs` |

---

## Navigation Constants

```javascript
// navigationConstants.js — ALWAYS use constants, never string literals

export const ROUTES = {
  HOME: 'Home',
  PRODUCT_DETAIL: 'ProductDetail',
  CART: 'Cart',
  ELECTRONIC_ORDER: {
    CREATE: 'CreateOrder',
    DETAIL: 'OrderDetail',
    PREVIEW: 'OrderPreview',
  },
};

export const PARAM_KEYS = {
  PRODUCT_ID: 'productId',
  ORDER_ID: 'orderId',
  CATALOG_ID: 'catalogId',
};
```

---

## Navigation Helpers

```javascript
// navigationHelpers.js
import { CommonActions, StackActions } from '@react-navigation/native';

export const navigateTo = (navigation, routeName, params = {}) => {
  navigation.navigate(routeName, params);
};

export const replaceTo = (navigation, routeName, params = {}) => {
  navigation.dispatch(StackActions.replace(routeName, params));
};

export const resetNavigation = (navigation, routeName, params = {}) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: routeName, params }],
    })
  );
};

export const goBackN = (navigation, count = 1) => {
  navigation.dispatch(StackActions.pop(count));
};
```

---

## TypeScript Types

```typescript
// types/navigation.d.ts
import { type StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  ProductDetail: {
    productId: number;
    from?: string;
  };
  Cart: undefined;
  CreateOrder: {
    catalogId: number;
    associateId?: number;
  };
};

export type ProductDetailScreenProps = StackScreenProps<
  RootStackParamList,
  'ProductDetail'
>;
```

---

## Usage in Screens

```typescript
import { useNavigation, useRoute } from '@react-navigation/native';
import { ROUTES, PARAM_KEYS } from '@navigation/navigationConstants';
import { navigateTo } from '@navigation/navigationHelpers';

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleProductPress = (productId: number) => {
    navigateTo(navigation, ROUTES.PRODUCT_DETAIL, { productId });
  };

  return (/* ... */);
};
```

---

## Deep Linking

```javascript
const linking = {
  prefixes: ['myapp://', 'https://app.example.com'],
  config: {
    screens: {
      Home: '',
      ProductDetail: 'product/:productId',
      Cart: 'cart',
    },
  },
};

<NavigationContainer linking={linking}>
  {/* Navigators */}
</NavigationContainer>
```

---

## Rules

| Rule | Detail |
|------|--------|
| Route names | Always use constants from `navigationConstants.js` |
| Params | Type with `RootStackParamList`, access via `useRoute()` |
| Helpers | Use `navigateTo`, `replaceTo`, `resetNavigation` — not raw dispatch |
| No prop drilling | Use `useNavigation()` hook, never pass navigation prop |
| No business logic | In screen options — keep declarative |

---

## Differences from Web

| Aspect | Web (React Router) | Mobile (React Navigation) |
|--------|-------------------|---------------------------|
| Package | react-router-dom | @react-navigation/native |
| Navigator | BrowserRouter | NavigationContainer |
| Routes | Routes + Route components | Stack/Drawer/Tab Navigators |
| Params | URL search params | route.params object |
| Deep Linking | URL-based (automatic) | Requires configuration |
| Back Button | Browser back | Android back + gesture |

---

## Related

- `frontend/presentation/components.md` — Component structure
- `frontend/infrastructure/state/redux.md` — State management
