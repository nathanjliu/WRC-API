# WRC-API
A super basic expressJS API for WRC results.

Uses the INCREDBLE [ewrc-results.com](http://ewrc-results.com). I've donated an you should too if you use this API.

API usage:

## Get rally IDs

`/api/rally/getids/{year}`

Get shortname, name and ID for rallies from a given year.

Parameters:

|   |   |
|---|---|
|  year |  Year of event. 2014-2019 only. Note: 2019 may be unreliable until calendar confirmed. |

## Get rally standings

`/api/rally/{name}/{year}/{id}`

Produces the latest top ten result from the current rally.

Short name examples: `catalunya`, `wales`, `germany`, `finland`.

Parameters:

|   |   |
|---|---|
| name  | For WRC events in 2016, 2017 and 2018, accepts a short name such as 'catalunya', 'wales', 'germany.' These can be found using the getids function. For earlier events and those in different competitions, use the full name as presented in an eWRC URL.  |
| year  |  Year of event |
| id (optional) | eWRC ID. Optional for WRC events in 2016, 2017 and 2018. Required for all other events.  |

## Get championship standings

`/api/championship/{year}`

Get WRC standings for any year the championship has been active.

Parameters:

|   |   |
|---|---|
|  year |  Year of championship. 1979-2018 supported. |


