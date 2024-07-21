package repository

import (
	"Users/evilkidz/Project/Golang/CMS/backend/models"
	"Users/evilkidz/Project/Golang/CMS/backend/packages/logger"
	"Users/evilkidz/Project/Golang/CMS/backend/packages/postgres"
	"context"
	"go.uber.org/fx"
	"gorm.io/gorm"
)

type (
	IRoleInterface interface {
		Create(ctx context.Context, reqData *models.Role, tx *gorm.DB) (*int, error)
		FindByID(ctx context.Context, reqData *models.Role) (*models.Role, error)
	}

	RoleRepository struct {
		fx.In
		DB     *postgres.DB
		Logger *logger.Logger
	}
)

// NewRepository :
func NewRepository(roleRepository RoleRepository) IRoleInterface {
	return &roleRepository
}

// Create :
func (receiver *RoleRepository) Create(ctx context.Context, reqData *models.Role, tx *gorm.DB) (*int, error) {
	if err := tx.WithContext(ctx).Create(&reqData).Error; err != nil {
		receiver.Logger.Error(err)
		return nil, err
	}

	return &reqData.ID, nil
}

// FindByID :
func (receiver *RoleRepository) FindByID(ctx context.Context, reqData *models.Role) (*models.Role, error) {
	role := new(models.Role)

	if err := receiver.DB.Gorm.WithContext(ctx).
		Where(&models.Role{
			ID: reqData.ID,
		}).
		First(&role).Error; err != nil {
		receiver.Logger.Error(err)
		return nil, err
	}

	return role, nil
}
