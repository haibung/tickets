package controller

import (
	"context"
	"gitlab.com/tiketfest/backend/models"
	"gitlab.com/tiketfest/backend/modules/transactionItem"
	"gitlab.com/tiketfest/backend/modules/transactionItem/repository"
	"gitlab.com/tiketfest/backend/packages/logger"
	"gitlab.com/tiketfest/backend/utilities"
	"go.uber.org/fx"
	"gorm.io/gorm"
	"net/http"
)

type (
	ITransactionItemController interface {
		Create(ctx context.Context, reqData *transactionItem.CreateRequest, tx *gorm.DB) (*int, error)
	}

	TransactionItemController struct {
		fx.In
		TransactionItemRepository repository.TransactionItemRepository
		Logger                    *logger.Logger
	}
)

func NewController(transactionItemController TransactionItemController) ITransactionItemController {
	return &transactionItemController
}

func (receiver *TransactionItemController) Create(ctx context.Context, reqData *transactionItem.CreateRequest, tx *gorm.DB) (*int, error) {
	// Validate request data
	messages, err := reqData.Validate()
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusBadRequest, messages)
	}

	// Create transaction
	insertID, err := receiver.TransactionItemRepository.Create(ctx, &models.TransactionItems{
		EventID:       reqData.EventID,
		Qty:           reqData.Qty,
		TransactionID: *reqData.TransactionID,
	}, tx)
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusInternalServerError, nil)
	}

	return insertID, nil
}
