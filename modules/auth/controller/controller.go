package controller

import (
	"Users/evilkidz/Project/Golang/CMS/backend/config"
	"Users/evilkidz/Project/Golang/CMS/backend/modules/auth"
	userDto "Users/evilkidz/Project/Golang/CMS/backend/modules/user"
	userController "Users/evilkidz/Project/Golang/CMS/backend/modules/user/controller"
	_jwt "Users/evilkidz/Project/Golang/CMS/backend/packages/jwt"
	"Users/evilkidz/Project/Golang/CMS/backend/packages/logger"
	"Users/evilkidz/Project/Golang/CMS/backend/utilities"
	"context"
	"errors"
	"github.com/gofrs/uuid"
	"github.com/golang-jwt/jwt"
	"go.uber.org/fx"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"time"
)

type (
	IAuthController interface {
		Login(ctx context.Context, reqData *auth.LoginRequest) (*auth.LoginResponse, error)
	}

	AuthController struct {
		fx.In
		Logger         *logger.Logger
		UserController userController.IUserController
	}
)

// NewController :
func NewController(authController AuthController) IAuthController {
	return &authController
}

// Login :
func (receiver *AuthController) Login(ctx context.Context, reqData *auth.LoginRequest) (*auth.LoginResponse, error) {
	// Validate request data
	messages, err := reqData.Validate()
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusBadRequest, messages)
	}

	fetchUser, err := receiver.UserController.FindByEmail(ctx, &userDto.FindByEmailRequest{
		Email: reqData.Email,
	})
	if err != nil {
		receiver.Logger.Error(err)

		if utilities.ParseError(err).StatusCode == http.StatusNotFound {
			return nil, utilities.ErrorRequest(errors.New(utilities.InvalidAccessLogin), http.StatusForbidden)
		}

		return nil, err
	}

	// Check password
	if err := bcrypt.CompareHashAndPassword([]byte(fetchUser.Password), []byte(reqData.Password)); err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(errors.New(utilities.InvalidAccessLogin), http.StatusForbidden)
	}

	// Generate uuid for user jwt
	generateUUID, err := uuid.NewV4()
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusInternalServerError)
	}

	// Generate access and refresh token
	accessToken, err := _jwt.GenerateToken(_jwt.Claim{
		Data: _jwt.ClaimData{
			UserID: fetchUser.ID,
			UUID:   generateUUID.String(),
		},
		StandardClaims: jwt.StandardClaims{
			Audience:  "", // Web | Mobile = Get from context header
			IssuedAt:  time.Now().Unix(),
			ExpiresAt: time.Now().Add(config.Get().Auth.ExpireAccessTokenDuration).Unix(),
		},
	}, config.Get().Auth.Secret)
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusInternalServerError)
	}

	refreshToken, err := _jwt.GenerateToken(_jwt.Claim{
		Data: _jwt.ClaimData{
			UserID: fetchUser.ID,
			UUID:   generateUUID.String(),
		},
		StandardClaims: jwt.StandardClaims{
			Audience:  "", // Web | Mobile = Get from context header
			IssuedAt:  time.Now().Unix(),
			ExpiresAt: time.Now().Add(config.Get().Auth.ExpireRefreshTokenDuration).Unix(),
		},
	}, config.Get().Auth.SecretClaim)
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusInternalServerError)
	}

	return &auth.LoginResponse{
		AccessToken:  *accessToken,
		RefreshToken: *refreshToken,
	}, nil
}
