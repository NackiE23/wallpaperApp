package wallpaper

import (
	"encoding/json"
	"os"
	"syscall"
	"unsafe"
)

const (
	SPI_GETDESKWALLPAPER = 0x0073
	SPI_SETDESKWALLPAPER = 0x0014
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

func SetWallpaper(imagePath string) error {
	// Load user32.dll
	user32 := syscall.NewLazyDLL("user32.dll")
	// Get the SystemParametersInfoW function
	procSystemParametersInfoW := user32.NewProc("SystemParametersInfoW")

	// Convert the image path to a UTF-16 encoded string
	imagePathUTF16, err := syscall.UTF16PtrFromString(imagePath)
	if err != nil {
		return err
	}

	// Call SystemParametersInfoW to set the wallpaper
	ret, _, err := procSystemParametersInfoW.Call(
		SPI_SETDESKWALLPAPER,
		0,
		uintptr(unsafe.Pointer(imagePathUTF16)),
		0,
	)

	if ret == 0 {
		return err
	}

	return nil
}

type Folder struct {
	Name  string   `json:"name"`
	Files []string `json:"files"`
}

func GetLocalWallpapers(rootPath string) []Folder {
	var folders []Folder
	files, _ := os.ReadDir(rootPath)

	for _, file := range files {
		if file.IsDir() {
			subFolders := GetLocalWallpapers(rootPath + "\\" + file.Name())
			folders = append(folders, subFolders...)
		} else {
			if cap(folders) == 0 {
				folders = append(folders, Folder{
					Name:  rootPath,
					Files: []string{file.Name()},
				})
			} else {
				folders[0].Files = append(folders[0].Files, file.Name())
			}
		}
	}

	return folders
}

func GetLocalWallpapersJSON(rootPath string) ([]byte, error) {
	folders := GetLocalWallpapers(rootPath)
	jsonData, errJSON := json.MarshalIndent(folders, "", " ")
	if errJSON != nil {
		return make([]byte, 0), errJSON
	}
	return jsonData, nil
}
