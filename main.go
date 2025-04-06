package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "os"
)

type Response struct {
    Message string `json:"message"`
    Status  int    `json:"status"`
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    response := Response{
        Message: "health",
        Status:  200,
    }
    json.NewEncoder(w).Encode(response)
}

func testHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    response := Response{
        Message: "hello world",
        Status:  200,
    }
    json.NewEncoder(w).Encode(response)
}

func main() {
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    fmt.Printf("Starting server on port %s...\n", port)
    fmt.Println("Press Ctrl+C to stop the server")
    
    http.HandleFunc("/health", healthHandler)
    http.HandleFunc("/test", testHandler)
    http.ListenAndServe("0.0.0.0:"+port, nil)
} 