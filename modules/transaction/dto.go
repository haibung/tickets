package transaction

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

		InvoiceNumber string
		FullName      string
		Email         string
		PhoneNumber   string
		//Total         float64
		//Fee           float64
		//Tax           float64
		//Commission    float64
		//GrandTotal    float64
		//Status        string
		Items []ItemTransaction

		Validation validation.Validation
	}

	ItemTransaction struct {
		EventID int
		Qty     int
	}

	FindByIDRequest struct {
		ContextUserID *int

		ID int

		Validation validation.Validation
	}

	FindByIDResponse struct {
		ID            int
		InvoiceNumber string
		FullName      string
		Email         string
		PhoneNumber   string
		Items         []ItemTransaction
		CreatedAt     time.Time `json:"created_at"`
	}
)

func (receiver CreateRequest) Validate() ([]map[string]interface{}, error) {
	receiver.Validation.IsEmptyString(receiver.InvoiceNumber, "Invoice Number")
	receiver.Validation.IsEmptyString(receiver.FullName, "Full Name")
	receiver.Validation.IsEmptyString(receiver.Email, "Email")
	receiver.Validation.IsEmptyString(receiver.PhoneNumber, "Phone Number")
	//receiver.Validation.IsFloatMin(receiver.Total, 0, "Total")
	//receiver.Validation.IsFloatMin(receiver.Fee, 0, "Fee")
	//receiver.Validation.IsFloatMin(receiver.Tax, 0, "Tax")
	//receiver.Validation.IsFloatMin(receiver.Commission, 0, "Commission")
	//receiver.Validation.IsFloatMin(receiver.GrandTotal, 0, "Grand Total")
	//receiver.Validation.IsEmptyString(receiver.Status, "Status")
	receiver.Validation.IsIntegerMin(len(receiver.Items), 1, "Items")

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
