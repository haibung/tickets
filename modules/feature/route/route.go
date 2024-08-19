package route

import (
	"github.com/labstack/echo/v4"
	"gitlab.com/tiketfest/backend/models"
	"gitlab.com/tiketfest/backend/modules/feature"
	"gitlab.com/tiketfest/backend/modules/feature/controller"
	"gitlab.com/tiketfest/backend/packages/jwt"
	"gitlab.com/tiketfest/backend/packages/logger"
	_permission "gitlab.com/tiketfest/backend/packages/permission"
	"gitlab.com/tiketfest/backend/packages/postgres"
	"gitlab.com/tiketfest/backend/routers"
	"gitlab.com/tiketfest/backend/utilities"
	"go.uber.org/fx"
	"net/http"
)

type Handler struct {
	fx.In
	Controller controller.IFeatureController
	Logger     *logger.Logger
	DB         *postgres.DB
	Router     *routers.Router
}

func NewRoute(h Handler, m ...echo.MiddlewareFunc) Handler {
	h.Route(m...)
	return h
}

func (receiver *Handler) Route(m ...echo.MiddlewareFunc) {
	echoRoute := receiver.Router.Group("/v1/feature", m...)
	echoRoute.Use(receiver.Router.Authentication)
	echoRoute.GET("", receiver.FindAll)
}

// FindAll :
func (receiver *Handler) FindAll(c echo.Context) error {
	var reqData = new(feature.FindAllRequest)

	data, ok := c.Request().Context().Value(jwt.InternalClaimData{}).(jwt.InternalClaimData)
	if !ok {
		return utilities.Response(c, &utilities.ResponseRequest{
			StatusCode: http.StatusUnauthorized,
			Message:    utilities.Authorization,
		})
	}

	if err := _permission.Read(data.Permissions, models.FeatureFeature); err != nil {
		receiver.Logger.Error(err)
		return utilities.Response(c, &utilities.ResponseRequest{
			StatusCode: http.StatusForbidden,
			Message:    utilities.Forbidden,
		})
	}

	reqData.ContextUserID = data.UserID

	if err := echo.QueryParamsBinder(c).
		Int("limit", &reqData.Limit).
		Int("page", &reqData.Page).
		BindError(); err != nil {
		receiver.Logger.Error(err)
		return utilities.Response(c, &utilities.ResponseRequest{
			StatusCode: http.StatusBadRequest,
			Message:    utilities.BadRequest,
		})
	}

	resp, paging, err := receiver.Controller.FindAll(c.Request().Context(), reqData)
	if err != nil {
		receiver.Logger.Error(err)
		return utilities.Response(c, &utilities.ResponseRequest{
			StatusCode: utilities.ParseError(err).StatusCode,
			Data:       utilities.ParseError(err).Data,
			Message:    err.Error(),
		})
	}

	if paging != nil {
		paging.Next(c)
		paging.Prev(c)
	}

	return utilities.Response(c, &utilities.ResponseRequest{
		StatusCode: http.StatusOK,
		Message:    utilities.Success,
		Data:       resp,
		Paginate:   paging,
	})
}
