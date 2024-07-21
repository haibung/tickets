package modules

import (
	auth "Users/evilkidz/Project/Golang/CMS/backend/modules/auth/route"
	category "Users/evilkidz/Project/Golang/CMS/backend/modules/category/route"
	content "Users/evilkidz/Project/Golang/CMS/backend/modules/content/route"
	permission "Users/evilkidz/Project/Golang/CMS/backend/modules/permission/route"
	role "Users/evilkidz/Project/Golang/CMS/backend/modules/role/route"
	user "Users/evilkidz/Project/Golang/CMS/backend/modules/user/route"
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
)
