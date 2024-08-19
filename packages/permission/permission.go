package permission

import (
	"encoding/json"
	"errors"
	"fmt"
	"gitlab.com/tiketfest/backend/models"
	"gitlab.com/tiketfest/backend/utilities"
)

type Permission struct {
	KeyAction   models.KeyAction
	FeatureCode models.FeatureCode
	IsActive    bool
}

// Bytes :
func Bytes(accessPermission []Permission) ([]byte, error) {
	access := map[string][]*Permission{}

	for _, v := range accessPermission {
		featureCode := string(v.FeatureCode)

		accessSelected, ok := access[featureCode]
		if ok {
			accessSelected = append(accessSelected, &Permission{
				FeatureCode: v.FeatureCode,
				IsActive:    v.IsActive,
				KeyAction:   v.KeyAction,
			})
			access[featureCode] = accessSelected
		} else {
			var permissions []*Permission

			permissions = append(permissions, &Permission{
				FeatureCode: v.FeatureCode,
				IsActive:    v.IsActive,
				KeyAction:   v.KeyAction,
			})

			access[featureCode] = permissions
		}
	}

	byteAccess, err := json.Marshal(&access)
	if err != nil {
		return nil, err
	}

	return byteAccess, nil
}

// GetPermission :
func GetPermission(accessPermission string, selector models.FeatureCode) ([]*Permission, error) {
	access := map[string][]*Permission{}
	if err := json.Unmarshal([]byte(accessPermission), &access); err != nil {
		return nil, err
	}

	accessSelected, ok := access[string(selector)]
	if !ok {
		return nil, fmt.Errorf(utilities.DataNotFound, "feature")
	}

	return accessSelected, nil
}

// Read :
func Read(accessPermission string, selector models.FeatureCode) error {
	result, err := GetPermission(accessPermission, selector)
	if err != nil {
		return err
	}

	var isAllowed bool

	for _, v := range result {
		if v.KeyAction == models.KeyActionRead && v.IsActive {
			isAllowed = true
			break
		}
	}

	if !isAllowed {
		return errors.New(utilities.Forbidden)
	}

	return nil
}

// Create :
func Create(accessPermission string, selector models.FeatureCode) error {
	result, err := GetPermission(accessPermission, selector)
	if err != nil {
		return err
	}

	var isAllowed bool

	for _, v := range result {
		if v.KeyAction == models.KeyActionCreate && v.IsActive {
			isAllowed = true
			break
		}
	}

	if !isAllowed {
		return errors.New(utilities.Forbidden)
	}

	return nil
}

// Update :
func Update(accessPermission string, selector models.FeatureCode) error {
	result, err := GetPermission(accessPermission, selector)
	if err != nil {
		return err
	}

	var isAllowed bool

	for _, v := range result {
		if v.KeyAction == models.KeyActionUpdate && v.IsActive {
			isAllowed = true
			break
		}
	}

	if !isAllowed {
		return errors.New(utilities.Forbidden)
	}

	return nil
}

// Delete :
func Delete(accessPermission string, selector models.FeatureCode) error {
	result, err := GetPermission(accessPermission, selector)
	if err != nil {
		return err
	}

	var isAllowed bool

	for _, v := range result {
		if v.KeyAction == models.KeyActionDelete && v.IsActive {
			isAllowed = true
			break
		}
	}

	if !isAllowed {
		return errors.New(utilities.Forbidden)
	}

	return nil
}
