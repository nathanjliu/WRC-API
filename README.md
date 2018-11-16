# WRC-API
A super basic expressJS API for WRC results.

Uses the INCREDBLE [ewrc-results.com](http://ewrc-results.com). I've donated an you should too if you use this API.

You can test usage at: http://wrc-api.herokuapp.com/. Please keep usage low and host yourself, it's unfair on eWRC results otherwise, and I'm running it on free heroku servers.

## Get rally IDs

`/api/rally/getids/{year}`

Get shortname, name and ID for rallies from a given year.

| Parameter  | Description  |
|---|---|
|  year |  Year of event. 2014-2019 only. Note: 2019 may be unreliable until calendar confirmed. |

## Get rally standings

`/api/rally/{name}/{year}/{id}`

Produces the latest top ten result from the current rally.

| Parameter  | Description  |
|---|---|
| name  | For WRC events in 2014-2019, accepts a short name such as 'catalunya', 'wales', 'germany.' These can be found using the getids function. For earlier events and those in different competitions, use the full name as presented in an eWRC URL.  |
| year  |  Year of event |
| id (optional) | eWRC ID. Optional for WRC events 2014-2019. Required for all other events.  |

## Get championship standings

`/api/championship/{year}`

Get WRC standings for any year the championship has been active.

| Parameter  | Description  |
|---|---|
|  year |  Year of championship. 1979-2018 supported. |

## Get driver IDs

`/api/driver/getids/{surname}`

Searches for drivers and their eWRC IDs.

Returns full name and ID.

| Parameter  | Description  |
|---|---|
|  surname |  Surname of a driver |


## Get driver stats

`/api/driver/{id}/{firstname}/{surname}`

Gets a drivers WRC statistics: Total Starts, Total Victories, Retirements, Podiums, First Event and Last Event.

| Parameter  | Description  |
|---|---|
|  id |  Driver id. Use driver/getids to get id. |
|  firstname | Optional. First name of the driver |
| lastname | Optional. Last name of the driver |

