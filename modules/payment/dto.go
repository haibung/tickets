package payment

import (
	"errors"
	"gitlab.com/tiketfest/backend/packages/validation"
	"gitlab.com/tiketfest/backend/utilities"
)

type (
	// Struct Request
	CreateRequest struct {
		ContextUserID int

		TransactionID    *int
		InternalID       int
		Status           *string
		SnapshotRequest  *string
		SnapshotCallback *string

		Validation validation.Validation
	}

	FindByIDRequest struct {
		ContextUserID int

		ID int

		Validation validation.Validation
	}
)

func (receiver CreateRequest) Validate() ([]map[string]interface{}, error) {
	receiver.Validation.IsIntegerMin(*receiver.TransactionID, 1, "TransactionID")
	receiver.Validation.IsIntegerMin(receiver.InternalID, 1, "InternalID")
	receiver.Validation.IsEmptyString(*receiver.Status, "Status")
	receiver.Validation.IsEmptyString(*receiver.SnapshotRequest, "SnapshotRequest")
	receiver.Validation.IsEmptyString(*receiver.SnapshotCallback, "SnapshotCallback")

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
