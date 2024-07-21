-- +goose Up
create table features (
   id            bigserial primary key,
   name          varchar(50),
   code          varchar(50),
   updated_at    timestamptz default now(),
   created_at    timestamptz default now()
);
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
drop table features;
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
