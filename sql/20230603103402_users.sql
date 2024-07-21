-- +goose Up
create table users (
     id            bigserial primary key,
     role_id       int not null,
     full_name     varchar(50),
     email         varchar(255) unique not null,
     verify        boolean default false,
     password      varchar(255),
     image         varchar(255) default null,
     updated_at    timestamptz default now(),
     created_at    timestamptz default now(),
     deleted_at    timestamptz default null,
     foreign key (role_id) references roles (id)
);
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
drop table users;
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
