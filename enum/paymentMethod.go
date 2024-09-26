package enum

import (
	"fmt"
	"gitlab.com/tiketfest/backend/utilities"
)

type PaymentMethod int

const (
	PaymentMethodCash        PaymentMethod = 1
	PaymentMethodQRIS        PaymentMethod = 2
	PaymentMethodPaymentLink PaymentMethod = 3
	PaymentMethodCasbon      PaymentMethod = 4
	PaymentMethodOther       PaymentMethod = 5
	PaymentMethodTransfer    PaymentMethod = 6
)

func (t PaymentMethod) String() string {
	switch t {
	case PaymentMethodCash:
		return "Tunai"
	case PaymentMethodQRIS:
		return "QRIS"
	case PaymentMethodPaymentLink:
		return "Payment Link"
	case PaymentMethodCasbon:
		return "Kasbon"
	case PaymentMethodOther:
		return "Lainnya"
	case PaymentMethodTransfer:
		return "Transfer"
	default:
		return "Unknown"
	}
}

func (t PaymentMethod) IsValid() error {
	switch t {
	case PaymentMethodCash,
		PaymentMethodQRIS,
		PaymentMethodPaymentLink,
		PaymentMethodCasbon,
		PaymentMethodOther,
		PaymentMethodTransfer:
		return nil
	}
	return fmt.Errorf(utilities.DataNotFound, "Metode Pembayaran")
}
