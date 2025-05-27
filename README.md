# domshot

MCP server to fetch browser screenshots of DOM elements.

https://github.com/user-attachments/assets/1ab36d65-32be-42f5-b3fc-97618c2e96a7

### Installation

```bash
$ git clone https://github.com/adtac/domshot.git
$ claude mcp add domshot -- $PWD/domshot/mcp.sh
```

Restart Claude.

### Usage

Paste this in the **Console** tab of **Chrome DevTools** on the page you want to give Claude access:

```js
const el = document.createElement("script"); el.src = "http://localhost:8000/embed.js"; document.head.appendChild(el);
```

Then ask Claude to call `get_browser_screenshot` and describe the result.

<details>
<summary>See example</summary>

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

</details>

### License

MIT
