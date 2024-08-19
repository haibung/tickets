package models

import (
	"fmt"
	"gitlab.com/tiketfest/backend/utilities"
	"time"
)

type (
	FeatureCode string

	Feature struct {
		ID        int
		Name      string
		Code      FeatureCode
		CreatedAt time.Time
		UpdatedAt time.Time
	}
)

const (
	FeatureUser            FeatureCode = "USER"
	FeatureContent         FeatureCode = "CONTENT"
	FeaturePermission      FeatureCode = "PERMISSION"
	FeatureRole            FeatureCode = "ROLE"
	FeatureFeature         FeatureCode = "FEATURE"
	FeatureCategory        FeatureCode = "CATEGORY"
	FeatureMedia           FeatureCode = "MEDIA"
	FeatureTransaction     FeatureCode = "TRANSACTION"
	FeatureTransactionItem FeatureCode = "TRANSACTION_ITEM"
	FeaturePayment         FeatureCode = "PAYMENT"
)

func (receiver FeatureCode) IsValid() error {
	switch receiver {
	case FeatureUser, FeatureContent, FeaturePermission, FeatureRole, FeatureMedia, FeatureCategory, FeatureFeature, FeatureTransaction, FeatureTransactionItem, FeaturePayment:
		return nil
	}

	return fmt.Errorf(utilities.DataNotFound, "feature")
}
