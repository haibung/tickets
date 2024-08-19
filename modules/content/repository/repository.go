package repository

import (
	"context"
	"gitlab.com/tiketfest/backend/models"
	"gitlab.com/tiketfest/backend/packages/logger"
	"gitlab.com/tiketfest/backend/packages/paginate"
	"gitlab.com/tiketfest/backend/packages/postgres"
	"go.uber.org/fx"
	"gorm.io/gorm"
	"strings"
)

type (
	IContentInterface interface {
		FindByID(ctx context.Context, reqData *models.Content) (*models.Content, error)
		FindAll(ctx context.Context, reqData *models.Content, pagination paginate.Pagination) ([]*models.Content, *paginate.Pagination, error)
		Create(ctx context.Context, reqData *models.Content, tx *gorm.DB) (*int, error)
		FindAllBySlugWithTx(ctx context.Context, reqData *models.Content, tx *gorm.DB) ([]*models.Content, error)
	}

	ContentRepository struct {
		fx.In
		DB     *postgres.DB
		Logger *logger.Logger
	}
)

// NewRepository :
func NewRepository(contentRepository ContentRepository) IContentInterface {
	return &contentRepository
}

// Create :
func (receiver *ContentRepository) Create(ctx context.Context, reqData *models.Content, tx *gorm.DB) (*int, error) {
	if err := tx.WithContext(ctx).Create(&reqData).Error; err != nil {
		receiver.Logger.Error(err)
		return nil, err
	}

	return &reqData.ID, nil
}

// FindByID :
func (receiver *ContentRepository) FindByID(ctx context.Context, reqData *models.Content) (*models.Content, error) {
	content := new(models.Content)

	if err := receiver.DB.Gorm.WithContext(ctx).
		Where(&models.Content{
			ID: reqData.ID,
		}).
		First(&content).Error; err != nil {
		receiver.Logger.Error(err)
		return nil, err
	}

	return content, nil
}

// FindAllBySlugWithTx :
func (receiver *ContentRepository) FindAllBySlugWithTx(ctx context.Context, reqData *models.Content, tx *gorm.DB) ([]*models.Content, error) {
	contents := make([]*models.Content, 0)

	if err := tx.WithContext(ctx).
		Where("slug like ?", "%"+strings.ToLower(reqData.Slug)+"%").
		Find(&contents).Error; err != nil {
		receiver.Logger.Error(err)
		return nil, err
	}

	return contents, nil
}

// FindAll :
func (receiver *ContentRepository) FindAll(ctx context.Context, reqData *models.Content, pagination paginate.Pagination) ([]*models.Content, *paginate.Pagination, error) {
	contents := make([]*models.Content, 0)

	queryBuilder := receiver.DB.Gorm.WithContext(ctx)

	if err := queryBuilder.Scopes(paginate.Paginate(reqData, &pagination, queryBuilder)).
		Find(&contents).Error; err != nil {
		receiver.Logger.Error(err)
		return nil, nil, err
	}

	return contents, &pagination, nil
}
