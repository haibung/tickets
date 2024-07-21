-- +goose Up
create table contents (
   id            bigserial primary key,
   title         text,
   category_id   int default null,
   type          text not null,
   slug          text unique not null,
   is_publish    boolean default true,
   description   text default null,
   tags          text default null,
   link          text default null,
   images        json,
   author_id     int not null,
   updated_at    timestamptz default now(),
   created_at    timestamptz default now(),
   deleted_at    timestamptz default null,
   foreign key (category_id) references categories (id),
   foreign key (author_id) references users (id)
);
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
drop table contents;
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
