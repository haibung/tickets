package controller

import (
	"context"
	"errors"
	"fmt"
	"gitlab.com/tiketfest/backend/models"
	"gitlab.com/tiketfest/backend/modules/role"
	"gitlab.com/tiketfest/backend/modules/role/repository"
	"gitlab.com/tiketfest/backend/packages/logger"
	"gitlab.com/tiketfest/backend/utilities"
	"go.uber.org/fx"
	"gorm.io/gorm"
	"net/http"
)

type (
	IRoleController interface {
		Create(ctx context.Context, reqData *role.CreateRequest, tx *gorm.DB) (utilities.ResultResponse, error)
		FindByID(ctx context.Context, reqData *role.FindByID) (*role.FindByIDResponse, error)
	}

	RoleController struct {
		fx.In
		RoleRepository repository.RoleRepository
		Logger         *logger.Logger
	}
)

// NewController :
func NewController(roleController RoleController) IRoleController {
	return &roleController
}

// Create :
func (receiver *RoleController) Create(ctx context.Context, reqData *role.CreateRequest, tx *gorm.DB) (utilities.ResultResponse, error) {
	// Validate request data
	messages, err := reqData.Validate()
	if err != nil {
		receiver.Logger.Error(err)
		return messages, utilities.ErrorRequest(err, http.StatusBadRequest)
	}

	// Create new role
	insertedID, err := receiver.RoleRepository.Create(ctx, &models.Role{
		Name: reqData.Name,
	}, tx)
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(
			errors.New(utilities.InternalServiceError),
			http.StatusInternalServerError,
		)
	}

	return *insertedID, nil
}

// FindByID :
func (receiver *RoleController) FindByID(ctx context.Context, reqData *role.FindByID) (*role.FindByIDResponse, error) {
	// Validate request data
	messages, err := reqData.Validate()
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusBadRequest, messages)
	}

	fetchRole, err := receiver.RoleRepository.FindByID(ctx, &models.Role{
		ID: reqData.ID,
	})
	if err != nil {
		receiver.Logger.Error(err)
		if err == gorm.ErrRecordNotFound {
			return nil, utilities.ErrorRequest(
				fmt.Errorf(utilities.DataNotFound, "role"),
				http.StatusNotFound,
			)
		}
		return nil, utilities.ErrorRequest(
			errors.New(utilities.InternalServiceError),
			http.StatusInternalServerError,
		)
	}

	return &role.FindByIDResponse{
		ID:   fetchRole.ID,
		Name: fetchRole.Name,
	}, nil
}
