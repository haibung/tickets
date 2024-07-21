package models

import (
	"gorm.io/gorm"
	"time"
)

type User struct {
	ID        int
	RoleID    int
	FullName  string
	Email     string
	Password  string
	Image     string
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt

	//Relation
	FetchAllPermissionByRoleID []Permission `gorm:"<-:false;foreignKey:RoleID;references:RoleID;"`
}
