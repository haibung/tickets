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
	IPermissionInterface interface {
		Create(ctx context.Context, reqData *models.Permission, tx *gorm.DB) (*int, error)
		FindByAllEntityWithTx(ctx context.Context, reqData *models.Permission, tx *gorm.DB) (*models.Permission, error)
		Update(ctx context.Context, reqData *models.Permission, tx *gorm.DB) error
	}

	PermissionRepository struct {
		fx.In
		DB     *postgres.DB
		Logger *logger.Logger
	}
)

// NewRepository :
func NewRepository(permissionRepository PermissionRepository) IPermissionInterface {
	return &permissionRepository
}

// Create :
func (receiver *PermissionRepository) Create(ctx context.Context, reqData *models.Permission, tx *gorm.DB) (*int, error) {
	if err := tx.WithContext(ctx).Create(&reqData).Error; err != nil {
		receiver.Logger.Error(err)
		return nil, err
	}

	return &reqData.ID, nil
}

// FindByAllEntityWithTx :
func (receiver *PermissionRepository) FindByAllEntityWithTx(ctx context.Context, reqData *models.Permission, tx *gorm.DB) (*models.Permission, error) {
	permission := new(models.Permission)

	if err := tx.WithContext(ctx).
		Where(&models.Permission{
			RoleID:    reqData.RoleID,
			FeatureID: reqData.FeatureID,
			KeyAction: reqData.KeyAction,
		}).
		First(&permission).Error; err != nil {
		receiver.Logger.Error(err)
		return nil, err
	}

	return permission, nil
}

// Update :
func (receiver *PermissionRepository) Update(ctx context.Context, reqData *models.Permission, tx *gorm.DB) error {
	updates := map[string]interface{}{
		"is_active": reqData.IsActive,
	}

	if err := tx.WithContext(ctx).
		Model(&models.Permission{}).
		Where("role_id = ?", reqData.RoleID).
		Where("feature_id = ?", reqData.FeatureID).
		Where("key_action = ?", reqData.KeyAction).
		Updates(&updates).Error; err != nil {
		receiver.Logger.Error(err)
		return err
	}

	return nil
}
