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
	IPaymentInterface interface {
		Create(ctx context.Context, reqData *models.Payments, tx *gorm.DB) (*int, error)
	}

	PaymentRepository struct {
		fx.In
		DB     *postgres.DB
		Logger *logger.Logger
	}
)

func NewRepository(paymentRepository PaymentRepository) IPaymentInterface {
	return &paymentRepository
}

func (receiver *PaymentRepository) Create(ctx context.Context, reqData *models.Payments, tx *gorm.DB) (*int, error) {
	if err := tx.WithContext(ctx).Create(&reqData).Error; err != nil {
		receiver.Logger.Error(err)
		return nil, err
	}
	return &reqData.ID, nil
}
