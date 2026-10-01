---
"@invana/themes": patch
---

`AppLayoutV2`: side sections now hold their pixel `defaultSize`. `mainSection` and the areas wrapping it no longer default to 600px / 800px — a fixed default beside a side panel's made the layout rescale both into percentages, so a 280px `leftSection` opened at a fraction of the row instead. Main now takes whatever width the side sections leave; pass `mainSection.defaultSize` only to pin it.
