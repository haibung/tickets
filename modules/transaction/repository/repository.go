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
		FindAll(ctx context.Context, reqData *models.Transactions) ([]*models.Transactions, error)
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
	receiver.Logger.Info("Transaction with ID:", reqData.UserID)
	receiver.Logger.Info("Transaction value:", transaction)

	if err := receiver.DB.Gorm.WithContext(ctx).
		Where(&models.Transactions{
			//ID:     reqData.ID,
			UserID: reqData.UserID,
		}).
		Order("created_at DESC").
		First(&transaction).Error; err != nil {
		receiver.Logger.Error(err)
		return nil, err
	}
	return transaction, nil
}

func (receiver *TransactionRepository) Update(ctx context.Context, reqData *models.Transactions, tx *gorm.DB) error {
	updates := map[string]interface{}{
		"total":       reqData.Total,
		"fee":         reqData.Fee,
		"tax":         reqData.Tax,
		"commission":  reqData.Commission,
		"grand_total": reqData.GrandTotal,
	}

	receiver.Logger.Info("Updating transaction with ID:", reqData.ID)
	receiver.Logger.Info("Update values:", updates)

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

//func (receiver *TransactionRepository) FindAll(ctx context.Context, reqData *models.Transactions) ([]*models.Transactions, error) {
//	var transactions []*models.Transactions
//
//	//if err := receiver.DB.Gorm.WithContext(ctx).
//	//	Where(&models.Transactions{
//	//		ID: reqData.ID,
//	//	}).
//	//	Order("created_at"). // Order by creation date, newest first
//	//	Limit(1).
//	//	First(&transactions).Error; err != nil {
//	//	receiver.Logger.Error(err)
//	//	return nil, err
//	//}
//
//	if err := receiver.DB.Gorm.WithContext(ctx).
//		Where(&models.Transactions{
//			UserID: reqData.UserID,
//		}).
//		Order("created_at desc").
//		Limit(1).
//		First(&transactions).Error; err != nil {
//		receiver.Logger.Error("Error fetching the most recent transaction", err)
//		return nil, err
//	}
//
//	return transactions, nil
//}

func (receiver *TransactionRepository) FindAll(ctx context.Context, reqData *models.Transactions) ([]*models.Transactions, error) {
	var transactions []*models.Transactions

	if err := receiver.DB.Gorm.WithContext(ctx).
		Where(&models.Transactions{
			UserID: reqData.UserID,
		}).
		Preload("TransactionItems"). // Preload the TransactionItems relation
		Preload("Payments").         // Preload the Payments relation
		Order("created_at desc").    // Order by the creation date, newest first
		Find(&transactions).Error; err != nil {
		receiver.Logger.Error("Error fetching transactions", err)
		return nil, err
	}

	return transactions, nil
}
