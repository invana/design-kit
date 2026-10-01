import { TypographyH1 } from './h1';
import { TypographyH2 } from './h2';
import { TypographyH3 } from './h3';
import { TypographyH4 } from './h4';
import { TypographyH5 } from './h5';
import { TypographyH6 } from './h6';
import { TypographyP } from './p';
import { TypographyBlockquote } from './blockquote';
import { TypographyInlineCode } from './inline-code';
import { TypographyLead } from './lead';
import { TypographyLarge } from './large';
import { TypographySmall } from './small';
import { TypographyMuted } from './muted';
import { TypographyList } from './list';
import { TypographyPre } from './pre';

// Export individual components for direct imports
export * from './h1';
export * from './h2';
export * from './h3';
export * from './h4';
export * from './h5';
export * from './h6';
export * from './p';
export * from './blockquote';
export * from './inline-code';
export * from './lead';
export * from './large';
export * from './small';
export * from './muted';
export * from './list';
export * from './pre';

// Export as namespace object
export const Typography = {
  H1: TypographyH1,
  H2: TypographyH2,
  H3: TypographyH3,
  H4: TypographyH4,
  H5: TypographyH5,
  H6: TypographyH6,
  P: TypographyP,
  Blockquote: TypographyBlockquote,
  Code: TypographyInlineCode,
  Lead: TypographyLead,
  Large: TypographyLarge,
  Small: TypographySmall,
  Muted: TypographyMuted,
  List: TypographyList,
  Pre: TypographyPre,
};
