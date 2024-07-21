package permission

import (
	"Users/evilkidz/Project/Golang/CMS/backend/models"
	"Users/evilkidz/Project/Golang/CMS/backend/packages/validation"
	"Users/evilkidz/Project/Golang/CMS/backend/utilities"
	"errors"
	"fmt"
)

type (
	CreateRequest struct {
		ContextUserID int

		Permissions []CreatePermissionItem

		Validation validation.Validation
	}

	CreatePermissionItem struct {
		FeatureID int
		RoleID    int
		IsActive  bool
		KeyAction models.KeyAction
	}
)

func (receiver CreateRequest) Validate() ([]map[string]interface{}, error) {

	if len(receiver.Permissions) == 0 {
		return nil, fmt.Errorf(utilities.EmptyValue, "permission")
	}

	for _, v := range receiver.Permissions {
		if err := v.KeyAction.IsValid(); err != nil {
			return nil, err
		}

		receiver.Validation.IsIntegerMin(v.RoleID, 1, "Role")
		receiver.Validation.IsIntegerMin(v.FeatureID, 1, "Feature")
	}

	if len(receiver.Validation.Messages) > 0 {
		return receiver.Validation.Messages, errors.New(utilities.BadRequest)
	}

	return nil, nil
}
