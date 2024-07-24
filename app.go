package main

import (
	"context"
	"encoding/base64"
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

func (a *App) GetLocalWallpapersJSON(rootPath string) string {
	foldersJSON, errJSON := wallpaper.GetLocalWallpapersJSON(rootPath)
	if errJSON != nil {
		return ""
	}

	return string(foldersJSON)
}

func (a *App) GetWallpaperPath() string {
	wallpaperPath, _ := wallpaper.GetWallpaperPath()
	return wallpaperPath
}

func (a *App) SetWallpaper(imagePath string) error {
	err := wallpaper.SetWallpaper(imagePath)
	return err
}

func (a *App) GetWallpaperBase64(filePath string) string {
	imageBytes, _ := os.ReadFile(filePath)
	return base64.StdEncoding.EncodeToString(imageBytes)
}

func (a *App) CheckFileExists(filePath string) bool {
	return wallpaper.CheckFileExists(filePath)
}
