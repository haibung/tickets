package seeds

import (
	"gitlab.com/tiketfest/backend/models"
	"gitlab.com/tiketfest/backend/packages/postgres"
)

func Permission(db *postgres.DB) error {
	var (
		seed       []*models.Permission
		features   []*models.Feature
		keyActions = []models.KeyAction{
			models.KeyActionRead,
			models.KeyActionCreate,
			models.KeyActionUpdate,
			models.KeyActionDelete,
		}
	)

	if err := db.Gorm.Find(&features).Error; err != nil {
		return err
	}

	for _, feature := range features {
		for _, keyAction := range keyActions {
			seed = append(seed, &models.Permission{
				RoleID:    1,
				FeatureID: feature.ID,
				IsActive:  true,
				KeyAction: keyAction,
			})
		}
	}

	if err := db.Gorm.Create(seed).Error; err != nil {
		return err
	}
	return nil
}
