package redis

import (
	"context"
	"fmt"

	"gitlab.com/tiketfest/backend/config"
	"gitlab.com/tiketfest/backend/packages/logger"

	"github.com/go-redis/redis/v8"
)

func NewRedis(log *logger.Logger) *redis.Client {
	redisClient := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", config.Get().Redis.Host, config.Get().Redis.Port),
		Password: config.Get().Redis.Password,
		DB:       config.Get().Redis.DefaultDB,
	})

	err := redisClient.Ping(context.Background()).Err()
	if err != nil {
		log.Fatal(err.Error())
	}

	return redisClient
}
