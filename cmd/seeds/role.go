package seeds

import (
	"gitlab.com/tiketfest/backend/models"
	"gitlab.com/tiketfest/backend/packages/postgres"
)

func Role(db *postgres.DB) error {
	var seed []*models.Role

	seed = append(seed, &models.Role{
		Name: "Super Admin",
	})

	if err := db.Gorm.Create(seed).Error; err != nil {
		return err
	}
	return nil
}
