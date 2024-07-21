package seeds

import (
	"Users/evilkidz/Project/Golang/CMS/backend/models"
	"Users/evilkidz/Project/Golang/CMS/backend/packages/postgres"
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
