package modules

import (
	category "gitlab.com/tiketfest/backend/modules/category/repository"
	content "gitlab.com/tiketfest/backend/modules/content/repository"
	feature "gitlab.com/tiketfest/backend/modules/feature/repository"
	payment "gitlab.com/tiketfest/backend/modules/payment/repository"
	permission "gitlab.com/tiketfest/backend/modules/permission/repository"
	role "gitlab.com/tiketfest/backend/modules/role/repository"
	transaction "gitlab.com/tiketfest/backend/modules/transaction/repository"
	transactionItem "gitlab.com/tiketfest/backend/modules/transactionItem/repository"
	user "gitlab.com/tiketfest/backend/modules/user/repository"
	"go.uber.org/fx"
)

// AppRepository :
var AppRepository = fx.Options(
	fx.Provide(user.NewRepository),
	fx.Provide(role.NewRepository),
	fx.Provide(permission.NewRepository),
	fx.Provide(feature.NewRepository),
	fx.Provide(category.NewRepository),
	fx.Provide(content.NewRepository),
	fx.Provide(transaction.NewRepository),
	fx.Provide(transactionItem.NewRepository),
	fx.Provide(payment.NewRepository),
)
