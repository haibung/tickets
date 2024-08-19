package controller

import (
	"context"
	"errors"
	"fmt"
	"gitlab.com/tiketfest/backend/models"
	categoryDto "gitlab.com/tiketfest/backend/modules/category"
	categoryController "gitlab.com/tiketfest/backend/modules/category/controller"
	"gitlab.com/tiketfest/backend/modules/content"
	"gitlab.com/tiketfest/backend/modules/content/repository"
	"gitlab.com/tiketfest/backend/packages/logger"
	"gitlab.com/tiketfest/backend/packages/paginate"
	"gitlab.com/tiketfest/backend/utilities"
	"go.uber.org/fx"
	"gorm.io/gorm"
	"net/http"
)

type (
	IContentController interface {
		FindByID(ctx context.Context, reqData *content.FindByIDRequest) (*content.FindByIDResponse, error)
		FindAll(ctx context.Context, reqData *content.FindAllRequest) ([]*content.FindByAllResponse, *paginate.Pagination, error)
		Create(ctx context.Context, reqData *content.CreateRequest, tx *gorm.DB) (*int, error)
	}

	ContentController struct {
		fx.In
		CategoryController categoryController.ICategoryController
		ContentRepository  repository.ContentRepository
		Logger             *logger.Logger
	}
)

// NewController :
func NewController(contentController ContentController) IContentController {
	return &contentController
}

// Create :

func (receiver *ContentController) Create(ctx context.Context, reqData *content.CreateRequest, tx *gorm.DB) (*int, error) {
	// Validate request data
	messages, err := reqData.Validate()
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusBadRequest, messages)
	}

	if reqData.CategoryID != nil {
		if _, err := receiver.CategoryController.FindByID(ctx, &categoryDto.FindByIDRequest{
			ID: *reqData.CategoryID,
		}); err != nil {
			receiver.Logger.Error(err)
			return nil, err
		}
	}

	slug, err := receiver.GenerateSlug(ctx, reqData.Title, tx)
	if err != nil {
		receiver.Logger.Error(err)
		return nil, err
	}

	// Create new Content
	insertedID, err := receiver.ContentRepository.Create(ctx, &models.Content{
		Title:       reqData.Title,
		Description: reqData.Description,
		Images:      reqData.Images,
		Link:        reqData.Link,
		Type:        reqData.Type,
		Slug:        *slug,
		Tags:        reqData.Tags,
		IsPublish:   reqData.IsPublish,
		CategoryID:  reqData.CategoryID,
		AuthorID:    reqData.ContextUserID,
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
func (receiver *ContentController) FindByID(ctx context.Context, reqData *content.FindByIDRequest) (*content.FindByIDResponse, error) {
	// Validate request data
	messages, err := reqData.Validate()
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusBadRequest, messages)
	}

	fetchContent, err := receiver.ContentRepository.FindByID(ctx, &models.Content{
		ID: reqData.ID,
	})
	if err != nil {
		receiver.Logger.Error(err)
		if err == gorm.ErrRecordNotFound {
			return nil, utilities.ErrorRequest(
				fmt.Errorf(utilities.DataNotFound, "Content"),
				http.StatusNotFound,
			)
		}
		return nil, utilities.ErrorRequest(
			errors.New(utilities.InternalServiceError),
			http.StatusInternalServerError,
		)
	}

	return &content.FindByIDResponse{
		ID:        fetchContent.ID,
		CreatedAt: fetchContent.CreatedAt,
	}, nil
}

// FindAll :
func (receiver *ContentController) FindAll(ctx context.Context, reqData *content.FindAllRequest) ([]*content.FindByAllResponse, *paginate.Pagination, error) {
	// Validate request data
	messages, err := reqData.Validate()
	if err != nil {
		receiver.Logger.Error(err)
		return nil, nil, utilities.ErrorRequest(err, http.StatusBadRequest, messages)
	}

	fetchAllContent, paging, err := receiver.ContentRepository.FindAll(ctx, &models.Content{}, paginate.Pagination{
		Limit: reqData.Limit,
		Page:  reqData.Page,
	})
	if err != nil {
		receiver.Logger.Error(err)
		if err == gorm.ErrRecordNotFound {
			return nil, nil, utilities.ErrorRequest(
				fmt.Errorf(utilities.DataNotFound, "Content"),
				http.StatusNotFound,
			)
		}
		return nil, nil, utilities.ErrorRequest(
			errors.New(utilities.InternalServiceError),
			http.StatusInternalServerError,
		)
	}

	response := []*content.FindByAllResponse{}

	for _, v := range fetchAllContent {
		response = append(response, &content.FindByAllResponse{
			ID:        v.ID,
			CreatedAt: v.CreatedAt,
		})
	}

	return response, paging, nil
}

// GenerateSlug :
func (receiver ContentController) GenerateSlug(ctx context.Context, slug string, tx *gorm.DB) (*string, error) {

	fetchAllContentWithSlug, err := receiver.ContentRepository.FindAllBySlugWithTx(ctx, &models.Content{
		Slug: utilities.Slug(slug),
	}, tx)
	if err != nil && err != gorm.ErrEmptySlice {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(
			errors.New(utilities.InternalServiceError),
			http.StatusInternalServerError,
		)
	}

	if len(fetchAllContentWithSlug) == 0 && err != gorm.ErrEmptySlice {
		slug = utilities.Slug(slug)
	} else {
		slug = fmt.Sprintf("%s-%v", slug, len(fetchAllContentWithSlug))
		slug = utilities.Slug(slug)
	}

	return &slug, nil
}
