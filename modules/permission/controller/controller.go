package controller

import (
	"Users/evilkidz/Project/Golang/CMS/backend/models"
	featureDto "Users/evilkidz/Project/Golang/CMS/backend/modules/feature"
	featureLogic "Users/evilkidz/Project/Golang/CMS/backend/modules/feature/controller"
	"Users/evilkidz/Project/Golang/CMS/backend/modules/permission"
	"Users/evilkidz/Project/Golang/CMS/backend/modules/permission/repository"
	roleDto "Users/evilkidz/Project/Golang/CMS/backend/modules/role"
	roleLogic "Users/evilkidz/Project/Golang/CMS/backend/modules/role/controller"
	"Users/evilkidz/Project/Golang/CMS/backend/packages/logger"
	"Users/evilkidz/Project/Golang/CMS/backend/utilities"
	"context"
	"errors"
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
