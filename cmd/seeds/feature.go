package seeds

import (
	"Users/evilkidz/Project/Golang/CMS/backend/models"
	"Users/evilkidz/Project/Golang/CMS/backend/packages/postgres"
)

func Feature(db *postgres.DB) error {
	var seed []*models.Feature

	seed = append(seed, &models.Feature{
		Name: "User",
		Code: models.FeatureUser,
	}, &models.Feature{
		Name: "Content",
		Code: models.FeatureContent,
	}, &models.Feature{
		Name: "Permission",
		Code: models.FeaturePermission,
	}, &models.Feature{
		Name: "Role",
		Code: models.FeatureRole,
	}, &models.Feature{
		Name: "Feature",
		Code: models.FeatureFeature,
	}, &models.Feature{
		Name: "Category",
		Code: models.FeatureCategory,
	})

	if err := db.Gorm.Create(seed).Error; err != nil {
		return err
	}
	return nil
}
