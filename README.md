# domshot

MCP server to fetch browser screenshots of DOM elements

### Installation

```bash
$ git clone https://github.com/adtac/domshot.git
$ claude mcp add domshot -- $PWD/domshot/mcp.sh
```

### Usage

Start Claude to also start the MCP server plus a HTTP server on port 8000.

Inject the embed script by opening the **Console** tab of Chrome DevTools on the page you want to give Claude access and pasting this:

```js
const el = document.createElement("script"); el.src = "http://localhost:8000/embed.js"; document.head.appendChild(el);
```

Ask Claude to call `get_browser_screenshot` and describe the result:

```
$ claude
╭───────────────────────────────────────────────────╮
│ ✻ Welcome to Claude Code!                         │
│                                                   │
│   /help for help, /status for your current setup  │
│                                                   │
│   cwd: /Users/user/src/tmp/domshot                │
╰───────────────────────────────────────────────────╯


> call get_browser_screenshot tool and describe the result

⏺ I'll call the browser screenshot tool and describe what I see.

⏺ domshot:get_browser_screenshot (MCP)
  ⎿  
  ⎿  [Image]

⏺ The screenshot shows a simple red webpage with the text "RED" displayed in white text, centered on a solid
  red background.
```

### License

MIT
