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

## Local Noorel research studio

The private Noorel repository now has an **optional local-only** mode that can serve this exact `index.html` from an authenticated loopback gateway. The operator runs it on their own trusted workstation with both repositories checked out, a locally generated Noorel checkpoint, and a private `NOOREL_GATEWAY_TOKEN` set outside source control:

```sh
python -m tools.loopback_gateway --checkpoint-dir runs/noorel-v0 \
  --leaf-html /path/to/LEAF.github.io/index.html --port 8767 --allow-experimental
```

Run that command from the private Noorel repository. Then use `http://127.0.0.1:8767/` **on the same machine** to test raw experimental neural responses. The local server enables the inference switch only in its in-memory HTML response, prompts for the local secret on first use, and never changes the public LEAF deployment. Do not enter this token into the public website.

The local model is a research prototype and may answer incoherently. A real trained assistant, a secure public HTTPS session gateway, and cloud conversation persistence have not been commissioned. See `artist1970/noorel.github.io/docs/LEAF-GATEWAY-CHECKPOINT-11.md` for security and operation details.

## Privacy

Conversation history is stored only in this browser; session-only storage is the default. Enabling “Remember chats on this device” permits local browser persistence. This storage is not encrypted or an Academy account cloud. Anyone with access to the same browser profile may be able to read it. Use Export to retain personal copies; browser/device clearing may erase unsaved messages.

## Hosting

`index.html` is the entry point. The repository is intended for GitHub Pages on the `main` branch. Site publishing must be enabled in repository settings if it is not already enabled.

No private model data or archive content should ever be committed to this public repository.
