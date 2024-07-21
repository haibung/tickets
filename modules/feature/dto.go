package feature

import (
	"Users/evilkidz/Project/Golang/CMS/backend/models"
	"Users/evilkidz/Project/Golang/CMS/backend/packages/validation"
	"Users/evilkidz/Project/Golang/CMS/backend/utilities"
	"errors"
	"time"
)

type (
	// Struct Request
	FindByIDRequest struct {
		ContextUserID int

		ID int

		Validation validation.Validation
	}

	FindAllRequest struct {
		ContextUserID int

		Limit int
		Page  int

		Validation validation.Validation
	}

	//	Struct Response
	FindByIDResponse struct {
		ID        int                `json:"id"`
		Name      string             `json:"name"`
		Code      models.FeatureCode `json:"code"`
		CreatedAt time.Time          `json:"created_at"`
	}

	FindByAllResponse struct {
		ID        int                `json:"id"`
		Name      string             `json:"name"`
		Code      models.FeatureCode `json:"code"`
		CreatedAt time.Time          `json:"created_at"`
	}
)

func (receiver FindByIDRequest) Validate() ([]map[string]interface{}, error) {
	receiver.Validation.IsIntegerMin(receiver.ID, 1, "Role")

	if len(receiver.Validation.Messages) > 0 {
		return receiver.Validation.Messages, errors.New(utilities.BadRequest)
	}

	return nil, nil
}

func (receiver FindAllRequest) Validate() ([]map[string]interface{}, error) {
	//receiver.Validation.IsIntegerMin(receiver.ID, 1, "Role")

	//if len(receiver.Validation.Messages) > 0 {
	//	return receiver.Validation.Messages, errors.New(utilities.BadRequest)
	//}

	return nil, nil
}
