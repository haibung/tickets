package modules

import (
	auth "gitlab.com/tiketfest/backend/modules/auth/controller"
	category "gitlab.com/tiketfest/backend/modules/category/controller"
	content "gitlab.com/tiketfest/backend/modules/content/controller"
	feature "gitlab.com/tiketfest/backend/modules/feature/controller"
	payment "gitlab.com/tiketfest/backend/modules/payment/controller"
	permission "gitlab.com/tiketfest/backend/modules/permission/controller"
	role "gitlab.com/tiketfest/backend/modules/role/controller"
	transaction "gitlab.com/tiketfest/backend/modules/transaction/controller"
	transactionItem "gitlab.com/tiketfest/backend/modules/transactionItem/controller"
	user "gitlab.com/tiketfest/backend/modules/user/controller"
	"go.uber.org/fx"
)

// AppController :
var AppController = fx.Options(
	fx.Provide(user.NewController),
	fx.Provide(role.NewController),
	fx.Provide(permission.NewController),
	fx.Provide(feature.NewController),
	fx.Provide(auth.NewController),
	fx.Provide(category.NewController),
	fx.Provide(content.NewController),
	fx.Provide(transaction.NewController),
	fx.Provide(transactionItem.NewController),
	fx.Provide(payment.NewController),
)
