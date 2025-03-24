create table app_config
(
  id    varchar(25) not null,
  value text,

  constraint pk_app_config primary key (id)
);
