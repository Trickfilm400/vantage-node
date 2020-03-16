# Vantage-Node
Get Data from Vantage Pro Weatherstation from Davis Instruments via telnet connection


# Installation
* Create a MySQL / MariaDB Database and Table
* Table Command below (*NOTICE:* **quotation marks**!):

    "CREATE TABLE log (id int NOT NULL AUTO_INCREMENT, time int NOT NULL, station_id smallint NOT NULL, barometer float NOT NULL, in_temp float NOT NULL, in_hum float NOT NULL, out_temp float NOT NULL, out_hum float NOT NULL, wind_speed float NOT NULL, max_win_speed float DEFAULT NULL, wind_dir smallint NOT NULL, dayrain float NOT NULL, rainrate float NOT NULL, PRIMARY KEY (id))"
    

* Edit config.json with your data
* Run `npm install` or `npm i`
## Usage
* Start Programm with `nodejs index.js` or `node .`

# Config
````json
{
	"vantage-url": "<Vantage IP Address>", //192.168.178.25, REQUIRED
	"vantage-port": 22222, //your telnet Port of the vantage pro weather station
	"mysql_enable": true, // or false, if wanted
	"db": {
		"host": "<Database IP>",
		"user": "<Database User>",
		"password": "<Database Password>",
		"database": "<Database Name>"
	},
	"database_save_interval": 60, //in seconds!
	"socket_server_port": 3010 //socket.io port
}
````
----
**If your have any problems, fell free to create an issue to contact me**