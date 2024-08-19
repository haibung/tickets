package auth

import (
	"errors"
	"gitlab.com/tiketfest/backend/packages/validation"
	"gitlab.com/tiketfest/backend/utilities"
)

type (
	// Struct Request
	LoginRequest struct {
		ContextUserID int

		Email    string
		Password string

		Validation validation.Validation
	}

	//	Struct Response
	LoginResponse struct {
		AccessToken  string `json:"access_token"`
		RefreshToken string `json:"refresh_token"`
	}
)

func (receiver LoginRequest) Validate() ([]map[string]interface{}, error) {
	receiver.Validation.IsEmptyString(receiver.Password, "Password")
	receiver.Validation.IsEmptyString(receiver.Email, "Email")

	if len(receiver.Validation.Messages) > 0 {
		return receiver.Validation.Messages, errors.New(utilities.BadRequest)
	}

	return nil, nil
}
