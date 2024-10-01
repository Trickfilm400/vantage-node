
-- #MYSQL Schema, working fpr mysql 8, last edited 08.04.2021
CREATE TABLE IF NOT EXISTS log (id int NOT NULL AUTO_INCREMENT, time int NOT NULL, station_id smallint NOT NULL, barometer float NOT NULL, in_temp float NOT NULL, in_hum float NOT NULL, out_temp float NOT NULL, out_hum float NOT NULL, wind_speed float NOT NULL, max_win_speed float DEFAULT NULL, wind_dir smallint NOT NULL, dayrain float NOT NULL, rainrate float NOT NULL, PRIMARY KEY (id))
