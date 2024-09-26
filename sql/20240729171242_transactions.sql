-- +goose Up
create table transactions (
    id                bigserial primary key,
    user_id           int not null,
    invoice_number    varchar(100) not null unique,
    full_name         varchar(255) not null,
    email             varchar(255) unique not null,
    phone_number      varchar(18) unique null,
    total             float not null,
    fee               float not null,
    tax               float not null,
    commission        float not null,
    grand_total       float not null,
    status            int not null,

    foreign key (user_id) references users (id),
    created_at        timestamptz default now(),
    updated_at        timestamptz default now(),
    deleted_at        timestamptz default null
);
-- +goose Down
drop table transactions;