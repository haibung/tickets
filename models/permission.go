package models

import (
	"fmt"
	"gitlab.com/tiketfest/backend/utilities"
	"time"
)

type (
	KeyAction string

	Permission struct {
		ID        int
		RoleID    int
		FeatureID int
		IsActive  bool
		KeyAction KeyAction
		CreatedAt time.Time
		UpdatedAt time.Time

		//Relation
		FetchFeatureByFeatureID Feature `gorm:"<-:false;foreignKey:FeatureID;references:ID;"`
	}
)

const (
	KeyActionRead   KeyAction = "READ"
	KeyActionCreate KeyAction = "CREATE"
	KeyActionUpdate KeyAction = "UPDATE"
	KeyActionDelete KeyAction = "DELETE"
)

func (receiver KeyAction) IsValid() error {
	switch receiver {
	case KeyActionRead, KeyActionCreate, KeyActionUpdate, KeyActionDelete:
		return nil
	}

	return fmt.Errorf(utilities.DataNotFound, "key action")
}
