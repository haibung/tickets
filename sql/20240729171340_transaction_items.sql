-- +goose Up
create table transaction_items (
    id             bigserial primary key,
    transaction_id int not null,
    event_id       int not null,
    qty            int not null,
    created_at     timestamptz default now(),
    foreign key (transaction_id) references transactions (id)
);

-- +goose Down
drop table transaction_items;