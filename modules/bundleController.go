package modules

import (
	auth "Users/evilkidz/Project/Golang/CMS/backend/modules/auth/controller"
	category "Users/evilkidz/Project/Golang/CMS/backend/modules/category/controller"
	content "Users/evilkidz/Project/Golang/CMS/backend/modules/content/controller"
	feature "Users/evilkidz/Project/Golang/CMS/backend/modules/feature/controller"
	permission "Users/evilkidz/Project/Golang/CMS/backend/modules/permission/controller"
	role "Users/evilkidz/Project/Golang/CMS/backend/modules/role/controller"
	user "Users/evilkidz/Project/Golang/CMS/backend/modules/user/controller"
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
)
