package models

import (
	"gorm.io/gorm"
	"time"
)

type Role struct {
	ID        int
	Name      string
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt
}
