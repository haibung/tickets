package controller

import (
	"context"
	"errors"
	"fmt"
	"gitlab.com/tiketfest/backend/models"
	"gitlab.com/tiketfest/backend/modules/media"
	"gitlab.com/tiketfest/backend/modules/media/repository"
	"gitlab.com/tiketfest/backend/packages/logger"
	"gitlab.com/tiketfest/backend/packages/paginate"
	"gitlab.com/tiketfest/backend/utilities"
	"go.uber.org/fx"
	"gorm.io/gorm"
	"net/http"
)

type (
	IMediaController interface {
		FindByID(ctx context.Context, reqData *media.FindByIDRequest) (*media.FindByIDResponse, error)
		FindAll(ctx context.Context, reqData *media.FindAllRequest) ([]*media.FindByAllResponse, *paginate.Pagination, error)
		Create(ctx context.Context, reqData *media.CreateRequest, tx *gorm.DB) error
	}

	MediaController struct {
		fx.In
		MediaRepository repository.MediaRepository
		Logger          *logger.Logger
	}
)

// NewController :
func NewController(mediaController MediaController) IMediaController {
	return &mediaController
}

// Create :
func (receiver *MediaController) Create(ctx context.Context, reqData *media.CreateRequest, tx *gorm.DB) error {
	// Validate request data
	messages, err := reqData.Validate()
	if err != nil {
		receiver.Logger.Error(err)
		return utilities.ErrorRequest(err, http.StatusBadRequest, messages)
	}

	for _, file := range reqData.Files {
		fileName, err := utilities.Upload(file)
		if err != nil {
			receiver.Logger.Error(err)
			return err
		}

		// Create new Media
		if _, err := receiver.MediaRepository.Create(ctx, &models.Media{
			URL:      *fileName,
			Key:      *fileName,
			AuthorID: reqData.ContextUserID,
		}, tx); err != nil {
			receiver.Logger.Error(err)
			return utilities.ErrorRequest(
				errors.New(utilities.InternalServiceError),
				http.StatusInternalServerError,
			)
		}

	}

	return nil
}

// FindByID :
func (receiver *MediaController) FindByID(ctx context.Context, reqData *media.FindByIDRequest) (*media.FindByIDResponse, error) {
	// Validate request data
	messages, err := reqData.Validate()
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusBadRequest, messages)
	}

	fetchMedia, err := receiver.MediaRepository.FindByID(ctx, &models.Media{
		ID: reqData.ID,
	})
	if err != nil {
		receiver.Logger.Error(err)
		if err == gorm.ErrRecordNotFound {
			return nil, utilities.ErrorRequest(
				fmt.Errorf(utilities.DataNotFound, "Media"),
				http.StatusNotFound,
			)
		}
		return nil, utilities.ErrorRequest(
			errors.New(utilities.InternalServiceError),
			http.StatusInternalServerError,
		)
	}

	return &media.FindByIDResponse{
		ID:        fetchMedia.ID,
		CreatedAt: fetchMedia.CreatedAt,
	}, nil
}

// FindAll :
func (receiver *MediaController) FindAll(ctx context.Context, reqData *media.FindAllRequest) ([]*media.FindByAllResponse, *paginate.Pagination, error) {
	// Validate request data
	messages, err := reqData.Validate()
	if err != nil {
		receiver.Logger.Error(err)
		return nil, nil, utilities.ErrorRequest(err, http.StatusBadRequest, messages)
	}

	fetchAllMedia, paging, err := receiver.MediaRepository.FindAll(ctx, &models.Media{}, paginate.Pagination{
		Limit: reqData.Limit,
		Page:  reqData.Page,
	})
	if err != nil {
		receiver.Logger.Error(err)
		if err == gorm.ErrRecordNotFound {
			return nil, nil, utilities.ErrorRequest(
				fmt.Errorf(utilities.DataNotFound, "Media"),
				http.StatusNotFound,
			)
		}
		return nil, nil, utilities.ErrorRequest(
			errors.New(utilities.InternalServiceError),
			http.StatusInternalServerError,
		)
	}

	response := []*media.FindByAllResponse{}

	for _, v := range fetchAllMedia {
		response = append(response, &media.FindByAllResponse{
			ID:        v.ID,
			CreatedAt: v.CreatedAt,
		})
	}

	return response, paging, nil
}
