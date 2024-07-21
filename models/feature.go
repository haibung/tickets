package models

import (
	"Users/evilkidz/Project/Golang/CMS/backend/utilities"
	"fmt"
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
	FeatureUser       FeatureCode = "USER"
	FeatureContent    FeatureCode = "CONTENT"
	FeaturePermission FeatureCode = "PERMISSION"
	FeatureRole       FeatureCode = "ROLE"
	FeatureFeature    FeatureCode = "FEATURE"
	FeatureCategory   FeatureCode = "CATEGORY"
	FeatureMedia      FeatureCode = "MEDIA"
)

func (receiver FeatureCode) IsValid() error {
	switch receiver {
	case FeatureUser, FeatureContent, FeaturePermission, FeatureRole, FeatureMedia, FeatureCategory, FeatureFeature:
		return nil
	}

	return fmt.Errorf(utilities.DataNotFound, "feature")
}
