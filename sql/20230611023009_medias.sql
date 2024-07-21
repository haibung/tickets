-- +goose Up
create table medias (
   id            bigserial primary key,
   url           text,
   description   text default null,
   author_id     int not null,
   updated_at    timestamptz default now(),
   created_at    timestamptz default now(),
   deleted_at    timestamptz default null,
   foreign key (author_id) references users (id)
);
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
drop table medias;
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
