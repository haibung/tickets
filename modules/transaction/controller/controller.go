package controller

import (
	"context"
	"errors"
	"fmt"
	"gitlab.com/tiketfest/backend/enum"
	"gitlab.com/tiketfest/backend/models"
	"gitlab.com/tiketfest/backend/modules/payment"
	paymentController "gitlab.com/tiketfest/backend/modules/payment/controller"
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
		FindAll(ctx context.Context, reqData *transaction.FindAllRequest) ([]*transaction.FindByIDResponse, error)
	}

	TransactionController struct {
		fx.In
		TransactionRepository repository.TransactionRepository
		TransactionItem       transactionItem.TransactionItemController
		PaymentController     paymentController.PaymentController
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

	if reqData.ContextUserID != nil {
		existingTransaction, err := receiver.TransactionRepository.FindByID(ctx, &models.Transactions{
			UserID: *reqData.ContextUserID,
		})
		if err == nil && existingTransaction != nil {
			receiver.Logger.Info("Transaction already exists for user, but proceeding to create a new transaction.")
			return &existingTransaction.ID, nil
		}
		if err != nil && err != gorm.ErrRecordNotFound {
			receiver.Logger.Error(err)
			return nil, utilities.ErrorRequest(errors.New(utilities.InternalServiceError), http.StatusInternalServerError)
		}
	}

	// Create transaction
	insertID, err := receiver.TransactionRepository.Create(ctx, &models.Transactions{
		UserID:        *reqData.ContextUserID,
		InvoiceNumber: reqData.InvoiceNumber,
		FullName:      reqData.FullName,
		Email:         reqData.Email,
		PhoneNumber:   phoneNumber,
		Status:        enum.TransactionStatusWaiting,
		//Total:         reqData.Total,
		//Fee:           reqData.Fee,
		//Tax:           reqData.Tax,
		//Commission:    reqData.Commission,
		//GrandTotal:    reqData.GrandTotal,

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

	err = receiver.TransactionRepository.Update(ctx, &models.Transactions{
		ID:         *insertID,
		Fee:        11.0,
		Commission: 6.0,
		Total:      1100.0,
		Tax:        155.0,
		GrandTotal: 1302.0,
	}, tx)

	if err != nil {
		receiver.Logger.Error(err)
		return nil, utilities.ErrorRequest(err, http.StatusInternalServerError, nil)
	}

	snapshotRequest := fmt.Sprintf(`{"transaction_id": %d, "details": "Transaction snapshot for %d"}`, *insertID, *insertID)
	snapshotCallback := `{"url": "https://example.com/callback", "method": "POST"}`

	paymentReq := &payment.CreateRequest{
		TransactionID:    insertID,
		InternalID:       utilities.RandomInt(100000, 999999),
		Status:           utilities.StringPointer("Pending"),
		SnapshotRequest:  utilities.StringPointer(snapshotRequest),
		SnapshotCallback: utilities.StringPointer(snapshotCallback),
	}

	paymentID, err := receiver.PaymentController.Create(ctx, paymentReq, tx)
	if err != nil {
		receiver.Logger.Error("Error creating payment for transaction:", err)
		return nil, utilities.ErrorRequest(err, http.StatusInternalServerError, nil)
	}

	receiver.Logger.Info("Payment created successfully with ID:", *paymentID, "for transaction ID:", *insertID)

	return insertID, nil
}

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

func (receiver *TransactionController) FindAll(ctx context.Context, reqData *transaction.FindAllRequest) ([]*transaction.FindByIDResponse, error) {

	// Validate the request data
	messages, err := reqData.Validate()
	if err != nil {
		receiver.Logger.Error("Validation error", err)
		return nil, utilities.ErrorRequest(err, http.StatusBadRequest, messages)
	}

	transactionRequest := &models.Transactions{
		UserID: reqData.ContextUserID,
	}

	transactions, err := receiver.TransactionRepository.FindAll(ctx, transactionRequest)
	if err != nil {
		receiver.Logger.Error("Error fetching transactions", err)
		return nil, utilities.ErrorRequest(
			errors.New(utilities.InternalServiceError),
			http.StatusInternalServerError,
		)
	}

	var response []*transaction.FindByIDResponse
	for _, t := range transactions {
		var items []transaction.ItemTransaction
		fmt.Print("ini item", items)
		for _, item := range t.TransactionItems {
			items = append(items, transaction.ItemTransaction{
				EventID: item.EventID,
				Qty:     item.Qty,
			})
		}

		response = append(response, &transaction.FindByIDResponse{
			ID:            t.ID,
			InvoiceNumber: t.InvoiceNumber,
			FullName:      t.FullName,
			Email:         t.Email,
			PhoneNumber:   *t.PhoneNumber,
			//Total:         t.Total,
			//Fee:           t.Fee,
			//Tax:           t.Tax,
			//Commission:    t.Commission,
			//GrandTotal:    t.GrandTotal,
			Status:    t.Status.String(),
			Items:     items,
			CreatedAt: t.CreatedAt,
		})
	}

	return response, nil
}
