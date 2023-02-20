drop table bike_counter.counters ;
create table bike_counter.counters (
	counter_id int4 NOT NULL,
	counter_name text null,
	latitude float null,
	longitude float null,
	photos json null,
	CONSTRAINT "PK_bike_counters" PRIMARY KEY (counter_id)
);

drop table bike_counter.counter_channels ;
create table bike_counter.counter_channels (
	counter_id int4 NOT NULL,
	channel_id int4 not null,
	channel_name text null,
	CONSTRAINT "PK_bike_counter_channels" PRIMARY KEY (counter_id, channel_id)
);

drop table bike_counter.counter_counts cascade ;
create table bike_counter.counter_counts (
	channel_id int4 NOT NULL,
	iso_date timestamp not null,
	counts int4 null,
	CONSTRAINT "PK_bike_counter_counts" PRIMARY KEY (channel_id, iso_date)
);

create view bike_counter.counter_data as
select * from bike_counter.counters c
natural join bike_counter.counter_channels cc 
natural join bike_counter.counter_counts cc2; 
