package models

import "time"

type (
	Payments struct {
		ID               int
		TransactionID    int
		InternalID       int
		Status           *string
		SnapshotRequest  *string `json:"-"`
		SnapshotCallback *string `json:"-"`
		CreatedAt        time.Time

		// Relations
		Transaction *Transactions `gorm:"<-:false;foreignKey:TransactionID;references:ID;" json:",omitempty"`
	}
)
