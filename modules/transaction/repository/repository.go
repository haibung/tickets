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
	ITransactionInterface interface {
		Create(ctx context.Context, reqData *models.Transactions, tx *gorm.DB) (*int, error)
		FindByID(ctx context.Context, reqData *models.Transactions) (*models.Transactions, error)
		Update(ctx context.Context, reqData *models.Transactions, tx *gorm.DB) error
	}

	TransactionRepository struct {
		fx.In
		DB     *postgres.DB
		Logger *logger.Logger
	}
)

func NewRepository(transactionRepository TransactionRepository) ITransactionInterface {
	return &transactionRepository
}

func (receiver *TransactionRepository) Create(ctx context.Context, reqData *models.Transactions, tx *gorm.DB) (*int, error) {
	if err := tx.WithContext(ctx).Create(&reqData).Error; err != nil {
		receiver.Logger.Error(err)
		return nil, err
	}

	return &reqData.ID, nil
}

func (receiver *TransactionRepository) FindByID(ctx context.Context, reqData *models.Transactions) (*models.Transactions, error) {
	transaction := new(models.Transactions)

	if err := receiver.DB.Gorm.WithContext(ctx).
		Where(&models.Transactions{
			ID: reqData.ID,
		}).
		First(&transaction).Error; err != nil {
		receiver.Logger.Error(err)
		return nil, err
	}

	return transaction, nil
}

//func (receiver *TransactionRepository) Update(ctx context.Context, reqData *models.Transactions, tx *gorm.DB) error {
//	updates := map[string]interface{}{
//		"total":       reqData.Total,
//		"fee":         reqData.Fee,
//		"tax":         reqData.Tax,
//		"commission":  reqData.Commission,
//		"grand_total": reqData.GrandTotal,
//	}
//
//	if err := tx.WithContext(ctx).
//		Model(&models.Transactions{}).
//		Where("id = ?", reqData.ID).
//		Updates(&updates).Error; err != nil {
//		receiver.Logger.Error(err)
//		return err
//	}
//
//	return nil
//}

func (receiver *TransactionRepository) Update(ctx context.Context, reqData *models.Transactions, tx *gorm.DB) error {
	// Prepare the fields to be updated
	updates := map[string]interface{}{
		"total":       reqData.Total,
		"fee":         reqData.Fee,
		"tax":         reqData.Tax,
		"commission":  reqData.Commission, // Fixed typo here
		"grand_total": reqData.GrandTotal,
	}

	// Log the update values for debugging
	receiver.Logger.Info("Updating transaction with ID:", reqData.ID)
	receiver.Logger.Info("Update values:", updates)

	// Perform the update query
	if err := tx.WithContext(ctx).
		Model(&models.Transactions{}).
		Where("id = ?", reqData.ID).
		Updates(updates).Error; err != nil {
		receiver.Logger.Error("Failed to update transaction:", err)
		return err
	}

	receiver.Logger.Info("Transaction updated successfully with ID:", reqData.ID)
	return nil
}
