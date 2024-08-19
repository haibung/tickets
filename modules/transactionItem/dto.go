package transactionItem

import (
	"errors"
	"gitlab.com/tiketfest/backend/packages/validation"
	"gitlab.com/tiketfest/backend/utilities"
)

type (
	// Struct Request
	CreateRequest struct {
		ContextUserID int

		TransactionID int
		EventID       int
		Qty           int

		Validation validation.Validation
	}

	FindByIDRequest struct {
		ContextUserID int

		ID int

		Validation validation.Validation
	}
)

func (receiver CreateRequest) Validate() ([]map[string]interface{}, error) {
	receiver.Validation.IsIntegerMin(receiver.TransactionID, 1, "TransactionID")
	receiver.Validation.IsIntegerMin(receiver.EventID, 1, "EventID")
	receiver.Validation.IsIntegerMin(receiver.Qty, 1, "Qty")

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
