package main

import (
	"gitlab.com/tiketfest/backend/cmd"
	"os"
)

func main() {
	if err := cmd.Execute(); err != nil {
		os.Exit(0)
	}
}
