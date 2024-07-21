-- +goose Up
create table roles (
   id            bigserial primary key,
   name          varchar(50),
   updated_at    timestamptz default now(),
   created_at    timestamptz default now(),
   deleted_at    timestamptz default null
);
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
drop table roles;
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
