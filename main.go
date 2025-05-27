package main

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/coder/websocket"
	"github.com/google/uuid"
	"github.com/mark3labs/mcp-go/mcp"
	"github.com/mark3labs/mcp-go/server"
)

func main() {
	type job struct {
		id     uuid.UUID
		result chan []byte
	}

	jobs := make(chan *job)

	go func() {
		s := server.NewMCPServer("domshot", "1.0.0", server.WithToolCapabilities(false))
		s.AddTool(mcp.NewTool("get_browser_screenshot"), func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
			j := &job{id: uuid.New(), result: make(chan []byte)}
			select {
			case jobs <- j:
				return mcp.NewToolResultImage("", string(<-j.result), "image/png"), nil
			default:
				return nil, fmt.Errorf("no browser session")
			}
		})

		if err := server.ServeStdio(s); err != nil {
			panic(fmt.Errorf("start stdio: %w", err))
		}
	}()

	go func() {
		if err := http.ListenAndServe("localhost:8000", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			switch r.Header.Get("upgrade") {
			case "":
				if r.URL.Path == "/embed.js" {
					b, err := os.ReadFile("embed.js")
					if err != nil {
						panic(err)
					}
					w.Write(b)
				} else {
					b, err := os.ReadFile("test.html")
					if err != nil {
						panic(err)
					}
					w.Write(b)
				}
			case "websocket":
				conn, err := websocket.Accept(w, r, &websocket.AcceptOptions{InsecureSkipVerify: true})
				if err != nil {
					panic(err)
				}
				defer conn.CloseNow()

				conn.SetReadLimit(1 << 20)

				for {
					j := <-jobs
					if err := conn.Write(context.Background(), websocket.MessageText, []byte(fmt.Sprintf(`{"id":%q}`, j.id))); err != nil {
						return
					}
					typ, msg, err := conn.Read(context.Background())
					os.WriteFile("/tmp/outerr", []byte(fmt.Sprintf("%v %v %v\n", typ, msg, err)), 0o644)
					if err != nil {
						return
					}
					if typ != websocket.MessageText {
						panic(typ)
					}
					j.result <- msg
				}
			}
		})); err != nil {
			panic(err)
		}
	}()

	select {}
}
