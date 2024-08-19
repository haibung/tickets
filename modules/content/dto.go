package content

import (
	"errors"
	"gitlab.com/tiketfest/backend/models"
	"gitlab.com/tiketfest/backend/packages/validation"
	"gitlab.com/tiketfest/backend/utilities"
	"time"
)

type (
	// Struct Request
	CreateRequest struct {
		ContextUserID int

		Title       string
		CategoryID  *int
		Type        models.ContentType
		IsPublish   bool
		Description string
		Tags        string
		Link        string
		Images      models.ContentImages

		Validation validation.Validation
	}

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
		ID          int `json:"id"`
		Title       string
		CategoryID  *int
		Type        models.ContentType
		IsPublish   bool
		Description string
		Tags        string
		Link        string
		Images      models.ContentImages
		CreatedAt   time.Time `json:"created_at"`
	}

	FindByAllResponse struct {
		ID          int `json:"id"`
		Title       string
		CategoryID  *int
		Type        models.ContentType
		IsPublish   bool
		Description string
		Tags        string
		Link        string
		Images      models.ContentImages
		CreatedAt   time.Time `json:"created_at"`
	}
)

func (receiver CreateRequest) Validate() ([]map[string]interface{}, error) {
	if err := receiver.Type.IsValid(); err != nil {
		return nil, err
	}

	receiver.Validation.IsEmptyString(receiver.Title, "Title")

	if len(receiver.Validation.Messages) > 0 {
		return receiver.Validation.Messages, errors.New(utilities.BadRequest)
	}

	return nil, nil
}

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
