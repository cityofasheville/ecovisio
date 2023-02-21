-- create tables -------------
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
-- create view -------------
create view bike_counter.counter_data as
select * from bike_counter.counters c
natural join bike_counter.counter_channels cc 
natural join bike_counter.counter_counts cc2; 



-- OTHER TESTS-------------
select count(*) from bike_counter.counters;
select count(*) from bike_counter.counter_channels;
select count(*) from bike_counter.counter_counts;
select count(*),date(iso_date) from bike_counter.counter_counts group by date(iso_date) order by date(iso_date);
select count(*),(channel_id) from bike_counter.counter_counts group by (channel_id) order by (channel_id);
select count(*), max(date) from (
	select count(*),date(iso_date) from bike_counter.counter_counts group by date(iso_date) order by date(iso_date)
) moo;

truncate table bike_counter.counters ;
truncate table bike_counter.counter_channels ;
truncate table bike_counter.counter_counts ;


---------------
  INSERT INTO bike_counter.counters
  (counter_id, counter_name, latitude, longitude, photos)
  VALUES(000, 'test2', 12.0, 22.011, '[]')
  ON CONFLICT (counter_id) DO
  UPDATE SET
  counter_name = EXCLUDED.counter_name,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  photos = EXCLUDED.photos;
  
 INSERT INTO bike_counter.counter_channels
(counter_id, channel_id, channel_name)
VALUES(0, 0, 'testwert')
  ON CONFLICT (counter_id, channel_id) DO
  UPDATE SET
  channel_name = EXCLUDED.channel_name;
  
   INSERT INTO bike_counter.counter_counts
  (channel_id, iso_date, counts)
  VALUES($1, $2, $3)
ON CONFLICT (channel_id, iso_date) DO
  UPDATE SET
  counts = EXCLUDED.counts;
          
 
---------------
  select * INTO bike_counter.BAKcounters from bike_counter.counters;
  select * INTO bike_counter.BAKcounter_channels from bike_counter.counter_channels;
  select * INTO bike_counter.BAKcounter_counts from bike_counter.counter_counts;
  
  
