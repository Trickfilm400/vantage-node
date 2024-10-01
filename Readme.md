# Vantage-Node
Get Data from Vantage Pro Weatherstation from Davis Instruments via telnet connection

# Features
- Telnet Live-Connection (data every 2 seconds)
- Prometheus Data export
- MySQL Storage
- Socket.IO Server
- Simple REST API
- MQTT Export
- InfluxDB Export (upcoming)


# Installation
There are two options: Use the docker image, or the plain nodejs script
### Nodejs Usage
* Copy `config.example.json` to `config.json` and change your data
* Create a MySQL / MariaDB Database with user
* Install dependencies with `npm i` and compile project with `npm run build`
* **Start Programm** with `npm start`

### Docker Image
* Download Docker image from [Docker Hub](https://hub.docker.com/r/n404/vantage-node) (`n404/vantage-node`)
* run `docker run -p 3010:3010 --name vantage-node -e VANTAGE_URL=123.123.123.123 -e MYSQL_ENABLED=false n404/vantage-node`
 
* With Custom `config.json` file: `docker run --rm -v $(pwd)/config.json:/config.json -p 3011:3011 n404/vantage-node`
**The Table on the MYSQL Database will be automatically generated if it is not existed**

# Config
### There are two options for the configuration parameter:
1. a `config.json` file in the root directory of the project
2. Configuration with environment variables (mostly for docker / kubernetes)

#### `config.json`
````json5
{
    "vantage": {
        "url": "192.168.178.xxx" //REQUIRED, default ""
    }, 
    "mysql": {
        "enabled": true | false, //required, default true
        "ip": "<database-Host>", //default "127.0.0.1"
        "database": "<database>", //default "weather"
        "username": "<databae-User>", //default "weather"
        "password": "<database-Password>" //default ""
    }, 
    "socket": {
        "enabled": true | false, //default true
        "port": 3011 //default 3010
    },
    "mqtt": {
      "enable": true | false,
      "host": "emqx",
      "user": "emqx",
      "password": "",
      "clientid": "mqtt_vantage_node_system_client",
      "topic": "vantage_data"
    },
    "saveinterval": 60 //default 60, given in seconds
}
````
#### List of supported environment variables
| Environment Variable | Description                                                 | Default Value | Type    | Required |
|----------------------|-------------------------------------------------------------|---------------|---------|----------|
| VANTAGE_URL          | The URL to the Vantage-Pro Telnet adapter                   | ""            | string  | yes      |
| VANTAGE_PORT         | The Port to the Vantage-Pro telnet adapter                  | 22222         | number  | no       |
| MYSQL_ENABLED        | If MYSQL should be used                                     | true          | boolean | yes      |
| MYSQL_IP             | The MYSQL Host (IP or Hostname)                             | 127.0.0.1     | string  | no       |
| MYSQL_PORT           | The Mysql Port                                              | 3306          | number  | no       |
| MYSQL_DB             | The MYSQL Database name                                     | weather       | string  | no       |
| MYSQL_USERNAME       | The MYSQL Database user                                     | weather       | string  | no       |
| MYSQL_PASSWORD       | The MYSQL database password                                 | ""            | string  | no       |
| SOCKET_PORT          | The Port the websocket-Server should listen on              | 3010          | number  | no       |
| SOCKET_ENABLED       | If websocket should be enabled                              | true          | boolean | no       |
| SAVE_INTERVAL        | the interval the data should be saved in the MYSQL Database | 60            | number  | no       |
----

### Websocket Usage
On the Websocket port there will be sent the packages as soo as they get received from the vantage-pro station.
You can use these packages with any socket.io-client (web-client or nodejs-client for example).
The Packages have the following structure:
````json
{
    "barometer": 986.8407885386599,
    "dayrain": 0,
    "inhum": 26,
    "intemp": 22.722222222222225, 
    "outhum": 82, 
    "outtemp": 9.722222222222221, 
    "rainrate": 0,
    "winddir": 258, 
    "windspeed": 0
}
````

### REST API
`/test` =>

```json
{
	"code": 200,
	"message": "Test successful"
}
```

`/metrics` => returns Prometheus Metrics of the weather data

`/healthcheck`(used for internal docker checks):

if healthcheck is ok (HTTP Statuscode: 200):

```json5
{
    "message": "Packages are valid", 
    "code": 200, 
    "value": 1234 // timestamp of last Telnet package in MS
}
```

if healthcheck is **not valid**: (HTTP Statuscode: 500)

```json5
{
    "message": "Packages are outdated and invalid!",
    "code": 500, 
    "value": 1234 //timestamp of last Telnet package in MS
}
```

`/lastdata`:

Values are `-1` if not set (for example after program restart) (like in `barometer`)
```json
{
  "value": {
    "barometer": -1,
    "dayRain": 0,
    "inHumidity": 29,
    "outHumidity": 71,
    "outTemperature": 17.055555555555557,
    "inTemperature": 22.944444444444443,
    "rainRate": 0,
    "windDirection": 147,
    "windSpeedMax": 0,
    "windSpeed": 0
  },
  "message": "Last Dataset of Weatherstation",
  "code": 200
}
```
**If your have any problems, fell free to create an issue to contact me**
