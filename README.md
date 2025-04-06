# Trade Tracker Backend

A simple Go web server that can be deployed to Render.

## Running Locally

1. Make sure you have Go installed (version 1.21 or later)
2. Run the server:
   ```bash
   go run main.go
   ```
3. The server will start on port 8080 by default, or you can set a custom port using the PORT environment variable:
   ```bash
   PORT=3000 go run main.go
   ```

## Building

To build the application:
```bash
go build
```

## Deployment

This application is configured to work with Render. It will automatically use the PORT environment variable provided by Render. 