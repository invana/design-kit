---
"@invana/ui": patch
"@invana/themes": patch
"@invana/assistant": patch
---

The chat composer's text box has an accessible name: `ChatSessionComposer`'s `textareaLabel`, set from the spec as `composer.label` (`Message` when left out), so a screen reader and a test can find it. In `AppLayoutV1` and `AppLayoutV2`, main no longer grows past the screen when a page is wider than it (a table of many columns): the page scrolls inside main, and an open right section stays in view.
