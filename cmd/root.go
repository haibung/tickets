package cmd

import (
	"Users/evilkidz/Project/Golang/CMS/backend/config"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "service",
	Short: "Service App",
}

func Execute() error {
	return rootCmd.Execute()
}

func init() {
	cobra.OnInitialize(initConfig)
}

func initConfig() {
	config.SetConfig()
}
