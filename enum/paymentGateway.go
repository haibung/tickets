package enum

import (
	"fmt"
	"gitlab.com/tiketfest/backend/utilities"
)

type PaymentGateway string

const (
	PaymentGatewayMidtrans PaymentGateway = "midtrans"
)

func (t PaymentGateway) IsValid() error {
	switch t {
	case
		PaymentGatewayMidtrans:
		return nil
	}
	return fmt.Errorf(utilities.DataNotFound, "Payment Gateway")
}
