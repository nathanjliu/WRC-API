# WRC-API
A super basic expressJS API for WRC results.

Uses the INCREDBLE [ewrc-results.com](http://ewrc-results.com). I've donated an you should too if you use this API.

API usage:

## Get rally IDs

Get shortname, name and ID for rallys from a given year.

Note: Supports 2016, 2017 and 2018 only.

`/api/rally/getids/{year}`

## Get rally standings

Produces the latest top ten result from the current rally.

`/api/rally/{shortname}/{year}`

## Get championship standings

Get WRC standings for any year the championship has been active.

`/api/championship/{year}`
