package models

import (
	"gitlab.com/tiketfest/backend/enum"
	"time"
)

type (
	Transactions struct {
		ID            int
		UserID        int
		InvoiceNumber string
		FullName      string
		Email         string
		PhoneNumber   *string
		Total         float64
		Fee           float64
		Tax           float64
		Commission    float64
		GrandTotal    float64
		Status        enum.TransactionStatus
		CreatedAt     time.Time
		UpdatedAt     time.Time

		// Relations
		User             *User               `gorm:"<-:false;foreignKey:UserID;references:ID;" json:",omitempty"`
		TransactionItems []*TransactionItems `gorm:"<-:false;foreignKey:TransactionID;references:ID;" json:",omitempty"`
		Payments         []*Payments         `gorm:"<-:false;foreignKey:TransactionID;references:ID;" json:",omitempty"`
	}
)
