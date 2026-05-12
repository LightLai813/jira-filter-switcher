# Privacy Policy — Jira Filter Switcher

_Last updated: 2026-05-12_

## Overview

Jira Filter Switcher is a Chrome browser extension that helps users quickly switch Jira board filters during stand-up meetings. This policy explains how the extension handles your data.

## Data Collection

**We do not collect any personal data.**

The extension does not:
- Collect, transmit, or share any personal information
- Send any data to external servers
- Track your browsing activity
- Use analytics or crash reporting services

## Data Storage

All data created by this extension (filter lists, URL patterns, panel position) is stored **locally in your browser** using the Chrome `storage.local` API. This data:

- Never leaves your device
- Is only accessible by the extension itself
- Can be deleted at any time via `chrome://extensions` → extension details → "Clear data"

## Permissions

| Permission | Purpose |
|---|---|
| `storage` | Save filter lists and settings locally in the browser |
| `scripting` | Inject the floating filter panel into Jira pages |
| Host permissions | Activate the panel only on user-configured Jira URLs |

No permission is used to collect or transmit personal data.

## Third-Party Services

This extension does not integrate with or send data to any third-party services.

## Changes to This Policy

If this policy changes, the updated version will be published in this repository with a new "Last updated" date.

## Contact

If you have any questions, please open an issue on the [GitHub repository](https://github.com/LightLai813/jira-filter-switcher).
