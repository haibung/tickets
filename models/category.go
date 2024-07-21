package models

import (
	"gorm.io/gorm"
	"time"
)

type (
	Category struct {
		ID        int
		Name      string
		ParentID  *int
		Sort      int
		CreatedAt time.Time
		UpdatedAt time.Time
		DeletedAt gorm.DeletedAt
	}
)
