package models

import (
	"time"
)

type (
	Transactions struct {
		ID            int
		InvoiceNumber string
		FullName      string
		Email         string
		PhoneNumber   *string
		Total         float64
		Fee           float64
		Tax           float64
		Commission    float64
		GrandTotal    float64
		Status        string
		CreatedAt     time.Time
		UpdatedAt     time.Time

		// Relations
		TransactionItems []*TransactionItems `gorm:"<-:false;foreignKey:TransactionID;references:ID;" json:",omitempty"`
		Payments         []*Payments         `gorm:"<-:false;foreignKey:TransactionID;references:ID;" json:",omitempty"`
	}
)
