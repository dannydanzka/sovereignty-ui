/**
 * Form control interfaces
 */

import type { FORM_CONTROL_SIZES } from './form-control.constants';

/** The size scale every textual form control shares. `md` is the default everywhere. */
export type FormControlSize = keyof typeof FORM_CONTROL_SIZES;
