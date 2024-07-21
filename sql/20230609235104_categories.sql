-- +goose Up
create table categories (
   id            bigserial primary key,
   name          varchar(50),
   sort          int not null,
   parent_id     int default null,
   updated_at    timestamptz default now(),
   created_at    timestamptz default now(),
   deleted_at    timestamptz default null,
   foreign key (parent_id) references categories (id)
);
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
drop table categories;
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
