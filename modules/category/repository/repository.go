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
	ICategoryInterface interface {
		FindByID(ctx context.Context, reqData *models.Category) (*models.Category, error)
		FindAll(ctx context.Context, reqData *models.Category, pagination paginate.Pagination) ([]*models.Category, *paginate.Pagination, error)
		Create(ctx context.Context, reqData *models.Category, tx *gorm.DB) (*int, error)
	}

	CategoryRepository struct {
		fx.In
		DB     *postgres.DB
		Logger *logger.Logger
	}
)

// NewRepository :
func NewRepository(categoryRepository CategoryRepository) ICategoryInterface {
	return &categoryRepository
}

// Create :
func (receiver *CategoryRepository) Create(ctx context.Context, reqData *models.Category, tx *gorm.DB) (*int, error) {
	if err := tx.WithContext(ctx).Create(&reqData).Error; err != nil {
		receiver.Logger.Error(err)
		return nil, err
	}

	return &reqData.ID, nil
}

// FindByID :
func (receiver *CategoryRepository) FindByID(ctx context.Context, reqData *models.Category) (*models.Category, error) {
	category := new(models.Category)

	if err := receiver.DB.Gorm.WithContext(ctx).
		Where(&models.Category{
			ID: reqData.ID,
		}).
		First(&category).Error; err != nil {
		receiver.Logger.Error(err)
		return nil, err
	}

	return category, nil
}

// FindAll :
func (receiver *CategoryRepository) FindAll(ctx context.Context, reqData *models.Category, pagination paginate.Pagination) ([]*models.Category, *paginate.Pagination, error) {
	categories := make([]*models.Category, 0)

	queryBuilder := receiver.DB.Gorm.WithContext(ctx)

	if err := queryBuilder.Scopes(paginate.Paginate(reqData, &pagination, queryBuilder)).
		Find(&categories).Error; err != nil {
		receiver.Logger.Error(err)
		return nil, nil, err
	}

	return categories, &pagination, nil
}
