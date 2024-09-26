package route

import (
	"fmt"
	"github.com/labstack/echo/v4"
	"gitlab.com/tiketfest/backend/models"
	"gitlab.com/tiketfest/backend/modules/transaction"
	"gitlab.com/tiketfest/backend/modules/transaction/controller"
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
	Controller controller.ITransactionController
	Logger     *logger.Logger
	DB         *postgres.DB
	Router     *routers.Router
}

func NewRoute(h Handler, m ...echo.MiddlewareFunc) Handler {
	h.Route(m...)
	return h
}

func (receiver *Handler) Route(m ...echo.MiddlewareFunc) {
	echoRoute := receiver.Router.Group("/v1/transaction", m...)
	echoRoute.Use(receiver.Router.Authentication)
	echoRoute.POST("", receiver.Create)
	echoRoute.GET("/all", receiver.FindAll)
}

// Create :
func (receiver *Handler) Create(c echo.Context) error {
	var reqData = new(transaction.CreateRequest)
	data, ok := c.Request().Context().Value(jwt.InternalClaimData{}).(jwt.InternalClaimData)
	if !ok {
		return utilities.Response(c, &utilities.ResponseRequest{
			StatusCode: http.StatusUnauthorized,
			Message:    utilities.Authorization,
		})
	}

	if err := _permission.Create(data.Permissions, models.FeatureTransaction); err != nil {
		receiver.Logger.Error(err)
		return utilities.Response(c, &utilities.ResponseRequest{
			StatusCode: http.StatusForbidden,
			Message:    utilities.Forbidden,
		})
	}

	reqData.ContextUserID = &data.UserID

	if err := c.Bind(reqData); err != nil {
		receiver.Logger.Error(err)
		return utilities.Response(c, &utilities.ResponseRequest{
			StatusCode: http.StatusBadRequest,
			Message:    utilities.BadRequest,
		})
	}

	tx := receiver.DB.Gorm.Begin()
	resp, err := receiver.Controller.Create(c.Request().Context(), reqData, tx)
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
		StatusCode: http.StatusCreated,
		Message:    utilities.Success,
		Data:       resp,
	})
}

func (receiver *Handler) FindAll(c echo.Context) error {
	var reqData = new(transaction.FindAllRequest)
	data, ok := c.Request().Context().Value(jwt.InternalClaimData{}).(jwt.InternalClaimData)
	if !ok {
		return utilities.Response(c, &utilities.ResponseRequest{
			StatusCode: http.StatusUnauthorized,
			Message:    utilities.Authorization,
		})
	}
	fmt.Println("ini data", data)

	if err := _permission.Read(data.Permissions, models.FeatureTransaction); err != nil {
		receiver.Logger.Error("No permission for Transaction", err)
		return utilities.Response(c, &utilities.ResponseRequest{
			StatusCode: http.StatusForbidden,
			Message:    utilities.Forbidden,
		})
	}
	// Check permission to read the Transaction Item feature
	//if err := _permission.Read(data.Permissions, models.FeatureTransactionItem); err != nil {
	//	receiver.Logger.Error("No permission for Transaction Item", err)
	//	return utilities.Response(c, &utilities.ResponseRequest{
	//		StatusCode: http.StatusForbidden,
	//		Message:    utilities.Forbidden,
	//	})
	//}

	reqData.ContextUserID = data.UserID
	fmt.Println("ini data userid", data.UserID)

	resp, err := receiver.Controller.FindAll(c.Request().Context(), reqData)
	if err != nil {
		receiver.Logger.Error(err)
		return utilities.Response(c, &utilities.ResponseRequest{
			StatusCode: utilities.ParseError(err).StatusCode,
			Data:       utilities.ParseError(err).Data,
			Message:    err.Error(),
		})
	}

	return utilities.Response(c, &utilities.ResponseRequest{
		StatusCode: http.StatusOK,
		Message:    utilities.Success,
		Data:       resp,
	})
}
