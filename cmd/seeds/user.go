package seeds

import (
	"gitlab.com/tiketfest/backend/models"
	"gitlab.com/tiketfest/backend/packages/postgres"
	"golang.org/x/crypto/bcrypt"
)

func User(db *postgres.DB) error {
	var seed []*models.User

	password, err := bcrypt.GenerateFromPassword([]byte("testing123"), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	seed = append(seed, &models.User{
		FullName: "Super Admin",
		Password: string(password),
		RoleID:   1,
		Email:    "superadmin@mail.com",
	})

	if err := db.Gorm.Create(seed).Error; err != nil {
		return err
	}
	return nil
}
