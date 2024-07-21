package modules

import (
	category "Users/evilkidz/Project/Golang/CMS/backend/modules/category/repository"
	content "Users/evilkidz/Project/Golang/CMS/backend/modules/content/repository"
	feature "Users/evilkidz/Project/Golang/CMS/backend/modules/feature/repository"
	permission "Users/evilkidz/Project/Golang/CMS/backend/modules/permission/repository"
	role "Users/evilkidz/Project/Golang/CMS/backend/modules/role/repository"
	user "Users/evilkidz/Project/Golang/CMS/backend/modules/user/repository"
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
)
