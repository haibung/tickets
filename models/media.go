package models

import (
	"gorm.io/gorm"
	"time"
)

type Media struct {
	ID          int
	URL         string
	Key         string
	Description string
	AuthorID    int
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   gorm.DeletedAt
}
