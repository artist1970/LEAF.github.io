# LEAF — Noorel Conversation Studio

This repository contains the public-facing, static HTML conversation interface for Noorel. The design follows Verve N Veda and Khaemenes Academy visual conventions.

## Interface features

- Responsive chat interface with scrollable, timestamped messages.
- New conversations and a conversation history panel.
- Export active conversation as JSON or Markdown.
- Local browser storage for the current tab; optional persistent browser storage controlled by the user.
- Clearly labeled **interface-test mode**, with limited canned replies for interface inspection only.
- Reserved **same-origin** endpoint `POST /api/noorel/chat` for future authenticated inference integration.

## Current deployment status

**The interface is not yet connected to the Noorel neural model.** Sample replies are not neural inference. On a GitHub Pages static site, `/api/noorel/chat` does not exist. Turning off interface-test mode therefore cannot produce real Noorel answers until an independently hosted, authenticated, secure same-origin gateway is deployed.

The gateway must authenticate the owner on the server, verify user authorization, enforce rate limits, provide CSRF defenses as appropriate, audit permitted access, limit request length, and enforce the private research model's access policies. Keep all model weights, GitHub credentials, inference secrets, archive contents and authentication logic **off** GitHub Pages.

The browser only sends a message when the user disables test mode and submits it. When the future secure endpoint exists, it should accept `{messages:[{role,content},...]}` and return `{reply:"..."}`. No API keys or model endpoints are configured in the public page.

## Privacy

Conversation history is stored only in this browser; session-only storage is the default. Enabling “Remember chats on this device” permits local browser persistence. This storage is not encrypted or an Academy account cloud. Anyone with access to the same browser profile may be able to read it. Use Export to retain personal copies; browser/device clearing may erase unsaved messages.

## Hosting

`index.html` is the entry point. The repository is intended for GitHub Pages on the `main` branch. Site publishing must be enabled in repository settings if it is not already enabled.

No private model data or archive content should ever be committed to this public repository.
