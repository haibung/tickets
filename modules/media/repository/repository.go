package repository

import (
	"context"
	"gitlab.com/tiketfest/backend/models"
	"gitlab.com/tiketfest/backend/packages/logger"
	"gitlab.com/tiketfest/backend/packages/paginate"
	"gitlab.com/tiketfest/backend/packages/postgres"
	"go.uber.org/fx"
	"gorm.io/gorm"
)

type (
	IMediaInterface interface {
		FindByID(ctx context.Context, reqData *models.Media) (*models.Media, error)
		FindAll(ctx context.Context, reqData *models.Media, pagination paginate.Pagination) ([]*models.Media, *paginate.Pagination, error)
		Create(ctx context.Context, reqData *models.Media, tx *gorm.DB) (*int, error)
	}

	MediaRepository struct {
		fx.In
		DB     *postgres.DB
		Logger *logger.Logger
	}
)

// NewRepository :
func NewRepository(mediaRepository MediaRepository) IMediaInterface {
	return &mediaRepository
}

// Create :
func (receiver *MediaRepository) Create(ctx context.Context, reqData *models.Media, tx *gorm.DB) (*int, error) {
	if err := tx.WithContext(ctx).Create(&reqData).Error; err != nil {
		receiver.Logger.Error(err)
		return nil, err
	}

	return &reqData.ID, nil
}

// FindByID :
func (receiver *MediaRepository) FindByID(ctx context.Context, reqData *models.Media) (*models.Media, error) {
	media := new(models.Media)

	if err := receiver.DB.Gorm.WithContext(ctx).
		Where(&models.Media{
			ID: reqData.ID,
		}).
		First(&media).Error; err != nil {
		receiver.Logger.Error(err)
		return nil, err
	}

	return media, nil
}

// FindAll :
func (receiver *MediaRepository) FindAll(ctx context.Context, reqData *models.Media, pagination paginate.Pagination) ([]*models.Media, *paginate.Pagination, error) {
	medias := make([]*models.Media, 0)

	queryBuilder := receiver.DB.Gorm.WithContext(ctx)

	if err := queryBuilder.Scopes(paginate.Paginate(reqData, &pagination, queryBuilder)).
		Find(&medias).Error; err != nil {
		receiver.Logger.Error(err)
		return nil, nil, err
	}

	return medias, &pagination, nil
}
