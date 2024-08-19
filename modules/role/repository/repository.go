package repository

import (
	"context"
	"gitlab.com/tiketfest/backend/models"
	"gitlab.com/tiketfest/backend/packages/logger"
	"gitlab.com/tiketfest/backend/packages/postgres"
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
