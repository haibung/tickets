-- +goose Up
create table permissions (
  id            bigserial primary key,
  role_id      int not null,
  feature_id   int not null,
  key_action   varchar(50),
  is_active    boolean default false,
  updated_at   timestamptz default now(),
  created_at   timestamptz default now(),
  foreign key (role_id) references roles (id),
  foreign key (feature_id) references features (id)
);
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
drop table permissions;
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
