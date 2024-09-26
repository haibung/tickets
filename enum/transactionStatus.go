package enum

import (
	"errors"
	"fmt"
	"strconv"
	"strings"

	"gitlab.com/tiketfest/backend/utilities"
)

type TransactionStatus int

const (
	TransactionStatusWaiting  TransactionStatus = 0
	TransactionStatusSuccess  TransactionStatus = 1
	TransactionStatusCancel   TransactionStatus = 2
	TransactionStatusFailed   TransactionStatus = 3
	TransactionStatusExpired  TransactionStatus = 4
	TransactionStatusOnHold   TransactionStatus = 5
	TransactionStatusRefunded TransactionStatus = 6
)

func (t TransactionStatus) String() string {
	switch t {
	case TransactionStatusWaiting:
		return "Menunggu"
	case TransactionStatusSuccess:
		return "Selesai"
	case TransactionStatusCancel:
		return "Dibatalkan"
	case TransactionStatusFailed:
		return "Gagal"
	case TransactionStatusExpired:
		return "Kadaluarsa"
	case TransactionStatusOnHold:
		return "Ditahan"
	case TransactionStatusRefunded:
		return "Dikembalikan"
	default:
		return "Unknown"
	}
}

func (t TransactionStatus) IsValid() error {
	switch t {
	case
		TransactionStatusWaiting,
		TransactionStatusSuccess,
		TransactionStatusCancel,
		TransactionStatusFailed,
		TransactionStatusExpired,
		TransactionStatusOnHold,
		TransactionStatusRefunded:
		return nil
	}
	return fmt.Errorf(utilities.DataNotFound, "Status Transaksi")
}

func TransactionStatusToArray(value string) ([]int, error) {
	var result []int
	statusTransaction := strings.Split(value, ",")
	for i := 0; i < len(statusTransaction); i++ {
		statusTransactionID, err := strconv.Atoi(statusTransaction[i])
		if err != nil {
			return nil, errors.New(utilities.NumberNotValid)
		}
		if err := TransactionStatus(statusTransactionID).IsValid(); err != nil {
			return nil, err
		}
		result = append(result, statusTransactionID)
	}
	return result, nil
}
