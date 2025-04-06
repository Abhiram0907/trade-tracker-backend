package main

import (
    "fmt"
    "github.com/gin-gonic/gin"
    "os"
    "github.com/gin-contrib/cors"
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
    
    // Configure CORS
    config := cors.DefaultConfig()
    config.AllowOrigins = []string{"http://localhost:3000"} // Add your frontend URL
    config.AllowCredentials = true
    config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
    config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
    
    r.Use(cors.New(config))
    
    r.GET("/health", healthHandler)
    r.GET("/test", testHandler)
    
    r.Run("0.0.0.0:" + port)
} 