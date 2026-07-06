/**
 * Internal icon module — web resolution
 *
 * Shared component files import icons from THIS path (never `lucide-react`
 * directly) so Metro can swap the whole set for `lucide-react-native` on native
 * via `index.native.ts`. Same icon names on both platforms; same `size`/`color`
 * props. This module is internal — it is NOT part of the public barrel.
 */

export * from 'lucide-react';
