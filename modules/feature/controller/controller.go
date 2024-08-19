package controller

import (
	"context"
	"errors"
	"fmt"
	"gitlab.com/tiketfest/backend/models"
	"gitlab.com/tiketfest/backend/modules/feature"
	"gitlab.com/tiketfest/backend/modules/feature/repository"
	"gitlab.com/tiketfest/backend/packages/logger"
	"gitlab.com/tiketfest/backend/packages/paginate"
	"gitlab.com/tiketfest/backend/utilities"
	"go.uber.org/fx"
	"gorm.io/gorm"
	"net/http"
)

type (
	IFeatureController interface {
		FindByID(ctx context.Context, reqData *feature.FindByIDRequest) (*feature.FindByIDResponse, error)
		FindAll(ctx context.Context, reqData *feature.FindAllRequest) ([]*feature.FindByAllResponse, *paginate.Pagination, error)
	}

	FeatureController struct {
		fx.In
		FeatureRepository repository.FeatureRepository
		Logger            *logger.Logger
	}
)

// NewController :
func NewController(featureController FeatureController) IFeatureController {
	return &featureController
}

// FindByID :
func (receiver *FeatureController) FindByID(ctx context.Context, reqData *feature.FindByIDRequest) (*feature.FindByIDResponse, error) {
	// Validate request data
	messages, err := reqData.Validate()
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusBadRequest, messages)
	}

	fetchFeature, err := receiver.FeatureRepository.FindByID(ctx, &models.Feature{
		ID: reqData.ID,
	})
	if err != nil {
		receiver.Logger.Error(err)
		if err == gorm.ErrRecordNotFound {
			return nil, utilities.ErrorRequest(
				fmt.Errorf(utilities.DataNotFound, "feature"),
				http.StatusNotFound,
			)
		}
		return nil, utilities.ErrorRequest(
			errors.New(utilities.InternalServiceError),
			http.StatusInternalServerError,
		)
	}

	return &feature.FindByIDResponse{
		ID:        fetchFeature.ID,
		Name:      fetchFeature.Name,
		Code:      fetchFeature.Code,
		CreatedAt: fetchFeature.CreatedAt,
	}, nil
}

// FindAll :
func (receiver *FeatureController) FindAll(ctx context.Context, reqData *feature.FindAllRequest) ([]*feature.FindByAllResponse, *paginate.Pagination, error) {
	// Validate request data
	messages, err := reqData.Validate()
	if err != nil {
		receiver.Logger.Error(err)
		return nil, nil, utilities.ErrorRequest(err, http.StatusBadRequest, messages)
	}

	fetchAllFeature, paging, err := receiver.FeatureRepository.FindAll(ctx, &models.Feature{}, paginate.Pagination{
		Limit: reqData.Limit,
		Page:  reqData.Page,
	})
	if err != nil {
		receiver.Logger.Error(err)
		if err == gorm.ErrRecordNotFound {
			return nil, nil, utilities.ErrorRequest(
				fmt.Errorf(utilities.DataNotFound, "feature"),
				http.StatusNotFound,
			)
		}
		return nil, nil, utilities.ErrorRequest(
			errors.New(utilities.InternalServiceError),
			http.StatusInternalServerError,
		)
	}

	response := []*feature.FindByAllResponse{}

	for _, v := range fetchAllFeature {
		response = append(response, &feature.FindByAllResponse{
			ID:        v.ID,
			Name:      v.Name,
			Code:      v.Code,
			CreatedAt: v.CreatedAt,
		})
	}

	return response, paging, nil
}
