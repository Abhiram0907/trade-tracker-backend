package main

import (
    "fmt"
    "github.com/gin-gonic/gin"
    "os"
)

type Response struct {
    Message string `json:"message"`
    Status  int    `json:"status"`
}

func healthHandler(c *gin.Context) {
    response := Response{
        Message: "health",
        Status:  200,
    }
    c.JSON(200, response)
}

func testHandler(c *gin.Context) {
    response := Response{
        Message: "hello world",
        Status:  200,
    }
    c.JSON(200, response)
}

func main() {
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    fmt.Printf("Starting server on port %s...\n", port)
    fmt.Println("Press Ctrl+C to stop the server")
    
    r := gin.Default()
    
    r.GET("/health", healthHandler)
    r.GET("/test", testHandler)
    
    r.Run("0.0.0.0:" + port)
} 