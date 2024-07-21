package routers

import (
	"Users/evilkidz/Project/Golang/CMS/backend/config"
	"Users/evilkidz/Project/Golang/CMS/backend/models"
	"Users/evilkidz/Project/Golang/CMS/backend/packages/jwt"
	"Users/evilkidz/Project/Golang/CMS/backend/packages/permission"
	"Users/evilkidz/Project/Golang/CMS/backend/utilities"
	"context"
	"github.com/labstack/echo/v4"
	"net/http"
	"strings"
)

func (receiver *Router) Authentication(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		authorizationHeader := c.Request().Header.Get("Authorization")
		authorization := strings.Split(authorizationHeader, " ")
		if len(authorization) > 1 {
			result, err := jwt.ParseClaim(authorization[1], config.Get().Auth.Secret)
			if err != nil {
				receiver.Logger.Error(err.Error())
				return utilities.Response(c, &utilities.ResponseRequest{
					StatusCode: http.StatusUnauthorized,
					Message:    utilities.Authorization,
				})
			}

			var (
				ctx              = c.Request().Context()
				accessPermission []permission.Permission
			)

			// Check exist user
			fetchUser, err := receiver.userRepository.FindByID(ctx, &models.User{
				ID: result.Data.UserID,
			})
			if err != nil {
				receiver.logger.Error(err.Error())
				return utilities.Response(c, &utilities.ResponseRequest{
					StatusCode: http.StatusUnauthorized,
					Message:    utilities.Authorization,
				})
			}

			// Fetch permissions
			for _, v := range fetchUser.FetchAllPermissionByRoleID {
				accessPermission = append(accessPermission, permission.Permission{
					KeyAction:   v.KeyAction,
					IsActive:    v.IsActive,
					FeatureCode: v.FetchFeatureByFeatureID.Code,
				})
			}

			permissionByte, err := permission.Bytes(accessPermission)
			if err != nil {
				receiver.Logger.Error(err.Error())
				return utilities.ErrorRequest(err, http.StatusInternalServerError)
			}

			ctx = context.WithValue(ctx, jwt.InternalClaimData{}, jwt.InternalClaimData{
				UserID:      fetchUser.ID,
				Permissions: string(permissionByte),
			})

			c.SetRequest(c.Request().WithContext(ctx))
		} else {
			return utilities.Response(c, &utilities.ResponseRequest{
				StatusCode: http.StatusUnauthorized,
				Message:    utilities.Authorization,
			})
		}
		return next(c)
	}
}
