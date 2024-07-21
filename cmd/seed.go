package cmd

import (
	"Users/evilkidz/Project/Golang/CMS/backend/cmd/seeds"
	"Users/evilkidz/Project/Golang/CMS/backend/packages/logger"
	"Users/evilkidz/Project/Golang/CMS/backend/packages/postgres"
	"github.com/spf13/cobra"
)

var seed = &cobra.Command{
	Use:   "seed",
	Short: "Seeder",
	Run: func(cmd *cobra.Command, args []string) {
		log := logger.NewLogger()
		postgres := postgres.NewPostgres(log)

		if len(args) == 0 {
			log.Error("please insert seed name")
			return
		}

		switch args[0] {
		case "user":
			if err := seeds.User(postgres); err != nil {
				log.Error(err)
				return
			}
		case "feature":
			if err := seeds.Feature(postgres); err != nil {
				log.Error(err)
				return
			}
		case "permission":
			if err := seeds.Permission(postgres); err != nil {
				log.Error(err)
				return
			}
		case "role":
			if err := seeds.Role(postgres); err != nil {
				log.Error(err)
				return
			}
		default:
			if err := seeds.Feature(postgres); err != nil {
				log.Error(err)
				return
			}
			if err := seeds.Role(postgres); err != nil {
				log.Error(err)
				return
			}
			if err := seeds.Permission(postgres); err != nil {
				log.Error(err)
				return
			}
			if err := seeds.User(postgres); err != nil {
				log.Error(err)
				return
			}
			return
		}
	},
}

func init() {
	rootCmd.AddCommand(seed)
}
