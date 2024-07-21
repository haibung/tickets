package route

import (
	"Users/evilkidz/Project/Golang/CMS/backend/modules/auth"
	"Users/evilkidz/Project/Golang/CMS/backend/modules/auth/controller"
	"Users/evilkidz/Project/Golang/CMS/backend/packages/logger"
	"Users/evilkidz/Project/Golang/CMS/backend/packages/postgres"
	"Users/evilkidz/Project/Golang/CMS/backend/routers"
	"Users/evilkidz/Project/Golang/CMS/backend/utilities"
	"github.com/labstack/echo/v4"
	"go.uber.org/fx"
	"net/http"
)

type Handler struct {
	fx.In
	Controller controller.IAuthController
	Logger     *logger.Logger
	DB         *postgres.DB
	Router     *routers.Router
}

func NewRoute(h Handler, m ...echo.MiddlewareFunc) Handler {
	h.Route(m...)
	return h
}

func (receiver *Handler) Route(m ...echo.MiddlewareFunc) {
	echoRoute := receiver.Router.Group("/v1/auth", m...)
	echoRoute.POST("/login", receiver.Login)
}

// Login :
func (receiver *Handler) Login(c echo.Context) error {
	var reqData = new(auth.LoginRequest)

	if err := c.Bind(reqData); err != nil {
		receiver.Logger.Error(err)
		return utilities.Response(c, &utilities.ResponseRequest{
			StatusCode: http.StatusBadRequest,
			Message:    utilities.BadRequest,
		})
	}

	tx := receiver.DB.Gorm.Begin()
	resp, err := receiver.Controller.Login(c.Request().Context(), reqData)
	if err != nil {
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
		StatusCode: http.StatusOK,
		Message:    utilities.Success,
		Data:       resp,
	})
}
