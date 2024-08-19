package utilities

import (
	"github.com/labstack/echo/v4"
	"gitlab.com/tiketfest/backend/packages/paginate"
)

type (
	ResponseRequest struct {
		Data       interface{}          `json:"data,omitempty"`
		StatusCode int                  `json:"status_code,omitempty"`
		Message    string               `json:"message,omitempty"`
		Paginate   *paginate.Pagination `json:"paginate,omitempty"`
	}

	ResultResponse interface{}
)

// Response :
func Response(c echo.Context, r *ResponseRequest) error {
	return c.JSON(r.StatusCode, r)
}
