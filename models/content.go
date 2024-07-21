package models

import (
	"Users/evilkidz/Project/Golang/CMS/backend/utilities"
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"gorm.io/gorm"
	"time"
)

type (
	ContentType string

	Content struct {
		ID          int
		Title       string
		CategoryID  *int
		Type        ContentType
		Slug        string
		IsPublish   bool
		Description string
		Tags        string
		Link        string
		Images      ContentImages
		AuthorID    int
		CreatedAt   time.Time
		UpdatedAt   time.Time
		DeletedAt   gorm.DeletedAt
	}

	ContentImages []ContentImage

	ContentImage struct {
		ID  int
		URL string
	}
)

const (
	ContentTypeBlog  ContentType = "BLOG"
	ContentTypeCard  ContentType = "CARD"
	ContentTypeSlide ContentType = "SLIDE"
)

func (receiver ContentType) IsValid() error {
	switch receiver {
	case ContentTypeBlog, ContentTypeCard, ContentTypeSlide:
		return nil
	}

	return fmt.Errorf(utilities.DataNotFound, "content type")
}

func (receiver *ContentImages) Scan(value interface{}) error {
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("could not parse image to bytes")
	}

	result := ContentImages{}
	if err := json.Unmarshal(bytes, &result); err != nil {
		return err
	}

	*receiver = result

	return nil
}

func (receiver ContentImages) Value() (driver.Value, error) {
	return json.Marshal(receiver)
}
