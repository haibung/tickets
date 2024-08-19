package controller

import (
	"context"
	"errors"
	"fmt"
	"gitlab.com/tiketfest/backend/models"
	"gitlab.com/tiketfest/backend/modules/category"
	"gitlab.com/tiketfest/backend/modules/category/repository"
	"gitlab.com/tiketfest/backend/packages/logger"
	"gitlab.com/tiketfest/backend/packages/paginate"
	"gitlab.com/tiketfest/backend/utilities"
	"go.uber.org/fx"
	"gorm.io/gorm"
	"net/http"
)

type (
	ICategoryController interface {
		FindByID(ctx context.Context, reqData *category.FindByIDRequest) (*category.FindByIDResponse, error)
		FindAll(ctx context.Context, reqData *category.FindAllRequest) ([]*category.FindByAllResponse, *paginate.Pagination, error)
		Create(ctx context.Context, reqData *category.CreateRequest, tx *gorm.DB) (*int, error)
	}

	CategoryController struct {
		fx.In
		CategoryRepository repository.CategoryRepository
		Logger             *logger.Logger
	}
)

// NewController :
func NewController(categoryController CategoryController) ICategoryController {
	return &categoryController
}

// Create :
func (receiver *CategoryController) Create(ctx context.Context, reqData *category.CreateRequest, tx *gorm.DB) (*int, error) {
	// Validate request data
	messages, err := reqData.Validate()
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusBadRequest, messages)
	}

	if reqData.ParentID != nil {
		_, err := receiver.CategoryRepository.FindByID(ctx, &models.Category{
			ID: *reqData.ParentID,
		})
		if err != nil {
			receiver.Logger.Error(err)
			if err == gorm.ErrRecordNotFound {
				return nil, utilities.ErrorRequest(
					fmt.Errorf(utilities.DataNotFound, "category"),
					http.StatusNotFound,
				)
			}
			return nil, utilities.ErrorRequest(
				errors.New(utilities.InternalServiceError),
				http.StatusInternalServerError,
			)
		}
	}

	// Create new category
	insertedID, err := receiver.CategoryRepository.Create(ctx, &models.Category{
		Name:     reqData.Name,
		ParentID: reqData.ParentID,
		Sort:     reqData.Sort,
	}, tx)
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(
			errors.New(utilities.InternalServiceError),
			http.StatusInternalServerError,
		)
	}

	return insertedID, nil
}

// FindByID :
func (receiver *CategoryController) FindByID(ctx context.Context, reqData *category.FindByIDRequest) (*category.FindByIDResponse, error) {
	// Validate request data
	messages, err := reqData.Validate()
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusBadRequest, messages)
	}

	fetchCategory, err := receiver.CategoryRepository.FindByID(ctx, &models.Category{
		ID: reqData.ID,
	})
	if err != nil {
		receiver.Logger.Error(err)
		if err == gorm.ErrRecordNotFound {
			return nil, utilities.ErrorRequest(
				fmt.Errorf(utilities.DataNotFound, "category"),
				http.StatusNotFound,
			)
		}
		return nil, utilities.ErrorRequest(
			errors.New(utilities.InternalServiceError),
			http.StatusInternalServerError,
		)
	}

	return &category.FindByIDResponse{
		ID:        fetchCategory.ID,
		Name:      fetchCategory.Name,
		Sort:      fetchCategory.Sort,
		CreatedAt: fetchCategory.CreatedAt,
	}, nil
}

// FindAll :
func (receiver *CategoryController) FindAll(ctx context.Context, reqData *category.FindAllRequest) ([]*category.FindByAllResponse, *paginate.Pagination, error) {
	// Validate request data
	messages, err := reqData.Validate()
	if err != nil {
		receiver.Logger.Error(err)
		return nil, nil, utilities.ErrorRequest(err, http.StatusBadRequest, messages)
	}

	fetchAllCategory, paging, err := receiver.CategoryRepository.FindAll(ctx, &models.Category{}, paginate.Pagination{
		Limit: reqData.Limit,
		Page:  reqData.Page,
	})
	if err != nil {
		receiver.Logger.Error(err)
		if err == gorm.ErrRecordNotFound {
			return nil, nil, utilities.ErrorRequest(
				fmt.Errorf(utilities.DataNotFound, "Category"),
				http.StatusNotFound,
			)
		}
		return nil, nil, utilities.ErrorRequest(
			errors.New(utilities.InternalServiceError),
			http.StatusInternalServerError,
		)
	}

	response := []*category.FindByAllResponse{}

	for _, v := range fetchAllCategory {
		response = append(response, &category.FindByAllResponse{
			ID:        v.ID,
			Name:      v.Name,
			Sort:      v.Sort,
			CreatedAt: v.CreatedAt,
		})
	}

	return response, paging, nil
}
