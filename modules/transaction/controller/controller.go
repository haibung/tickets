package controller

import (
	"context"
	"errors"
	"fmt"
	"gitlab.com/tiketfest/backend/models"
	"gitlab.com/tiketfest/backend/modules/transaction"
	"gitlab.com/tiketfest/backend/modules/transaction/repository"
	transactionItemDto "gitlab.com/tiketfest/backend/modules/transactionItem"
	transactionItem "gitlab.com/tiketfest/backend/modules/transactionItem/controller"

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
		TransactionItem       transactionItem.TransactionItemController
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
		//Total:         reqData.Total,
		//Fee:           reqData.Fee,
		//Tax:           reqData.Tax,
		//Commission:    reqData.Commission,
		//GrandTotal:    reqData.GrandTotal,
		//Status:        reqData.Status,

	}, tx)

	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusInternalServerError, nil)
	}
	for _, item := range reqData.Items {
		if _, err := receiver.TransactionItem.Create(ctx, &transactionItemDto.CreateRequest{
			TransactionID: insertID,
			Qty:           item.Qty,
			EventID:       item.EventID,
		}, tx); err != nil {
			receiver.Logger.Error(err)
			return nil, err
		}
	}

	if reqData.ContextUserID != nil {
		_, err := receiver.FindByID(ctx, &transaction.FindByIDRequest{
			ID: *reqData.ContextUserID,
		})
		if err != nil {
			receiver.Logger.Error(err)
			if err == gorm.ErrRecordNotFound {
				return nil, utilities.ErrorRequest(
					fmt.Errorf(utilities.DataNotFound, "transaction"),
					http.StatusNotFound,
				)
			}
			return nil, utilities.ErrorRequest(
				errors.New(utilities.InternalServiceError),
				http.StatusInternalServerError,
			)
		}
	}

	err = receiver.TransactionRepository.Update(ctx, &models.Transactions{
		ID:         *insertID,
		Fee:        10.0,
		Commission: 5.0,
		Total:      100.0,
		Tax:        15.0,
		GrandTotal: 130.0,
	}, tx)

	return insertID, nil
}

// FindByID :
func (receiver *TransactionController) FindByID(ctx context.Context, reqData *transaction.FindByIDRequest) (*transaction.FindByIDResponse, error) {
	// Validate request data
	messages, err := reqData.Validate()
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusBadRequest, messages)
	}

	fetchTransaction, err := receiver.TransactionRepository.FindByID(ctx, &models.Transactions{
		ID: reqData.ID,
	})
	if err != nil {
		receiver.Logger.Error(err)
		if err == gorm.ErrRecordNotFound {
			return nil, utilities.ErrorRequest(
				fmt.Errorf(utilities.DataNotFound, "Transaction"),
				http.StatusNotFound,
			)
		}
		return nil, utilities.ErrorRequest(
			errors.New(utilities.InternalServiceError),
			http.StatusInternalServerError,
		)
	}

	//Validate phone number
	phoneNumber, err := utilities.PhoneNumberTrim(*fetchTransaction.PhoneNumber)
	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusBadRequest, messages)
	}

	items := make([]transaction.ItemTransaction, len(fetchTransaction.TransactionItems))
	for i, item := range fetchTransaction.TransactionItems {
		items[i] = transaction.ItemTransaction{
			EventID: item.EventID,
			Qty:     item.Qty,
		}
	}

	return &transaction.FindByIDResponse{
		ID:            fetchTransaction.ID,
		InvoiceNumber: fetchTransaction.InvoiceNumber,
		FullName:      fetchTransaction.FullName,
		Email:         fetchTransaction.Email,
		PhoneNumber:   *phoneNumber,
		Items:         items,
		CreatedAt:     fetchTransaction.CreatedAt,
	}, nil
}
