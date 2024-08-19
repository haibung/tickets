package role

import (
	"errors"
	"gitlab.com/tiketfest/backend/packages/validation"
	"gitlab.com/tiketfest/backend/utilities"
	"time"
)

type (
	// Struct Request
	CreateRequest struct {
		ContextUserID int

		Name string

		Validation validation.Validation
	}

	FindByID struct {
		ContextUserID int

		ID int

		Validation validation.Validation
	}

	//	Struct Response
	FindByIDResponse struct {
		ID        int       `json:"id"`
		Name      string    `json:"name"`
		CreatedAt time.Time `json:"created_at"`
	}
)

func (receiver CreateRequest) Validate() ([]map[string]interface{}, error) {
	receiver.Validation.IsEmptyString(receiver.Name, "Name")

	if len(receiver.Validation.Messages) > 0 {
		return receiver.Validation.Messages, errors.New(utilities.BadRequest)
	}

	return nil, nil
}

func (receiver FindByID) Validate() ([]map[string]interface{}, error) {
	receiver.Validation.IsIntegerMin(receiver.ID, 1, "Role")

	if len(receiver.Validation.Messages) > 0 {
		return receiver.Validation.Messages, errors.New(utilities.BadRequest)
	}

	return nil, nil
}
