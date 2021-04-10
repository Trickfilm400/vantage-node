# Vantage-Node
Get Data from Vantage Pro Weatherstation from Davis Instruments via telnet connection

### This is not a normal NPM package at the moment, it is rather a finished program for docker 

# Installation
## There are two options: Use the docker image, or the plain nodejs script
### Nodejs Usage
* Copy `config.example.json` to `config.json` and change your data
* Create a MySQL / MariaDB Database with user
* **Start Programm** with `nodejs index.js` or `node .`

### Docker Image
* Download Docker image from docker Hub (link here)
* run `docker run -p 3010:3010 --name vantage-node -e VANTAGE_URL=123.123.123.123 -e MYSQL_ENABLED=false n404/vantage-node`
 
**The Table on the MYSQL Database will be automatically generated if it is not existed**

# Config
### There are two options for the configuration parameter:
1. a `config.json` file in the root directory of the project
2. Configuration with environment variables (mostly for docker / kubernetes)

#### `config.json`
````json
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
**If your have any problems, fell free to create an issue to contact me**
