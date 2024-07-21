package user

import (
	"Users/evilkidz/Project/Golang/CMS/backend/packages/validation"
	"Users/evilkidz/Project/Golang/CMS/backend/utilities"
	"errors"
	"time"
)

type (
	//Struct Request
	CreateRequest struct {
		ContextUserID int

		FullName string
		Password string
		Email    string
		RoleID   int

		Validation validation.Validation
	}

	FindByEmailRequest struct {
		ContextUserID int

		Email string

		Validation validation.Validation
	}

	//	Struct Response
	FindByEmailResponse struct {
		ID        int       `json:"id"`
		FullName  string    `json:"full_name"`
		Email     string    `json:"email"`
		Password  string    `json:"password"`
		CreatedAt time.Time `json:"created_at"`
	}
)

func (receiver CreateRequest) Validate() ([]map[string]interface{}, error) {
	receiver.Validation.IsEmptyString(receiver.FullName, "FullName")
	receiver.Validation.IsIntegerMin(receiver.RoleID, 1, "Role")
	receiver.Validation.IsEmptyString(receiver.Password, "Password")
	receiver.Validation.IsEmptyString(receiver.Email, "Email")
	receiver.Validation.IsEmailValid(receiver.Email, "Email")

	if len(receiver.Validation.Messages) > 0 {
		return receiver.Validation.Messages, errors.New(utilities.BadRequest)
	}

	return nil, nil
}

func (receiver FindByEmailRequest) Validate() ([]map[string]interface{}, error) {
	receiver.Validation.IsEmptyString(receiver.Email, "Email")
	receiver.Validation.IsEmailValid(receiver.Email, "Email")

	if len(receiver.Validation.Messages) > 0 {
		return receiver.Validation.Messages, errors.New(utilities.BadRequest)
	}

	return nil, nil
}
