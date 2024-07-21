package utilities

import (
	"Users/evilkidz/Project/Golang/CMS/backend/packages/paginate"
	"github.com/labstack/echo/v4"
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
