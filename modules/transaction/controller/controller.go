package controller

import (
	"context"
	"gitlab.com/tiketfest/backend/models"
	"gitlab.com/tiketfest/backend/modules/transaction"
	"gitlab.com/tiketfest/backend/modules/transaction/repository"
	"gitlab.com/tiketfest/backend/packages/logger"
	"gitlab.com/tiketfest/backend/utilities"
	"go.uber.org/fx"
	"gorm.io/gorm"
	"net/http"
)

type (
	ITransactionController interface {
		Create(ctx context.Context, reqData *transaction.CreateRequest, tx *gorm.DB) (*int, error)
	}

	TransactionController struct {
		fx.In
		TransactionRepository repository.TransactionRepository
		Logger                *logger.Logger
	}
)

func NewController(transactionController TransactionController) ITransactionController {
	return &transactionController
}

func (receiver *TransactionController) Create(ctx context.Context, reqData *transaction.CreateRequest, tx *gorm.DB) (*int, error) {
	// Validate request data
	messages, err := reqData.Validate()
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusBadRequest, messages)
	}

	//Validate phone number
	phoneNumber, err := utilities.PhoneNumberTrim(reqData.PhoneNumber)
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusBadRequest, messages)
	}

	// Create transaction
	insertID, err := receiver.TransactionRepository.Create(ctx, &models.Transactions{
		InvoiceNumber: reqData.InvoiceNumber,
		FullName:      reqData.FullName,
		Email:         reqData.Email,
		PhoneNumber:   phoneNumber,
		Total:         reqData.Total,
		Fee:           reqData.Fee,
		Tax:           reqData.Tax,
		Commission:    reqData.Commission,
		GrandTotal:    reqData.GrandTotal,
		Status:        reqData.Status,
	}, tx)
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusInternalServerError, nil)
	}

	return insertID, nil
}
