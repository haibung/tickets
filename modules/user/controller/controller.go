package controller

import (
	"context"
	"errors"
	"fmt"
	"gitlab.com/tiketfest/backend/models"
	roleDto "gitlab.com/tiketfest/backend/modules/role"
	roleController "gitlab.com/tiketfest/backend/modules/role/controller"
	"gitlab.com/tiketfest/backend/modules/user"
	"gitlab.com/tiketfest/backend/modules/user/repository"
	"gitlab.com/tiketfest/backend/packages/logger"
	"gitlab.com/tiketfest/backend/utilities"
	"go.uber.org/fx"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"net/http"
	"strings"
)

type (
	IUserController interface {
		Create(ctx context.Context, reqData *user.CreateRequest, tx *gorm.DB) (*int, error)
		FindByEmail(ctx context.Context, reqData *user.FindByEmailRequest) (*user.FindByEmailResponse, error)
	}

	UserController struct {
		fx.In
		UserRepository repository.UserRepository
		RoleController roleController.IRoleController
		Logger         *logger.Logger
	}
)

// NewController :
func NewController(userController UserController) IUserController {
	return &userController
}

// Create :
func (receiver *UserController) Create(ctx context.Context, reqData *user.CreateRequest, tx *gorm.DB) (*int, error) {
	// Validate request data
	messages, err := reqData.Validate()
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusBadRequest, messages)
	}

	// Check if role not found
	if _, err := receiver.RoleController.FindByID(ctx, &roleDto.FindByID{
		ID: reqData.RoleID,
	}); err != nil {
		receiver.Logger.Error(err)
		return nil, err
	}

	// Check if email has taken
	existEmail, err := receiver.UserRepository.FindByEmail(ctx, &models.User{
		Email: reqData.Email,
	})
	if err != nil && err != gorm.ErrRecordNotFound {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusInternalServerError)
	} else if existEmail != nil {
		return nil, utilities.ErrorRequest(fmt.Errorf(utilities.ValueAreadyExist, "Email"), http.StatusBadRequest)
	}

	// Hash password
	password, err := bcrypt.GenerateFromPassword([]byte(reqData.Password), bcrypt.DefaultCost)
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusInternalServerError)
	}

	// Create new user
	insertedID, err := receiver.UserRepository.Create(ctx, &models.User{
		FullName: reqData.FullName,
		Password: string(password),
		Email:    strings.ToLower(reqData.Email),
		RoleID:   reqData.RoleID,
	}, tx)
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(
			errors.New(utilities.InternalServiceError),
			http.StatusInternalServerError,
		)
	}

	return insertedID, nil
}

// FindByEmail :
func (receiver *UserController) FindByEmail(ctx context.Context, reqData *user.FindByEmailRequest) (*user.FindByEmailResponse, error) {
	// Validate request data
	messages, err := reqData.Validate()
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusBadRequest, messages)
	}

	fetchUser, err := receiver.UserRepository.FindByEmail(ctx, &models.User{
		Email: reqData.Email,
	})
	if err != nil {
		receiver.Logger.Error(err)
		if err == gorm.ErrRecordNotFound {
			return nil, utilities.ErrorRequest(
				fmt.Errorf(utilities.DataNotFound, "user"),
				http.StatusNotFound,
			)
		}
		return nil, utilities.ErrorRequest(
			errors.New(utilities.InternalServiceError),
			http.StatusInternalServerError,
		)
	}

	return &user.FindByEmailResponse{
		ID:        fetchUser.ID,
		FullName:  fetchUser.FullName,
		Email:     fetchUser.Email,
		Password:  fetchUser.Password,
		CreatedAt: fetchUser.CreatedAt,
	}, nil
}
