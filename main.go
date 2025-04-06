package main

import (
    "fmt"
    "net/http"
    "os"
)

func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello from Render + Go!")
}

func main() {
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    fmt.Printf("Starting server on port %s...\n", port)
    fmt.Println("Press Ctrl+C to stop the server")
    
    http.HandleFunc("/", handler)
    http.ListenAndServe("0.0.0.0:"+port, nil)
} 