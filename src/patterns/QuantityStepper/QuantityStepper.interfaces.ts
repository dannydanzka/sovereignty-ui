/**
 * QuantityStepper Interfaces
 */

/** Assistive copy for the two keys. Required — the library has no language. */
export interface QuantityStepperTexts {
  /** Accessible name of the − key. */
  decrease: string;
  /** Accessible name of the + key. */
  increase: string;
}

export interface QuantityStepperProps {
  /** Keeps the label for assistive tech but not on screen (e.g. beside another labelled control). */
  hideLabel?: boolean;
  id: string;
  label: string;
  name: string;
  onChange: (value: string) => void;
  texts: QuantityStepperTexts;
  value: number;
}
