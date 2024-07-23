package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"
	"wallpaperApp/wallpaper"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) shutdown(ctx context.Context) {
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) GetWallpaperPath() string {
	wallpaperPath, _ := wallpaper.GetWallpaperPath()
	return wallpaperPath
}

func (a *App) GetWallpaperBase64(filePath string) string {
	imageBytes, _ := os.ReadFile(filePath)
	return base64.StdEncoding.EncodeToString(imageBytes)
}
