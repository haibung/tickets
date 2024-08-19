package repository

import (
	"context"
	"gitlab.com/tiketfest/backend/models"
	"gitlab.com/tiketfest/backend/packages/logger"
	"gitlab.com/tiketfest/backend/packages/paginate"
	"gitlab.com/tiketfest/backend/packages/postgres"
	"go.uber.org/fx"
)

type (
	IFeatureInterface interface {
		FindByID(ctx context.Context, reqData *models.Feature) (*models.Feature, error)
		FindAll(ctx context.Context, reqData *models.Feature, pagination paginate.Pagination) ([]*models.Feature, *paginate.Pagination, error)
	}

	FeatureRepository struct {
		fx.In
		DB     *postgres.DB
		Logger *logger.Logger
	}
)

// NewRepository :
func NewRepository(featureRepository FeatureRepository) IFeatureInterface {
	return &featureRepository
}

// FindByID :
func (receiver *FeatureRepository) FindByID(ctx context.Context, reqData *models.Feature) (*models.Feature, error) {
	feature := new(models.Feature)

	if err := receiver.DB.Gorm.WithContext(ctx).
		Where(&models.Feature{
			ID: reqData.ID,
		}).
		First(&feature).Error; err != nil {
		receiver.Logger.Error(err)
		return nil, err
	}

	return feature, nil
}

// FindAll :
func (receiver *FeatureRepository) FindAll(ctx context.Context, reqData *models.Feature, pagination paginate.Pagination) ([]*models.Feature, *paginate.Pagination, error) {
	features := make([]*models.Feature, 0)

	queryBuilder := receiver.DB.Gorm.WithContext(ctx)

	if err := queryBuilder.Scopes(paginate.Paginate(reqData, &pagination, queryBuilder)).
		Find(&features).Error; err != nil {
		receiver.Logger.Error(err)
		return nil, nil, err
	}

	return features, &pagination, nil
}
