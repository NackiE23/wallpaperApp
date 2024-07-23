package wallpaper

import (
	"syscall"
	"unsafe"
)

const (
	SPI_GETDESKWALLPAPER = 0x0073
	MAX_PATH             = 260
)

func GetWallpaperPath() (string, error) {
	// Load user32.dl
	user32 := syscall.NewLazyDLL("user32.dll")
	// Get the SystemParametersInfoW function
	procSystemParametersInfoW := user32.NewProc("SystemParametersInfoW")

	// Create a buffer to store the wallpaper path
	buffer := make([]uint16, MAX_PATH)

	// Call SystemParametersInfoW to get the wallpaper path
	ret, _, err := procSystemParametersInfoW.Call(
		SPI_GETDESKWALLPAPER,
		uintptr(MAX_PATH),
		uintptr(unsafe.Pointer(&buffer[0])),
		0,
	)

	if ret == 0 {
		return "", err
	}

	// Convert the buffer from UTF-16 to a Go string
	wallpaperPath := syscall.UTF16ToString(buffer)
	return wallpaperPath, nil
}
