/**
 * Story-only: the layout cells of AppV2 — each slot drawn as a labelled `EmptyState` so it is
 * obvious which is which and how far the bottom panel reaches for each `bottomSpan`.
 */
import { AppLayoutV2, type BottomSpan } from '@invana/themes/app-v2/layout';

import { Region, footerProps, navItems, railProps, type FooterData, type NavItemData, type RegionData } from '../shell';
import type { V2Handlers } from './handlers';

export interface RegionsData {
  caption: string;
  kind: 'regions';
  brand: string;
  note: string;
  bottomSpan?: BottomSpan;
  /** Absent: no activity bar — the workspace sits flush against the left edge. */
  rail?: { top: NavItemData[]; bottom: NavItemData[] };
  regions: { left: RegionData; main: RegionData; right: RegionData; bottom: RegionData };
  footer: FooterData;
}

export function RegionsShell({ v, on }: { v: RegionsData; on: V2Handlers }) {
  return (
    <AppLayoutV2
      bottomSpan={v.bottomSpan}
      header={{
        leftNavItems: navItems([{ name: v.brand, label: v.brand, static: true }], on.onClick),
        centerNavItems: navItems([{ name: v.note, label: v.note, static: true }], on.onClick),
      }}
      leftNav={railProps(v.rail, on.onClick)}
      leftSection={{ content: <Region region={v.regions.left} /> }}
      mainSection={{ content: <Region region={v.regions.main} /> }}
      rightSection={{ content: <Region region={v.regions.right} /> }}
      bottomSection={{ content: <Region region={v.regions.bottom} /> }}
      footer={footerProps(v.footer, on)}
    />
  );
}
