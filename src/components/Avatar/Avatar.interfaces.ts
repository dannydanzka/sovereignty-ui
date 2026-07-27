/** Avatar component props */
export type AvatarSize = '2xl' | 'lg' | 'md' | 'sm' | 'xs' | 'xl';

export interface AvatarProps {
  alt?: string;
  className?: string;
  name?: string;
  /**
   * `xs` (24px) is the avatar that fits inside a top bar next to text; `2xl` (96px) is the one a
   * profile header uses. Both existed as hand-rolled copies in a product before they existed here —
   * a scale that stops at 64px forces a fork for the two most common placements.
   */
  size?: AvatarSize;
  src?: string | null;
}
