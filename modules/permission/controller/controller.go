package controller

import (
	"context"
	"errors"
	"gitlab.com/tiketfest/backend/models"
	featureDto "gitlab.com/tiketfest/backend/modules/feature"
	featureLogic "gitlab.com/tiketfest/backend/modules/feature/controller"
	"gitlab.com/tiketfest/backend/modules/permission"
	"gitlab.com/tiketfest/backend/modules/permission/repository"
	roleDto "gitlab.com/tiketfest/backend/modules/role"
	roleLogic "gitlab.com/tiketfest/backend/modules/role/controller"
	"gitlab.com/tiketfest/backend/packages/logger"
	"gitlab.com/tiketfest/backend/utilities"
	"go.uber.org/fx"
	"gorm.io/gorm"
	"net/http"
)

type (
	IPermissionController interface {
		Create(ctx context.Context, reqData *permission.CreateRequest, tx *gorm.DB) error
	}

	PermissionController struct {
		fx.In
		PermissionRepository repository.PermissionRepository
		FeatureController    featureLogic.IFeatureController
		RoleController       roleLogic.IRoleController
		Logger               *logger.Logger
	}
)

// NewController :
func NewController(permissionController PermissionController) IPermissionController {
	return &permissionController
}

// Create :
func (receiver *PermissionController) Create(ctx context.Context, reqData *permission.CreateRequest, tx *gorm.DB) error {
	// Validate request data
	messages, err := reqData.Validate()
	if err != nil {
		receiver.Logger.Error(err)
		return utilities.ErrorRequest(err, http.StatusBadRequest, messages)
	}

	for _, v := range reqData.Permissions {
		// Check if feature not found
		if _, err := receiver.FeatureController.FindByID(ctx, &featureDto.FindByIDRequest{
			ID: v.FeatureID,
		}); err != nil {
			receiver.Logger.Error(err)
			return err
		}

		// Check if role not found
		if _, err := receiver.RoleController.FindByID(ctx, &roleDto.FindByID{
			ID: v.RoleID,
		}); err != nil {
			receiver.Logger.Error(err)
			return err
		}

		existPermission, err := receiver.PermissionRepository.FindByAllEntityWithTx(ctx, &models.Permission{
			RoleID:    v.RoleID,
			FeatureID: v.FeatureID,
			KeyAction: v.KeyAction,
		}, tx)
		if err != nil && err != gorm.ErrRecordNotFound {
			receiver.Logger.Error(err)
			return utilities.ErrorRequest(err, http.StatusInternalServerError)
		}

		// Update permission
		if existPermission != nil && err != gorm.ErrRecordNotFound {
			if err := receiver.PermissionRepository.Update(ctx, &models.Permission{
				RoleID:    v.RoleID,
				FeatureID: v.FeatureID,
				KeyAction: v.KeyAction,
				IsActive:  v.IsActive,
			}, tx); err != nil {
				receiver.Logger.Error(err)
				return utilities.ErrorRequest(
					errors.New(utilities.InternalServiceError),
					http.StatusInternalServerError,
				)
			}
		}

		// Create new permission
		if err == gorm.ErrRecordNotFound {
			if _, err := receiver.PermissionRepository.Create(ctx, &models.Permission{
				RoleID:    v.RoleID,
				FeatureID: v.FeatureID,
				KeyAction: v.KeyAction,
				IsActive:  v.IsActive,
			}, tx); err != nil {
				receiver.Logger.Error(err)
				return utilities.ErrorRequest(
					errors.New(utilities.InternalServiceError),
					http.StatusInternalServerError,
				)
			}
		}
	}

	return nil
}
