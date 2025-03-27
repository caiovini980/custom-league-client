create table app_config (
  id         varchar(25) not null,
  value      text,
  created_at text,
  updated_at text,

  constraint pk_app_config primary key (id)
);


insert into app_config (id, value, created_at, updated_at)
values ('RIOT_PATH', null, datetime(), datetime());
