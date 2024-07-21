package route

import (
	"Users/evilkidz/Project/Golang/CMS/backend/models"
	"Users/evilkidz/Project/Golang/CMS/backend/modules/permission"
	"Users/evilkidz/Project/Golang/CMS/backend/modules/permission/controller"
	"Users/evilkidz/Project/Golang/CMS/backend/packages/jwt"
	"Users/evilkidz/Project/Golang/CMS/backend/packages/logger"
	_permission "Users/evilkidz/Project/Golang/CMS/backend/packages/permission"
	"Users/evilkidz/Project/Golang/CMS/backend/packages/postgres"
	"Users/evilkidz/Project/Golang/CMS/backend/routers"
	"Users/evilkidz/Project/Golang/CMS/backend/utilities"
	"github.com/labstack/echo/v4"
	"go.uber.org/fx"
	"net/http"
)

type Handler struct {
	fx.In
	Controller controller.IPermissionController
	Logger     *logger.Logger
	DB         *postgres.DB
	Router     *routers.Router
}

func NewRoute(h Handler, m ...echo.MiddlewareFunc) Handler {
	h.Route(m...)
	return h
}

func (receiver *Handler) Route(m ...echo.MiddlewareFunc) {
	echoRoute := receiver.Router.Group("/v1/permission", m...)
	echoRoute.Use(receiver.Router.Authentication)
	echoRoute.POST("", receiver.Create)
}

// Create :
func (receiver *Handler) Create(c echo.Context) error {
	var reqData = new(permission.CreateRequest)

	data, ok := c.Request().Context().Value(jwt.InternalClaimData{}).(jwt.InternalClaimData)
	if !ok {
		return utilities.Response(c, &utilities.ResponseRequest{
			StatusCode: http.StatusUnauthorized,
			Message:    utilities.Authorization,
		})
	}

	if err := _permission.Create(data.Permissions, models.FeaturePermission); err != nil {
		receiver.Logger.Error(err)
		return utilities.Response(c, &utilities.ResponseRequest{
			StatusCode: http.StatusForbidden,
			Message:    utilities.Forbidden,
		})
	}

	reqData.ContextUserID = data.UserID

	if err := c.Bind(reqData); err != nil {
		receiver.Logger.Error(err)
		return utilities.Response(c, &utilities.ResponseRequest{
			StatusCode: http.StatusBadRequest,
			Message:    utilities.BadRequest,
		})
	}

	tx := receiver.DB.Gorm.Begin()

	if err := receiver.Controller.Create(c.Request().Context(), reqData, tx); err != nil {
		receiver.Logger.Error(err)
		defer func() {
			tx.Rollback()
		}()

		return utilities.Response(c, &utilities.ResponseRequest{
			StatusCode: utilities.ParseError(err).StatusCode,
			Data:       utilities.ParseError(err).Data,
			Message:    err.Error(),
		})
	}
	tx.Commit()

	return utilities.Response(c, &utilities.ResponseRequest{
		StatusCode: http.StatusCreated,
		Message:    utilities.Success,
	})
}
