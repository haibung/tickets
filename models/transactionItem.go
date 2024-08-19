package models

import "time"

type (
	TransactionItems struct {
		ID            int
		TransactionID int
		EventID       int
		Qty           int
		CreatedAt     time.Time

		// Relations
		Transaction *Transactions `gorm:"<-:false;foreignKey:TransactionID;references:ID;" json:",omitempty"`
	}
)
