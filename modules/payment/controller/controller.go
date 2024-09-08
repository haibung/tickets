package controller

import (
	"context"
	"gitlab.com/tiketfest/backend/models"
	"gitlab.com/tiketfest/backend/modules/payment"
	"gitlab.com/tiketfest/backend/modules/payment/repository"
	"gitlab.com/tiketfest/backend/packages/logger"
	"gitlab.com/tiketfest/backend/utilities"
	"go.uber.org/fx"
	"gorm.io/gorm"
	"net/http"
)

type (
	IPaymentController interface {
		Create(ctx context.Context, reqData *payment.CreateRequest, tx *gorm.DB) (*int, error)
	}

	PaymentController struct {
		fx.In
		PaymentRepository repository.PaymentRepository
		Logger            *logger.Logger
	}
)

func NewController(paymentController PaymentController) IPaymentController {
	return &paymentController
}
func (receiver *PaymentController) Create(ctx context.Context, reqData *payment.CreateRequest, tx *gorm.DB) (*int, error) {
	// Validate request data
	messages, err := reqData.Validate()
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusBadRequest, messages)
	}

	// Create transaction
	insertID, err := receiver.PaymentRepository.Create(ctx, &models.Payments{
		TransactionID:    *reqData.TransactionID,
		InternalID:       reqData.InternalID,
		Status:           reqData.Status,
		SnapshotRequest:  reqData.SnapshotRequest,
		SnapshotCallback: reqData.SnapshotCallback,
	}, tx)
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusInternalServerError, nil)
	}

	return insertID, nil
}
