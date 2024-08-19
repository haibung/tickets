package models

import "time"

type (
	Payments struct {
		ID               int
		TransactionID    int
		InternalID       string
		Status           *string
		SnapshotRequest  *string
		SnapshotCallback *string
		CreatedAt        time.Time

		// Relations
		Transaction *Transactions `gorm:"<-:false;foreignKey:TransactionID;references:ID;" json:",omitempty"`
	}
)
