(() => {
  window.domshot = () => {
    return new Promise(resolve => {
      const overlay = Object.assign(document.createElement("div"), {
        style: "position: fixed; inset: 0; pointer-events: none; z-index: 2147483647; background: #00000020; "
      });

      const highlight = Object.assign(document.createElement("div"), {
        style: "position: fixed; border: 2px solid #00ff00; background: #00ff0020; pointer-events: none; z-index: inherit; "
      });

      overlay.appendChild(highlight);
      document.body.appendChild(overlay);

      let current = null;

      const mousemove = (ev) => {
        current = document.elementFromPoint(ev.clientX, ev.clientY);
        if (!current) {
          return;
        }

        const rect = current.getBoundingClientRect();
        Object.assign(highlight.style, {
          left: rect.left + "px",
          top: rect.top + "px",
          width: rect.width + "px",
          height: rect.height + "px"
        });
      };

      const click = async (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        cleanup();
        if (!current) {
          return resolve(null);
        }

        try {
          const canvas = await html2canvas(current);
          const blob = await new Promise((resolve, reject) => {
            return canvas.toBlob(b => b ? resolve(b) : reject(new Error("failed")), "image/png")
          });
          const bytes = new Uint8Array(await blob.arrayBuffer());
          window.arr = bytes;
          resolve(btoa(String.fromCharCode.apply(null, bytes)));
        } catch (err) {
          console.error(err);
          resolve(null);
        }
      };

      const keydown = (ev) => {
        if (ev.key === "Escape") {
          cleanup();
          resolve(null);
        }
      };

      document.addEventListener("mousemove", mousemove, true);
      document.addEventListener("click", click, true);
      document.addEventListener("keydown", keydown, true);

      function cleanup() {
        overlay.remove();
        document.removeEventListener("mousemove", mousemove, true);
        document.removeEventListener("click", click, true);
        document.removeEventListener("keydown", keydown, true);
      }
    });
  }

  function main() {
    var script = document.createElement("script");
    script.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
    document.head.appendChild(script);

    const conn = new WebSocket(document.currentScript.src.replaceAll("http://", "ws://"));
    conn.addEventListener("open", (ev) => console.log("websocket opened"));
    conn.addEventListener("close", (ev) => console.log("websocket closed"));
    conn.addEventListener("message", async (ev) => {
      console.log("websocket message", ev);
      const { id } = JSON.parse(ev.data);
      console.log("handling", id);
      const resp = await window.domshot();
      console.log("resp", resp);
      conn.send(resp);
    });
  }

  main();
})();
