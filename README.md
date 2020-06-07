# chicago-divvy-bike-rental-platform
This is REST API for the Chicago Divvy Bike Rental platform using the Divvy API and the provided trip data.

## Local Install
```shell
npm install --save
```
## Security Tokens
The Authorization for APIs is provided using 20 character token based mechanism. The following security tokens should be used when calling APIs

| Environment | Token              |
|-------------|--------------------|
| Dev | jjn1qwgxgca3mwr839nx |
| QA | jjn1qwgxgca3mwr839nx |


## Dependencies
* CLI
    * CLI is Command Line Interface otherwise known as Command Prompt, Powershell, Git Bash, Git Shell, Git Terminal
* [Node.js](http://nodejs.org/)
    * Install Node version v12.14.1
        * Visit official website and "Install" (not "Download")
    * Verify
        * Open CLI
        * Run `node -v`
        * Expect a version number
* Dev local setup
    * Install
        * Open CLI as Administrator
        * Change directory to the web site root
        * Run `npm --save i`
    * Verify
        * Open CLI
        * Run `npm start`

## Usage

There are 3 endpoints:

* stations 
* trips 
* riders 

#### stations:

This endpoint takes station_id as input and returns the information for one station given a station id

```
curl -X GET \
  'http://localhost:3000/stations?station_id=5' \
  -H 'authorization: jjn1qwgxgca3mwr839nx' \
  
```

In the above curl call the station_id provided is 5, the endpoint will return with the response below,

```
{
    "statusCode": 200,
    "records": [
        {
            "lon": -87.627716,
            "rental_methods": [
                "CREDITCARD",
                "TRANSITCARD",
                "KEY"
            ],
            "lat": 41.874053,
            "eightd_station_services": [],
            "electric_bike_surcharge_waiver": false,
            "station_type": "classic",
            "short_name": "SL-007",
            "capacity": 23,
            "name": "State St & Harrison St",
            "eightd_has_key_dispenser": false,
            "external_id": "a3a37e26-a135-11e9-9cda-0a87ae2ba916",
            "rental_uris": {
                "android": "https://chi.lft.to/lastmile_qr_scan",
                "ios": "https://chi.lft.to/lastmile_qr_scan"
            },
            "has_kiosk": true,
            "station_id": "5"
        }
    ]
}

```

#### trips:

Given one or more stations, return the number of riders in the following age groups,
[0-20,21-30,31-40,41-50,51+, unknown], who ended their trip at that station for a given
day.

```
curl -X GET \
  'http://localhost:3000/trips?stations=89%2C90%2C91%2C92%2C93%2C94&date=4%2F3%2F2019' \
  -H 'authorization: jjn1qwgxgca3mwr839nx' \
  
```

In the above curl call the query string contains station_ids provided comma separated and a date string in `MM/DD/YYYY` format, the endpoint will return with the response below,

```
{
    "statusCode": 200,
    "records": {
        "0-20": 0,
        "21-30": 28,
        "31-40": 7,
        "41-50": 4,
        "51+": 11,
        "unknown": 0
    }
}

```
#### riders:

This endpoint given one or more stations, return the last 20 trips that ended at each station for a single day(given day)

```
curl -X GET \
  'http://localhost:3000/trips?stations=92%2C93%2C94&date=4%2F3%2F2019' \
  -H 'authorization: jjn1qwgxgca3mwr839nx' \
  
```

In the above curl call the query string contains station_ids provided comma separated and a date string in `MM/DD/YYYY` format, the endpoint will return with the response below,

```
{
    "statusCode": 200,
    "records": {
        "92": [
            {
                "01 - Rental Details Rental ID": "22207291",
                "01 - Rental Details Local Start Time": "2019-04-03 19:00:49",
                "01 - Rental Details Local End Time": "2019-04-03 19:11:03",
                "01 - Rental Details Bike ID": "117",
                "01 - Rental Details Duration In Seconds Uncapped": "614.0",
                "03 - Rental Start Station ID": "47",
                "03 - Rental Start Station Name": "State St & Kinzie St",
                "02 - Rental End Station ID": "92",
                "02 - Rental End Station Name": "Carpenter St & Huron St",
                "User Type": "Subscriber",
                "Member Gender": "Male",
                "05 - Member Details Member Birthday Year": "1991"
            },
            ...
        ],
        "93": [
            {
                "01 - Rental Details Rental ID": "22206237",
                "01 - Rental Details Local Start Time": "2019-04-03 17:59:22",
                "01 - Rental Details Local End Time": "2019-04-03 18:17:22",
                "01 - Rental Details Bike ID": "5769",
                "01 - Rental Details Duration In Seconds Uncapped": "1,080.0",
                "03 - Rental Start Station ID": "620",
                "03 - Rental Start Station Name": "Orleans St & Chestnut St (NEXT Apts)",
                "02 - Rental End Station ID": "93",
                "02 - Rental End Station Name": "Sheffield Ave & Willow St",
                "User Type": "Subscriber",
                "Member Gender": "Female",
                "05 - Member Details Member Birthday Year": "1992"
            }
        ],
        "94": [
            {
                "01 - Rental Details Rental ID": "22206686",
                "01 - Rental Details Local Start Time": "2019-04-03 18:22:39",
                "01 - Rental Details Local End Time": "2019-04-03 18:49:55",
                "01 - Rental Details Bike ID": "1539",
                "01 - Rental Details Duration In Seconds Uncapped": "1,636.0",
                "03 - Rental Start Station ID": "286",
                "03 - Rental Start Station Name": "Franklin St & Quincy St",
                "02 - Rental End Station ID": "94",
                "02 - Rental End Station Name": "Clark St & Armitage Ave",
                "User Type": "Subscriber",
                "Member Gender": "Male",
                "05 - Member Details Member Birthday Year": "1972"
            },
            {
                "01 - Rental Details Rental ID": "22206583",
                "01 - Rental Details Local Start Time": "2019-04-03 18:17:55",
                "01 - Rental Details Local End Time": "2019-04-03 18:27:23",
                "01 - Rental Details Bike ID": "560",
                "01 - Rental Details Duration In Seconds Uncapped": "568.0",
                "03 - Rental Start Station ID": "115",
                "03 - Rental Start Station Name": "Sheffield Ave & Wellington Ave",
                "02 - Rental End Station ID": "94",
                "02 - Rental End Station Name": "Clark St & Armitage Ave",
                "User Type": "Customer",
                "Member Gender": "Male",
                "05 - Member Details Member Birthday Year": "1973"
            }
            ...
        ]
    }
}

```


## Commands

[Docker-Image-File](https://drive.google.com/file/d/16PNyBzIT7eiootc81O1zz1jyp6U8lZXg/view?usp=sharing)