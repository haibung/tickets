-- +goose Up
create table payments (
    id                bigserial primary key,
    transaction_id    int not null,
    internal_id       int not null,
    status            varchar(50) not null,
    snapshot_request  json not null,
    snapshot_callback json not null,
    created_at        timestamptz default now(),
    foreign key (transaction_id) references transactions (id)
);

-- +goose Down
drop table payments;
