package modules

import (
	auth "gitlab.com/tiketfest/backend/modules/auth/route"
	category "gitlab.com/tiketfest/backend/modules/category/route"
	content "gitlab.com/tiketfest/backend/modules/content/route"
	payment "gitlab.com/tiketfest/backend/modules/payment/route"
	permission "gitlab.com/tiketfest/backend/modules/permission/route"
	role "gitlab.com/tiketfest/backend/modules/role/route"
	transaction "gitlab.com/tiketfest/backend/modules/transaction/route"
	transactionItem "gitlab.com/tiketfest/backend/modules/transactionItem/route"
	user "gitlab.com/tiketfest/backend/modules/user/route"
	"go.uber.org/fx"
)

// AppRoute :
var AppRoute = fx.Options(
	fx.Invoke(user.NewRoute),
	fx.Invoke(role.NewRoute),
	fx.Invoke(permission.NewRoute),
	fx.Invoke(auth.NewRoute),
	fx.Invoke(category.NewRoute),
	fx.Invoke(content.NewRoute),
	fx.Invoke(transaction.NewRoute),
	fx.Invoke(transactionItem.NewRoute),
	fx.Invoke(payment.NewRoute),
)
