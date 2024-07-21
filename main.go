package main

import (
	"Users/evilkidz/Project/Golang/CMS/backend/cmd"
	"os"
)

func main() {
	if err := cmd.Execute(); err != nil {
		os.Exit(0)
	}
}
