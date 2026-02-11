# lampa-scroll-fix

Lampa plugin that fixes mouse wheel scroll behavior for desktop browsers.

## Problem

When using Lampa on desktop, vertical mouse wheel scroll controls horizontal navigation (left/right card switching) instead of scrolling content. This is designed for TV remotes but breaks the desktop experience.

## Solution

This plugin:
- ✅ Disables horizontal navigation triggered by vertical mouse wheel scroll
- ✅ Allows proper content scrolling when available
- ✅ Doesn't break navigation using keyboard or other input methods

## Installation

Add plugin to Lampa by URL:

```
https://raw.githubusercontent.com/eudu/lampa-scroll-fix/main/scroll_fix.js
```

Or if hosted on GitHub Pages:

```
https://eudu.github.io/lampa-scroll-fix/scroll_fix.js
```

1. Open Lampa → Settings → Extensions → Add Plugin
2. Paste the plugin URL
3. Plugin will load automatically

## How it Works

The plugin intercepts wheel events and:
1. Blocks any left/right navigation commands triggered by vertical scrolling
2. If the content area is scrollable, scrolls it instead
3. Allows normal keyboard/gamepad navigation to continue working
