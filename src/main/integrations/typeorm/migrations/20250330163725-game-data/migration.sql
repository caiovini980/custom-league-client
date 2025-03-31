create table "game_data_info" (
  version  varchar(20) not null,
  language varchar(10) not null,
  data     text        not null,

  constraint pk_game_data_info primary key (version, language)
);

create table "champion_game_data" (
  version      varchar(20) not null,
  language     varchar(10) not null,
  champion_id  varchar(10) not null,
  champion_key varchar(10) not null,
  data         text        not null,

  constraint pk_champion_game_data primary key (version, language, champion_id, champion_key)
)
