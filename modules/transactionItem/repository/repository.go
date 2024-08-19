package repository

import (
	"context"
	"gitlab.com/tiketfest/backend/models"
	"gitlab.com/tiketfest/backend/packages/logger"
	"gitlab.com/tiketfest/backend/packages/postgres"
	"go.uber.org/fx"
	"gorm.io/gorm"
)

type (
	ITransactionItemInterface interface {
		Create(ctx context.Context, reqData *models.TransactionItems, tx *gorm.DB) (*int, error)
		FindByID(ctx context.Context, reqData *models.TransactionItems) (*models.TransactionItems, error)
	}

	TransactionItemRepository struct {
		fx.In
		DB     *postgres.DB
		Logger *logger.Logger
	}
)

func NewRepository(transactionItemRepository TransactionItemRepository) ITransactionItemInterface {
	return &transactionItemRepository
}

func (receiver *TransactionItemRepository) Create(ctx context.Context, reqData *models.TransactionItems, tx *gorm.DB) (*int, error) {
	if err := tx.WithContext(ctx).Create(&reqData).Error; err != nil {
		receiver.Logger.Error(err)
		return nil, err
	}

	return &reqData.ID, nil
}

func (receiver *TransactionItemRepository) FindByID(ctx context.Context, reqData *models.TransactionItems) (*models.TransactionItems, error) {
	transactionItem := new(models.TransactionItems)

	if err := receiver.DB.Gorm.WithContext(ctx).
		Where(&models.Transactions{
			ID: reqData.ID,
		}).
		First(&transactionItem).Error; err != nil {
		receiver.Logger.Error(err)
		return nil, err
	}

	return transactionItem, nil
}
